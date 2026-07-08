import { Stack } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("RootLayout: checking hydration. hasHydrated =", useAuthStore.persist.hasHydrated());
    
    // If already hydrated (e.g. synchronous storage)
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    // Wait for Zustand persist to rehydrate from AsyncStorage
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      console.log("RootLayout: onFinishHydration triggered");
      setHydrated(true);
    });

    // Final safety check
    setTimeout(() => {
      console.log("RootLayout: Safety timeout check. hasHydrated =", useAuthStore.persist.hasHydrated());
      if (useAuthStore.persist.hasHydrated()) {
        setHydrated(true);
      } else {
        // Force hydration flag after 2 seconds to avoid permanent loading screen
        console.log("RootLayout: Forcing hydration flag true after timeout");
        setHydrated(true);
      }
    }, 2000);

    return () => unsub();
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EEF8EE" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </QueryClientProvider>
  );
}
