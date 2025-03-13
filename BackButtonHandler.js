import React, { useEffect } from "react";
import { Alert, BackHandler, Platform, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButtonHandler = () => {
  const navigation = useNavigation(); // Gunakan navigasi

  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        Alert.alert(
          "Konfirmasi", // 🟢 Ini tidak error karena Alert sudah mendukung string
          "Apakah Anda ingin kembali?",
          [
            { text: "Batal", style: "cancel" },
            { text: "Kembali", onPress: () => navigation.goBack() },
          ]
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }

    if (Platform.OS === "web") {
      window.onpopstate = () => {
        Alert.alert(
          "Konfirmasi",
          "Apakah Anda ingin kembali?",
          [
            { text: "Batal", style: "cancel" },
            { text: "Kembali", onPress: () => window.history.back() },
          ]
        );
      };
    }
  }, []);

  return <Text style={{ display: "none" }}>Back Button Handler</Text>; // ✅ Tambahkan ini agar tidak error
};

export default BackButtonHandler;
