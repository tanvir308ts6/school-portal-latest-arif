import { Observable } from 'rxjs';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { autocompleteMixin } from 'src/app/mixins/dropdownMixins';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-district-form',
  templateUrl: './district-form.component.html',
  styleUrls: ['./district-form.component.scss'],
})
export class DistrictFormComponent
  extends autocompleteMixin()
  implements OnInit
{
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
   countryDropdown: any[] = [];
  statusDropdown: any[] = [];
  divisionDropdown: Observable<any[]>;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<DistrictFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.formItemsData = this.formBuild.group({
      en_name: ['', checkRequired('English Name')],
      bn_name: ['', checkRequired('Bangla Name')],
      district_code: ['', checkRequired('District Code')],
      division_code: ['', checkRequired('Division')],
      // country_code: [null, checkRequired('Country')],
      division: [],
      status: [1, checkRequired('Status')],
    });
    this.statusDropdown = data.dropdowns.status;
    this.divisionDropdown = this.initializeFunction(
      this.formItemsData,
      'division',
      'en_name',
      data.dropdowns.division
    );
  }

  ngOnInit(): void {
    this.countryDropdown=this.data.dropdowns.countryDropdown;

    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {
      if (!data) {
      }
    });
  }

  validateForm() {
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid) {
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  setDataForEdit(sourceData?: boolean) {
    if (this.data.data) {
      this.formItemsData.patchValue({
        en_name: this.data?.data?.en_name,
        bn_name: this.data?.data?.bn_name,
        district_code: this.data?.data?.district_code,
        division_code: Number(this.data?.data?.division_code),
        division: this.data?.data?.division,
        status: this.data?.data?.status,
      });
    }
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
