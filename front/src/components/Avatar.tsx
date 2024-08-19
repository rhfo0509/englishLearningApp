import React from 'react';
import {Image} from 'react-native';

const Avatar = ({
  source,
  size = 32,
}: {
  source?: {uri: string};
  size: number;
}) => {
  return (
    <Image
      source={source || require('../assets/user.png')}
      resizeMode="cover"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
};

export default Avatar;
