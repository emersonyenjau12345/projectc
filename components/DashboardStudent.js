import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const DashboardStudent = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();

  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email);

        try {
          const usersCollection = collection(db, "Users");
          const q = query(usersCollection, where("Email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log("User ditemukan:", userData);
            setName(userData.Name || "No Name");
          } else {
            console.log("User tidak ditemukan di Firestore");
            setName("User Not Found");
          }
        } catch (error) {
          console.error("Error mengambil data Firestore:", error);
        }
      } else {
        setEmail("User not logged in");
        setName("Unknown");
      }
    };

    const deleteOldHistory = async () => {
      try {
        const historyCollection = collection(db, "History");
        const querySnapshot = await getDocs(historyCollection);
        const currentTime = Date.now();

        querySnapshot.forEach(async (docSnapshot) => {
          const data = docSnapshot.data();
          if (data.timestamp) {
            const timeDiff = currentTime - data.timestamp;
            if (timeDiff > 24 * 60 * 60 * 1000) {
              await deleteDoc(doc(db, "History", docSnapshot.id));
              console.log(`Deleted old history: ${docSnapshot.id}`);
            }
          }
        });
      } catch (error) {
        console.error("Error deleting old history:", error);
      }
    };

    fetchUserData();
    deleteOldHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Selamat Datang</Text>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.emailText}>Email: {email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ProfileView", { email })}
        >
          <FontAwesome5 name="user-alt" size={30} color="black" />
          <Text style={styles.menuText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ViewAbsentScreen", { email })}
        >
          <MaterialIcons name="assignment" size={30} color="black" />
          <Text style={styles.menuText}>View Absent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("InputDataScreen")}
        >
          <MaterialIcons name="folder" size={30} color="black" />
          <Text style={styles.menuText}>Input File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ChangePasswordScreen", { email })}
        >
          <FontAwesome5 name="key" size={30} color="black" />
          <Text style={styles.menuText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ChatScreen", { email })}
        >
          <FontAwesome5 name="comments" size={30} color="black" />
          <Text style={styles.menuText}>Chatting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.goBack()}>
          <MaterialIcons name="exit-to-app" size={30} color="black" />
          <Text style={styles.menuText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B3E5FC",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 14,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  menuItem: {
    width: 120,
    height: 120,
    backgroundColor: "#3F51B5",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  menuText: {
    color: "white",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DashboardStudent;
