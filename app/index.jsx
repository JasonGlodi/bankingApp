import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MyBank</Text>
      <Text style={styles.tagline}>Your Future, Your Bank</Text>

      <Image
        source={require("../assets/branch.jpg")} // Update this path based on your assets
        style={styles.image}
        resizeMode="contain"
      />

      <Link href="/(auth)/signin" asChild>
        <TouchableOpacity style={styles.getStartedBtn}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/(app)/home" asChild>
        <TouchableOpacity>
          <Text style={styles.loginText}>Go to home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 40,
  },
  getStartedBtn: {
    backgroundColor: "#2980B9",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    color: "#2980B9",
    fontSize: 14,
    marginTop: 10,
  },
});
