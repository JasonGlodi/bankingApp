import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../components/header";
import Navbar from "../components/Navbar";

const API_KEY = "5e513b94141cb8ff254da33c"; // This API was gotten from ExchangeRate-API key
const BASE_CURRENCY = "XAF"; // CFA Franc

//List of countries to display with their currency codes and flag URLS
const COUNTRY_INFO = [
  { name: "USA", currency: "USD", flag: "https://flagcdn.com/w40/us.png" },
  {
    name: "United Kingdom",
    currency: "GBP",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  { name: "Japan", currency: "JPY", flag: "https://flagcdn.com/w40/jp.png" },
  { name: "France", currency: "EUR", flag: "https://flagcdn.com/w40/fr.png" },
  { name: "China", currency: "CNY", flag: "https://flagcdn.com/w40/cn.png" },
  { name: "Canada", currency: "CAD", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Nigeria", currency: "NGN", flag: "https://flagcdn.com/w40/ng.png" },
  {
    name: "South Africa",
    currency: "ZAR",
    flag: "https://flagcdn.com/w40/za.png",
  },
  { name: "India", currency: "INR", flag: "https://flagcdn.com/w40/in.png" },
  { name: "Germany", currency: "EUR", flag: "https://flagcdn.com/w40/de.png" },
  { name: "Brazil", currency: "BRL", flag: "https://flagcdn.com/w40/br.png" },
  { name: "Russia", currency: "RUB", flag: "https://flagcdn.com/w40/ru.png" },
  { name: "Mexico", currency: "MXN", flag: "https://flagcdn.com/w40/mx.png" },
  {
    name: "Australia",
    currency: "AUD",
    flag: "https://flagcdn.com/w40/au.png",
  },
  { name: "Turkey", currency: "TRY", flag: "https://flagcdn.com/w40/tr.png" },
  {
    name: "South Korea",
    currency: "KRW",
    flag: "https://flagcdn.com/w40/kr.png",
  },
  { name: "Ghana", currency: "GHS", flag: "https://flagcdn.com/w40/gh.png" },
  {
    name: "Switzerland",
    currency: "CHF",
    flag: "https://flagcdn.com/w40/ch.png",
  },
  { name: "Sweden", currency: "SEK", flag: "https://flagcdn.com/w40/se.png" },
  { name: "Kenya", currency: "KES", flag: "https://flagcdn.com/w40/ke.png" },
];

export default function ExchangeRateScreen() {
  const router = useRouter();
  const [rates, setRates] = useState([]); //Stores exchange rate data
  const [loading, setLoading] = useState(true);

  //to navigate back to the banking screen
  const handleBackPress = () => {
    router.push("/banking");
  };

  //fetch exchange rate from the API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        //fetch exchange rates for each country
        const fetchedRates = await Promise.all(
          COUNTRY_INFO.map(async ({ currency, name, flag }) => {
            const res = await fetch(
              `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${BASE_CURRENCY}/${currency}`
            );
            const data = await res.json();
            const conversionRate =
              data.result === "success" ? data.conversion_rate : null;

            //return formatted object with buy and sell value
            return {
              name,
              flag,
              currency,
              buy: conversionRate ? (conversionRate * 0.98).toFixed(3) : "N/A", // bank buys at slightly lower rate
              sell: conversionRate ? (conversionRate * 1.02).toFixed(3) : "N/A", //bank sells at slightly higher rate
            };
          })
        );

        setRates(fetchedRates); // save rate at state
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // render one row of each country
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.countryCell}>
        <Image source={{ uri: item.flag }} style={styles.flag} />
        <Text style={styles.countryText}>{item.name}</Text>
      </View>
      <Text style={styles.rateText}>{item.buy}</Text>
      <Text style={styles.rateText}>{item.sell}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title="Exchange Rate"
        showBack={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.countryText, { flex: 2 }]}>
            Country
          </Text>
          <Text style={styles.headerText}>Buy</Text>
          <Text style={styles.headerText}>Sell</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={rates}
            keyExtractor={(item) => item.currency + item.name}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <View style={styles.navbarSpacer} />
      <Navbar />
    </SafeAreaView>
  );
}

//styles for the  screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 8,
    marginTop: 8,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  countryCell: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
    borderRadius: 2,
  },
  countryText: {
    fontSize: 16,
    textAlign: "left",
    paddingLeft: 8,
  },
  rateText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  navbarSpacer: {
    height: 80,
  },
  listContent: {
    paddingBottom: 80,
  },
});
