import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Navbar from "../components/Navbar";
import Header from "../components/header";

const Home = () => {
  const handleMenuPress = (itemId) => {
    switch (itemId) {
      case 1: // Account and Card
        router.push("/menu/accountandcard");
        break;
      case 2: // Transfer
        router.push("/transfers");
        break;
      case 3: // Withdraw
        router.push("/menu/withdraw");
        break;
      case 4: // Mobile prepaid
        router.push("/menu/mobile");
        break;
      case 5: // Pay the bill
        router.push("/menu/bill");
        break;
      case 6: // Transaction report
        router.push("/transactions");
        break;
      case 7: // Beneficiary
        router.push("/menu/beneficiary");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Account\nand Card",
      icon: "account-balance-wallet",
      color: "#6366F1",
      route: "/menu/accountandcard",
    },
    {
      id: 2,
      title: "Transfer",
      icon: "swap-horiz",
      color: "#EF4444",
      route: "/transfers",
    },
    {
      id: 3,
      title: "Withdraw",
      icon: "atm",
      color: "#3B82F6",
      route: "/menu/withdraw",
    },
    {
      id: 4,
      title: "Mobile\nprepaid",
      icon: "phone-android",
      color: "#F59E0B",
      route: "/menu/mobile",
    },
    {
      id: 5,
      title: "Pay the\nbill",
      icon: "receipt",
      color: "#10B981",
      route: "/menu/bill",
    },
    {
      id: 6,
      title: "Transaction\nreport",
      icon: "description",
      color: "#6366F1",
      route: "/settings/transactions",
    },
    {
      id: 7,
      title: "Beneficiary",
      icon: "people",
      color: "#EC4899",
      route: "/menu/beneficiary",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <Header title="Home" />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Credit Card */}
        <View style={styles.cardContainer}>
          <View style={styles.creditCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHolderName}>John Smith</Text>
              <Text style={styles.cardType}>Amazon Platinum</Text>
            </View>

            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>4756</Text>
              <View style={styles.dots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <View style={styles.dots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <Text style={styles.cardNumberText}>9018</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.balance}>$3,469.52</Text>
              <Text style={styles.visaText}>VISA</Text>
            </View>

            {/* Card Design Elements */}
            <View style={styles.cardCircle1} />
            <View style={styles.cardCircle2} />
          </View>
        </View>

        {/* Menu Grid - Using Link components */}
        <View style={styles.menuGrid}>
          {menuItems.slice(0, 3).map((item) => (
            <Link key={item.id} href={item.route} asChild>
              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <View style={styles.menuGrid}>
          {menuItems.slice(3, 6).map((item) => (
            <Link key={item.id} href={item.route} asChild>
              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <View style={styles.menuGrid}>
          {menuItems.slice(6).map((item) => (
            <Link key={item.id} href={item.route} asChild>
              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 40,
  },
  creditCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    height: 200,
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardHolderName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardType: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  cardNumber: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardNumberText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  dots: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    marginHorizontal: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  balance: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },
  visaText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
  },
  cardCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  cardCircle2: {
    position: "absolute",
    bottom: -40,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuText: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
  },
});

export default Home;
