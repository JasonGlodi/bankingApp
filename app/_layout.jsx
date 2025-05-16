import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Disable the sliding animation
        animation: "none",

        // Style options
        headerStyle: {
          backgroundColor: "#4e54c8", // Match your blue color
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // Hide the route path by setting a custom header title
        // or completely hide the header title
        headerTitle: "", // Set to empty string or remove this line for no title at all

        // If you want to hide the entire header in some screens
        // headerShown: false,
      }}
    >
      {/* Define each screen with custom options if needed */}
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome", // This will show "Welcome" instead of the route
        }}
      />
      <Stack.Screen
        name="(app)/home"
        options={{
          title: "Home", // This will show "Home" instead of "(app)/home"
          // If you already have a back button and title in your component:
          // headerShown: false, // Completely hide the header
        }}
      />
      {/* Other screens... */}
    </Stack>
  );
}
