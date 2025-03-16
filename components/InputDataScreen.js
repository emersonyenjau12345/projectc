import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useWindowDimensions } from "react-native";

const InputDataScreen = () => {
  const { width, height } = useWindowDimensions();
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try {
      const userRef = doc(db, "Users", email.replace(/[@.]/g, "_"));
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async () => {
    if (!image || !user) {
      Alert.alert("Error", "Silakan pilih gambar terlebih dahulu!");
      return;
    }

    const data = new FormData();
    data.append("file", { uri: image, type: "image/jpeg", name: "upload.jpg" });
    data.append("upload_preset", "Gambar_Saya");
    data.append("cloud_name", "ddmz8ct9u");

    try {
      let response = await fetch("https://api.cloudinary.com/v1_1/ddmz8ct9u/image/upload", {
        method: "POST",
        body: data,
      });
      let result = await response.json();

      const userEmail = user.email;
      const userRef = doc(db, "Users", userEmail);

      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        Alert.alert("Error", "User tidak ditemukan di database!");
        return;
      }

      await setDoc(
        userRef,
        {
          imageUrl: result.secure_url,
          ImageApproved: false,
          description: description || "",
        },
        { merge: true }
      );

      Alert.alert("Sukses", "Gambar berhasil diunggah & data diperbarui!");
      setImage(null);
      setDescription("");
      fetchUserData(user.email);
    } catch (error) {
      Alert.alert("Error", "Gagal mengunggah gambar.");
      console.error("Upload Error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{user?.email || "User Tidak Ditemukan"}</Text>
        </View>

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <>
              <FontAwesome5 name="cloud-upload-alt" size={50} color="#555" />
              <Text style={styles.uploadText}>Upload Gambar</Text>
            </>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Tambahkan deskripsi"
          placeholderTextColor="#888"
          value={description}
          onChangeText={(text) => setDescription(text)} // Tanpa batasan karakter
        />

        <TouchableOpacity style={styles.uploadButton} onPress={uploadToCloudinary}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: { 
    width: "90%", 
    padding: 20, 
    backgroundColor: "#f5f5f5", 
    alignItems: "center",
    borderRadius: 10,
    elevation: 3, 
  },
  header: { 
    marginBottom: 20, 
    width: "100%", 
    alignItems: "center" 
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#333" 
  },
  uploadBox: { 
    width: "100%", 
    height: 200, 
    backgroundColor: "#e0e0e0", 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: "#ccc",
    marginBottom: 20,
  },
  uploadText: { 
    marginTop: 10, 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#555" 
  },
  uploadedImage: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 10,
    resizeMode: "contain", 
  },
  input: { 
    width: "100%",
    height: 50, 
    borderColor: "#ddd", 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  uploadButton: { 
    backgroundColor: "#28a745", 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: "center",
    width: "100%",
  },
  uploadButtonText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#fff" 
  },
});

export default InputDataScreen;
