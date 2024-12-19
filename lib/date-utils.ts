import { format, Locale } from 'date-fns';
import { el } from 'date-fns/locale';

export const formatDateToGreek = (date: Date, formatStr: string) => {
  return format(date, formatStr, {
    locale: el
  });
}; 