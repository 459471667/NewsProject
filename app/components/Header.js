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

import { isLT19 } from '../utils/ScreenUtil'

export default class Header extends Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    static defaultProps = {
        leftText: '返回',
        centerText: '新闻详情'

    }

    render() {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    activeOpacity={.8}
                    style={{flexDirection: 'row',alignItems: 'center', flex: 1}}
                    onPress={()=>{this.props.navigation.goBack()}}
                >
                    <Image source={require('./../../assets/images/i_goback.png')} resizeMode={'contain'} style={styles.backImg}/>
                    <Text style={styles.backText}>{this.props.leftText}</Text>
                </TouchableOpacity>
                <View style={styles.CenterContainer}>
                    <Text style={styles.contentText}>{this.props.centerText}</Text>
                </View>
                
                <TouchableOpacity style={{flex: 1}}>

                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#d81e06',
        paddingTop: isLT19()?0:25
    },
    backImg: {
        width: 25,
        height: 25
    },
    backText: {
        color: 'white', 
        fontSize: 16
    },
    CenterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        flex: 4,
    },
    contentText: {
        fontSize: 18,
        color: '#F8F8F8'
    }
})