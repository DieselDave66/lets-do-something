import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as SMS from 'expo-sms';

const FRIENDS = [
  { name: 'Will', phone: '+19804060374' },
  { name: 'Darren', phone: '+17049991108' },
  { name: 'Brendan', phone: '+14847534772' },
  { name: 'Alec', phone: '+18049382532' },
  { name: 'J', phone: '' },
  { name: 'Luke', phone: '+17047376773' },
  { name: 'Harrison', phone: '+17046498781' },
  { name: 'East', phone: '+18044322434' },
];

const RILE_UP_MESSAGES = [
  "Ashame none of you booze anymore",
  "I'm the reason you got a bid",
  "Crazy I know more ball than the 3 of you combined lol",
];

export default function App() {
  const [selected, setSelected] = useState(new Set());
  const [rileIndex, setRileIndex] = useState(0);

  const toggle = (name) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const sendRileUp = async () => {
    if (selected.size === 0) {
      Alert.alert('Select someone first');
      return;
    }
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('SMS is not available on this device');
      return;
    }
    const addresses = FRIENDS.filter((f) => selected.has(f.name)).map((f) => f.phone);
    await SMS.sendSMSAsync(addresses, RILE_UP_MESSAGES[rileIndex]);
    setRileIndex((prev) => (prev + 1) % RILE_UP_MESSAGES.length);
  };

  const send = async (message, emptyAlert) => {
    if (selected.size === 0) {
      Alert.alert(emptyAlert);
      return;
    }

    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('SMS is not available on this device');
      return;
    }

    const addresses = FRIENDS.filter((f) => selected.has(f.name)).map(
      (f) => f.phone
    );

    await SMS.sendSMSAsync(addresses, message);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Let's Do Something</Text>

        <View style={styles.friendList}>
          {FRIENDS.map((friend) => {
            const isOn = selected.has(friend.name);
            return (
              <TouchableOpacity
                key={friend.name}
                style={[styles.friendBtn, isOn && styles.friendBtnOn]}
                onPress={() => toggle(friend.name)}
                activeOpacity={0.75}
              >
                <Text style={[styles.friendName, isOn && styles.friendNameOn]}>
                  {friend.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.rogBtn, selected.size === 0 && styles.rogBtnDisabled]}
            onPress={() => send("Let's play video games", 'Select someone first')}
            activeOpacity={0.8}
          >
            <Text style={styles.rogBtnText}>Video Games</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boozeBtn, selected.size === 0 && styles.rogBtnDisabled]}
            onPress={() => send("Let's Booze", 'Select someone first')}
            activeOpacity={0.8}
          >
            <Text style={styles.rogBtnText}>Booze</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnRowFull}>
          <TouchableOpacity
            style={[styles.rileBtn, selected.size === 0 && styles.rogBtnDisabled]}
            onPress={sendRileUp}
            activeOpacity={0.8}
          >
            <Text style={styles.rogBtnText}>Rile Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  friendList: {
    width: '100%',
    gap: 14,
  },
  friendBtn: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  friendBtnOn: {
    borderColor: '#f5c518',
    backgroundColor: '#2a2200',
  },
  friendName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#888',
  },
  friendNameOn: {
    color: '#f5c518',
  },
  btnRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  rogBtn: {
    flex: 1,
    paddingVertical: 28,
    borderRadius: 20,
    backgroundColor: '#f5c518',
    alignItems: 'center',
  },
  boozeBtn: {
    flex: 1,
    paddingVertical: 28,
    borderRadius: 20,
    backgroundColor: '#4fc3f7',
    alignItems: 'center',
  },
  rogBtnDisabled: {
    backgroundColor: '#333',
  },
  btnRowFull: {
    width: '100%',
  },
  rileBtn: {
    width: '100%',
    paddingVertical: 28,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
  },
  rogBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 1,
  },
});
