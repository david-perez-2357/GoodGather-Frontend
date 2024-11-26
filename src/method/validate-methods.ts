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
    validate: (value: string) => value.trim() !== '',
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
    message: `La fecha debe estar entre ${moment(min).format('DD/MM/YYYY')} y ${moment(max).format('DD/MM/YYYY')}`,
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
    message: `La hora debe estar entre ${moment(min, 'HH:mm').format('HH:mm')} y ${moment(max, 'HH:mm').format('HH:mm')}`,
  }),
  allowedValues: (values: string[]) => ({
    validate: (value: string) => values.includes(value),
    message: `El valor debe ser uno de los siguientes: ${values.join(', ')}`,
  }),
  lengthRange: (min: number, max: number) => ({
    validate: (value: string) => value.length >= min && value.length <= max,
    message: `El valor debe tener entre ${min} y ${max} caracteres`,
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
