import {useAppState} from '@react-native-community/hooks';
import {memo, useEffect} from 'react';

const foregroundHandlers = {};
const backgroundHandlers = {};

export const addForegroundHandler = (key, handler) => {
  foregroundHandlers[key] = handler;
};

export const addBackgroundHandlers = (key, handler) => {
  backgroundHandlers[key] = handler;
};

export const removeForegroundHandler = key => {
  delete foregroundHandlers[key];
};

export const removeBackgroundHandler = key => {
  delete backgroundHandlers[key];
};

const getActiveStateHandlers = {
  active: foregroundHandlers,
  background: {},
  inactive: {},
};

const AppStateHandler = () => {
  const currentState = useAppState();

  useEffect(() => {
    const activeStateHandlers = getActiveStateHandlers[currentState] || {};
    for (let handler of Object.values(activeStateHandlers)) {
      if (typeof handler === 'function') {
        handler();
      }
    }
  }, [currentState]);

  return null;
};

export default memo(AppStateHandler);
