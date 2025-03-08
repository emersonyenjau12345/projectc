import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, realtimeDb } from "../firebaseConfig";
import { ref, onValue, push, update } from "firebase/database";

const chatPath = "chats";

const markMessagesAsRead = async (senderEmail, userEmail) => {
    const messagesRef = ref(realtimeDb, chatPath);
    onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const updates = {};
            snapshot.forEach((child) => {
                const message = child.val();
                if (message.sender === senderEmail && message.receiver === userEmail && message.status !== "Dibaca") {
                    updates[`${chatPath}/${child.key}/status`] = "Dibaca";
                }
            });
            if (Object.keys(updates).length > 0) {
                update(ref(realtimeDb), updates);
            }
        }
    }, { onlyOnce: true });
};

const VillageChating = ({ navigation }) => {
    const [inputText, setInputText] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [unreadSenders, setUnreadSenders] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [selectedSender, setSelectedSender] = useState(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) setUserEmail(user.email);
    }, []);

    useEffect(() => {
        if (!userEmail) return;

        const messagesRef = ref(realtimeDb, chatPath);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sortedMessages = Object.keys(data)
                    .map((key) => ({ id: key, ...data[key] }))
                    .filter(msg => msg.sender === userEmail || msg.receiver === userEmail)
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                const unreadMessages = {};
                const senders = [...new Set(sortedMessages
                    .filter(msg => msg.sender !== "Admin" && msg.receiver === userEmail)
                    .map(msg => msg.sender))];

                senders.forEach(sender => {
                    const unreadCount = sortedMessages.filter(msg => msg.sender === sender && msg.receiver === userEmail && msg.status !== "Dibaca").length;
                    unreadMessages[sender] = unreadCount;
                });

                setUnreadCounts(unreadMessages);
                setUnreadSenders(senders);

                if (selectedSender) {
                    setChatMessages(sortedMessages.filter(msg => 
                        (msg.sender === selectedSender && msg.receiver === userEmail) || 
                        (msg.sender === userEmail && msg.receiver === selectedSender)
                    ));

                    // Jika sedang di dalam chat dan ada pesan baru, langsung tandai sebagai dibaca
                    markMessagesAsRead(selectedSender, userEmail);
                } else {
                    setChatMessages([]);
                }
            } else {
                setUnreadSenders([]);
                setUnreadCounts({});
                setChatMessages([]);
            }
        });

        return () => unsubscribe();
    }, [userEmail, selectedSender]);

    const handleSelectSender = (sender) => {
        setSelectedSender(sender);
        markMessagesAsRead(sender, userEmail);
    };

    const handleSendMessage = () => {
        if (inputText.trim() && userEmail && selectedSender) {
            const chatRef = ref(realtimeDb, chatPath);
            const newMessage = {
                sender: userEmail,
                receiver: selectedSender,
                text: inputText,
                timestamp: new Date().toISOString(),
                status: "Terkirim",
            };

            push(chatRef, newMessage);
            setInputText("");
        }
    };

    const isImageUrl = (url) => {
        return url.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/i);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="#7D2675" />
                </TouchableOpacity>
                <Text style={styles.username}>Chat Admin</Text>
            </View>

            <View style={styles.notificationContainer}>
                <Text style={styles.notificationTitle}>Pesan Masuk</Text>
                {unreadSenders.map((sender, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelectSender(sender)} style={styles.notificationItem}>
                        <Text style={styles.notificationText}>{sender} {unreadCounts[sender] > 0 && `(${unreadCounts[sender]})`}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedSender && (
                <FlatList
                    ref={flatListRef}
                    data={chatMessages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.messageContainer,
                            item.sender === userEmail ? styles.userMessage : styles.adminMessage
                        ]}>
                            <Ionicons
                                name={item.sender === userEmail ? "person-circle-outline" : "school-outline"}
                                size={24}
                                color={item.sender === userEmail ? "#7D2675" : "#2E86C1"}
                                style={{ marginRight: 5 }}
                            />
                            <View style={[styles.messageBubble, item.sender === userEmail ? styles.userBubble : styles.adminBubble]}>
                                {isImageUrl(item.text) ? (
                                    <Image source={{ uri: item.text }} style={{ width: 150, height: 150, borderRadius: 10 }} />
                                ) : (
                                    <Text style={styles.messageText}>{item.text}</Text>
                                )}
                            </View>
                        </View>
                    )}
                />
            )}

            {selectedSender && (
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ketik pesan..."
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity onPress={handleSendMessage}>
                        <Ionicons name="send" size={24} color="#7D2675" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    // Tambahkan warna untuk membedakan pesan admin dan student
    userBubble: { backgroundColor: "#D1C4E9" },
    adminBubble: { backgroundColor: "#BBDEFB" },
    container: { flex: 1, backgroundColor: "#F2F2F2", paddingHorizontal: 10, paddingBottom: 10 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: "#DDD",
        backgroundColor: "#E3E3E3",
        paddingHorizontal: 10,
    },
    username: { fontSize: 18, fontWeight: "bold", color: "#333", marginLeft: 10 },
    notificationContainer: { padding: 10, backgroundColor: "#FFF", borderRadius: 10, marginVertical: 10 },
    notificationTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    notificationItem: { padding: 10, backgroundColor: "#E3E3E3", marginVertical: 5, borderRadius: 5 },
    notificationText: { fontSize: 14, color: "#333" },
    messageContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
    userMessage: { alignSelf: "flex-end", flexDirection: "row-reverse" },
    adminMessage: { alignSelf: "flex-start" },
    messageBubble: { padding: 10, borderRadius: 10, backgroundColor: "#FFF", elevation: 2, maxWidth: "75%" },
    messageText: { fontSize: 16, color: "#333" },
    inputBar: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#FFF", borderRadius: 30, elevation: 2 },
    input: { flex: 1, padding: 10, borderRadius: 20, fontSize: 16 },
});

export default VillageChating;
