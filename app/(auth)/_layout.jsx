import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "none", // Disable sliding animation
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          title: "Sign Up",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
