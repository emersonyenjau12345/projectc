import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BackButtonHandler from "./BackButtonHandler";

import HomeScreen from "./components/HomeScreen";
import StudentLoginScreen from "./components/StudentLoginScreen";
import VillageDeanLoginScreen from "./components/VillageDeanLoginScreen";
import DashboardStudent from "./components/DashboardStudent";
import ProfileView from "./components/ProfileView";
import ViewAbsentScreen from "./components/ViewAbsentScreen";
import InputDataScreen from "./components/InputDataScreen";
import ChangePasswordScreen from "./components/ChangePasswordScreen";
import VillageDeanDashboardScreen from "./components/VillageDeanDashboardScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import WorkLoginScreen from "./components/WorkLoginScreen";
import ChatScreen from "./components/ChatScreen";
import VillageChating from "./components/VillageChating";
import EditinPihakKerja from "./components/EditinPihakKerja";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <BackButtonHandler /> {/* ✅ Menangani tombol kembali di semua layar */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="DashboardStudent" component={DashboardStudent} />
        <Stack.Screen name="ProfileView" component={ProfileView} />
        <Stack.Screen name="ViewAbsentScreen" component={ViewAbsentScreen} />
        <Stack.Screen name="InputDataScreen" component={InputDataScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="VillageChating" component={VillageChating} />
        <Stack.Screen name="EditinPihakKerja" component={EditinPihakKerja} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="VillageDeanLogin" component={VillageDeanLoginScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="VillageDeanDashboard" component={VillageDeanDashboardScreen} />
        <Stack.Screen name="WorkLoginScreen" component={WorkLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
