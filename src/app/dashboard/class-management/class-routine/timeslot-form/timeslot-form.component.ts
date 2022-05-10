import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-timeslot-form',
  templateUrl: './timeslot-form.component.html',
  styleUrls: ['./timeslot-form.component.scss'],
})
export class TimeslotFormComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  formItemsData: FormGroup;
  loaderStatus: boolean = false;
  onSubmitEvent = new EventEmitter();

  typeDropdown: string[] = ['Class', 'Break'];

  constructor(
    public dialogRef: MatDialogRef<TimeslotFormComponent>,
    private formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loader: LoaderService
  ) {
    this.formItemsData = formBuild.group({
      start_time: ['', checkRequired('Start Time')],
      duration: ['', checkRequired('Duration')],
      end_time: [''],
      type: [],
    });
    this.setFormData('start_time', this.data?.preData?.start_time.slice(0,5));
  }

  ngOnInit(): void {
    this.setDataForEdit();
    this.loader.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loader.submissionControl.subscribe((data) => {});
  }

  setFormData(control: string, value: any) {
    if (value) {
      this.formItemsData.controls[control].setValue(value);
    }
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        start_time: this.data?.data?.start_time.slice(0,5),
        end_time: this?.data?.data?.end_time.slice(0,5),
        duration: this.durationVSend_time(
          'end_time',
          this.data?.data?.end_time,
          this.data?.data?.start_time
        ),
        type: this.data?.data?.type
      });
    }
  }

  validateForm() {
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      this.setFormData(
        'end_time',
        this.durationVSend_time(
          'duration',
          this.formItemsData.value.duration,
          this.formItemsData.value.start_time
        )
      );
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  durationVSend_time(given: string, g_amount: any, start_time: string) {
    let start_time_minute: number = Number(start_time?.split(':')[1]) ?? 0;
    let start_time_hour: number = Number(start_time?.split(':')[0]) ?? 0;
    let result: number | string = '';
    if (start_time_minute !== NaN && start_time_hour !== NaN) {
      if (given === 'duration') {
        start_time_minute += Number(g_amount);
        if (start_time_minute >= 60) {
          start_time_hour += Math.floor(start_time_minute / 60);
          start_time_minute %= 60;
        }
        result = `${
          start_time_hour < 10 ? '0' + start_time_hour : start_time_hour
        }:${
          start_time_minute < 10 ? '0' + start_time_minute : start_time_minute
        }`;
      } else if (given === 'end_time') {
        result =
          Number(g_amount.split(':')[0]) * 60 +
          Number(g_amount.split(':')[1]) -
          (start_time_hour * 60 + start_time_minute);
      }
    }
    return result;
  }

  resetAction() {
    if (this.data.data) {
      this.setDataForEdit(true);
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.formItemsData.markAsPristine();
    this.formItemsData.markAsUntouched();
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.setValue('');
    });
  }
}
