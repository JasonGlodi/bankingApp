import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
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
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    return errors;
  };

  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      Alert.alert("Weak Password", passwordErrors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email,
        username,
        password,
        phone_number: phoneNumber || "",
      };

      const response = await fetch("http://192.168.1.175:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Registration failed.";
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) {
          errorMessage = `${firstKey}: ${data[firstKey].join(", ")}`;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        throw new Error(errorMessage);
      }

      // Store token or data if needed
      await AsyncStorage.setItem("user", JSON.stringify(data));

      Alert.alert("Success", "Account created!", [
        {
          text: "Continue",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (err) {
      console.error("Signup Error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            {/* Welcome Text */}
            <View style={styles.welcomeBox}>
              <Text style={styles.welcomeText}>Create your account</Text>
              <Text style={styles.subText}>
                Fill in the details below to get started
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email - Required */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Username - Required */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Username <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Phone Number - Optional */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Password - Required */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={hidePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
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

              {/* Confirm Password - Required */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Confirm Password <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  loading && styles.signupButtonDisabled,
                ]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  Already have an account?{" "}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <Text style={styles.loginLink}>Sign In</Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  welcomeBox: {
    marginTop: 32,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#6b7280",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  passwordHint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  signupButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0,
    elevation: 0,
  },
  signupButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginLinkText: {
    color: "#6b7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SignupScreen;
