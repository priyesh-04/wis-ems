import { FormControl } from "@angular/forms";

export function validatorAlphaNumeric(control: FormControl) {
  const regExp = /^[a-zA-Z0-9 ]*$/;
  if (control.value && !regExp.test(control.value)) {
    return { invalidAlphaNumeric: true };
  }
  return null;
}

export function validatorEmail(control: FormControl) {
  const value = control.value;
  if (value) {
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regExp.test(value)) {
      return {
        validatorText: {
          valid: false,
        },
      };
    }
  }
}

export function validatorTextOnly(control: FormControl) {
  const value = control.value;
  if (value) {
    const regExp = /^[a-zA-Z ]*$/;
    if (!regExp.test(value)) {
      return {
        validatorText: {
          valid: false,
        },
      };
    }
  }
}

export function validatorIndianMobileNumber(control: FormControl) {
  const num = control.value;
  if (num) {
    const value = num.toString();
    const mobileNumber = value.replace(/\D/g, "");
    if (mobileNumber.length !== 10) {
      return {
        mobileNumberValidator: {
          valid: false,
        },
      };
    }
    const firstDigit = mobileNumber.substring(0, 1);
    if (
      firstDigit !== "6" &&
      firstDigit !== "7" &&
      firstDigit !== "8" &&
      firstDigit !== "9"
    ) {
      return {
        mobileNumberValidator: {
          valid: false,
        },
      };
    }
  }
  return null;
}
