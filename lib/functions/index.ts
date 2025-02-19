import dayjs from 'dayjs';
import { fileTypes } from 'lib/constants';

export const randomSubstring = (str: string, len: number) => {
  const index = Math.floor(Math.random() * (str.length - len - 1));

  return str.substring(index, index + len);
};

type ValueType =
  | string
  | boolean
  | number
  | Record<string, string | boolean | number>;

export const isCompleted = (obj: ValueType | Record<string, ValueType>) => {
  try {
    let vals = Object.values(obj);
    return vals.every(v => isCompleted(v));
  } catch {
    return obj !== '';
  }
};

export const validateFiles = (files: File[]) => {

    let validFiles = [] as File[], invalidFiles = [] as File[]

  for (let file of files) {

    if (!fileTypes.has(file.type)) invalidFiles.push(file)

    else validFiles.push(file)
  }

  return { validFiles, invalidFiles }
};

export function toArrayBuffer(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

export const formatDate = (dateStr: string) => {
  let date = dayjs(dateStr);

  let diff = date.diff(dayjs(), 'days');

  if (diff === 1) return date.format('[Yesterday at] HH:mm:ss');

  if (diff < 7) return date.format('dddd [at] HH:mm:ss');
  else return date.format('DD/MM/YY [at] HH:mm');
};

// export const dealProgress = (deal: any) => {

//     let total = Object.keys(deal).length;

//     let count = 0;

//     for (let val of Object.values(deal)) if (isCompleted(val)) count++

//     return (count / total) * 100
// }

export const updateObject = (oldObject: object, updatedProperties: object) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const capitalise = (str: string) => {
  if (str.length < 2) return str;
  else return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const repaymentRange = (amount, rate, lookahead?) => {
  return [
    amount * (1 + rate * 0.01),
    amount * Math.pow(1 + rate * 0.01, lookahead ?? 10),
  ];
};

export const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};
