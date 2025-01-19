import { useDispatch } from 'react-redux';
import { persistor } from '../../redux/store';


export const useResetReduxState = () => {
  const dispatch = useDispatch();

  const resetReduxState = async () => {
    await persistor.purge(); // Clear persisted data
    dispatch({ type: 'RESET' }); // Dispatch RESET action
  };

  return resetReduxState;
};
