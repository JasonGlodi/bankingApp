import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function Notifications() {
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.label}>Receive Transaction Alerts</Text>
        <Switch
          value={transactionAlerts}
          onValueChange={(value) => setTransactionAlerts(value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Enable Promotional Notifications</Text>
        <Switch
          value={promotionalNotifications}
          onValueChange={(value) => setPromotionalNotifications(value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={pushNotifications}
          onValueChange={(value) => setPushNotifications(value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: { fontSize: 16 },
});
