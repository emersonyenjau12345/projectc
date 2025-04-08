import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, 
  Dimensions, TouchableOpacity 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

const { width } = Dimensions.get('window');

const getKeterangan = (points) => {
  if (points >= 1 && points <= 28) {
    return "Menghadap Sir Refly";
  } else if (points >= 29 && points <= 49) {
    return "Pemanggilan Orang Tua";
  } else if (points >= 50) {
    return "Diskors Semester Berikutnya";
  } else {
    return "Boleh Melakukan Pendaftaran";
  }
};

const WorkLoginScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Users'));
      if (querySnapshot.empty) {
        console.warn('Data Firestore kosong.');
      }
      const usersData = querySnapshot.docs.map((doc) => {
        const userData = doc.data();
        const poin = parseInt(userData.Points, 10) || 0;

        return {
          id: doc.id,
          No: userData.No || '-',
          Name: userData.Name || '-',
          Tempat_Kerja: getKeterangan(poin),
          Tempat_Duduk: userData.Seating || '-',
          Jumlah_Apsen: userData.Jumlah_Apsen || '0',
          Poin: poin,
        };
      });
      const filteredData = usersData.filter((user) => user.Poin >= 1 && user.Poin <= 28);
      setData(filteredData);
    } catch (error) {
      console.error('Error mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditPress = () => {
    navigation.navigate('EditinPihakKerja');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <FontAwesome name="user-circle" size={80} color="#6200ea" />
          <Text style={styles.profileText}>Student List</Text>
        </View>

        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <FontAwesome name="edit" size={28} color="#6200ea" />
        </TouchableOpacity>
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { width: 40 }]}>No</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Workplace</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Points</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, { width: 40 }]}>{item.No}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.Name}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.Tempat_Kerja}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{item.Poin}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});

export default WorkLoginScreen;
