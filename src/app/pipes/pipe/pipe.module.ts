import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameConverterPipe } from '../name-converter.pipe';
import { DataAccessorPipe } from '../data-accessor.pipe';
import { DatePipePipe } from '../date-pipe.pipe';
import { CurrencyConverterPipe } from '../currency-converter.pipe';
import { TypeCheckPipe } from '../type-check.pipe';
import { FunctionAccessorPipe } from '../function-accessor.pipe';

@NgModule({
  declarations: [
    NameConverterPipe,
    DataAccessorPipe,
    DatePipePipe,
    CurrencyConverterPipe,
    TypeCheckPipe,
    FunctionAccessorPipe,
  ],
  imports: [CommonModule],
  exports: [
    NameConverterPipe,
    DataAccessorPipe,
    DatePipePipe,
    CurrencyConverterPipe,
    TypeCheckPipe,
    FunctionAccessorPipe,
  ],
})
export class PipeModule {}
