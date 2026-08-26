export default function validateField(field, value) {
  const messages = field.messages || {};
  const validation = field.validation || {};

  const isEmpty = value === undefined || value === null || value === "";

  // --------------------------------------------------
  // Required
  // --------------------------------------------------

  if (field.required && isEmpty) {
    return {
      valid: false,
      rule: "required",
      message: messages.required || `${field.label} is required.`,
    };
  }

  // --------------------------------------------------
  // Optional field with no value
  // --------------------------------------------------

  if (!field.required && isEmpty) {
    return {
      valid: true,
      rule: null,
      message: null,
    };
  }

  const stringValue = String(value);

  // --------------------------------------------------
  // Minimum length
  // --------------------------------------------------

  if (validation.minLength !== undefined && stringValue.length < validation.minLength) {
    return {
      valid: false,
      rule: "minLength",
      message: messages.minLength || `${field.label} must be at least ${validation.minLength} characters.`,
    };
  }

  // --------------------------------------------------
  // Maximum length
  // --------------------------------------------------

  if (validation.maxLength !== undefined && stringValue.length > validation.maxLength) {
    return {
      valid: false,
      rule: "maxLength",
      message: messages.maxLength || `${field.label} cannot exceed ${validation.maxLength} characters.`,
    };
  }

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  if (validation.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(stringValue)) {
      return {
        valid: false,
        rule: "email",
        message: messages.email || "Please enter a valid email address.",
      };
    }
  }

  // --------------------------------------------------
  // Pattern
  // --------------------------------------------------

  if (validation.pattern) {
    let pattern;

    try {
      pattern = new RegExp(validation.pattern);
    } catch {
      return {
        valid: false,
        rule: "pattern",
        message: messages.pattern || `${field.label} contains an invalid value.`,
      };
    }

    if (!pattern.test(stringValue)) {
      return {
        valid: false,
        rule: "pattern",
        message: messages.pattern || `${field.label} contains an invalid value.`,
      };
    }
  }

  // --------------------------------------------------
  // Minimum numeric value
  // --------------------------------------------------

  if (validation.min !== undefined) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < validation.min) {
      return {
        valid: false,
        rule: "min",
        message: messages.min || `${field.label} must be at least ${validation.min}.`,
      };
    }
  }

  // --------------------------------------------------
  // Maximum numeric value
  // --------------------------------------------------

  if (validation.max !== undefined) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue > validation.max) {
      return {
        valid: false,
        rule: "max",
        message: messages.max || `${field.label} must not exceed ${validation.max}.`,
      };
    }
  }

  // --------------------------------------------------
  // Valid
  // --------------------------------------------------

  return {
    valid: true,
    rule: null,
    message: null,
  };
}
