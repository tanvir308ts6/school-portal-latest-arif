import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { autocompleteMixin } from 'src/app/mixins/dropdownMixins';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-thana-form',
  templateUrl: './thana-form.component.html',
  styleUrls: ['./thana-form.component.scss'],
})
export class ThanaFormComponent extends autocompleteMixin() implements OnInit {
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

  divisionDropdown: Observable<any[]>;
  districtDropdown: Observable<any[]> = new Observable();
  statusDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<ThanaFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.formItemsData = this.formBuild.group({
      en_name: ['', checkRequired('English Name')],
      bn_name: ['', checkRequired('Bangla Name')],
      district_code: [null, checkRequired('District')],
      district: [],
      division_code: [null, checkRequired('Division')],
      division: [],
      thana_code: ['', checkRequired('Upazila Code')],
      status: [1, checkRequired('Status')],
    });
    this.divisionDropdown = this.initializeFunction(
      this.formItemsData,
      'division',
      'en_name',
      data.dropdowns.division
    );
    this.statusDropdown = data.dropdowns.status;
  }

  ngOnInit(): void {
    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {});
  }

  getDistrictDropdown(has_event?: any) {
    this.setAutocompleteData(this.formItemsData, 'division','division_code','division_code');
    if (has_event) {
      this.clearField(this.formItemsData, 'district');
    }
    if (this.formItemsData.value.division_code) {
      let tempSearch: any = {
        division_code: Number(this.formItemsData.value.division_code),
      };
      this.api
        .get(`settings/district?search=${this.api.getSearchData(tempSearch)}`)
        .subscribe((response: any) => {
          this.districtDropdown = this.initializeFunction(
            this.formItemsData,
            'district',
            'en_name',
            response.data.data
          );
        });
    }
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
        district: this.data?.data?.district,
        district_code: Number(this.data?.data?.district_code),
        division: this.data?.data?.division,
        division_code: Number(this.data?.data?.division_code),
        thana_code: this.data?.data?.thana_code,
        status: this.data?.data?.status,
      });
      this.getDistrictDropdown();
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

  clearField(formData: FormGroup, control: string) {
    formData.controls[control].markAsPristine();
    formData.controls[control].markAsUntouched();
    formData.controls[control].setValue('');
  }
}
