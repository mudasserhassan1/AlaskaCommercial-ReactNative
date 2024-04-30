import moment from 'moment';
import {COLORS, FONTS} from '../../theme';

const currentYear = moment().year();

export const DISABLED_CONFIG = {
  selected: false,
  marked: false,
  disabled: true,
  inactive: true,
};

export const DISABLED_DATES = [
  `${currentYear + 1}-01-01`,
  `${currentYear}-07-02`,
  `${currentYear}-07-04`,
  `${currentYear}-12-24`,
  `${currentYear}-12-25`,
  `${currentYear}-04-30`,
  `${currentYear}-04-29`,
  `${currentYear}-04-25`,
];

export const THEME = {
  calendarBackground: COLORS.WHITE,
  textSectionTitleColor: COLORS.BLACK,
  textSectionTitleDisabledColor: 'grey',
  dayTextColor: COLORS.MAIN,
  disabledArrowColor: COLORS.GREY_III,
  todayTextColor: COLORS.GREY_IV,
  textDisabledColor: COLORS.GREY_IV,
  selectedDayTextColor: COLORS.WHITE,
  monthTextColor: COLORS.BLACK,
  selectedDayBackgroundColor: COLORS.MAIN,
  arrowColor: COLORS.MAIN,
  textDayStyle: {
    fontFamily: FONTS.SEMI_BOLD,
  },
};
