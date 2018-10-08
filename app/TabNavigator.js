import React, { Component } from 'react';
import {
   StyleSheet,
   View,
   Text,
} from 'react-native';

import Home from './pages/Home';
import Live from './pages/Live';
import Mine from './pages/Mine';
import Video from './pages/Video';

import TabNavigator from 'react-native-tab-navigator';


export default class GDNoDataView extends Component {
    constructor(props){
        super(props);
        this.state({
            selectTab:"首页"
        });
    }

    _renderTaberItems(){
        
    }

   render(){
       return(
           <View>
           </View>
       );
    }
}