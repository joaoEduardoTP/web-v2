/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, formatISO, isValid, parse, parseISO } from "date-fns";

function formatISODate(isoString: string) {
  const date = parseISO(isoString);
  if (isNaN(date.getTime())) return isoString; // Retorna como está se não for uma data válida

  return format(date, 'dd/MM/yy HH:mm:ss');
}

export function formatDates(dataArray: any[]) {
  return dataArray.map((item: any) => {
    const newItem = { ...item };

    for (const key in newItem) {
      if (typeof newItem[key] === 'string' && newItem[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        newItem[key] = formatISODate(newItem[key]);
      }
    }

    return newItem;
  });
}

function parseFormattedDate(formattedDateString: string) {
  const parsedDate = parse(formattedDateString, 'dd/MM/yy HH:mm:ss', new Date());

  if (!isValid(parsedDate)) {
    return formattedDateString;
  }

  // Formata a data de volta para ISO string
  return formatISO(parsedDate);
}

// Função inversa de formatDates
export function parseDates(dataArray: any[]) {
  return dataArray.map((item: any) => {
    const newItem = { ...item };

    for (const key in newItem) {
      if (typeof newItem[key] === 'string') {
        newItem[key] = parseFormattedDate(newItem[key]);
      }
    }

    return newItem;
  });
}

