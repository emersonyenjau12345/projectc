import React, { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButtonHandler = () => {
  const navigation = useNavigation(); // Pastikan navigasi bisa digunakan

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack(); // ✅ Kembali ke layar sebelumnya
      } else {
        Alert.alert("Konfirmasi", "Apakah Anda ingin keluar dari aplikasi?", [
          { text: "Batal", style: "cancel" },
          { text: "Keluar", onPress: () => BackHandler.exitApp() }, // ❌ Jika tidak bisa kembali, keluar aplikasi
        ]);
      }
      return true;
    };

    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }

    if (Platform.OS === "web") {
      const handlePopState = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          Alert.alert("Konfirmasi", "Apakah Anda ingin kembali?", [
            { text: "Batal", style: "cancel" },
            { text: "Kembali", onPress: () => window.history.back() },
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
