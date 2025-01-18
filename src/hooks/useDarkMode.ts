import { useColorScheme } from 'react-native';

const useDarkMode = () => {
  return useColorScheme() === 'dark';
};

export default useDarkMode;
