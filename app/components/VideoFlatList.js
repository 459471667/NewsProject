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
        console.log(`http://c.3g.163.com/nc/video/${requestCode}/${_this.currPage}-10.html`)
        ajax({
            url: `http://c.3g.163.com/nc/video/${requestCode}/${_this.currPage}-10.html`,
            dataType:'json',
            success: (data)=>{
                console.log(data);
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
    _onEndReached = () =>{
        this._getNewsList();
    }

     _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height: 1, backgroundColor:'#e6e6e6' }} />
    );

    _renderEmptyView = () => (
        <View style={{height: this.state.flatHeight, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('./../../assets/images/list_placeholder.png')} resizeMode={'contain'} style={{width: 80, height: 60}} />
        </View>
    );

    _setFlatListHeight = (e) => {
        let height = e.nativeEvent.layout.height;
        if (this.state.flatHeight < height) {
            this.setState({flatHeight: height})
        }
    };

    _renderRefresh = () => {
        this.setState({refreshing: true}); //开始刷新
        this.currPage = 0;
        this._getNewsList();
    };

     render () {
         return(
             <View style={styles.container}>
                 <FlatList
                    ref={(flatList)=>this._flatList = flatList}
                    data={ this.state.sourceData }
                    keyExtractor={ this._keyExtractor }
                    renderItem={ this._renderItem }
                    initialNumToRender={10}
                    onEndReachedThreshold={0.1}
                    onEndReached={ this._onEndReached }
                    ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                    ListEmptyComponent={ this._renderEmptyView }
                    onLayout={this._setFlatListHeight}
                    refreshing={ this.state.refreshing }
                    onRefresh={ this._renderRefresh }
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

     // 视频秒数转分：秒格式
     _formatVideoTime = (s)=>{
        if(s <= 60){
            return s<10? '00:0'+s: '00:'+s;
        }
        if(s > 60){
            let f = parseInt(s/60), y = s%60;
            f < 10 && (f = '0'+f);
            y < 10 && (y = '0'+y);
            return `${f}:${y}`;
        }
    };

     render(){
         console.log(this.props.item.item)
         let item = this.props.item.item;
         return(
             <TouchableOpacity 
                activeOpacity={.8}
                onPress={this._onPress} 
             >
                <ImageBackground source={{uri: item.cover}} resizeMode={'cover'} style={{height: 200, justifyContent: 'space-between',}} >
                    <Text style={styles.textTitle}>{item.title}</Text>
                    <View style={styles.playImg}>
                        <Image style={{width:18, height:18, marginLeft: 3}} resizeMode={'cover'} source={require('./../../assets/images/i_play.png')}/>
                    </View>
                    <Text style={styles.timetext}>{this._formatVideoTime(item.length)}</Text>
                </ImageBackground>
                <View style={{paddingHorizontal: 8, marginTop: 5, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={{uri: item.topicImg}} resizeMode={'contain'} style={{width: 30, height: 30, borderRadius: 30, marginRight: 10}} />
                        <Text style={{marginRight: 6}}>{item.topicName}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={require('./../../assets/images/i_reply.png')} resizeMode={'contain'} style={{width: 25, height: 25, marginRight: 5}} />
                        <Text>{item.replyCount}跟帖</Text>
                    </View>
                </View>
                
             </TouchableOpacity>
         )
     }
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    textTitle: {
        paddingHorizontal: 10, 
        paddingVertical: 5,
        fontSize: 16,
        lineHeight:25, 
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    playImg:{
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgba(0,0,0,.5)', 
        borderRadius:25,
        alignSelf: 'center',
    },
    timetext:{
        fontSize:12,
        alignSelf:'flex-end',
        color: '#fff', 
        padding: 10
    }
 })