import React from 'react';
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastProps,
} from 'react-native-toast-message';

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#1f6feb',
        backgroundColor: '#333',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        color: '#fff',
      }}
    />
  ),
  info: (props: ToastProps) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: '#56ab2f',
        backgroundColor: '#333',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        color: '#fff',
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#d9534f',
        backgroundColor: '#333',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        color: '#fff',
      }}
    />
  ),
};

export default toastConfig;
