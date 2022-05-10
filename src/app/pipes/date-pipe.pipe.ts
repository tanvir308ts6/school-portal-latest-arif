import { formatDate } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
@Injectable({
  providedIn: 'root'
})
export class DatePipePipe implements PipeTransform {

  transform(value?: Date): string | null {
    if(value){
      return formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      return null;
    }
  }

}
