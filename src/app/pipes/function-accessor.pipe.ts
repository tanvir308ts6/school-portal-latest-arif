import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'functionAccessor',
})
export class FunctionAccessorPipe implements PipeTransform {
  transform(value: any, func: Function): string {
    return func(value);
  }
}
