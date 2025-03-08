import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FontAwesome5 } from '@expo/vector-icons';

const WorkLoginScreen = () => {
  const [dataKerja, setDataKerja] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📡 Mengambil data dari Firestore...");
        const querySnapshot = await getDocs(collection(db, "user1"));
        const data = [];
        querySnapshot.forEach((doc) => {
          console.log("📄 Data ditemukan:", doc.data());
          data.push({ id: doc.id, ...doc.data() });
        });
        setDataKerja(data);
        console.log("✅ Data berhasil diambil:", data);
      } catch (error) {
        console.error("❌ Error mengambil data dari Firestore:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#EAAFB4" />
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>NO</Text>
              <Text style={styles.headerText}>NAMA</Text>
              <Text style={styles.headerText}>Jam Kerja</Text>
              <Text style={styles.headerText}>Point</Text>
              <Text style={styles.headerText}>Keterangan</Text>
              <Text style={styles.headerText}>Aksi</Text>
            </View>

            {dataKerja.length > 0 ? (
              dataKerja.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.cellText}>{item.No}</Text>
                  <Text style={styles.cellText}>{item.Name}</Text>
                  <Text style={styles.cellText}>{item.Jam}</Text>
                  <Text style={styles.cellText}>{item.Points}</Text>
                  <Text style={styles.cellText}>{item.Tempat_Kerja}</Text>
                  <FontAwesome5 name="edit" size={16} color="blue" style={styles.icon} />
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Tidak ada data</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAD1F5",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#EAAFB4",
    padding: 10,
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#FFD9E0",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAAFB4",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  cellText: {
    flex: 1,
    textAlign: "center",
  },
  icon: {
    marginLeft: 10,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "gray",
  },
});

export default WorkLoginScreen;