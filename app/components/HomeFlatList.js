import React, { Component } from 'react';
import {
   StyleSheet,
   Dimensions,
   FlatList,
   TouchableOpacity,
   View,
   Image,
   Text,
} from 'react-native';

import ajax from './../utils/fetch';
import Toast, {DURATION} from 'react-native-easy-toast'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class XFFlatList extends Component {

    constructor(props){
        super(props)
        this.state={
            sourceData: [],
            refreshing: false,
        }
    }
    currPage= 0;

    componentDidMount(){
        this._getNewsList();
    }

    _getNewsList(){
        let _this = this;
        let requestCode = this.props.requestCode;

        ajax({
            url: `http://c.m.163.com/nc/article/headline/${requestCode}/${_this.currPage}-10.html?from=toutiao&passport=&devId=OPdeGFsVSojY0ILFe6009pLR%2FMsg7TLJv5TjaQQ6Hpjxd%2BaWU4dx4OOCg2vE3noj&size=10&version=5.5.3&spever=false&net=wifi&lat=&lon=&ts=1456985878&sign=oDwq9mBweKUtUuiS%2FPvB015PyTDKHSxuyuVq2076XQB48ErR02zJ6%2FKXOnxX046I&encryption=1&canal=appstore`,
            success: (data)=>{
                _this.setState({
                    sourceData: _this.state.refreshing?data[requestCode]:[..._this.state.sourceData, ...data[requestCode]]
                });
                _this.currPage += 10;
                console.log('data:',_this.state.sourceData)
            },
            error: (err)=>{
                _this.refs.toast.show('网络请求异常');
            },
            complete: ()=>{
                _this.state.refreshing && _this.setState({refreshing: false});
            }
        });
    }

    _keyExtractor = (item, index) => item.id;

    //自定义分割线
    _renderItemSeparatorComponent(){
        return(
            <View style={{ height: 1, backgroundColor:'#e6e6e6' }} />
        )
        
    }

    _renderItem = (item) =>{
        return (
            <FlatListItem
                item ={item}
            />
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.sourceData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    initialNumToRender={10}
                    ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                />
                <Toast
                ref="toast"
                style={{backgroundColor:'black'}}
                position='center'
                opacity={0.8}
                textStyle={{color:'white'}}
            />
            </View>

        );
    }
}

// 根据数据返回不同布局的item
class FlatListItem extends React.PureComponent {

    render (){
        
    let item = this.props.item.item; 
    // 判断是否是三图布局
    let isThreePic = item['imgnewextra'];
    // 判断是否是视频布局
    let isVideo = item['videoinfo'];

    //三图
    if (isThreePic) {
        return (
            <TouchableOpacity>
                <View>
                    <Text>{item.title}</Text>
                    <View></View>
                    <View></View>

                </View>
            </TouchableOpacity>
        )
    }

    //视频
    if (isVideo) {
        return (
            <TouchableOpacity>
                <View>
                    <Text>视频</Text>
                    <View></View>
                    <View></View>

                </View>
            </TouchableOpacity>
        )
    }

        return(
            <TouchableOpacity
                style={styles.item}
            >
                <View style={{width: screenWidth*.63,height: 80, justifyContent: 'space-between'}}>
                    <Text style={{fontSize:16, lineHeight:25, color: '#2c2c2c'}}>{item.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row',}}>
                            <Text style={{marginRight: 6}}>{item.source}</Text>
                            <Text>{item.replyCount}跟帖</Text>
                        </View>
                        <Text style={{color: '#ccc', fontSize: 18}}>x</Text>
                    </View>
                </View>
                <Image source={{uri: item.imgsrc}} style={{width: screenWidth*.3, height: 80}} />
            </TouchableOpacity>
        )
    }

}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        padding: 7
    }
});