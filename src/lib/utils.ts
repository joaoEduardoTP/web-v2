import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDropDownValues<T>(data: T[], selector: string) {
  const uniqueArray = [...new Set(data.map(item => item[selector]))];
  const noEmptyValues = uniqueArray.filter(element => element !== "").sort();
  const optionsArray = noEmptyValues.map(listItem => {
    return {
      value: listItem,
      label: listItem,
    };
  });
  return optionsArray;
}

import { differenceInHours, formatDistance, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DeliveryMethod } from "@/types";

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Sem data";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    const hoursDiff = differenceInHours(new Date(), date);

    if (hoursDiff < 24 && hoursDiff >= 0) { // Se for menos de 24 horas e no futuro/presente
      const minutes = Math.floor(hoursDiff * 60) % 60; // Get remaining minutes after hours
      const onlyHours = Math.floor(hoursDiff);
      return `há ${ onlyHours }h ${ minutes }m`;
    } else {
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR,
      });
    }

  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Erro na data";
  }
}



export function formatTimeBetweenDates(startDateString: string | null | undefined, endDateString: string | null | undefined): string {
  if (!startDateString || !endDateString) {
    return "Sem dados de data";
  }

  try {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Data inválida";
    }

    return formatDistance(startDate, endDate, {
      addSuffix: false, // Não precisa de sufixo "atrás" ou "em" aqui
      locale: ptBR,
    });

  } catch (error) {
    console.error("Erro ao formatar tempo entre datas:", error);
    return "Erro na data";
  }
}

export function formatDeliveryMethod(method: string): string {
  // 1. Divide a string em palavras usando o "_" como separador
  const palavras = method.split('_');

  // 2. Capitaliza a primeira letra de cada palavra e junta com espaço
  const formatado = palavras.map(palavra => {
    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
  }).join(' ');

  return formatado;
}
