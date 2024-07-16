import { FormControl } from "@angular/forms";

export function getFormattedDate(date) {
  const d = new Date(date);
  const today =
        d.getFullYear() +
        '-' +
        (d.getMonth() > 8
          ? d.getMonth() + 1
          : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        'T' + (d.getHours() > 9 ? d.getHours(): '0'+d.getHours())+":"+(d.getMinutes() > 9 ? d.getMinutes() : '0'+d.getHours()) + ":00+05:30";
        
  return [today];
}

export function formatDateToDDMMYYYY(dateString) {
  const dateObj = new Date(dateString);
  //return dateObj;

  const day = dateObj.getDate().toString().padStart(2, '0');
  //return day;
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  //return `${day}-${month}-${year}`;
  return `${year}-${month}-${day}`;
}

export function formatToDateTime(dateString) {
  // Original ISO timestamp
  const isoTimestamp = dateString;

  // Create a Date object from the ISO timestamp
  const date = new Date(isoTimestamp);

  // Get the local date and time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Combine the local date and time components in ISO 8601 format
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  return formattedDateTime;
}

export function getTodayDateTime(){
  const today = new Date();
  const todayDate = new Date(today);
  todayDate.setDate(today.getDate());

  const yyyy = todayDate.getFullYear();
  const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
  const dd = String(todayDate.getDate()).padStart(2, '0');
  const hh = String(todayDate.getHours()).padStart(2, '0');
  const min = String(todayDate.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function getMinDateTime(val:number){
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - val);

  const yyyy = minDate.getFullYear();
  const mm = String(minDate.getMonth() + 1).padStart(2, '0');
  const dd = String(minDate.getDate()).padStart(2, '0');
  const hh = String(minDate.getHours()).padStart(2, '0');
  const min = String(minDate.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function getMaxDateTime(val:number){
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + val);

  const yyyy = maxDate.getFullYear();
  const mm = String(maxDate.getMonth() + 1).padStart(2, '0');
  const dd = String(maxDate.getDate()).padStart(2, '0');
  const hh = String(maxDate.getHours()).padStart(2, '0');
  const min = String(maxDate.getMinutes()).padStart(2, '0');

  return`${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function getFormattedDatetime(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let hour = "" + d.getHours();
  let min = "" + d.getMinutes();
  let sec = "" + d.getSeconds();
  let timeZone ="" + d.getTimezoneOffset();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (min.length < 2) min = "0" + min;
  if (sec.length < 2) sec = "0" + sec;

  return [year, month, day].join("-") + "T" + [hour, min, sec].join(":") + [timeZone].join(":");
}

export function getMinDate(val:number){
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - val);

  const yyyy = minDate.getFullYear();
  const mm = String(minDate.getMonth() + 1).padStart(2, '0');
  const dd = String(minDate.getDate()).padStart(2, '0');
  //const hh = String(minDate.getHours()).padStart(2, '0');
  //const min = String(minDate.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

export function getMaxDate(val:number){
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + val);

  const yyyy = maxDate.getFullYear();
  const mm = String(maxDate.getMonth() + 1).padStart(2, '0');
  const dd = String(maxDate.getDate()).padStart(2, '0');
  // const hh = String(maxDate.getHours()).padStart(2, '0');
  // const min = String(maxDate.getMinutes()).padStart(2, '0');

  return`${yyyy}-${mm}-${dd}`;
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
