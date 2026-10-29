
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryScreen } from "../screens/HistoryScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { PatientScreen } from "../screens/PatientScreen";
import { PermissionsScreen } from "../screens/PermissionsScreen";
import { ProfessionalScreen } from "../screens/ProfessionalScreen";
import type { AppstackParamList, AppTabParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<AppstackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const tabIcons = {
  Patient: "users",
  Professional: "user-plus",
  History: "file-text",
  Permissions: "shield",
} as const;

const tabLabels = {
  Patient: "Pacientes",
  Professional: "Profesional",
  History: "Historial",
  Permissions: "Permisos",
} as const;

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Patient"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarHideOnKeyboard: true,
        tabBarLabel: tabLabels[route.name],
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
        },
        tabBarIcon: ({ color, size }) => (
          <Feather name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Patient" component={PatientScreen} />
      <Tab.Screen name="Professional" component={ProfessionalScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Permissions" component={PermissionsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
