import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListItem } from "react-native-elements";
import CountDown from "react-native-countdown-component";

export default function CounterTab() {
  const [HolidayData, setHolidayData] = useState([]);
  const [Available, SetAvailable] = useState(false);

  function getHolidayData() {
    axios
      .get(
        "https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/2021-2022?output=json"
      )
      .then((res) => {
        const data = {};
        let dataSet = false;
        res.data.content[0].vacations.forEach((element) => {
          let ans = calculateDays(element.regions[0].startdate);
          if (dataSet) {
            return;
          }
          if (ans <= 0) {
            return;
          }
          data.type = element.type;
          data.regions = element.regions;
          data.daysToGo = ans;
          dataSet = true;
        });
        console.log(data);
        setHolidayData(data);
        SetAvailable(true);
      });
  }

  useEffect(() => {
    getHolidayData();
  }, []);

  function calculateDays(date) {
    const date1 = new Date();
    const date2 = new Date(date);
    return Math.floor((date2 - date1) / 1000);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {Available ? (
        <CountDown
          until={HolidayData.daysToGo - 60 * 60 * 24}
          onFinish={() => alert("Je hebt op dit moment vakantie!")}
          size={20}
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}
