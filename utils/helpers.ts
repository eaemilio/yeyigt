import dayjs from 'dayjs';
import moment from 'moment';
import 'moment/locale/es';
import BraceletIcon from '../components/dashboard/icons/Bracelet';
import EarringIcon from '../components/dashboard/icons/EarringIcon';
import GroupIcon from '../components/dashboard/icons/GroupIcon';
import RingIcon from '../components/dashboard/icons/RingIcon';
import TagIcon from '../components/dashboard/icons/TagIcon';
import NecklaceIcon from '../components/dashboard/NecklaceIcon';
import { DEFAULT_PAGE_SIZE, MIN_YEAR } from './constants';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: string) => moment(date).format('DD/MM/YYYY');

export const getYearsRange = (currentYear: number, minYear?: number) => {
  const years = [];
  let startYear = minYear || MIN_YEAR;
  while (startYear <= currentYear) {
    years.push(startYear++);
  }
  return years;
};

export const getPagination = ({
  page,
  size = DEFAULT_PAGE_SIZE,
}: {
  page: number;
  size: number;
}) => {
  const limit = size ? +size : DEFAULT_PAGE_SIZE;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

export const getPageCount = (count: number, pageSize = DEFAULT_PAGE_SIZE) => {
  if (count === 0) {
    return 1;
  }
  return count % pageSize === 0 ? count / pageSize : ~~(count / pageSize) + 1;
};

export const getTypeIcon = (id: number) => {
  switch (id) {
    case 2:
      return BraceletIcon;
    case 3:
      return EarringIcon;
    case 4:
      return TagIcon;
    case 5:
      return GroupIcon;
    case 6:
      return RingIcon;
    case 7:
      return NecklaceIcon;
    default:
      return BraceletIcon;
  }
};

export const findTotalSum = (array: number[]) => [...array].reduce((sum, a) => sum + a, 0);

export const numberWithCommas = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getDebt = (gramPrice: number, totalSales: number, pandora: boolean) =>
  (totalSales / (pandora ? 65 : 60)) * gramPrice;

export const getDateLimits = (date?: string) => {
  if (!date) {
    return { gte: undefined, lte: undefined };
  }

  const d = dayjs.tz(`${date} 23:59`, 'America/Guatemala');

  const gte = dayjs.tz(`${d.month() + 1}-01-${d.year()} 23:59`, 'America/Guatemala').toISOString();
  const lte = d.toISOString();
  return { gte, lte };
};
