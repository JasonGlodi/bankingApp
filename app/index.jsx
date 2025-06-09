import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function LandingPage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for the decorative elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.container}
      >
        {/* Animated background elements */}
        <Animated.View
          style={[styles.backgroundCircle1, { transform: [{ rotate: spin }] }]}
        />
        <Animated.View
          style={[styles.backgroundCircle2, { transform: [{ rotate: spin }] }]}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.logoGradient}
              >
                <Text style={styles.logoIcon}>💳</Text>
              </LinearGradient>
              <Text style={styles.logo}>MyBank</Text>
            </View>

            <Text style={styles.tagline}>Your Future, Your Bank</Text>
            <Text style={styles.subtitle}>
              Experience banking reimagined with cutting-edge technology and
              personalized financial solutions
            </Text>
          </Animated.View>

          {/* Feature Cards */}
          <Animated.View
            style={[
              styles.featuresSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.featureIcon}
              >
                <Text style={styles.featureIconText}>🚀</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>Instant Transfers</Text>
              <Text style={styles.featureDesc}>Send money in seconds</Text>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#f093fb", "#f5576c"]}
                style={styles.featureIcon}
              >
                <Text style={styles.featureIconText}>🔒</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>Bank-Level Security</Text>
              <Text style={styles.featureDesc}>Your money is safe with us</Text>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={styles.featureIcon}
              >
                <Text style={styles.featureIconText}>📊</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>Smart Analytics</Text>
              <Text style={styles.featureDesc}>Track your spending habits</Text>
            </View>
          </Animated.View>

          {/* CTA Section */}
          <Animated.View
            style={[
              styles.ctaSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Link href="/(auth)/signin" asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.getStartedBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.btnText}>Get Started</Text>
                  <Text style={styles.btnSubText}>Join thousands of users</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            <View style={styles.loginSection}>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.loginBtn} activeOpacity={0.7}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <Text style={styles.loginTextBold}>Log in</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Quick access for development */}
            <Link href="/(app)/home" asChild>
              <TouchableOpacity style={styles.devLink} activeOpacity={0.7}>
                <Text style={styles.devLinkText}>🏠 Quick Home Access</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Trust Indicators */}
          <Animated.View style={[styles.trustSection, { opacity: fadeAnim }]}>
            <Text style={styles.trustText}>
              Trusted by 50,000+ users worldwide
            </Text>
            <View style={styles.trustIndicators}>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>🔐 Encrypted</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>🏆 Award Winning</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustBadgeText}>⚡ 24/7 Support</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backgroundCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  backgroundCircle2: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(118, 75, 162, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(118, 75, 162, 0.2)",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 35,
  },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: "#a0a0a0",
    marginBottom: 15,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 16,
    color: "#808080",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuresSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    paddingHorizontal: 5,
  },
  featureCard: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 12,
    color: "#a0a0a0",
    textAlign: "center",
    lineHeight: 16,
  },
  ctaSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  getStartedBtn: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
    minWidth: width - 60,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  btnSubText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "400",
  },
  loginSection: {
    marginBottom: 20,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  loginText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
  loginTextBold: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
  },
  devLink: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  devLinkText: {
    color: "#808080",
    fontSize: 14,
    textAlign: "center",
  },
  trustSection: {
    alignItems: "center",
    marginTop: 20,
  },
  trustText: {
    color: "#a0a0a0",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  trustIndicators: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  trustBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  trustBadgeText: {
    color: "#a0a0a0",
    fontSize: 12,
    fontWeight: "500",
  },
});
