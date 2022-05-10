import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-routine-form',
  templateUrl: './routine-form.component.html',
  styleUrls: ['./routine-form.component.scss'],
})
export class RoutineFormComponent implements OnInit {
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

  subjectDropdown: any[] = [];
  teacherDropdown: any[] = [];
  statusDropdown: any[] = [
    {
      id: 1,
      text: 'Active',
    },
    {
      id: 0,
      text: 'Inactive',
    },
  ];
  typeDropdown: string[] = [
    'Class',
    'Break'
  ]

  constructor(
    public dialogRef: MatDialogRef<RoutineFormComponent>,
    private formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loader: LoaderService
  ) {
    this.formItemsData = formBuild.group({
      subject_id: [null],
      teacher_id: [null],
      order_no: [null],
      day: [''],
      start_time: ['', checkRequired('Start Time')],
      duration: ['', checkRequired('Duration')],
      end_time: [''],
      subject: [],
      teacher: [],
      status: [1],
      id: [],
      type: [],
    });
    this.teacherDropdown = this.data?.dropdowns?.teacher;
    this.subjectDropdown = this.data?.dropdowns?.subject;
    this.setFormData('order_no', this.data?.preData?.order_no);
    this.setFormData('start_time', this.data?.preData?.start_time);
    this.setFormData('end_time', this.data?.preData?.end_time);
    this.setFormData('duration', this.data?.preData?.duration);
    this.setFormData('type', this.data?.preData?.type);
    this.setFormData('day', this.data?.preData?.day);
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
        subject_id: Number(this?.data?.data?.subject_id),
        subject: this?.data?.data?.subject,
        teacher_id: Number(this.data?.data?.teacher_id),
        teacher: this.data?.data?.teacher,
        order_no: Number(this.data?.data?.order_no),
        day: this.data?.data?.day,
        status: this.data?.data?.status,
        id: this.data?.data?.id,
      });
    }
  }

  validateForm() {
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      this.setFormData('subject_id', this.formItemsData.value?.subject?.id);
      this.setFormData('teacher_id', this.formItemsData.value?.teacher?.id);
      if (!this.formItemsData.value.id) {
        this.formItemsData.removeControl('id');
      }
      this.formItemsData.removeControl('type');
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  durationVSend_time(given: string, g_amount: any, start_time: string) {
    let start_time_minute: number = Number(start_time?.split(':')[1]) ?? 0;
    let start_time_hour: number = Number(start_time?.split(':')[0]) ?? 0;
    let result: any;
    if (start_time_minute && start_time_hour) {
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
