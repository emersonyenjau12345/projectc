import React, { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButtonHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        if (navigation.canGoBack()) {
          navigation.goBack(); // Kembali ke layar sebelumnya
        } else {
          Alert.alert("Konfirmasi", "Apakah Anda ingin keluar dari aplikasi?", [
            { text: "Batal", style: "cancel" },
            { text: "Keluar", onPress: () => BackHandler.exitApp() },
          ]);
        }
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }

    if (Platform.OS === "web") {
      window.onpopstate = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          Alert.alert("Konfirmasi", "Apakah Anda ingin keluar?", [
            { text: "Batal", style: "cancel" },
            { text: "Keluar", onPress: () => window.history.back() },
          ]);
        }
      };
    }
  }, [navigation]);

  return null;
};

export default BackButtonHandler;
