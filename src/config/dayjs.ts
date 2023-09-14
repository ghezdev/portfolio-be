import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Buenos_Aires');
dayjs.locale('es');

export default dayjs;
