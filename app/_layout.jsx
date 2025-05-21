import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Disable the sliding animation
        animation: "none",
        // Style options
        headerStyle: {
          backgroundColor: "#FFFFFFFF", // Match your blue color
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // Hide the header completely by default
        headerShown: false,
      }}
    >
      {/* Define each screen with custom options if needed */}
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome", // This will show "Welcome" instead of the route
          headerShown: true, // Show header on this screen if needed
        }}
      />
      <Stack.Screen
        name="(app)/home"
        options={{
          title: "Home", // This will show "Home" instead of "(app)/home"
          headerShown: false, // Hide the header completely on Home screen
        }}
      />
      {/* Other screens... */}
    </Stack>
  );
}
