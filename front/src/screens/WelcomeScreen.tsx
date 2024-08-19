import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import Avatar from '../components/Avatar';
import {useUser} from '../contexts/UserContext';
import LanguageModal from '../components/LanguageModal';
import {createUser} from '../lib/user';

const WelcomeScreen = ({route, navigation}: any) => {
  const {uid} = route.params;
  const [response, setResponse] = useState<ImagePickerResponse | null>(null);
  const [form, setForm] = useState({
    id: uid,
    username: '',
    language: '',
    photoURL: null as string | null,
  });
  const [language, setLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const {setUser} = useUser();

  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (response?.assets) {
        const asset = response.assets[0];
        const extension = asset.fileName?.split('.').pop();
        if (extension) {
          const storageRef = storage().ref(`/profile/${uid}.${extension}`);
          const imgBlob = await (await fetch(asset.uri as string)).blob();

          await storageRef.put(imgBlob);
          const photoURL = await storageRef.getDownloadURL();

          setForm(prevForm => ({
            ...prevForm,
            photoURL,
          }));
        }
      }

      createUser(form);
      setUser(form);
    } catch (error) {
      console.error('Failed to submit profile: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUsername = (username: string) => {
    setForm(prevForm => ({
      ...prevForm,
      username,
    }));
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

  const handleSelectLanguage = (language: {label: string; code: string}) => {
    setForm(prevForm => ({
      ...prevForm,
      language: language.code,
    }));
    setLanguage(language.label);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.avatar} onPress={handleSelectAvatar}>
        <Avatar source={response?.assets?.[0]?.uri || null} size={128} />
      </TouchableOpacity>
      <View>
        <TextInput
          ref={inputRef}
          placeholder="Username"
          value={form.username}
          onChangeText={handleChangeUsername}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => {
            inputRef.current?.blur();
            setVisible(true);
          }}
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.input, {justifyContent: 'center'}]}
          onPress={() => setVisible(true)}>
          <Text style={{color: language ? '#fff' : '#aaa'}}>
            {language || 'Select a Language'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
      <LanguageModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelectLanguage}
      />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    marginBottom: 32,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
