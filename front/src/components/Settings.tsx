import React, {useState, useEffect} from 'react';
import {Modal, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LANGUAGES} from '../common/constants';

const Settings = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem('settings');
        if (settings) {
          setVoiceSpeed(JSON.parse(settings).voiceSpeed);
          setLanguage(JSON.parse(settings).language);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const handleSave = async () => {
    const settings = {
      voiceSpeed,
      language,
    };
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
      setVisible(false);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.settings}
        onPress={() => setVisible(true)}>
        <IIcon name="settings-outline" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.item}>
              <Text style={styles.label}>Voice Speed</Text>
              <Slider
                style={styles.slider}
                minimumValue={8}
                maximumValue={12}
                step={1}
                value={voiceSpeed}
                onValueChange={value => setVoiceSpeed(value)}
              />
              <Text>{voiceSpeed / 10}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Language</Text>
              <Picker
                selectedValue={language}
                onValueChange={language => setLanguage(language)}
                dropdownIconColor="#333"
                style={styles.picker}>
                {LANGUAGES.map(language => (
                  <Picker.Item
                    key={language.code}
                    label={language.label}
                    value={language.code}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(false)}>
                <Text style={[styles.buttonText, {color: '#d9534f'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settings: {
    marginTop: 4,
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  item: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
  },
  picker: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#1f6feb',
  },
});
