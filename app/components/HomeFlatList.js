import React, { Component } from 'react';
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

import ajax from './../utils/fetch';
import Toast, {DURATION} from 'react-native-easy-toast'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class XFFlatList extends Component {

    constructor(props){
        super(props)
        this.state={
            sourceData: [],
            refreshing: false,
            flatHeight: 0
        }
    }
    currPage= 0;

    componentDidMount(){
        this._getNewsList();
    }

    //获取数据
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

    //跳转详情
    _onPressItem =(item) =>{
        this.setState({
            selected: item.id
        });

        //跳转视频详情
        if (item['videoinfo']) {
            this.props.navigation.push('VideoDetail', {item});
            return
        }

        //跳转新闻详情
        this.props.navigation.push('NewsDetail', {item});
    }

    //渲染每一列
    _renderItem = (item) =>{
        return (
            <FlatListItem
                item ={item}
                onPressItem = {this._onPressItem}
                selected={ this.state.selected === item.id }
            />
        )
    }

    //底部
    _renderFooter = () =>{
        let len = this.state.sourceData.length;
        return (
            <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center', height: len<1?0:40}}>
                <Image source={require('./../../assets/images/i_loading.gif')} resizeMode={'contain'} style={{width: 20, height: 20, marginRight: 5 }} />
                <Text>正在加载...</Text>
            </View>
        )
    }

    // 上拉加载更多
    _onEndReached = () => {
        this._getNewsList();
    };

    //下拉刷新
    _renderRefresh =() =>{
        this.setState({refreshing: true});
        currPage= 0;
        this._getNewsList();
    }

    //列表为空时
    _renderEmptyView = () =>{

        return(
            <View style={{height: screenHeight*0.9, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('./../../assets/images/list_placeholder.png')} resizeMode={'contain'} style={{width: 80, height: 60}} />
            </View>
        )
    }

    //获取高度
    _setFlatListHeight= (e) =>{
        let height = e.nativeEvent.layout.height;

        if (this.state.flatHeight < height) {
            this.setState({flatHeight: height})
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    extraData={ this.state.selected }
                    data={this.state.sourceData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    initialNumToRender={10}
                    ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                    ListFooterComponent={ this._renderFooter }
                    onEndReachedThreshold = {0.1}
                    onEndReached ={this._onEndReached}
                    refreshing ={this.state.refreshing}
                    onRefresh ={this._renderRefresh}
                    ListEmptyComponent={ this._renderEmptyView }
                    onLayout={this._setFlatListHeight}
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

    _onPress= ()=>{
        this.props.onPressItem(this.props.item.item)
    }

    render (){
        
        let item = this.props.item.item; 
        // 判断是否是三图布局
        let isThreePic = item['imgnewextra'];
        // 判断是否是视频布局
        let isVideo = item['videoinfo'];

        //三图
        if (isThreePic) {
            return (
                <TouchableOpacity 
                    style={styles.picItem}
                    activeOpacity={.8}
                    onPress={this._onPress}
                >
                    <View style={{justifyContent: "space-between"}}>
                        <Text style={{fontSize:16, lineHeight:25, color: '#2c2c2c'}}>{item.title}</Text>
                        <View style={{flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
                            <Image source={{uri: item.imgsrc}} style={{width: screenWidth*.3, height: 80}} />
                            {
                                item.imgnewextra.map((itemImg, index) =>{
                                    return(
                                        <Image source={{uri: itemImg.imgsrc}} key={index} style={{width: screenWidth*.3, height: 80}} />
                                    )
                                    
                                })
                            }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={{marginRight: 6}}>{item.source}</Text>
                                <Text>{item.replyCount}跟帖</Text>
                            </View>
                            <Text style={{color: '#ccc', fontSize: 18}}>x</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            )
        }

        //视频
        if (isVideo) {
            return (
                <TouchableOpacity
                    style={styles.picItem}
                    activeOpacity={.8}
                    onPress={this._onPress}
                >
                    <View style={{justifyContent: "space-between"}}>
                        <Text style={{fontSize:16, lineHeight:25, color: '#2c2c2c'}}>{item.title}</Text>
                        <ImageBackground source={{uri: item.imgsrc}} resizeMode={'cover'} style={{height: 180, marginVertical: 6, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,.5)', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('./../../assets/images/i_play.png')} resizeMode={'contain'} style={{width: 18, height: 18, marginLeft: 3}} />
                            </View>
                        </ImageBackground>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={{marginRight: 6}}>{item.source}</Text>
                                <Text>{item.replyCount}跟帖</Text>
                            </View>
                            <Text style={{color: '#ccc', fontSize: 18}}>x</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            )
    }

        return(
            <TouchableOpacity
                style={styles.item}
                activeOpacity={.8}
                onPress={this._onPress}
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
    },
    picItem: {
        padding: 7
    }
});