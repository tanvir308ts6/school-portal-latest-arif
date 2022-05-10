import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyConverter'
})
export class CurrencyConverterPipe implements PipeTransform {

  transform(value: string | number): string {
    let tempString = '';
    let number = 1000;
    if(typeof value == 'string'){
      tempString = `.${Number(value) % 1 ? Number(value) % 1 : '00'}`;
      for(let i=Number(value); i>=1 ; i++){
        tempString = `${i%number}${tempString}`;
        i = Math.floor(i/number);
        number = 100;
      }
    } else {

    }
    return tempString;
  }

}
