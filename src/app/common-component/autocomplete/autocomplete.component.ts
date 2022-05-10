import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplateLiteral } from '@angular/compiler';
import { Component, ElementRef, HostBinding, Inject, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { MatFormField, MatFormFieldControl, MAT_FORM_FIELD } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';

class MyTel {
  constructor(public area: string, public exchange: string, public subscriber: string) {}
}

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: AutocompleteComponent
    }
  ],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class AutocompleteComponent implements OnInit, MatFormFieldControl<MyTel>, ControlValueAccessor {

  constructor(
    private builder: FormBuilder,
    private _elementRef: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
  ) {
    this.formData = builder.group({
      area: [''],
      exchange: [''],
      subscriber: [''],
    });
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  @ViewChild('area') areaInput: HTMLInputElement | any;
  @ViewChild('exchange') exchangeInput: HTMLInputElement | any;
  @ViewChild('subscriber') subscriberInput: HTMLInputElement | any;

  writeValue(tel: MyTel | null): void {
    this.value = tel;
  }

  onChange = (_: any) => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  touched: boolean = false;
  onTouched = () => {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  formData: FormGroup;
  stateChanges = new Subject<void>();

  @Input() get value(): MyTel | null {
    let n = this.formData.value;
    if (
      n.area.length == 3 &&
      n.exchange.length == 3 &&
      n.subscriber.length == 4
    ) {
      return new MyTel(n.area, n.exchange, n.subscriber);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    tel = tel || new MyTel('', '', '');
    this.formData.setValue({
      area: tel.area,
      exchange: tel.exchange,
      subscriber: tel.subscriber,
    });
    this.stateChanges.next();
  }

  private _placeholder: string = '';
  @Input() get placeholder(){
    return this._placeholder;
  }
  set placeholder(holder: string){
    this._placeholder = holder;
    this.stateChanges.next();
  }

  static next_id: number = 0;
  @HostBinding() id: string = `app-autocomplete-${AutocompleteComponent.next_id++}`;

  focused: boolean = false;
  onFocusIn(event: FocusEvent){
    if(!this.focused){
      this.focused = true;
      this.stateChanges.next();
    }
  }
  onFocusOut(event: FocusEvent){
    if(!this._elementRef.nativeElement.contains(event.relatedTarget as Element)){
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }
  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  get empty(){
    let n: MyTel = this.formData.value;
    return !n.area && !n.exchange && !n.subscriber;
  }

  @HostBinding('class.floating') get shouldLabelFloat(){
    return this.focused || !this.empty;
  }

  private _required: boolean = false;
  @Input() get required(){
    return this._required;
  }
  set required(req){
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _disabled: boolean = false;
  @Input() get disabled(){
    return this._disabled;
  }
  set disabled(dis){
    this._disabled = coerceBooleanProperty(dis);
    this._disabled ? this.formData.disable() : this.formData.enable();
    this.stateChanges.next();
  }

  get errorState(): boolean{
    return this.formData.invalid && this.touched;
  }

  controlType?: string = 'app-autocomplete';

  autofilled?: boolean | undefined;

  @Input('aria-describedby') userAriaDescribedBy?: string | undefined;

  setDescribedByIds(ids: string[]): void {
    const controlElement = this._elementRef.nativeElement.querySelector('app-autocomplete-container');
    controlElement?.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent): void {
    if (this.formData.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.formData.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.formData.controls.area.valid) {
      this._focusMonitor.focusVia(this.exchangeInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.areaInput, 'program');
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(){
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}
