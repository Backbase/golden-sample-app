import { DateFormat } from './interfaces/date-formats';

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const enUSDate = (date: Date, options?: Intl.DateTimeFormatOptions): string =>
  date.toLocaleDateString('en-US', options);

export const timeID = () =>
  new Date().toISOString().split('.')[0].replace(/T/g, '-').replace(/:/g, '-');

export const formatDate = (date: Date, format: DateFormat) => {
  switch (format) {
    case 'MM/DD/YYYY':
      return enUSDate(date);
    case 'MM/DD/YY':
      return enUSDate(date, {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
    case 'M/D/YY':
      return enUSDate(date, {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
    case 'Mon D, YYYY':
      return enUSDate(date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    case 'Mon D YYYY':
      return enUSDate(date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).replace(/,/g, '');
    case 'Mon DD, YYYY':
      return enUSDate(date, {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    case 'Mon DD YYYY':
      return enUSDate(date, {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).replace(/,/g, '');
    case 'YYYY-MM-DD':
      return date.toISOString().slice(0, 10);
    case 'ISO8601':
    case 'YYYY-MM-DDTHH:MM:SS.FFFZ':
      return date.toISOString();
    case 'Month D, YYYY':
      return enUSDate(date, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    default:
      return enUSDate(date);
  }
};

const getDateWithOffset = (offsetDays: number): string =>
  enUSDate(new Date(Date.now() + offsetDays * MILLISECONDS_IN_DAY));

export const yesterday = () => getDateWithOffset(-1);
export const today = () => getDateWithOffset(0);
export const tomorrow = () => getDateWithOffset(1);
export const afterTomorrow = () => getDateWithOffset(2);
export const nextWeek = () => getDateWithOffset(7);
export const nextMonth = () => getDateWithOffset(31);

const isDateWithOffset = (
  date: Date | undefined,
  offsetDays: number
): boolean => {
  if (!date) return false;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + offsetDays);
  return (
    date.getDate() === targetDate.getDate() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  );
};

export const isYesterday = (date?: Date): boolean => isDateWithOffset(date, -1);
export const isToday = (date?: Date): boolean => isDateWithOffset(date, 0);
export const isTomorrow = (date?: Date): boolean => isDateWithOffset(date, 1);
export const isAfterTomorrow = (date?: Date): boolean => isDateWithOffset(date, 2);
export const isNextWeek = (date?: Date): boolean => isDateWithOffset(date, 7);
export const isNextMonth = (date?: Date): boolean => isDateWithOffset(date, 31);
