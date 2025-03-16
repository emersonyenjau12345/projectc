import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useWindowDimensions } from "react-native";

const VillageDeanLoginScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Gunakan ukuran layar

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [role, setRole] = useState("Village Dean");

  const auth = getAuth();
  const db = getFirestore();

  const ADMIN_EMAIL = "s21810030@student.unklab.ac.id";
  const WORKER_EMAILS = ["s11810307@student.unklab.ac.id"];

  // Fungsi Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan Password harus diisi!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (role === "Village Dean" && email === ADMIN_EMAIL) {
        Alert.alert("Login Sukses", "Selamat datang, Village Dean!");
        navigation.navigate("VillageDeanDashboard");
      } else if (role === "Pihak Kerja" && WORKER_EMAILS.includes(email)) {
        Alert.alert("Login Sukses", "Selamat datang, Pihak Kerja!");
        navigation.navigate("WorkLoginScreen");
      } else {
        Alert.alert(
          "Akses Ditolak",
          "Email tidak cocok dengan role yang dipilih."
        );
      }
    } catch (error) {
      console.error("❌ Login Gagal:", error);
      Alert.alert("Login Gagal", "Email atau password salah.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome back to the Klabat University point redemption login menu
      </Text>

      {/* Dropdown Role */}
      <View style={[styles.inputContainer, { width: Math.min(width * 0.9, 400) }]}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Village Dean" value="Village Dean" />
          <Picker.Item label="Pihak Kerja" value="Pihak Kerja" />
        </Picker>
      </View>

      {/* Input Email */}
      <View style={[styles.inputContainer, { width: Math.min(width * 0.9, 400) }]}>
        <FontAwesome5
          name="user-alt"
          size={20}
          color="#C96DD8"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Input Password */}
      <View style={[styles.inputContainer, { width: Math.min(width * 0.9, 400) }]}>
        <FontAwesome5
          name="lock"
          size={20}
          color="#C96DD8"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={secureText ? "visibility-off" : "visibility"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        style={styles.forgotPassword}
      >
        <Text style={styles.forgotText}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, { width: Math.min(width * 0.9, 400) }]}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAD1F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
    minHeight: 50,
    elevation: 3, // Efek bayangan untuk tampilan lebih modern
  },
  picker: {
    flex: 1,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 15,
  },
  forgotText: {
    color: "#4C86F3",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#4C86F3",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 5, // Efek shadow agar tombol lebih menonjol
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default VillageDeanLoginScreen;
