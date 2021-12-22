import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CalenderTab from "./Components/Pages/Calender";
import CounterTab from "./Components/Pages/Counter";
import SettingsTab from "./Components/Pages/Settings";
import AboutUsTab from "./Components/Pages/AboutUs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
const Tab = createMaterialBottomTabNavigator();
const init = async () => {
  // const value = await AsyncStorage.removeItem("Region");
  try {
    const value = await AsyncStorage.getItem("Region");
    if (value !== null) {
    } else {
      setRegion();
    }
  } catch (e) {
    console.log(e);
  }
};

const setRegion = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("permission not granted");
  }

  const userLocation = await Location.getCurrentPositionAsync();
  console.log(userLocation);
  let region = "";
  if (userLocation.coords.latitude >= 53) {
    region = "noord";
  }
  if (userLocation.coords.latitude < 53) {
    region = "midden";
  }
  if (userLocation.coords.latitude <= 52) {
    region = "zuid";
  }
  try {
    await AsyncStorage.setItem("Region", region);
  } catch (e) {
    console.log(e);
  }
};

export default function App() {
  init();
  return (
    <NavigationContainer>
      <StatusBar />
      <Tab.Navigator
        initialRouteName="Counter"
        activeColor="white"
        barStyle={{ backgroundColor: "#2c3e50" }}
      >
        <Tab.Screen
          name="Calender"
          component={CalenderTab}
          options={{
            headerTitle : 'Calender',
            tabBarLabel: "Calender",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-child-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Counter"
          component={CounterTab}
          options={{
            tabBarLabel: "Counter",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsTab}
          options={{
            tabBarLabel: "Gps settings",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="crosshairs-gps" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="About us"
          component={AboutUsTab}
          options={{
            tabBarLabel: "About us",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
