/**
 * Utilidades de validación de formularios
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validar un campo según reglas específicas
 */
export function validateField(value: string, rules: ValidationRule): ValidationResult {
  // Validación de campo requerido
  if (rules.required && (!value || value.trim() === '')) {
    return { isValid: false, error: 'Este campo es obligatorio' };
  }

  // Si está vacío y no es requerido, es válido
  if (!value || value.trim() === '') {
    return { isValid: true };
  }

  const trimmedValue = value.trim();

  // Validación de longitud mínima
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return { 
      isValid: false, 
      error: `Debe tener al menos ${rules.minLength} caracteres` 
    };
  }

  // Validación de longitud máxima
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: `No puede exceder ${rules.maxLength} caracteres` 
    };
  }

  // Validación de patrón (regex)
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return { 
      isValid: false, 
      error: 'Formato inválido' 
    };
  }

  // Validación personalizada
  if (rules.custom) {
    const customError = rules.custom(trimmedValue);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
}

/**
 * Validar teléfono colombiano
 */
export function validatePhone(value: string): ValidationResult {
  const phoneRules: ValidationRule = {
    required: true,
    pattern: /^(\+57|0057)?[1-9]\d{9}$/,
    custom: (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 12) {
        return 'Debe tener entre 10 y 12 dígitos';
      }
      return null;
    }
  };
  return validateField(value, phoneRules);
}

/**
 * Validar email
 */
export function validateEmail(value: string): ValidationResult {
  const emailRules: ValidationRule = {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };
  return validateField(value, emailRules);
}

/**
 * Validar descripción
 */
export function validateDescription(value: string): ValidationResult {
  const descRules: ValidationRule = {
    required: true,
    minLength: 10,
    maxLength: 1000,
    custom: (val) => {
      if (!/[a-zA-Z]/.test(val)) {
        return 'Debe contener al menos una letra';
      }
      return null;
    }
  };
  return validateField(value, descRules);
}

/**
 * Validar número de equipos
 */
export function validateEquipmentCount(value: string): ValidationResult {
  const countRules: ValidationRule = {
    required: true,
    pattern: /^\d+$/,
    custom: (val) => {
      const num = parseInt(val, 10);
      if (num < 1 || num > 99) {
        return 'Debe estar entre 1 y 99';
      }
      return null;
    }
  };
  return validateField(value, countRules);
}

/**
 * Validar texto general (sin caracteres especiales peligrosos)
 */
export function validateText(value: string, options?: { allowSpecialChars?: boolean }): ValidationResult {
  const pattern = options?.allowSpecialChars 
    ? /^[a-zA-Z0-9\s.,;:!?¡¿'"@#$%&*()_+\-=\[\]{}|\\\/<>]*$/
    : /^[a-zA-Z0-9\s]*$/;
  
  const textRules: ValidationRule = {
    required: true,
    pattern,
  };
  return validateField(value, textRules);
}
