import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Qualtrics from 'react-native-qualtrics';
import { displayToConsole, logToConsole } from "../../configs/ReactotronConfig";
import {useSelector} from 'react-redux';
import {useIsFocused, useRoute} from '@react-navigation/native';
import useIsGuest from '../../hooks/useIsGuest';

export const INTERCEPT_ID = 'SI_884jdLI12iIidsG';
export const BRAND_ID = 'northwestcompany';
export const PROJECT_ID = 'ZN_1BUTdAdrNbaHMrA';

export const initialize = () => {
  Qualtrics.initialize(
    BRAND_ID,
    PROJECT_ID,
    INTERCEPT_ID,
    initializationResult => {
      Qualtrics.evaluateTargetingLogic(async targetingResult => {
        displayToConsole({targetingResult, initializationResult});
        if (targetingResult.passed) {
          const displayed = await Qualtrics.display();
          displayToConsole({displayed});
          Qualtrics.displayTarget();
        }
      });
    },
  );
};

export const initializeProject = () => {
  Qualtrics.initializeProject(BRAND_ID, PROJECT_ID, initializationResult => {
    const intercept = Object.keys(initializationResult)?.[0];
    displayToConsole({
      initializationResult,
      intercept: Object.keys(initializationResult)?.[0],
    });
    if (intercept && initializationResult[intercept]?.passed) {
      displayToConsole('initializationResult passed');
    }
  });
};

export const registerViewVisit = viewName => {
  if (global.isQualtricsInitialized) {
    displayToConsole({registerViewVisit: true, viewName});
    Qualtrics.registerViewVisit(viewName);
  }
};

export const setString = (key, value) => {
  if (global.isQualtricsInitialized) {
    displayToConsole({setString: true, key, value});
    Qualtrics.setString(key, value);
  }
};

export const setDateTime = date => {
  if (global.isQualtricsInitialized) {
    displayToConsole({setDateTime: true, date});
    Qualtrics.setDateTime(date);
  }
};

export const setNumber = count => {
  if (global.isQualtricsInitialized) {
    displayToConsole({setNumber: true, count});
    Qualtrics.setNumber('age', count);
  }
};

export const resetTimer = () => {
  if (global.isQualtricsInitialized) {
    displayToConsole({resetTimer: true});
    Qualtrics.resetTimer();
  }
};

export const resetViewCounter = () => {
  if (global.isQualtricsInitialized) {
    displayToConsole({resetViewCounter: true});
    Qualtrics.resetViewCounter();
  }
};

export const initializeProjectWithExtRefId = (_id = '', callback) => {
  Qualtrics.initializeProjectWithExtRefId(
    BRAND_ID,
    PROJECT_ID,
    _id,
    async initializationResults => {
      displayToConsole({
        initializeProjectWithExtRefId: true,
        initializationResults,
      });
      global.isQualtricsInitialized = true;
      if (typeof callback === 'function') {
        callback(true);
      }
      resetTimer();
      resetViewCounter();
      setDateTime(new Date().toISOString());
      // evaluateProject();
    },
  );
};

export const evaluateProject = () => {
  if (global.isQualtricsInitialized) {
    Qualtrics.evaluateProject(targetingResults => {
      displayToConsole({evaluateProject: true, targetingResults});
      for (let intercept in targetingResults) {
        let result = targetingResults[intercept];
        if (result.passed) {
          Qualtrics.display();
        }
      }
    });
  }
};

export const evaluateIntercept = async intercept => {
  displayToConsole('Running - evaluateIntercept ' + intercept);
  try {
    Qualtrics.evaluateIntercept(intercept, async evaluatedIntercept => {
      displayToConsole({evaluatedIntercept});
      if (evaluatedIntercept?.passed) {
        Qualtrics.displayTarget();
      }
    });
  } catch (e) {
    displayToConsole({'catch block': e});
  }
};

export const displayIntercept = async interceptId => {
  displayToConsole('displayIntercept with interceptId ' + interceptId);
  try {
    await Qualtrics.displayIntercept(interceptId);
  } catch (e) {
    displayToConsole({ERROR: e, message: e?.message});
  }
};

const QualtricsComponent = forwardRef(
  (
    {
      item,
      onItemPress,
      isLoading,
      withButtons,
      withInitialize = true,
      index,
      key,
    },
    ref,
  ) => {
    const [isInitialized, setIsInitialized] = useState(false);
    useImperativeHandle(ref, () => ({
      setString,
      setNumber,
      initialize,
      evaluateProject,
      displayIntercept,
      registerViewVisit,
      initializeProject,
      evaluateIntercept,
      initializeProjectWithExtRefId,
    }));

    const isGuest = useIsGuest();

    const idSelector = useMemo(
      () => state => state.general?.loginInfo?.userInfo._id ?? '',
      [],
    );
    const homeStoreNameSelector = useMemo(
      () => state => state.general?.zipCodeDetail?.homeStoreName ?? '',
      [],
    );

    const _id = useSelector(idSelector);

    const homeStoreName = useSelector(homeStoreNameSelector);

    const route = useRoute();
    const timerRef = useRef();
    const isFocused = useIsFocused() && !isLoading;
    const reachByReset = !!route?.params?.reset;

    useEffect(() => {
      if (_id && !isGuest && !reachByReset) {
        setTimeout(() => {
          initializeProjectWithExtRefId(_id, setIsInitialized);
        }, 1000);
      }
    }, [_id, isGuest]);

    useEffect(() => {
      if (isFocused && !__DEV__) {
        timerRef.current = setTimeout(() => {
          evaluateProject();
        }, 2000);
      }

      return () => timerRef.current && clearTimeout(timerRef.current);
    }, [isFocused, isInitialized]);

    useEffect(() => {
      if (homeStoreName && !reachByReset) {
        setString('StoreName', homeStoreName);
      }
    }, [homeStoreName, isInitialized]);

    return <></>;
  },
);

export default React.memo(QualtricsComponent);
