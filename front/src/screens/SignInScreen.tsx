import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {signIn, signUp} from '../lib/auth';
import {useUser} from '../contexts/UserContext';

const SignInScreen = ({navigation, route}: any) => {
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const isSignUp = route.params?.isSignUp || false;
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const {setUser} = useUser();

  const handleChangeText = (name: string) => (value: string) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const {email, password, confirmPassword} = form;

    if (!email || !password || (isSignUp && !confirmPassword)) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields.',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }

    setLoading(true);

    try {
      const {user} = isSignUp
        ? await signUp({email, password})
        : await signIn({email, password});
      const profile = await AsyncStorage.getItem('user');

      if (!profile) {
        navigation.navigate('Welcome', {uid: user.uid});
      } else {
        setUser(JSON.parse(profile));
      }
    } catch (error: any) {
      console.log(error.code);
      const messages: {[key: string]: string} = {
        'auth/email-already-in-use': 'Email already in use.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/user-not-found': 'User not found.',
        'auth/invalid-email': 'Invalid email address.',
      };
      Toast.show({
        type: 'error',
        text1:
          messages[error.code] || `${isSignUp ? 'Sign Up' : 'Sign In'} failed.`,
        position: 'bottom',
        visibilityTime: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      Alert.alert('EXIT', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => {
            setForm({
              email: '',
              password: '',
              confirmPassword: '',
            });
            navigation.navigate('SignIn', {isSignUp: false});
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EnglishEcho</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={handleChangeText('email')}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={handleChangeText('password')}
          ref={passwordRef}
          returnKeyType={isSignUp ? 'next' : 'done'}
          onSubmitEditing={() => {
            isSignUp ? confirmPasswordRef.current?.focus() : handleSubmit();
          }}
          style={styles.input}
        />
        {isSignUp && (
          <TextInput
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChangeText={handleChangeText('confirmPassword')}
            secureTextEntry
            ref={confirmPasswordRef}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            style={styles.input}
          />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#333', marginTop: 16}]}
          onPress={() => {
            setForm({
              email: '',
              password: '',
              confirmPassword: '',
            });
            if (isSignUp) {
              navigation.navigate('SignIn', {isSignUp: false});
            } else {
              navigation.navigate('SignIn', {isSignUp: true});
            }
          }}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {isSignUp ? 'Go to Sign In' : 'Go to Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
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
