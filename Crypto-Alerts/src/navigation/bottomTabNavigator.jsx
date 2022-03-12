import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import CoinListScreen from '../screens/coinListScreen';
import WatchListScreen from '../screens/watchListScreen';
import ProfileScreen from '../screens/profileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Crypto Assets"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: '#181818'
        },
      }}
    >
      <Tab.Screen name="Crypto Assets" component={CoinListScreen} options={{
        tabBarIcon: ({ focused, color }) => (<Ionicons name="list-sharp" size={focused ? 30 : 25} color={color} />)
      }} />
      <Tab.Screen name="Watch List" component={WatchListScreen} options={{
        tabBarIcon: ({ focused, color }) => (<FontAwesome name="star" size={focused ? 30 : 25} color={color} />)
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ focused, color }) => (<Ionicons name="person" size={focused ? 30 : 25} color={color} />)
      }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;