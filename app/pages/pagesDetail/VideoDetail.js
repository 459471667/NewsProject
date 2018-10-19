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

import VideoPlayer from '../../components/VideoPlayer';
import Orientation from 'react-native-orientation';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class VideoDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            isFullScreen: false,
            voteCount: 0,

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
            })
        }else{
            this.setState({
                isFullScreen: false
            })  
        }
    }

    render() {
        console.log(this.params)

        return (
            <View style={styles.container} onLayout={this._onChangeLayout}>
                <View style={styles.topheight}></View>
                <VideoPlayer
                    ref={(ref) => this.videoPlayer = ref}
                    videoURL={this.uri}
                    videoTitle={this.params.title}
                    videoCover={this.cover}
                    onChangeOrientation={this._onOrientationChanged}
                    onTapBackButton={this._onClickBackButton}
                />
                <Text>视频详情</Text>
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
    }
    
})