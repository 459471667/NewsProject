import React, { Component } from 'react';
import {
   StyleSheet,
   Dimensions,
   FlatList,
   TouchableOpacity,
   View,
   Image,
   Text,
   ImageBackground,
   ScrollView
} from 'react-native';

import VideoPlayer from '../../components/VideoPlayer';
import Orientation from 'react-native-orientation';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class VideoDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            isFullScreen: false,
            voteCount: 0,
            isVote: false

        }
    }
    params = this.props.navigation.state.params.item;
    isNews = this.params['videoinfo'];
    voteCount = this.isNews? this.isNews['voteCount']:this.params['votecount'];
    uri = this.isNews? this.isNews['mp4_url']:this.params['mp4_url'];
    cover = this.isNews? this.isNews['cover']:this.params['cover'];
    playCount = this.isNews? this.isNews['playCount']:this.params['playCount'];
    topicImg = this.isNews? this.isNews['topicImg']:this.params['topicImg'];
    topicName  = this.isNews? this.isNews['topicName']:this.params['topicName'];

    componentWillMount() {
        console.log(this.params)
        this.setState({ voteCount: this.voteCount});
    }
    
    componentWillUnmount() {
        Orientation.unlockAllOrientations();
    }    

    //横竖屏切换
    _onOrientationChanged = (isFullScreen) => {
        if (isFullScreen) {
            Orientation.lockToPortrait();
        } else {
            Orientation.lockToLandscape();
        }
    };

    _onClickBackButton = () =>{
        this.props.navigation.goBack();
    }

    _onChangeLayout =(event) =>{
        const {x, y, width, height} = event.nativeEvent.layout;
        let isLandscape = (width > height);
        if (isLandscape) {
            this.setState({
                isFullScreen: true
            });
            this.videoPlayer.updateLayout(width, height, true);
        }else{
            this.setState({
                isFullScreen: false
            });
            this.videoPlayer.updateLayout(width, width * 9/16, false);
        }
    }
    _clickVote = ()=>{
        this.setState({
            isVote: true,
            voteCount: this.state.voteCount+1
        });
    };

    render() {
        console.log(this.params)

        return (
            <View style={styles.container} onLayout={this._onChangeLayout}>
                { this.state.isFullScreen ? null : <View style={styles.topheight}></View> }
                <VideoPlayer
                    ref={(ref) => this.videoPlayer = ref}
                    videoURL={this.uri}
                    videoTitle={this.params.title}
                    videoCover={this.cover}
                    onChangeOrientation={this._onOrientationChanged}
                    onTapBackButton={this._onClickBackButton}
                />
                <View style={{flex: 1, backgroundColor: 'red'}}>
                    <ScrollView style={{backgroundColor: '#f8f8f8'}}>
                        <View  style={styles.vedioInfoContainer}>
                            <View style={styles.infoTopContainer}>
                                <Text style={styles.infoTitle}>{this.params.title}</Text>
                                <TouchableOpacity activeOpacity={1} style={styles.infoRight} onPress={()=>{ !this.state.isVote && this._clickVote() }}>
                                    <Image style={styles.infoZoveImg} source={ this.state.isVote?require('./../../../assets/images/i_vote_red.png'):require('./../../../assets/images/i_vote_black.png')} resizeMode={'contain'} />
                                    <Text style={[styles.infoZoveText, {color: this.state.isVote?'#d81e06':'#000'}]}>{this.state.voteCount}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.vedioPlayContainer}>
                                <Image resizeMode={'contain'} source={require('./../../../assets/images/i_right_arrows.png')} style={{width: 15, height: 15}} />
                                <Text style={{fontSize: 12, color: '#515151'}}>{this.playCount}次播放</Text>
                            </View>

                            <View style={styles.vedioUserContainer}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image resizeMode={'contain'} source={{uri: this.topicImg}} style={styles.vedioUserImg}/>
                                    <Text style={{fontSize: 12, color: '#000'}}>{this.topicName}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={.9} style={styles.subscriptionBtn}>
                                    <Text style={{fontSize: 12, color: '#000'}}>+订阅</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    topheight: {
        height:23,
        backgroundColor:'#000'
    },
    vedioInfoContainer: {
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    infoTopContainer: {
        flexDirection: 'row',
        minHeight: 60,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    infoRight: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 60,
        height: 40,
        marginLeft: 10,
        borderLeftColor: '#bfbfbf',
        borderLeftWidth: 1,
    },
    infoTitle: {
        color: '#000',
        fontSize: 16,
        maxWidth: screenWidth * .8,
        lineHeight: 28,
    },
    infoZoveImg: {
        width: 20,
        height: 20,
    },
    infoZoveText: {
        fontSize: 12,
    },
    vedioPlayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    vedioUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    vedioUserImg: {
        width: 26,
        height: 26,
        borderRadius: 26,
        marginRight: 5
    },
    subscriptionBtn: {
        width: 70,
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',

    }
    
})