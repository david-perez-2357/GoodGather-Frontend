export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export const ValidationRules: { [key: string]: ValidationRule | ((...args: any[]) => ValidationRule) } = {
  required: {
    validate: (value: string) => value.trim() !== '',
    message: 'Este campo es obligatorio'
  },
  email: {
    validate: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'El email no es válido'
  },
  onlyLetters: {
    validate: (value: string) =>
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value),
    message: 'Solo se permiten letras y espacios'
  },
  validDate: {
    validate: (value: string) => !isNaN(Date.parse(value)),
    message: 'La fecha no es válida'
  },
  alphanumeric: {
    validate: (value: string) =>
      /^[a-zA-Z0-9]+$/.test(value),
    message: 'Solo se permiten caracteres alfanuméricos'
  },
  onlyNumbers: {
    validate: (value: string) =>
      /^[0-9]+$/.test(value),
    message: 'Solo se permiten números'
  },
  dateRange: (min: Date, max: Date) => ({
    validate: (value: string) => {
      const date = new Date(value);
      return date >= min && date <= max;
    },
    message: `La fecha debe estar entre ${min.toDateString()} y ${max.toDateString()}`
  }),
  allowedValues: (values: string[]) => ({
    validate: (value: string) => values.includes(value),
    message: `El valor debe ser uno de los siguientes: ${values.join(', ')}`
  }),
  lengthRange: (min: number, max: number) => ({
    validate: (value: string) => value.length >= min && value.length <= max,
    message: `El valor debe tener entre ${min} y ${max} caracteres`
  }),
};

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
