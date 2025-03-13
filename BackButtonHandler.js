import React, { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";

const BackButtonHandler = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        Alert.alert("Konfirmasi", "Apakah Anda ingin keluar dari aplikasi?", [
          { text: "Batal", style: "cancel" },
          { text: "Keluar", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }

    if (Platform.OS === "web") {
      window.onpopstate = () => {
        Alert.alert("Konfirmasi", "Apakah Anda ingin kembali?", [
          { text: "Batal", style: "cancel" },
          { text: "Kembali", onPress: () => window.history.back() },
        ]);
      };
    }
  }, []);

  return null;
};

export default BackButtonHandler;
