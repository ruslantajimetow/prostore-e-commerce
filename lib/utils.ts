import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convetr prisma objects to plain objects

export function prismaToPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// create a formatted price

export function formatPrice(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

//Format error function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError') {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Calc Prices function
export const round2 = (value: string | number) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('The type of the value be the string or number');
  }
};

//Currency Formatter
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-Us', {
  currency: 'USD',
  style: 'currency',
  maximumFractionDigits: 2,
});

// currency formatter function
export const formatCurrency = (amount: number | string | null) => {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
};
