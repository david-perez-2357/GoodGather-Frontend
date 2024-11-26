import moment from 'moment';

// Interfaz para reglas de validación estáticas
export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

// Interfaz para funciones generadoras de reglas dinámicas
export type DynamicValidationRule = (...args: any[]) => ValidationRule;

// Colección de reglas de validación estáticas
export const StaticValidationRules: { [key: string]: ValidationRule } = {
  required: {
    validate: (value: string) => value != undefined && value.trim() !== '',
    message: 'Este campo es obligatorio',
  },
  email: {
    validate: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'El email no es válido',
  },
  onlyLetters: {
    validate: (value: string) =>
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value),
    message: 'Solo se permiten letras y espacios',
  },
  onlyNumbersAndSpaces: {
    validate: (value: string) =>
      /^[0-9\s]+$/.test(value),
    message: 'Solo se permiten números y espacios',
  },
  validDate: {
    validate: (value: string) => !isNaN(Date.parse(value)),
    message: 'La fecha no es válida',
  },
  alphanumeric: {
    validate: (value: string) =>
      /^[a-zA-Z0-9]+$/.test(value),
    message: 'Solo se permiten caracteres alfanuméricos',
  },
  onlyNumbers: {
    validate: (value: string) =>
      /^[0-9]+$/.test(value),
    message: 'Solo se permiten números',
  },
};

// Colección de funciones generadoras de reglas dinámicas
export const DynamicValidationRules: { [key: string]: DynamicValidationRule } = {
  dateRange: (min: string, max: string) => ({
    validate: (value: string) => {
      const date = moment(value, 'YYYY-MM-DD', true);
      return date.isValid() && date.isBetween(
        moment(min, 'YYYY-MM-DD'),
        moment(max, 'YYYY-MM-DD'),
        'day',
        '[]'
      );
    },
    message: min === max ? `La fecha debe ser ${moment(min, 'YYYY-MM-DD').format('DD/MM/YYYY')}` : `La fecha debe estar entre ${moment(min, 'YYYY-MM-DD').format('DD/MM/YYYY')} y ${moment(max, 'YYYY-MM-DD').format('DD/MM/YYYY')}`,
  }),
  timeRange: (min: string, max: string) => ({
    validate: (value: string) => {
      const time = moment(value, 'HH:mm', true);
      return time.isValid() && time.isBetween(
        moment(min, 'HH:mm'),
        moment(max, 'HH:mm'),
        'minute',
        '[]'
      );
    },
    message: min === max ? `La hora debe ser ${min}` : `La hora debe estar entre ${min} y ${max}`,
  }),
  allowedValues: (values: string[]) => ({
    validate: (value: string) => values.includes(value),
    message: values.length === 1 ? `El valor permitido es ${values[0]}` : `Los valores permitidos son ${values.join(', ')}`,
  }),
  lengthRange: (min: number, max: number) => ({
    validate: (value: string) => value.length >= min && value.length <= max,
    message: min === max ? `La longitud debe ser de ${min} caracteres` : `La longitud debe estar entre ${min} y ${max} caracteres`,
  }),
};

// Función de validación que utiliza una lista de reglas
export function validateField(
  value: string,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}
