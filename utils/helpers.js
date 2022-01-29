import moment from 'moment';
import 'moment/locale/es';
import BraceletIcon from '../components/dashboard/icons/Bracelet';
import EarringIcon from '../components/dashboard/icons/EarringIcon';
import GroupIcon from '../components/dashboard/icons/GroupIcon';
import RingIcon from '../components/dashboard/icons/RingIcon';
import TagIcon from '../components/dashboard/icons/TagIcon';
import NecklaceIcon from '../components/dashboard/NecklaceIcon';
import { DEFAULT_PAGE_SIZE, MIN_YEAR } from './constants';

export const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
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
    if (count === 0) {
        return 1;
    }
    return count % pageSize === 0 ? count / pageSize : ~~(count / pageSize) + 1;
};

export const getTypeIcon = (id) => {
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

export const findTotalSum = (array) => {
    return [...array].reduce((sum, a) => sum + a, 0);
};

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getDebt = (gramPrice, totalSales) => {
    return (totalSales / 60) * gramPrice;
};
