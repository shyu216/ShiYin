import React, { useEffect } from 'react';
import Home from './Home';
import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const App = () => {
  useEffect(() => {
    changeNavigationBarColor('transparent', true);
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <Home />
    </>
  );
};

export default App;