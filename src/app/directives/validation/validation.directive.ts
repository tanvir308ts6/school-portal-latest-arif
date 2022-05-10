import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective {
  constructor() { }
}

export function checkRequired(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '' || control.value === null) {
      return {
        customError: {
          value: 'The ' + formName + ' is required',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkMaxLength(formName: string, length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length > length) {
      return {
        customError: {
          value:
            'The ' + formName + ' must have at most ' + length + ' characters',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkMinLength(formName: string, length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < length) {
      return {
        customError: {
          value:
            'The ' + formName + ' must have at least ' + length + ' characters',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoSpecialChar(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      control.value.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
    ) {
      return {
        customError: {
          value: 'The ' + formName + ' can not have special characters',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkOnlyNumber(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !Number(control.value)) {
      return {
        customError: {
          value: 'The ' + formName + ' can only have numbers',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoNumber(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && JSON.stringify(control.value).match(/[0-9]/)) {
      return {
        customError: {
          value: 'The ' + formName + ' can not have numbers',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkEmail(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      typeof control.value != 'number' &&
      !control.value.match(
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      return {
        customError: {
          value: 'The ' + formName + ' must be a valid email',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNumberLess(formName: string, value: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      typeof control.value != 'number' &&
      Number(control.value) < value
    ) {
      return {
        customError: {
          value: 'The ' + formName + ' can not be less than ' + value,
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNumberGreater(
  formName: string,
  value: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      typeof control.value != 'number' &&
      Number(control.value) > value
    ) {
      return {
        customError: {
          value: 'The ' + formName + ' can not be greater than ' + value,
        },
      };
    } else {
      return null;
    }
  };
}

export function checkFieldComparison(
  formName1: any,
  formName2: any,
  type: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value1: any = null;
    let value2: any = null;
    if (type == 'number') {
      value1 = +control.get(formName1?.field)?.value;
      value2 = +control.get(formName2?.field)?.value;
    } else if (type == 'time') {
      value1 = new Date(control.get(formName1?.field)?.value);
      value2 = new Date(control.get(formName2?.field)?.value);
    } else if (type == 'string') {
      value1 = control.get(formName1?.field)?.value;
      value2 = control.get(formName2?.field)?.value;
    }
    if (value1 && value2 && value1 < value2) {
      return {
        customError: {
          value:
            'The ' + formName1.text + ' can not be less than ' + formName2.text,
        },
      };
    } else {
      return null;
    }
  };
}

export function checkBannedString(
  formName: string,
  value: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let reguExp = new RegExp(value);
    if (
      control.value &&
      typeof control.value != 'number' &&
      control.value.match(reguExp)
    ) {
      return {
        customError: {
          value: 'The ' + formName + ' can not have ' + value,
        },
      };
    } else {
      return null;
    }
  };
}

export function checkPositiveNumber(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && JSON.stringify(control.value).includes('-')) {
      return {
        customError: {
          value: 'The ' + formName + " can't be negative",
        },
      };
    } else {
      return null;
    }
  };
}

export function checkOnlyDigit(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !JSON.stringify(control.value).match(/\d/)) {
      return {
        customError: {
          value: 'The ' + formName + ' must be positive integer',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoJustSpecialCharacter(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      control.value.match(/^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]*$/)
    ) {
      return {
        customError: {
          value: 'The ' + formName + " can't have only special character",
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoJustDigits(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.match(/^\d*$/)) {
      return {
        customError: {
          value: 'The ' + formName + " can't have only numbers",
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoBlankSpace(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.includes(' ')) {
      return {
        customError: {
          value: 'The ' + formName + " can't have blank spaces",
        },
      };
    } else {
      return null;
    }
  };
}

export function checkInvalidBlankSpace(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      (control.value.match(/^\s/) ||
        control.value.match(/\s$/) ||
        control.value.includes('  '))
    ) {
      return {
        customError: {
          value: 'The ' + formName + " can't have invalid blank spaces",
        },
      };
    } else {
      return null;
    }
  };
}

export function checkValidYear(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && JSON.stringify(control.value).length != 4) {
      return {
        customError: {
          value: 'The ' + formName + ' must have a valid year',
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoFutureYear(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      typeof control.value != 'number' &&
      Number(control.value) > new Date().getFullYear()
    ) {
      return {
        customError: {
          value: 'The ' + formName + " can't have a future year",
        },
      };
    } else {
      return null;
    }
  };
}

export function checkNoPastYear(formName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      typeof control.value != 'number' &&
      Number(control.value) < new Date().getFullYear()
    ) {
      return {
        customError: {
          value: 'The ' + formName + " can't have a past year",
        },
      };
    } else {
      return null;
    }
  };
}
