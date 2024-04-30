import moment from 'moment';
import {DATE_TIME_FORMATS} from '../constants/Common';

export const formatTimeForRefund = (is24Hour, dateTime) => {
  if (is24Hour) {
    return moment(dateTime).format(DATE_TIME_FORMATS.twentyFourHour.refund);
  }
  return moment(dateTime).format(DATE_TIME_FORMATS.twelveHour.refund);
};

export const formatDateForRefundCard = (is24Hour, dateTime) => {
  if (is24Hour) {
    return moment(dateTime).format(
      DATE_TIME_FORMATS.twentyFourHour.refundOrderCard,
    );
  }
  return moment(dateTime).format(DATE_TIME_FORMATS.twelveHour.refundOrderCard);
};

export const formatDateForOrderHistory = date => {
  return moment(date).format(DATE_TIME_FORMATS.orderHistory);
};

export const formatOrderDateAndTime = (is24Hour, date) => {
  if (is24Hour) {
    return moment(date).format(DATE_TIME_FORMATS.twentyFourHour.orderTime);
  }
  return moment(date).format(DATE_TIME_FORMATS.twelveHour.orderTime);
};

export const formatTime = (
  date,
  format = DATE_TIME_FORMATS.YYYYMMDD,
  is24Hour = false,
) => {
  return moment(date).format(format);
};
export const timeDiff = (date1, date2, unit = 'days') => {
  return moment(date1).diff(date2, unit);
};
