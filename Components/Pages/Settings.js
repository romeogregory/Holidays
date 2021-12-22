import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsTab() {
  const [Region, setRegion] = useState(getRegion);
  const setNewRegion = async (region) => {
    setRegion(region);
    try {
      await AsyncStorage.setItem("Region", region);
    } catch (e) {
      console.log(e);
    }
    console.log(region);
  };
  const getRegion = async () => {
    try {
      region = await AsyncStorage.getItem("Region");
    } catch (e) {
      console.log(e);
    }
    setRegion(region);
    // return region;
  };
  getRegion();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 4,
          width: 150,
        }}
      >
        <Picker
          selectedValue={Region}
          onValueChange={(itemValue, itemIndex) => setNewRegion(itemValue)}
        >
          <Picker.Item label="noord" value="noord" />
          <Picker.Item label="midden" value="midden" />
          <Picker.Item label="zuid" value="zuid" />
        </Picker>
      </View>
    </View>
  );
}
