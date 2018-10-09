/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
        StyleSheet, 
        BackHandler,
        InteractionManager
      } from 'react-native';

import RouteConfigs from "./app/RouteConfigs";
import StackNavigatorConfig from "./app/StackNavigatorConfig";

import SplashScreen from "react-native-splash-screen";
import { StackNavigator } from 'react-navigation';

// 创建导航器，传入路由配置和导航配置
const Navigation = StackNavigator(RouteConfigs,StackNavigatorConfig);

export default class App extends PureComponent {
  componentDidMount(){
   this._closeStartPage();
   this._addBackListener();
  }

  //关闭启动页
  _closeStartPage(){
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    });
  }
  //监听返回按钮
  _addBackListener (){
      BackHandler.addEventListener("hardwareBackPress", function() {
        let o = 1;
          if (o === 2) {
          alert('不退出1');
          return true;
          }
        return false;
      });
  }

  render() {
    return (
      <Navigation/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
