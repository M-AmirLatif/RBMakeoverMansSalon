export interface FormErrors {
  name?: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

export function validatePakistaniPhone(phone: string): boolean {
  // Normalize by removing spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Accept: 03XXXXXXXXX (11 digits starting with 03)
  // Or: +923XXXXXXXXX or 00923XXXXXXXXX (12-14 digits)
  // Or: 923XXXXXXXXX (12 digits)
  const pkRegex = /^((\+92|0092|92)?3[0-9]{9}|03[0-9]{9})$/;
  return pkRegex.test(cleaned);
}

export function validateDateNotPast(dateString: string): boolean {
  if (!dateString) return false;
  const parts = dateString.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return false;
  }
  const [year, month, day] = parts;
  const selectedDay = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return selectedDay.getTime() >= today.getTime();
}

export function validateAppointmentForm(values: {
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Please enter your full name (minimum 2 characters).";
  } else if (values.name.trim().length > 70) {
    errors.name = "Name is too long (maximum 70 characters).";
  }

  if (!values.phone || values.phone.trim().length === 0) {
    errors.phone = "Please enter your mobile phone number.";
  } else if (!validatePakistaniPhone(values.phone)) {
    errors.phone = "Please enter a valid Pakistani mobile number (e.g., 0326 9326566 or +923269326566).";
  }

  if (!values.service || values.service.trim().length === 0) {
    errors.service = "Please select a service or choose 'Not sure yet'.";
  }

  if (!values.preferredDate) {
    errors.preferredDate = "Please choose your preferred date.";
  } else if (!validateDateNotPast(values.preferredDate)) {
    errors.preferredDate = "Preferred date cannot be in the past.";
  }

  if (!values.preferredTime || values.preferredTime.trim().length === 0) {
    errors.preferredTime = "Please select your preferred time slot.";
  }

  if (values.message && values.message.length > 500) {
    errors.message = "Message must not exceed 500 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
