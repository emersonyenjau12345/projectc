import React, { useEffect, useState } from 'react';
import { 
    View, Text, TextInput, StyleSheet, SafeAreaView, ActivityIndicator, 
    TouchableOpacity, FlatList 
} from 'react-native';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const EditinPihakKerja = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedJam, setEditedJam] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Users'));
                const usersData = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    No: index + 1,
                    ...doc.data()
                })).filter(user => user.Role !== 'Pihak Kerja' && user.Role !== 'Admin' && user.Name && user.Jam && user.Points > 0 && user.Points >= 1 && user.Points <= 28);
                
                setData(usersData);
                setFilteredData(usersData);
            } catch (error) {
                console.error("Error mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ea" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
                    <FontAwesome name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>User List</Text>
                <TouchableOpacity style={styles.navButton}>
                    <FontAwesome name="user-circle" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search by name or O'clock..."
                value={searchQuery}
                onChangeText={(query) => {
                    setSearchQuery(query);
                    if (query === '') {
                        setFilteredData(data);
                    } else {
                        const lowerQuery = query.toLowerCase();
                        const filtered = data.filter(user => 
                            user.Name.toLowerCase().includes(lowerQuery) || 
                            String(user.Points).includes(lowerQuery)
                        );
                        setFilteredData(filtered);
                    }
                }}
            />

            <View style={styles.tableContainer}>
                {/* Header Tabel */}
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, { width: 50 }]}>No</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>O'clock</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Action</Text>
                </View>

                {/* Data Tabel */}
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.errorText}>No user data matches the search.</Text>}
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
                                    <TouchableOpacity onPress={() => {
                                        const user = data.find(u => u.id === item.id);
                                        if (!user || editedJam === null) return;
                                        const selisih = user.Jam - editedJam;
                                        let newPoints = user.Points;
                                        if (selisih > 0) newPoints -= selisih * 2;
                                        updateDoc(doc(db, 'Users', item.id), { Jam: editedJam, Points: newPoints });
                                        setData(prev => prev.map(u => u.id === item.id ? { ...u, Jam: editedJam, Points: newPoints } : u));
                                        setFilteredData(prev => prev.map(u => u.id === item.id ? { ...u, Jam: editedJam, Points: newPoints } : u));
                                        setEditingId(null);
                                    }}>
                                        <FontAwesome name="check" size={20} color="green" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => {
                                        setEditingId(item.id);
                                        setEditedJam(item.Jam);
                                    }}>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EACAF5', paddingTop: 40, paddingHorizontal: 10 },
    navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#6200ea', marginBottom: 20 },
    navButton: { padding: 10 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    searchInput: { backgroundColor: 'white', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 15 },
    tableContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 20, elevation: 3 },
    headerRow: { flexDirection: 'row', backgroundColor: '#6200ea', paddingVertical: 10, borderRadius: 5 },
    headerCell: { textAlign: 'center', fontWeight: 'bold', color: 'white' },
    tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    tableCell: { textAlign: 'center', fontSize: 14, paddingVertical: 5 },
    input: { borderBottomWidth: 1, borderBottomColor: '#6200ea', textAlign: 'center' },
    actions: { flexDirection: 'row', justifyContent: 'space-around', flex: 1 },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red', marginTop: 20 }
});

export default EditinPihakKerja;
