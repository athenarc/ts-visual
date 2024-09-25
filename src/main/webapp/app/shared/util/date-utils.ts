import moment from 'moment';

import { APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATETIME_FORMAT_Z } from 'app/config/constants';

export const convertDateTimeFromServer = date => (date ? moment(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? moment(date, APP_LOCAL_DATETIME_FORMAT_Z).toDate() : null);

export const displayDefaultDateTime = () => moment().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);

export const handleDate = date => new Date(date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000));
