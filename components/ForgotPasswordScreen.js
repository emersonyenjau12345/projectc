import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const auth = getAuth();

  // Daftar email yang diperbolehkan reset password
  const ADMIN_EMAIL = "s21810030@student.unklab.ac.id";
  const WORKER_EMAILS = ["s11810307@student.unklab.ac.id"]; // Tambahkan email pihak kerja

  // Fungsi untuk mengirim email reset password
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Silakan masukkan email Anda!");
      return;
    }

    if (email !== ADMIN_EMAIL && !WORKER_EMAILS.includes(email)) {
      Alert.alert(
        "Error",
        "Email tidak terdaftar sebagai Admin atau Pihak Kerja."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Email Terkirim",
        "Silakan cek email Anda untuk reset password."
      );
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error reset password:", error);
      Alert.alert("Error", "Gagal mengirim email reset password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Your Password</Text>

      <View style={styles.inputContainer}>
        <FontAwesome5
          name="user-alt"
          size={20}
          color="#C96DD8"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
      >
        <Text style={styles.resetText}>Send Reset Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back to Login</Text>
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
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: "100%",
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 0, // Menghindari garis bawah hitam kecil
    outlineStyle: "none", // Untuk mencegah efek focus di web
  },
  
  resetButton: {
    backgroundColor: "#4C86F3",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    marginTop: 10,
    padding: 10,
  },
  backText: {
    fontSize: 14,
    color: "#333",
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;
