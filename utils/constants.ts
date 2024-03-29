export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
export const MIN_YEAR = 2022;
export const DEFAULT_PAGE_SIZE = 10;

export const AVAILABLE = 0;
export const SOLD = 1;
export const CONSIGNMENT = 2;
export const ALL = 3;
export const PRODUCT_STATUS = ['Disponible', 'Vendido', 'Consignación', 'Todos'];

export const METHOD_NOT_ALLOWED_ERROR = { error: 'Method not allawed' };
export const NOT_FOUND_ERROR = { error: 'Not Found' };

export const PAGE_OFFSET = 10;

export const HTTP_CODES = {
  METHOD_NOT_ALLOWED: 405,
  NOT_FOUND: 404,
  CREATED: 201,
  OK: 200,
  SERVER_ERROR: 500,
  UPDATED: 204,
};

export const ERROR_MESSAGE = 'Ocurrió un error, intenta de nuevo';

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    scales: {
      y: {
        min: -10,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        borderWidth: 0,
      },
      ticks: {
        color: 'rgb(212 212 216)',
      },
    },
    y: {
      grid: {
        display: false,
        borderColor: 'transparent',
      },
      ticks: {
        color: 'rgb(212 212 216)',
        backdropPadding: 1,
      },
    },
  },
};

export const BAR_STYLE = {
  backgroundColor: 'rgba(248, 113, 113, 0.7)',
  borderRadius: 15,
  barThickness: 30,
  minBarLength: 10,
};
