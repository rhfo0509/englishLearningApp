import {useState, useEffect} from 'react';

const usePasswordValidation = ({
  password = '',
  confirmPassword = '',
}: {
  password: string;
  confirmPassword: string;
}) => {
  const [isMatch, setIsMatch] = useState<boolean>(true);

  useEffect(() => {
    setIsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  return isMatch;
};

export default usePasswordValidation;
