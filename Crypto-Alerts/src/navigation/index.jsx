import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './bottomTabNavigator';
import LoginScreen from '../screens/loginScreen'
import CoinListScreen from '../screens/coinListScreen';
import CoinDetailedScreen from '../screens/coinDetailedScreen';
import SearchScreen from '../screens/searchScreen';
import ProfileScreen from '../screens/profileScreen'

const Stack = createNativeStackNavigator();

// app loads login screen first, from login screen user is navigated to root which is bottomTabNavigator.
// lines 20-22 are only needed if were explicitly trying to go to a specific page via code without clicking bottom tab navigator buttons. 
const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name='LoginScreen' component={LoginScreen}/>
      <Stack.Screen name='Root' component={BottomTabNavigator}/>
      <Stack.Screen name='CoinListScreen' component={CoinListScreen}/>
      <Stack.Screen name='CoinDetailedScreen' component={CoinDetailedScreen}/>
      <Stack.Screen name='SearchScreen' component={SearchScreen}/>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
    </Stack.Navigator>
  )
}

export default Navigation;