import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  // Keyboard,
  // TextInput,
  // View,
  // TouchableOpacity,
  // ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  GoogleSigninButton,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';

// import {signIn, signUp} from '../lib/auth';
import {getUser} from '../lib/user';
import {useUser} from '../contexts/UserContext';
// import usePasswordValidation from '../hooks/usePasswordValidation';

const SignInScreen = ({navigation, route}: any) => {
  // const passwordRef = useRef<TextInput>(null);
  // const confirmPasswordRef = useRef<TextInput>(null);

  // const isSignUp = route.params?.isSignUp || false;
  // const [form, setForm] = useState({
  //   email: '',
  //   password: '',
  //   confirmPassword: '',
  // });
  const [loading, setLoading] = useState(false);
  const {setUser} = useUser();

  // const isPasswordMatch = usePasswordValidation({
  //   password: form.password,
  //   confirmPassword: form.confirmPassword,
  // });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const {user} = await auth().signInWithCredential(googleCredential);
      const profile = await getUser(user.uid);

      if (!profile) {
        navigation.navigate('Welcome', {uid: user.uid});
      } else {
        setUser(profile);
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Google Sign In failed. Please try again later',
        position: 'bottom',
        visibilityTime: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleChangeText = (name: string) => (value: string) => {
  //   setForm({...form, [name]: value});
  // };

  // const handleSubmit = async () => {
  //   Keyboard.dismiss();
  //   const {email, password, confirmPassword} = form;

  //   if (!email || !password || (isSignUp && !confirmPassword)) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Please fill in all fields.',
  //       position: 'bottom',
  //       visibilityTime: 1500,
  //     });
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const {user} = isSignUp
  //       ? await signUp({email, password})
  //       : await signIn({email, password});
  //     const profile = await getUser(user.uid);

  //     if (!profile) {
  //       navigation.navigate('Welcome', {uid: user.uid});
  //     } else {
  //       setUser(profile);
  //     }
  //     setForm({
  //       email: '',
  //       password: '',
  //       confirmPassword: '',
  //     });
  //   } catch (error: any) {
  //     console.log(error.code);
  //     const messages: {[key: string]: string} = {
  //       'auth/email-already-in-use': 'Email already in use.',
  //       'auth/wrong-password': 'Incorrect password.',
  //       'auth/user-not-found': 'User not found.',
  //       'auth/invalid-email': 'Invalid email address.',
  //       'auth/weak-password': 'Password should be at least 6 characters',
  //       'auth/network-request-failed': 'Network error occurred.',
  //     };
  //     Toast.show({
  //       type: 'error',
  //       text1:
  //         messages[error.code] ||
  //         `${isSignUp ? 'Sign Up' : 'Sign In'} failed. Please try again later`,
  //       position: 'bottom',
  //       visibilityTime: 1500,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            // setForm({
            //   email: '',
            //   password: '',
            //   confirmPassword: '',
            // });
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
      <View style={styles.content}>
        <Image source={require('../assets/icon.png')} />
        <Text style={styles.title}>EnglishEcho</Text>
      </View>
      {/* <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
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
          placeholderTextColor="#aaa"
          secureTextEntry
          value={form.password}
          onChangeText={handleChangeText('password')}
          autoCapitalize="none"
          ref={passwordRef}
          returnKeyType={isSignUp ? 'next' : 'done'}
          onSubmitEditing={() => {
            isSignUp ? confirmPasswordRef.current?.focus() : handleSubmit();
          }}
          style={styles.input}
        />
        {isSignUp && (
          <>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              value={form.confirmPassword}
              secureTextEntry
              onChangeText={handleChangeText('confirmPassword')}
              autoCapitalize="none"
              ref={confirmPasswordRef}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={styles.input}
            />
            {form.password && form.confirmPassword && !isPasswordMatch && (
              <Text style={{color: '#d9534f'}}>Passwords do not match</Text> // 경고 메시지 추가
            )}
          </>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text style={styles.text}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
          )}
        </TouchableOpacity> */}

      {/* 구글 로그인 버튼 추가 */}
      <View style={styles.buttonContainer}>
        <GoogleSigninButton
          style={{width: '100%', height: 64}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={handleGoogleSignIn}
          disabled={loading}
        />
      </View>

      {/* <TouchableOpacity
          style={[styles.button, {backgroundColor: '#000'}]}
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
          <Text style={styles.text}>
            {isSignUp ? 'Go to Sign In' : 'Go to Sign Up'}
          </Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#333',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  // form: {
  //   width: '100%',
  // },
  // input: {
  //   height: 48,
  //   borderColor: '#ccc',
  //   borderWidth: 2,
  //   borderRadius: 8,
  //   paddingHorizontal: 16,
  //   marginTop: 16,
  //   color: '#fff',
  //   fontSize: 16,
  // },
  // button: {
  //   backgroundColor: '#1f6feb',
  //   paddingVertical: 12,
  //   marginTop: 16,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  // text: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: '500',
  // },
  // loading: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});
