import { FormControl } from "@angular/forms";

export function getFormattedDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

export function getFormattedDatetime(dateString) {
  const d = new Date(dateString);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  let hour = "" + d.getHours();
  let min = "" + d.getMinutes();
  let sec = "" + d.getSeconds();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (min.length < 2) min = "0" + min;
  if (sec.length < 2) sec = "0" + sec;
  return [year, month, day].join("-") + "T" + [hour, min, sec].join(":");
}

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
