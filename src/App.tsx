import React, {useEffect} from 'react';
import Home from './Home';
import {StatusBar} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  useEffect(() => {
    changeNavigationBarColor('transparent', true);
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent={true}
        />
        <Home />
      </GestureHandlerRootView>
    </>
  );
};

export default App;
