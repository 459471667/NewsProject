import React, { Component } from 'react';
import {
   StyleSheet,
   Dimensions,
   StatusBar,
   TouchableOpacity,
   View,
   Image,
   Text,
   ImageBackground
} from 'react-native';

import Header from './../../components/Header'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class NewsDetail extends Component{

    constructor(props){
        super(props);
        this.state = {
            statusBarTranslucent:true
        }
    }

    render() {
        let item = this.props.item;
        console.log('111',this.props.navigation.state.params.item)
        // `http://c.m.163.com/nc/article/${docid}/full.html`,
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={this.state.statusBarTranslucent}
                />
                <Header navigation={this.props.navigation}/>

                <Text>新闻详情</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
})