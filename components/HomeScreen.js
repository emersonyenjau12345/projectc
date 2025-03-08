import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { width: width * 0.8, height: height * 0.25 }]}
      />
      <View style={styles.titleContainer}>
        <View style={styles.line} />
        <Text style={styles.title}>REDEEM POINT</Text>
        <View style={styles.line} />
      </View>
      <Text style={styles.verse}>
        "Apapun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti
        untuk Tuhan dan bukan untuk manusia."
      </Text>
      <Text style={styles.verseRef}>KOLOSE 3:23</Text>

      <TouchableOpacity
        style={[styles.button, { width: width * 0.8 }]}
        onPress={() => navigation.navigate("VillageDeanLogin")}
      >
        <Text style={styles.buttonText}>Login Village Dean</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { width: width * 0.8 }]}
        onPress={() => navigation.navigate("StudentLogin")}
      >
        <Text style={styles.buttonText}>Login Student</Text>
      </TouchableOpacity>

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
