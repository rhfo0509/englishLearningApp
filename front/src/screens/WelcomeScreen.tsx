import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Avatar from '../components/Avatar';
import {useUser} from '../contexts/UserContext';
import {createUser} from '../lib/user';
import {signOut} from '../lib/auth';
import {LANGUAGES} from '../common/constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const WelcomeScreen = ({route, navigation}: any) => {
  const {uid} = route.params;
  const [response, setResponse] = useState<ImagePickerResponse | null>(null);
  const [username, setUsername] = useState<string>('');
  const [language, setLanguage] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const {setUser} = useUser();

  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!username || !language) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields.',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      setLoading(true);

      const settings = {
        voiceSpeed: 10,
        language,
      };
      await AsyncStorage.setItem('settings', JSON.stringify(settings));

      let photoURL = '';
      if (response?.assets) {
        const asset = response.assets[0];
        const extension = asset.fileName?.split('.').pop();
        if (extension) {
          const storageRef = storage().ref(`/profile/${uid}.${extension}`);
          const imgBlob = await (await fetch(asset.uri as string)).blob();

          await storageRef.put(imgBlob);
          photoURL = await storageRef.getDownloadURL();
        }
      }

      const user = {id: uid, username, photoURL};

      createUser(user);
      setUser(user);
    } catch (error) {
      console.error('Failed to submit profile: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // signOut();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    navigation.goBack();
  };

  const handleSelectAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      includeBase64: false,
    });

    if (!result.didCancel && result.assets) {
      setResponse(result);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.avatar} onPress={handleSelectAvatar}>
        <Avatar source={response?.assets?.[0]?.uri || ''} size={128} />
      </TouchableOpacity>
      <View>
        <TextInput
          ref={inputRef}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          returnKeyType="next"
          style={styles.input}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={setLanguage}
            dropdownIconColor="#aaa">
            <Picker.Item label="Select a language" value="" />
            {LANGUAGES.map(language => (
              <Picker.Item
                key={language.code}
                label={language.label}
                value={language.code}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={[styles.buttonText, {color: '#fff'}]}>Next</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#eeeff3'}]}
          onPress={handleCancel}
          disabled={loading}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: '#b0b0b0',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    color: '#333',
    fontSize: 16,
  },
  pickerContainer: {
    height: 48,
    borderColor: '#b0b0b0',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
  },
  picker: {
    color: '#aaa',
    fontSize: 16,
    height: 48,
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
