import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";

import PeriodicTableScreen from "../screens/PeriodicTableScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ResultsScreen from "../screens/ResultsScreen";
import MaterialDetailScreen from "../screens/MaterialDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a1a2e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Advanced Search" }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: "Search Results" }}
      />
      <Stack.Screen
        name="MaterialDetail"
        component={MaterialDetailScreen}
        options={{ title: "Material Details" }}
      />
    </Stack.Navigator>
  );
}

function PeriodicTableStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a1a2e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="Home"
        component={PeriodicTableScreen}
        options={{ title: "Periodic Table" }}
      />
      <Stack.Screen
        name="MaterialDetail"
        component={MaterialDetailScreen}
        options={{ title: "Material Details" }}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1a1a2e" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Stack.Screen
        name="MaterialDetail"
        component={MaterialDetailScreen}
        options={{ title: "Material Details" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#16213e",
          },
          tabBarActiveTintColor: "#4a90e2",
          tabBarInactiveTintColor: "#aaa",
        }}
        initialRouteName="SearchTab"
      >
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStack}
          options={{
            title: "Favorites",
            tabBarLabel: "Favorites",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="HomeTab"
          component={PeriodicTableStack}
          options={{
            tabBarLabel: "Table",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
