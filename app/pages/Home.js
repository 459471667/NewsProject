import React, { Component } from 'react';
import {
   StyleSheet,
   Dimensions,
   StatusBar,
   TouchableOpacity,
   View,
   Image,
   Text,
} from 'react-native';

import { isLT19 } from '../utils/ScreenUtil';
import Swiper from 'react-native-swiper';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    swiperData = [
        '华为不看好5G',
        '陶渊明后人做主播',
        '尔康制药遭处罚',
        '卢恩光行贿一案受审',
        '盖茨力挺扎克伯格',
        '大连特大刑事案件',
        '高校迷香盗窃案',
        '少年被批评后溺亡',
        '北京工商约谈抖音'
    ];

   render(){
       return(
           <View style={styles.container}>
                {/* 状态栏 */}
                <StatusBar backgroundColor={'rgba(255,255,255, 0)'} translucent={true}/>
                {/*头部*/}
                <View style={styles.headerContainer}>
                    <TouchableOpacity activeOpacity = {1} onPress={()=>{alert('hello')}} >
                        <Image source={require('./../../assets/images/logo.png')} resizeMode={'contain'} style={styles.headerLogo}/>
                    </TouchableOpacity>
                    <View style={styles.headerSearchContainer}>
                        <Swiper
                            horizontal={false}
                            showsPagination={false}
                            scrollEnabled={false}
                            autoplay={true}
                            autoplayTimeout={2}
                        >
                            {
                            this.swiperData.map((item, index) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} key={index} style={styles.swiperItem} onPress={()=>{ this.props.navigation.push('NewsSearch', {keyword: item}) }}>
                                        <Image source={require('./../../assets/images/i_search.png')} resizeMode={'contain'} style={styles.headerSearchImg}/>
                                        <Text style={styles.headerSearchText}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </Swiper>
                    </View>
                    <TouchableOpacity>
                        <Image source={require('./../../assets/images/i_24h.png')} resizeMode={'contain'} style={styles.headerRightImg}/>
                    </TouchableOpacity>

                </View>


               <Text>首页1</Text>
           </View>
       );
    }
}

const styles = StyleSheet.create({
    container :{
        flex:1,
        backgroundColor: '#F8F8F8',
    },
    headerContainer:{
        backgroundColor: '#d81e06',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        height: 70,
        paddingTop: isLT19()?0:25,
        paddingBottom: 5
        
    },
    headerLogo:{
        width:45,
        height:45
    },
    headerRightImg: {
        width: 27,
        height: 27,
    },
    headerSearchContainer:{
        width:screenWidth*0.7,
        height:33,
        borderRadius:18,
        backgroundColor: 'rgba(255,255,255,.3)'
    },
    swiperItem:{
        flex:1,
        flexDirection: "row",
        justifyContent :"center",
        alignItems :"center"
    },
    headerSearchImg :{
        width: 17,
        height: 17,
        marginRight: 5
    },
    headerSearchText: {
        color: '#F8F8F8'
    },
});