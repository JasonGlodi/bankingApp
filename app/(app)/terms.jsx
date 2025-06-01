import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.intro}>
        Please read the following terms and conditions carefully before using our banking services.
      </Text>

      <View style={styles.section}>
        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using this banking application, you accept and agree to be bound by the
          terms and provisions of this agreement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. User Responsibilities</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account and password and
          for restricting access to your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. Privacy and Security</Text>
        <Text style={styles.text}>
          We take your privacy seriously. All personal and financial data is securely encrypted and
          handled according to our privacy policy.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>4. Limitation of Liability</Text>
        <Text style={styles.text}>
          The bank shall not be liable for any direct or indirect damages resulting from the use of
          this application.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>5. Modifications</Text>
        <Text style={styles.text}>
          We reserve the right to change these terms at any time. Continued use of the application
          implies your acceptance of the revised terms.
        </Text>
      </View>

      <Text style={styles.footer}>
        If you have any questions about these Terms and Conditions, please contact customer support.
      </Text>
    </ScrollView>
  );
};

export default TermsAndConditions;




const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  intro: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0055aa',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  footer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 20,
  },
});


