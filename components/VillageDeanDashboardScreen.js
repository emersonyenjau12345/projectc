// VillageDeanDashboardScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Linking,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { db } from "../firebaseConfig"; // Pastikan ini adalah konfigurasi Firebase Anda
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
const VillageDeanDashboardScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("viewPoints");
  const [searchQuery, setSearchQuery] = useState("");
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs
          .map((doc, index) => ({
            id: doc.id,
            No: index + 1,
            ...doc.data(),
          }))
          .filter((user) => user.Name !== "admin" && user.Name !== "pekerjaan");
        console.log("Fetched Users: ", usersList);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const messagesCollection = collection(db, "chats");
        const messagesSnapshot = await getDocs(messagesCollection);
        const messagesList = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUsers();
    fetchMessages();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id, field, value) => {
    setEditedData({ 
      ...editedData, 
      [id]: { ...editedData[id], [field]: value } 
    });
  };

  const openImage = (imageUrl) => {
    if (imageUrl) {
      Linking.openURL(imageUrl);
    } else {
      alert("Tidak ada gambar untuk ditampilkan!");
    }
  };

  const approveImage = async (id) => {
    try {
      // Cari user berdasarkan id di state users
      const user = users.find((user) => user.id === id);
  
      if (!user) {
        alert("Error: Pengguna tidak ditemukan!");
        return;
      }
  
      if (!user.imageUrl) {
        alert("Error: Gambar belum tersedia!");
        return;
      }
  
      // Update Firestore
      const userRef = doc(db, "Users", id);
      await updateDoc(userRef, { ImageApproved: true });
  
      // Perbarui state lokal
      setUsers(users.map(user =>
        user.id === id ? { ...user, ImageApproved: true } : user
      ));
  
      alert("Gambar Disetujui!");
    } catch (error) {
      console.error("Error approving image:", error);
    }
  };

  const approvePoints = async (id, points) => {
    if (points >0) {
      alert("Poin masih ada, tidak bisa disetujui!");
      return;
    }

    try {
      const userRef = doc(db, "Users", id);
      await updateDoc(userRef, { Approved: true });

      setUsers(users.map(user =>
        user.id === id ? { ...user, Approved: true } : user
      ));

      alert("Points Approved!");
    } catch (error) {
      console.error("Error approving points:", error);
    }
  };
  
  const handleSave = async (id) => {
    const updatedUser  = editedData[id];
    if (updatedUser ) {
      await updateDoc(doc(db, "Users", id), updatedUser );
      setUsers(users.map((user) => (user.id === id ? { ...user, ...updatedUser  } : user)));
      setEditedData({ ...editedData, [id]: {} });
      alert("Data Updated!");
    }
  };
  
  const handleCancel = (id) => {
    const originalUser  = users.find((user) => user.id === id);
    if (originalUser ) {
      setEditedData({
        ...editedData, 
        [id]: {
          Seating: originalUser .Tempat_Kerja,
          Points: String(originalUser .Points),
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.navbarLeft}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.navbarTitle}>Redeem Points System</Text>
        </View>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.unklab.ac.id/visi-misi-tujuan/")}>
            <Text style={styles.navLink}>Visi & Misi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.unklab.ac.id/contact/")}>
            <Text style={styles.navLink}>Contact Us</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan nama..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Redeem Points</Text>
          <TouchableOpacity onPress={() => setActiveTab("editPoints")}>
            <Text style={styles.sidebarItem}>Edit Points</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("viewPoints")}>
            <Text style={styles.sidebarItem}>View Points</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("approvePoints")}>
            <Text style={styles.sidebarItem}>Approve Points</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('VillageChating')}>
             <Text style={styles.sidebarItem}>Messe(0)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {activeTab === "editPoints"
              ? "EDIT POINTS"
              : activeTab === "approvePoints"
              ? "APPROVE POINTS"
              : "VIEW POINTS"}
          </Text>

          {activeTab === "viewPoints" && (
  <View>
    {/* Keterangan Tabel */}
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>No</Text>
      <Text style={styles.headerCell}>Nama</Text>
      <Text style={styles.headerCell}>NIM</Text>
      <Text style={styles.headerCell}>Regis</Text>
      <Text style={styles.headerCell}>Seating</Text>
      <Text style={styles.headerCell}>Tempat Kerja</Text>
      <Text style={styles.headerCell}>Poin</Text>
      <Text style={styles.headerCell}>Keterangan</Text>

    </View>

    {/* Data Tabel */}
    <FlatList
      data={filteredUsers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.No}</Text>
          <Text style={styles.tableCell}>{item.Name}</Text>
          <Text style={styles.tableCell}>{item.Nim}</Text>
          <Text style={styles.tableCell}>{item.Regis}</Text>
          <Text style={styles.tableCell}>{item.Seating}</Text>
          <Text style={styles.tableCell}>{item.Tempat_Kerja}</Text>
          <Text style={styles.tableCell}>{item.Points}</Text>
          <Text style={styles.tableCell}>{item.ImageApproved ? "Disetujui" : "Belum Disetujui"}</Text>

        </View>
      )}
    />
  </View>
)}
{activeTab === "approvePoints" && (
  <View>
    {/* Keterangan Header Tabel */}
    <View style={styles.tableHeader}>
  <Text style={[styles.headerCell, { paddingHorizontal: 40 }]}>No</Text>
  <Text style={[styles.headerCell, { paddingHorizontal: 20 }]}>Nama </Text>
  <Text style={[styles.headerCell, { paddingHorizontal: 20 }]}>Nim</Text>
  <Text style={[styles.headerCell, { paddingHorizontal: 20 }]}>Jam Kerja</Text>
  <Text style={[styles.headerCell, { paddingHorizontal: 20 }]}>Poin Mahasiswa</Text>
  <Text style={[styles.headerCell, { paddingHorizontal: 10 }]}>Aksi</Text>
</View>


    {/* Data Tabel */}
    <FlatList
      data={filteredUsers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const points = parseInt(item.Points) || 0;
        return (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.No}</Text>
            <Text style={styles.tableCell}>{item.Name}</Text>
            <Text style={styles.tableCell}>{item.Nim}</Text>
            <Text style={styles.tableCell}>{item.Jam}</Text>
            <Text style={styles.tableCell}>{points}</Text>

            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => approvePoints(item.id, points)}>
                <FontAwesome5
                  name={points === 0 ? "check-circle" : "times-circle"}
                  size={20}
                  color={points === 0 ? "green" : "red"}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openImage(item.imageUrl)}>
                <FontAwesome5 name="image" size={20} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => approveImage(item.id)}>
                <FontAwesome5
                  name="thumbs-up"
                  size={20}
                  color={item.ImageApproved ? "green" : "gray"}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  </View>
)}

{activeTab === "editPoints" && (
  <View>
    {/* Keterangan Header Tabel */}
    <View style={styles.tableHeader}>
  <Text style={[styles.headerCell, { flex: 1.5}]}>No</Text>
  <Text style={[styles.headerCell, { flex: 1.5 }]}>Nama</Text>
  <Text style={[styles.headerCell, { flex: 1.5 }]}>NIM</Text>
  <Text style={[styles.headerCell, { flex: 1.5 }]}>Regis</Text>
  <Text style={[styles.headerCell, { flex: 1.5 }]}>Jam Kerja</Text>
  <Text style={[styles.headerCell, { flex: 1.5 }]}>Poin</Text>
  <Text style={[styles.headerCell, { flex: 1.5 }]}>Aksi</Text>
  </View>


    {/* Data Tabel */}
    <FlatList
      data={filteredUsers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.No}</Text>
          <Text style={styles.tableCell}>{item.Name}</Text>
          <Text style={styles.tableCell}>{item.Nim}</Text>
          <Text style={styles.tableCell}>{item.Regis}</Text>

          <TextInput
            style={styles.input}
            value={editedData[item.id]?.Jam ?? String(item.Jam)}
            onChangeText={(text) => handleEdit(item.id, "Jam", text)}
            keyboardType="numeric"
            placeholder="Jam Kerja"
          />

          <TextInput
            style={styles.input}
            value={editedData[item.id]?.Points ?? String(item.Points)}
            onChangeText={(text) => handleEdit(item.id, "Points", text)}
            keyboardType="numeric"
            placeholder="Poin"
          />

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleSave(item.id)}>
              <MaterialIcons name="save" size={24} color="green" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCancel(item.id)}>
              <FontAwesome5 name="undo" size={20} color="orange" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </View>
)}


        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  navbar: {
    backgroundColor: "#1976D2",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  navbarTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  searchInput: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    width: 200,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mainContent: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 220,
    backgroundColor: "#263238",
    padding: 15,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  sidebarItem: {
    fontSize: 14,
    marginVertical: 8,
    color: "#B0BEC5",
    paddingVertical: 10,
  },
  content: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  tableCell: { flex: 1, textAlign: "center", fontSize: 14, color: "#37474F" },
  logo: { width: 40, height: 40, marginRight: 10 },
  navLinks: { flexDirection: "row" },
  navLink: {
    color: "white",
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#DCDCDC",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 5,
    justifyContent: "space-around",
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },

});

export default VillageDeanDashboardScreen;