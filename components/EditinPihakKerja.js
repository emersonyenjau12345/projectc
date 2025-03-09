import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const EditinPihakKerja = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedJam, setEditedJam] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Users'));
                if (querySnapshot.empty) {
                    console.warn('Data Firestore kosong.');
                }
                const usersData = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    No: index + 1,
                    ...doc.data()
                })).filter(user => user.Role !== 'Pihak Kerja' && user.Role !== 'Admin' && user.Name && user.Jam);
                
                setData(usersData);
            } catch (error) {
                console.error("Error mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = (id, jam) => {
        setEditingId(id);
        setEditedJam(jam);
    };

    const handleSave = async (id) => {
        const user = data.find(item => item.id === id);
        if (!user || editedJam === null) return;

        const selisih = user.Jam - editedJam;
        const newJumlahApsen = user.Jumlah_Apsen - selisih;
        const newPoints = user.Points - selisih;

        const userRef = doc(db, 'Users', id);
        await updateDoc(userRef, {
            Jam: editedJam,
            Jumlah_Apsen: newJumlahApsen,
            Points: newPoints,
        });

        setData(prevData => prevData.map(item => item.id === id ? { ...item, Jam: editedJam, Jumlah_Apsen: newJumlahApsen, Points: newPoints } : item));
        setEditingId(null);
        setEditedJam(null);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ea" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
                    <FontAwesome name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Daftar Pengguna</Text>
                <TouchableOpacity style={styles.navButton}>
                    <FontAwesome name="user-circle" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Konten utama */}
            <View style={styles.content}>
                {data.length > 0 ? (
                    <View style={styles.table}>
                        <View style={styles.tableRowHeader}>
                            <Text style={[styles.tableHeaderText, { width: 50 }]}>No</Text>
                            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Nama</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Jam Kerja</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Aksi</Text>
                        </View>

                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { width: 50 }]}>{item.No}</Text>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{item.Name}</Text>
                                    {editingId === item.id ? (
                                        <TextInput
                                            style={[styles.tableCell, styles.input, { flex: 1 }]}
                                            keyboardType="numeric"
                                            value={String(editedJam)}
                                            onChangeText={setEditedJam}
                                        />
                                    ) : (
                                        <Text style={[styles.tableCell, { flex: 1 }]}>{item.Jam}</Text>
                                    )}
                                    <View style={styles.actions}>
                                        {editingId === item.id ? (
                                            <TouchableOpacity onPress={() => handleSave(item.id)}>
                                                <FontAwesome name="check" size={20} color="green" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => handleEdit(item.id, item.Jam)}>
                                                <FontAwesome name="edit" size={20} color="blue" />
                                            </TouchableOpacity>
                                        )}
                                        {editingId === item.id && (
                                            <TouchableOpacity onPress={() => setEditingId(null)}>
                                                <FontAwesome name="times" size={20} color="red" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <Text style={styles.errorText}>Tidak ada data pengguna yang tersedia.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#EACAF5', 
        paddingTop: 40  // Tambah jarak dari atas layar (naftabar turun)
    },

    navbar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: '#6200ea',
        marginBottom: 20, // Jarak ke bawah supaya konten tidak menempel
        marginTop: 20 // Tambah jarak navbar dari atas layar
    },

    navButton: { padding: 10 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' },

    content: { 
        flex: 1, 
        paddingHorizontal: 15, 
        paddingTop: 5,  // Jarak setelah navbar
    },

    table: { backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },

    tableRowHeader: { flexDirection: 'row', backgroundColor: '#6200ea', paddingVertical: 10, paddingHorizontal: 10 },
    tableHeaderText: { fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },

    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10, paddingHorizontal: 10, alignItems: 'center' },
    tableCell: { textAlign: 'center' },

    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 5, textAlign: 'center' },

    actions: { flexDirection: 'row', justifyContent: 'center', gap: 10 },

    errorText: { fontSize: 16, color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: 20 },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});


export default EditinPihakKerja;
