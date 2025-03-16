import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  // Menyesuaikan ukuran tombol berdasarkan ukuran layar
  const buttonWidth = width > 600 ? width * 0.5 : width * 0.8;

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { width: width * 0.8, height: height * 0.25 }]}
      />

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <View style={styles.line} />
        <Text style={styles.title}>REDEEM POINT</Text>
        <View style={styles.line} />
      </View>

      {/* Verse */}
      <Text
        style={[
          styles.verse,
          Platform.OS === "web" ? { maxWidth: width * 0.6, fontSize: 12 } : null,
        ]}
        numberOfLines={Platform.OS === "web" ? 2 : undefined}
        adjustsFontSizeToFit={Platform.OS === "web"}
      >
        "Janganlah kita menjauhkan diri dari ibadah, tetapi marilah kita saling
        menasihati, dan semakin giat melakukannya."
      </Text>
      <Text style={styles.verseRef}>Ibrani 10:25</Text>

      {/* Login Buttons */}
      <TouchableOpacity
        style={[styles.button, { width: buttonWidth }]} // Lebar tombol disesuaikan
        onPress={() => navigation.navigate("VillageDeanLogin")}
      >
        <Text style={styles.buttonText}>Login Village Dean</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { width: buttonWidth }]} // Lebar tombol disesuaikan
        onPress={() => navigation.navigate("StudentLogin")}
      >
        <Text style={styles.buttonText}>Login Student</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={[styles.footer, { bottom: height * 0.05 }]}>
        UNIVERSITAS KLABAT
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#844E87",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    resizeMode: "contain",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  verse: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  verseRef: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    position: "absolute",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
