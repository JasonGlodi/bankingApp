import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios" || Platform.OS === "android"
            ? "padding"
            : "height"
        }
        style={styles.keyboardView}
      >
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign up</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>Create your account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Surname */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
                autoCapitalize="none"
              />
            </View>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={hidePassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setHidePassword(!hidePassword)}
                >
                  <Ionicons
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "500",
  },
  welcomeBox: {
    marginTop: 32,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    color: "#333",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },
  signupButton: {
    backgroundColor: "#60a5fa", // light blue
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  signupButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default SignupScreen;
