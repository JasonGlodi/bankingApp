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

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const handleSignup = async () => {
    // Basic validation
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Password confirmation validation
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password fields didn't match.");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email,
        username,
        password,
        confirm_password: confirmPassword,
        phone_number: phoneNumber || "",
      };

      // Remove undefined values
      Object.keys(userData).forEach((key) => {
        if (userData[key] === undefined || userData[key] === "") {
          if (key !== "phone_number") {
            // Keep phone_number even if empty
            delete userData[key];
          }
        }
      });

      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email for verification.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ]
        );
      } else {
        // Handle validation errors from backend
        let errorMessage = "Registration failed";
        if (data.email) {
          errorMessage = `Email: ${data.email.join(", ")}`;
        } else if (data.username) {
          errorMessage = `Username: ${data.username.join(", ")}`;
        } else if (data.password) {
          errorMessage = `Password: ${data.password.join(", ")}`;
        } else if (data.phone_number) {
          errorMessage = `Phone: ${data.phone_number.join(", ")}`;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors.join(", ");
        }

        Alert.alert("Registration Error", errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Network error. Please try again later.");
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
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
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
