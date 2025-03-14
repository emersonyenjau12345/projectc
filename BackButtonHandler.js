import React, { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButtonHandler = () => {
  const navigation = useNavigation(); // Dapatkan navigasi dari React Navigation

  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        if (navigation.canGoBack()) {
          navigation.goBack(); // Navigasi kembali
        } else {
          Alert.alert("Konfirmasi", "Apakah Anda ingin keluar dari aplikasi?", [
            { text: "Batal", style: "cancel" },
            { text: "Keluar", onPress: () => BackHandler.exitApp() }, // Keluar aplikasi
          ]);
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }

    if (Platform.OS === "web") {
      const handlePopState = () => {
        if (navigation.canGoBack()) {
          navigation.goBack(); // Gunakan navigasi React Native
        } else {
          Alert.alert("Konfirmasi", "Apakah Anda ingin keluar?", [
            { text: "Batal", style: "cancel" },
            { text: "Kembali", onPress: () => window.history.back() }, // Gunakan history browser
          ]);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [navigation]);

  return null;
};

export default BackButtonHandler;
