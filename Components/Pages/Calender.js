import { Text, ScrollView, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListItem } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalenderTab() {
  const [HolidayData, setHolidayData] = useState([]);
  const [Available, SetAvailable] = useState(false);
  const [SchoolYear, SetSchoolYear] = useState("2021-2022");
  const [Region, setRegion] = useState();
  const [refreshing, setRefreshing] = useState(false);

  function getHolidayData() {
    axios
      .get(
        "https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/" +
          SchoolYear +
          "?output=json"
      )
      .then((res) => {
        const data = res.data.content[0];
        setHolidayData(data);
        SetAvailable(true);
      });
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRegion()
    getHolidayData()
    setRefreshing(false);
  }, []);

  const getRegion = async () => {
    try {
      region = await AsyncStorage.getItem("Region");
    } catch (e) {
      console.log(e);
    }
    setRegion(region);
  };

  useEffect(() => {
    getHolidayData();
    getRegion();
  }, [SchoolYear]);

  return (
    <ScrollView style={{ marginTop: 35 }}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
    >
      <Picker
        style={{ backgroundColor: "white" }}
        selectedValue={SchoolYear}
        onValueChange={(itemValue, itemIndex) => SetSchoolYear(itemValue)}
      >
        <Picker.Item label="2021-2022" value="2021-2022" />
        <Picker.Item label="2022-2023" value="2022-2023" />
        <Picker.Item label="2023-2024" value="2023-2024" />
      </Picker>
      {Available ? (
        HolidayData.vacations.map((d, i) => (
          <ListItem key={i} topDivider>
            <ListItem.Content>
              <ListItem.Title>{d.type}</ListItem.Title>
              {d.regions.map((sd, i) =>
                sd.region == Region ? (
                  <ListItem.Subtitle key={i}>
                    {sd.region}: {sd.startdate.slice(0, 10)} -{" "}
                    {sd.enddate.slice(0, 10)}
                  </ListItem.Subtitle>
                ) : null || sd.region == "heel Nederland" ? (
                  <ListItem.Subtitle key={i}>
                    {sd.region}: {sd.startdate.slice(0, 10)} -{" "}
                    {sd.enddate.slice(0, 10)}
                  </ListItem.Subtitle>
                ) : null
              )}
            </ListItem.Content>
          </ListItem>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </ScrollView>
  );
}
