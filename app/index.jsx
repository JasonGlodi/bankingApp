import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Banking App</Text>

      <View style={styles.linkContainer}>
        <Link href="/home" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/signin" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  linkContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#f4511e",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
