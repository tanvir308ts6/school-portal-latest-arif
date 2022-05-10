import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataAccessor',
})
export class DataAccessorPipe implements PipeTransform {
  transform(value: any, keygen: string): any | null {
    let tempArr = keygen.split('.');
    let tempData = Object.assign({}, value);
    tempArr.some((key: string) => {
      if (key in tempData && tempData[key] !== null && tempData[key] !== '') {
        tempData =
          key == 'month'
            ? new Date(`2014-${tempData[key]}-1`).toLocaleString('default', {
                month: 'long',
              })
            : key == 'status' ? tempData[key] == 1 ? 'Active' :  'Inactive' : tempData[key];
        return false;
      } else if(/\[([0-9]+)\]/.test(key)){
        let tempuIndex = /\[([^)]+)\]/.exec(key);
        let tempuData = tempuIndex ? tempuIndex[1] : 0;
        tempData = tempData[key][Number(tempuData)];
        return false;
      } else {
        tempData = null;
        return true;
      }
    });
    return tempData;
  }
}
