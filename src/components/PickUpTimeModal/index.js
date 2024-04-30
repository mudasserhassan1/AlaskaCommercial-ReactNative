import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {List} from '../List';
import {styles} from './styles';
import moment from 'moment';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  DATE_TIME_FORMATS,
  pickupTimes,
  pickupTimes24H,
  SUNDAY_EXCLUSIONS_REQUIREMENTS,
} from '../../constants/Common';
import {useSelector} from 'react-redux';
// import {isSaturday, isSunday} from 'date-fns';
import BottomSheetModal from '../BottomSheetModal';
import {Calendar} from 'react-native-calendars';
import {formatTime, timeDiff} from '../../utils/timeUtils';
import {DISABLED_CONFIG, DISABLED_DATES, THEME} from './constants';
import {logToConsole} from '../../configs/ReactotronConfig';

const MODAL_TITLE = {
  [APP_CONSTANTS.CURBSIDE_PICKUP]: APP_CONSTANTS.REQUESTED_PICKUP_DATE,
  [APP_CONSTANTS.HOME_DELIVERY]: APP_CONSTANTS.REQUESTED_DELIVERY_DATE,
  [APP_CONSTANTS.BUSH_DELIVERY]: APP_CONSTANTS.REQUESTED_DELIVERY_TO_AIRLINE,
};

const PickupTimeModal = ({
  visible,
  onRequestClose,
  defaultTimeIndex = null,
  defaultDateIndex = null,
  onDateSelect,
  onTimeSelect,
  deliveryMethod,
}) => {
  // const {cartItems} = useSelector(({general: {cartItems = []} = {}}) => ({
  //   cartItems,
  // }));
  const useCartItemsSelector = () =>
    useMemo(() => state => state.general.cartItems ?? [], []);
  const cartItems = useSelector(useCartItemsSelector());
  const [date, setDate] = useState([]);
  const [disabledDates, setDisabledDates] = useState({});
  const [selectedList, setSelectedList] = useState(defaultTimeIndex);
  const [userSelectedDate, setUserSelectedDate] = useState(defaultDateIndex);
  const [btnDisable, setBtnDisable] = useState(true);
  const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(false);
  const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(false);
  const [isCakeOrPartyItemAdded, setIsCakeOrPartyItemAdded] = useState(false);

  const startDate = formatTime(date?.[0]) || null;
  const endDate = formatTime(date?.[date?.length - 1]) || null;

  const storeHoursSundaySelector = useMemo(
    () => state => state.general?.storeDetail.storeHoursSunday || '',
    [],
  );

  const storeHoursSaturdaySelector = useMemo(
    () => state => state.general?.storeDetail.storeHoursSaturday || '',
    [],
  );
  const disabledDatesSelector = useMemo(
    () => state => state.general?.disabledDates || [],
    [],
  );

  const storeHoursSunday = useSelector(storeHoursSundaySelector);

  const storeHoursSaturday = useSelector(storeHoursSaturdaySelector);
  const disabledDates_ = useSelector(disabledDatesSelector);

  const is24HourSelector = useMemo(
    () => state => state.general?.is24Hour || false,
    [],
  );

  const is24Hour = useSelector(is24HourSelector);

  const initializeStates = () => {
    setUserSelectedDate(defaultDateIndex);
    setSelectedList(defaultTimeIndex);
  };

  useEffect(() => {
    if (visible) {
      if (cartItems.length > 0) {
        cartItems.map(item => {
          const {itemObj = {}, ...rest} = item ?? {};
          const {item: innerItem = []} = itemObj ?? {};
          let {
            FORM_REQUIRED: formRequired = '',
            PARTY_TRAY_FLAG: partyFlag = '',
          } = innerItem?.[0] ?? {};
          if (!!formRequired || partyFlag === 'Y' || partyFlag === 'y') {
            return setIsCakeOrPartyItemAdded(true);
          }
        });
      } else {
        setIsCakeOrPartyItemAdded(false);
      }
    }
  }, [cartItems, visible]);

  const isSunday = date => {
    const day = moment(date).format('dddd');
    return day.toLowerCase() === 'sunday';
  };
  const isSaturday = date => {
    const day = moment(date).format('dddd');
    return day.toLowerCase() === 'saturday';
  };

  useEffect(() => {
    const days = [];
    let daysRequired = 7;
    let partyCakeExtendedDate = 0;
    const disabled = {};
    const isSundayExcluded = SUNDAY_EXCLUSIONS_REQUIREMENTS.includes(
      storeHoursSunday.split('-')[0],
    );
    const isSaturdayExcluded = SUNDAY_EXCLUSIONS_REQUIREMENTS.includes(
      storeHoursSaturday.split('-')[0],
    );
    for (let i = 1; i <= daysRequired; i++) {
      let dt = moment().add(i, 'days');
      let isWeekend = isSunday(dt) || isSaturday(dt);
      const dtFormatted = dt.format('YYYY-MM-DD');
      logToConsole({dt});

      // Check for disabled dates or excluded weekends
      const isDisabled = disabledDates_.some(date =>
        date.startsWith(dtFormatted),
      );
      if (
        isDisabled ||
        (isSundayExcluded && isSunday(dt)) ||
        (isSaturdayExcluded && isSaturday(dt))
      ) {
        daysRequired++; // Increment daysRequired for skipped days
        disabled[formatTime(dt)] = DISABLED_CONFIG;
        continue;
      }

      if (isCakeOrPartyItemAdded && partyCakeExtendedDate < 3 && !isWeekend) {
        partyCakeExtendedDate++;
        daysRequired++; // Increment daysRequired for extended days
        disabled[formatTime(dt)] = DISABLED_CONFIG;
        continue;
      }

      days.push(dt);
    }

    setDate(days);
    setDisabledDates(disabled);
  }, [
    storeHoursSaturday,
    storeHoursSunday,
    isCakeOrPartyItemAdded,
    disabledDates_,
  ]);

  useEffect(() => {
    verifyDataFields();
  }, [selectedList, userSelectedDate, visible]);

  const verifyDataFields = () => {
    if (deliveryMethod === APP_CONSTANTS.CURBSIDE_PICKUP) {
      if (userSelectedDate === null || selectedList === null) {
        return setBtnDisable(true);
      }
      if (isOldData() && defaultTimeIndex === selectedList) {
        return setBtnDisable(true);
      }
      return setBtnDisable(false);
    } else {
      if (userSelectedDate === null) {
        return setBtnDisable(true);
      }
      if (isOldData()) {
        return setBtnDisable(true);
      }
      return setBtnDisable(false);
    }
  };

  const isOldData = () => {
    return defaultDateIndex === userSelectedDate;
  };

  const selectedDate = index => {
    setUserSelectedDate(index);
  };

  const selectList = index => {
    setSelectedList(index);
  };

  const save = () => {
    onDateSelect(date[userSelectedDate], userSelectedDate);
    onTimeSelect(pickupTimes[selectedList], selectedList);
    onRequestClose();
  };

  const onDayPress = ({dateString} = {}) => {
    const xyz = date.findIndex(dt => formatTime(dt) === formatTime(dateString));
    selectedDate(
      date.findIndex(dt => formatTime(dt) === formatTime(dateString)),
    );
  };

  const onMonthChange = ({dateString = ''} = {}) => {
    const endOfPlacementMonth = moment(endDate)
      .endOf('month')
      .format(DATE_TIME_FORMATS.YYYYMMDD);
    const endOfCalenderMonth = moment(dateString)
      .endOf('month')
      .format(DATE_TIME_FORMATS.YYYYMMDD);
    setIsLeftArrowDisabled(timeDiff(startDate, dateString) >= 0);
    setIsRightArrowDisabled(!timeDiff(endOfPlacementMonth, endOfCalenderMonth));
    // logToConsole({bool: timeDiff(startDate, dateString) >= 0});
    // logToConsole({bool_: !timeDiff(endOfPlacementMonth, endOfCalenderMonth)});
  };

  const ItemSeparatorView = () => <View style={styles.listItemSeparator} />;

  const renderList = ({item, index}) => {
    const {listName = '', time = ''} = item || {};
    return (
      <TouchableOpacity
        style={styles.listRow}
        onPress={() => selectList(index)}>
        <View style={styles.radioButtonView}>
          <View style={styles.radioUnchecked}>
            {index === selectedList && <View style={styles.checkedCircle} />}
          </View>
          <View style={styles.descriptionView}>
            <Text allowFontScaling={false} style={styles.itemName}>
              {listName}
            </Text>
            <Text allowFontScaling={false} style={styles.descriptionText}>
              {time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubHeader = (style, title) => (
    <View style={style}>
      <Text allowFontScaling={false} style={styles.timeHeader}>
        {title}
      </Text>
      <View style={styles.divider} />
    </View>
  );

  const renderHeader = useCallback(dt => {
    return (
      <Text allowFontScaling={false} style={styles.header}>{`${formatTime(
        dt?.toString(),
        DATE_TIME_FORMATS.MMMM,
      )}`}</Text>
    );
  }, []);

  return (
    <BottomSheetModal
      visible={visible}
      title={MODAL_TITLE[deliveryMethod]}
      statusBarTranslucent
      avoidKeyboard={true}
      onModalWillShow={initializeStates}
      onCrossPress={onRequestClose}
      buttonTitle={APP_CONSTANTS.CONTINUE}
      isButtonDisabled={btnDisable}
      onBottomPress={save}>
      <View>
        <Calendar
          disableAllTouchEventsForDisabledDays
          disableAllTouchEventsForInactiveDays
          hideExtraDays
          disableArrowLeft={isLeftArrowDisabled}
          disableArrowRight={isRightArrowDisabled}
          onMonthChange={onMonthChange}
          initialDate={startDate}
          minDate={startDate}
          maxDate={endDate}
          renderHeader={renderHeader}
          enableSwipeMonths={false}
          theme={THEME}
          onDayPress={onDayPress}
          markedDates={{
            ...disabledDates,
            // ['2023-11-27']:{disabled: true},
            [userSelectedDate === null
              ? ''
              : formatTime(date?.[userSelectedDate])]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
        />
        {deliveryMethod === APP_CONSTANTS.CURBSIDE_PICKUP ? (
          <>
            {renderSubHeader(styles.timeWrapper, APP_CONSTANTS.TIME)}
            <List
              data={is24Hour ? pickupTimes24H : pickupTimes}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={renderList}
            />
          </>
        ) : null}
        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
        </View>
      </View>
    </BottomSheetModal>
  );
};

export default PickupTimeModal;
