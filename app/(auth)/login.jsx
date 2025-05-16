import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.innerContainer}>
          {/* Header */}

          {/* Welcome Text */}
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>Hello, Welcome back 👋</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Remember Me and Forgot Password */}
            <View style={styles.rememberForgotRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Pas de compte ? </Text>
              <TouchableOpacity>
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>
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
  rememberForgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8b4513", // brown-ish
    borderColor: "#8b4513",
  },
  rememberText: {
    color: "#333",
  },
  forgotText: {
    color: "#666",
  },
  loginButton: {
    backgroundColor: "#60a5fa", // blue-400
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    color: "#666",
  },
  signUpText: {
    color: "#2563eb", // blue-600
    fontWeight: "500",
  },
});

export default LoginScreen;
