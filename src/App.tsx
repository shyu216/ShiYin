import React from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import Card from './components/Containers/Card';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Loader from './components/Common/Loader';

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (<>
      <SafeAreaProvider>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Card} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>);
  }
}

export default App;