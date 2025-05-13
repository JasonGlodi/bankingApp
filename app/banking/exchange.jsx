import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../components/header";
import Navbar from "../components/Navbar";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

// State variables for currencies, amounts, dropdown items, and loading state
export default function ExchangeScreen() {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [currencyItems, setCurrencyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = "5e513b94141cb8ff254da33c"; // the API key for the Exchange Rate

  useEffect(() => {
    fetchSupportedCurrencies();
  }, []);

  // Fetch list of supported currencies from the API
  const fetchSupportedCurrencies = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`
      );
      const data = await response.json();
      if (data.result === "success") {
        const items = data.supported_codes.map(([code, name]) => ({
          label: `${code} - ${name}`,
          value: code,
        }));
        setCurrencyItems(items);
      } else {
        Alert.alert("Error", "Failed to fetch currencies.");
      }
    } catch (error) {
      console.error("Currency fetch error:", error);
      Alert.alert("Error", "Could not load currencies.");
    }
  };

  const convertCurrency = async () => {
    if (!fromAmount) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${fromAmount}`
      );
      const data = await response.json();
      if (data.result === "success") {
        setToAmount(data.conversion_result.toFixed(2).toString());
      } else {
        Alert.alert("Conversion Error", data["error-type"] || "Unknown error.");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert("Error", "Could not convert currency.");
    }
    setIsLoading(false);
  };

  const handleBackPress = () => {
    router.push("/banking");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Exchange" showBack={true} onBackPress={handleBackPress} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require("../../assets/Illustration.jpg")}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={styles.card}>
              <Text style={styles.label}>From</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Amount"
                  style={styles.input}
                  keyboardType="numeric"
                  value={fromAmount}
                  onChangeText={setFromAmount}
                />
                <RNPickerSelect
                  onValueChange={setFromCurrency}
                  value={fromCurrency}
                  items={currencyItems}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  )}
                />
              </View>

              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-down" size={20} color="blue" />
                <Ionicons name="arrow-up" size={20} color="red" />
              </View>

              <Text style={styles.label}>To</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Converted Amount"
                  style={styles.input}
                  keyboardType="numeric"
                  value={toAmount}
                  editable={false}
                />
                <RNPickerSelect
                  onValueChange={setToCurrency}
                  value={toCurrency}
                  items={currencyItems}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  )}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.exchangeButton,
                  fromAmount
                    ? { backgroundColor: "#007bff" }
                    : { backgroundColor: "#eee" },
                ]}
                onPress={convertCurrency}
                disabled={!fromAmount || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.exchangeText,
                      fromAmount ? { color: "#fff" } : { color: "#ccc" },
                    ]}
                  >
                    Exchange
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.navbarSpacer} />
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: {
    color: "#999",
    marginBottom: 5,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  exchangeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  exchangeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  navbarSpacer: {
    height: 80,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    color: "#333",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    color: "#333",
    paddingRight: 30,
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
});
