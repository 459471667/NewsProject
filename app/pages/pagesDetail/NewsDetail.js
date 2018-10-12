import React, { Component } from 'react';
import {
   StyleSheet,
   Dimensions,
   StatusBar,
   TouchableOpacity,
   ScrollView,
   View,
   Image,
   Text,
   Modal,
   ImageBackground
} from 'react-native';

import Header from './../../components/Header';
import ajax from './../../utils/fetch';
import HTMLView from 'react-native-htmlview';
import ImageViewer from 'react-native-image-zoom-viewer';
import Toast, {DURATION} from 'react-native-easy-toast'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class NewsDetail extends Component{

    constructor(props){
        super(props);
        this.state = {
            statusBarTranslucent:true,
            newsData: '',
            body:'',
            modalVisible:false,
            
        }
    }

    componentDidMount(){
        this._getNewsDetailData();
    }

    //获取数据
    _getNewsDetailData(){
        let docid = this.props.navigation.state.params.item.docid;
        console.log(docid)
        ajax({
            url:`http://c.m.163.com/nc/article/${docid}/full.html`,
            success:(data) =>{
              
                let bodyData = data[docid]['body'];
                data[docid]['img'].map((item)=>{
                    bodyData = bodyData.replace(item.ref,`<img src=${item.src}/>`)
                })
                this.setState({
                    newsData: data[docid],
                    body:bodyData
                });
                
            },
            error:(err)=>{
                console.info('详情请求错误:');
                console.info(err);
            }
        })
    }

    //
    imgArr = [];
    imgIndex = -1;
    initIndex = 0;

    _renderNode =(node, index, siblings, parent, defaultRenderer) =>{
        if (node.name == 'img') {
            this.imgIndex++;
            let num = this.imgIndex;
            let nodeAttr = node.attribs;
            let imgSrc = nodeAttr.src.substring(0, nodeAttr.src.length -1)
            this.imgArr.push({url:imgSrc});
            console.log('arr',imgSrc)
            return(
                <TouchableOpacity key={index} activeOpacity={.8} onPress={()=>{this._showImgModal(num)}}>
                    <Image source={{uri: imgSrc}} resizeMode={'stretch'} style={{flex: 1, height: this._getImgHeight(imgSrc), marginBottom: 35 }} />
                </TouchableOpacity> 
            );
            
        }
        
    }

    // 图片高度自适应
    _getImgHeight = (imageUri) => {
        let imgHeight = 230;
        Image.getSize(imageUri,(width,height) => {
            imgHeight = Math.floor(screenWidth/width*height);
        });
        return imgHeight
    };

    //图片显示
    _showImgModal =(index) =>{
        this.initIndex = index;
        this.setState({
            modalVisible:true,
            statusBarTranslucent:false
        })
    }

    _closeImgModal =() =>{
        console.log('object')
        this.setState({
            modalVisible:false,
            statusBarTranslucent:true
        })
    }

    render() {
        
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={this.state.statusBarTranslucent}
                    backgroundColor={ this.state.statusBarTranslucent? '#d81e06': '#000' }
                />
                <Header navigation={this.props.navigation}/>
                <ScrollView>
                    <View style={{padding:10}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#2c2c2c', marginBottom: 10, lineHeight: 35}}>{this.state.newsData.title}</Text>
                        <Text>{this.state.newsData.source}  {this.state.newsData.ptime}</Text>
                    </View>
                    <HTMLView
                        value={this.state.body}
                        style={{padding: 10}}
                        stylesheet={htmlStyles}
                        saveToLocalByLongPress={false}
                        onLinkPress={(url) => alert('clicked link: ', url)}
                        renderNode = { this._renderNode }
                    />
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={this._closeImgModal}
                    >
                        <ImageViewer
                            index={ this.initIndex }
                            imageUrls={ this.imgArr }
                            onClick={ this._closeImgModal }
                            saveToLocalByLongPress={false}
                        />
                    </Modal>

                </ScrollView>

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

const htmlStyles = StyleSheet.create({

    p: {
        color: '#2c2c2c',
        lineHeight: 30,
        fontSize:16
    }

});