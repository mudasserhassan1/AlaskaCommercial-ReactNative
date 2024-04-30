import {shallowEqual, useSelector} from 'react-redux';
import {useMemo} from 'react';


const useIsGuest = () => {
  const isGuestSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.isGuest ?? false,
    [],
  );

  const isGuest = useSelector(isGuestSelector, shallowEqual);
  return !!isGuest;
};

export default useIsGuest;
