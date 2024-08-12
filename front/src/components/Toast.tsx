import React from 'react';
import {BaseToast, ToastProps} from 'react-native-toast-message';

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
  // You can add other custom types like 'error', 'info', etc.
};

export default toastConfig;
