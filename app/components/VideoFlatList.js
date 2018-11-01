import React,{ Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    View,
    Image,
    Text,
    ImageBackground
 } from 'react-native';

import ajax from './../utils/fetch'
import Toast, {DURATION} from 'react-native-easy-toast'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

 export default class VideoFlatList extends Component {

    constructor(props){
        super(props)
        this.state= {
            sourceData:[],
            refreshing: false,
        }
    }

    currPage= 0;

    componentDidMount() {
        this._getNewsList();
    }

    _getNewsList= () =>{
        let _this = this;
        let requestCode = this.props.requestCode;
        
        ajax({
            url: `http://c.3g.163.com/nc/video/${requestCode}/${_this.currPage}-10.html`,
            success: (data)=>{
                console.log(data.videoList);
                _this.setState({
                    sourceData: _this.state.refreshing ? data.videoList : [..._this.state.sourceData,...data.videoList]
                })
                _this.currPage += 10;
            },
            error: (err)=>{
                _this.refs.toast.show('网络请求异常');
            },
            complete: ()=>{
                _this.state.refreshing && _this.setState({refreshing: false});
            }
        })
        

    }

    /**
     * 此函数用于为给定的item生成一个不重复的Key。
     * Key的作用是使React能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。
     * 若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标
     */
    _keyExtractor = (item, index) => index+'';

    _onPressItem = (item) => {
        // 跳转视频详情页面
        this.props.navigation.push('VideoDetail', {item});

    };

    _renderItem = (item) =>{
        return(
            <FlatListItem
                item={item}
                onPressItem={this._onPressItem}
            />
        )
    }

     render () {
         return(
             <View style={styles.container}>
                 <FlatList
                    ref={(flatList)=>this._flatList = flatList}
                    data={ this.state.sourceData }
                    keyExtractor={ this._keyExtractor }
                    renderItem={ this._renderItem }
                    // 初始加载的条数，不会被卸载
                    initialNumToRender={10}
                 />                
                <Toast
                    ref="toast"
                    style={{backgroundColor:'black'}}
                    position='center'
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
             </View>
         )
     }
 }

 class FlatListItem extends Component{
    _onPress = () =>{
        this.props.onPressItem(this.props.item.item)
    }

     render(){
         console.log(this.props.item.item)
         let item = this.props.item.item;
         return(
             <TouchableOpacity 
                activeOpacity={.8}
                onPress={this._onPress} 
             >
                <ImageBackground source={{uri: item.cover}} resizeMode={'cover'} style={{height: 200, justifyContent: 'space-between',}} >
                    
                </ImageBackground>
                
             </TouchableOpacity>
         )
     }
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
 })