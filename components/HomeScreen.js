import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isPC = Platform.OS === "web" && width > 800; // Deteksi platform PC

  return isPC ? (
    <ImageBackground
      source={require("../assets/pioneer_chapel.jpg")}
      style={styles.pcBackground}
      imageStyle={{ opacity: 0.3 }} // Efek transparan pada gambar
    >
      <View style={styles.pcContainer}>
        {/* Logo */}
        <Image source={require("../assets/logo.png")} style={styles.pcLogo} />

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <View style={styles.line} />
          <Text style={styles.title}>REDEEM POINT</Text>
          <View style={styles.line} />
        </View>

        {/* Verse */}
       <Text style={isPC ? styles.pcVerse : styles.verse}>
       Janganlah kita menjauhkan diri dari ibadah,{"\n"}
       tetapi marilah kita saling menasihati,{"\n"}
       dan semakin giat melakukannya.
       </Text>

       
        {/* Teks Ibrani 10:25 yang berfungsi sebagai tombol login Village Dean */}
        <TouchableOpacity
          onPress={() => navigation.navigate("VillageDeanLogin")}
        >
          <Text style={styles.verseRef}>Ibrani 10:25</Text>
        </TouchableOpacity>

        {/* Login Student Button */}
        <TouchableOpacity
          style={styles.pcButton}
          onPress={() => navigation.navigate("StudentLogin")}
        >
          <Text style={styles.buttonText}>Login Student</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>UNIVERSITAS KLABAT</Text>
      </View>
    </ImageBackground>
  ) : (
    <View style={styles.mobileContainer}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.mobileLogo} />

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <View style={styles.line} />
        <Text style={styles.title}>REDEEM POINT</Text>
        <View style={styles.line} />
      </View>

      {/* Verse */}
      <Text style={styles.verse}>
        "Janganlah kita menjauhkan diri dari ibadah, tetapi marilah kita saling
        menasihati, dan semakin giat melakukannya."
      </Text>

      {/* Teks Ibrani 10:25 yang berfungsi sebagai tombol login Village Dean */}
      <TouchableOpacity
        onPress={() => navigation.navigate("VillageDeanLogin")}
      >
        <Text style={styles.verseRef}>Ibrani 10:25</Text>
      </TouchableOpacity>

      {/* Login Student Button */}
      <TouchableOpacity
        style={styles.mobileButton}
        onPress={() => navigation.navigate("StudentLogin")}
      >
        <Text style={styles.buttonText}>Login Student</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>UNIVERSITAS KLABAT</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: "#844E87",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pcBackground: {
    flex: 1,
    resizeMode: "cover", // Menyesuaikan ukuran gambar
  },
  pcContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Efek transparan untuk konten
  },
  mobileLogo: {
    width: "70%",
    height: "20%",
    resizeMode: "contain",
    marginBottom: 15,
  },
  pcLogo: {
    width: "50%",
    height: "20%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  verse: {
    textAlign: "center",
    color: "#fff",
    fontSize: 13,
    marginBottom: 2,
    paddingHorizontal: 10,
  },
  verseRef: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mobileButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 3,
    width: "80%",
  },
  pcButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    width: 250,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
  },

  pcVerse: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,  // Ukuran teks lebih besar di PC
    fontWeight: "500",
    width: "80%",  // Batasi lebar agar tidak terlalu panjang
    lineHeight: 30,  // Jarak antar baris agar lebih nyaman dibaca
    marginBottom: 10,
  },


});

export default HomeScreen;
