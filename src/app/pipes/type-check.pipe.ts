import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeCheck',
})
export class TypeCheckPipe implements PipeTransform {
  transform(value: any, type: string): boolean {
    return value === null ? type === 'null' : Array.isArray(value) ? type === 'array' : typeof value === type;
  }
}
