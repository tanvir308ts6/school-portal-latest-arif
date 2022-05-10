import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameConverter',
})
export class NameConverterPipe implements PipeTransform {
  transform(value?: string, bannedString?: string[]): string | null {
    if (value && value != 'id') {
      let stringArray = value.split(/[_.]+/);
      let changeString = '';
      stringArray.forEach((element, i) => {
        stringArray[i] = stringFirstValue(element);
        if (checkNoBannedString(stringArray[i], bannedString)) {
          if (!/\[([0-9]+)\]/.test(stringArray[i])) {
            changeString = !changeString.endsWith(stringArray[i])
              ? `${changeString} ${stringArray[i]}`
              : `${changeString}`;
          } else if (/\[([0-9]+)\]/.test(stringArray[i])) {
            let tempuStr = stringArray[i].split('[');
            changeString = `${changeString} ${tempuStr[0]}`;
          } else {
            changeString = `${stringArray[i]}`;
          }
        } else if (stringArray.length == 1) {
          changeString = stringArray[0];
        }
      });
      return changeString;
    } else if (value && value == 'id') {
      return 'No';
    } else {
      return null;
    }
  }
}

function stringFirstValue(data: string) {
  let tada = data.charAt(0).toUpperCase() + data.slice(1);
  return tada;
}

function checkNoBannedString(data: string, dataArray?: string[]) {
  let result: boolean = true;
  dataArray?.some((tada: any) => {
    if (data == tada) {
      result = false;
      return true;
    } else {
      return false;
    }
  });
  return result;
}
