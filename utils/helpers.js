import moment from 'moment';
import 'moment/locale/es';
import { DEFAULT_PAGE_SIZE, MIN_YEAR } from './constants';

export const formatDate = (date) => {
    return moment(date).format('dddd DD MMMM YYYY');
};

export const getYearsRange = (currentYear, minYear) => {
    const years = [];
    let startYear = minYear || MIN_YEAR;
    while (startYear <= currentYear) {
        years.push(startYear++);
    }
    return years;
};

export const getPagination = ({ page, size = DEFAULT_PAGE_SIZE }) => {
    const limit = size ? +size : DEFAULT_PAGE_SIZE;
    const from = page ? (page - 1) * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
};

export const getPageCount = (count, pageSize = DEFAULT_PAGE_SIZE) => {
    return count % pageSize === 0 ? count / pageSize : ~~(count / pageSize) + 1;
};
