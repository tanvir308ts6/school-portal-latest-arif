import { FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

type Constractor = new (...args: any[]) => {};
export function autocompleteMixin<TBase extends Constractor>(
  Base: TBase = class {} as any
) {
  return class AutoComplete extends Base {
    displayFunction = (control: string)=> {
      return (tada: any) => tada && tada[control] ? tada[control] : '';
    }
    initializeFunction(
      form: FormGroup,
      control: string,
      objKey: string,
      dataList: any[]
    ) {
      return form.controls[control].valueChanges.pipe(
        startWith(''),
        map((tada1: any) =>
          typeof tada1 === 'string' ? tada1 : tada1[objKey]
        ),
        map((tada2: string) => {
          return tada2
            ? this.filterFunction(dataList, tada2, objKey)
            : dataList;
        })
      );
    }
    filterFunction(dataList: any[], matchString: string, objKey: string) {
      return dataList.filter((tada3: any) =>
        tada3[objKey].toLowerCase().includes(matchString.toLowerCase())
      );
    }
    setAutocompleteData(formGroup: FormGroup, fromControl: string, toControl: string, key: string) {
      let tempObj: any = formGroup.value;
      if (tempObj[fromControl] && typeof tempObj[fromControl] === 'object' && tempObj[fromControl][key]) {
        formGroup.controls[toControl].setValue(
          formGroup.value[fromControl][key]
        );
      }
    }
    startValidationData(formGroup: FormGroup, checkControl: string, targetControl: string){
      if(!formGroup.value[checkControl]){
        formGroup.controls[targetControl].setValue(null);
      }
    }
  };
}
