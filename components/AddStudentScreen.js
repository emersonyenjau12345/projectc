import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const AddStudentScreen = () => {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [regis, setRegis] = useState('');
  const [seating, setSeating] = useState('');
  const [point, setPoint] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigation = useNavigation();

  const showMessage = (text, type = 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleAddStudent = async () => {
    if (!nama || !nim || !regis || !seating || !point || !email) {
      showMessage('Semua data harus diisi!', 'error');
      return;
    }

    try {
      const password = '123456';
      const lowerEmail = email.toLowerCase();
      const docRef = doc(db, 'Users', lowerEmail);

      const pointsNumber = parseInt(point);
      const jamKerja = Math.floor(pointsNumber / 2);

      await setDoc(
        docRef,
        {
          AuthUID: '',
          Name: nama,
          Nim: Number(nim),
          Regis: regis,
          Seating: seating,
          Points: point,
          Email: lowerEmail,
          Password: password,
          Jam: jamKerja,
          ImageApproved: false,
        },
        { merge: true }
      );

      const userCredential = await createUserWithEmailAndPassword(auth, lowerEmail, password);
      const uid = userCredential.user.uid;
      await setDoc(docRef, { AuthUID: uid }, { merge: true });

      showMessage('Data mahasiswa berhasil ditambahkan!', 'success');
      setNama('');
      setNim('');
      setRegis('');
      setSeating('');
      setPoint('');
      setEmail('');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showMessage('Email sudah terdaftar. Data tetap diperbarui.', 'success');
        try {
          // Optional: Login logic if needed
        } catch (loginError) {
          showMessage('Login Gagal: ' + loginError.message, 'error');
        }
      } else {
        showMessage('Error: ' + error.message, 'error');
      }
    }
  };

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets || res.assets.length === 0) {
        showMessage('Tidak ada file yang dipilih.', 'error');
        return;
      }
      const fileUri = res.assets[0].uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        for (const row of jsonData) {
          const email = (row.Email || '').toLowerCase();
          const password = '123456';
          const docRef = doc(db, 'Users', email);
          try {
            const pointVal = parseInt(row.Poin || 0);
            const jamKerja = Math.floor(pointVal / 2);

            await setDoc(
              docRef,
              {
                AuthUID: '',
                Name: row.Nama || '',
                Nim: Number(row.Nim) || 0,
                Regis: row.Regis || '',
                Seating: row['Tempat Duduk'] || '',
                Points: row.Poin || '0',
                Email: email,
                Password: password,
                Jam: jamKerja,
                ImageApproved: false,
              },
              { merge: true }
            );
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            await setDoc(docRef, { AuthUID: uid }, { merge: true });
          } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
              await signInWithEmailAndPassword(auth, email, password);
            } else {
              console.error('Gagal mengunggah baris data:', row, error.message);
            }
          }
        }
        showMessage('File berhasil diunggah & data siswa ditambahkan!', 'success');
      };
      reader.readAsArrayBuffer(blob);
    } catch (err) {
      showMessage('Gagal memilih file: ' + err.message, 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#6C63FF" />
            <Text style={styles.backText}></Text>
          </TouchableOpacity>

          <FontAwesome name="user-circle" size={50} color="#6C63FF" style={{ marginBottom: 5 }} />
          <Text style={styles.title}>Tambah / Edit Siswa</Text>

          {message ? (
            <View style={[styles.messageBox, messageType === 'success' ? styles.successBox : styles.errorBox]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ) : null}

          <TextInput style={styles.input} placeholder="Nama" value={nama} onChangeText={setNama} />
          <TextInput style={styles.input} placeholder="NIM" value={nim} onChangeText={setNim} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Regis" value={regis} onChangeText={setRegis} />
          <TextInput style={styles.input} placeholder="Seating" value={seating} onChangeText={setSeating} />
          <TextInput style={styles.input} placeholder="Point" value={point} onChangeText={setPoint} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <View style={styles.buttonContainer}>
            <Button title="Simpan Mahasiswa" onPress={handleAddStudent} color="#6C63FF" />
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text style={styles.uploadText}>Unggah Excel (.xlsx)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    width: '90%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // agar button rata kiri
    marginBottom: 10,
    marginTop: 5,  
  },
  backText: {
    color: '#6C63FF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 15,
    alignSelf: 'center',
    width: '100%',
  },
  messageBox: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  successBox: {
    backgroundColor: '#d4edda',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
  },
  messageText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 13,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  uploadText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default AddStudentScreen;
