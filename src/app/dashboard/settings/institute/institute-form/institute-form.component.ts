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
  selector: 'app-institute-form',
  templateUrl: './institute-form.component.html',
  styleUrls: ['./institute-form.component.scss'],
})
export class InstituteFormComponent extends autocompleteMixin() implements OnInit {
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

  divisionDropdown: Observable<any[]> = new Observable();
  districtDropdown: Observable<any[]> = new Observable();
  organizationTypeDropdown: any[] = [];
  postOfficeDropdown: Observable<any[]> = new Observable();
  thanaDropdown: Observable<any[]> = new Observable();
  statusDropdown: any[] = [];
  instituteTypeDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<InstituteFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.formItemsData = this.formBuild.group({
      organization_type_id: [null, checkRequired('Organization Type')],
      name_en: ['', checkRequired('English Name')],
      name_bn: ['', checkRequired('Bangla Name')],
      short_name: ['', checkRequired('Short Name')],
      address: ['', checkRequired('Address')],
      district_code: ['', checkRequired('District')],
      district: [],
      division_code: ['', checkRequired('Division')],
      division: [],
      eiin_no: ['', checkRequired('EIIN')],
      institute_type: ['', checkRequired('Institute Type')],
      thana_code: [null, checkRequired('Thana')],
      thana: [],
      post_code: [null, checkRequired('Post Office')],
      post_office: [],
      upload_logo: [],
      website_url: ['', checkRequired('Website URL')],
      status: [1, checkRequired('Status')],
      _method: ['POST']
    });
    this.divisionDropdown = this.initializeFunction(
      this.formItemsData,
      'division',
      'en_name',
      data.dropdowns.division
    );
    this.organizationTypeDropdown = data.dropdowns.organizationType;
    this.instituteTypeDropdown = data.dropdowns.instituteType;
    this.statusDropdown = data.dropdowns.status;
  }

  ngOnInit(): void {
    this.setDataForEdit(true);
    this.loaderService.loaderControl.subscribe((data) => {
      this.loaderStatus = data;
    });
    this.loaderService.submissionControl.subscribe((data) => {

    })
  }

  getDistrictDropdown(has_event?: any){
    this.setAutocompleteData(this.formItemsData, 'division','division_code','division_code');
    if(has_event){
      this.clearField(this.formItemsData, 'district');
      this.clearField(this.formItemsData, 'thana');
      this.clearField(this.formItemsData, 'post_office');
    }
    if(this.formItemsData.value.division_code){
      let tempSearch: any = {
        division_code: Number(this.formItemsData.value.division_code)
      }
      this.api.get(`settings/district?search=${this.api.getSearchData(tempSearch)}`).subscribe((response: any) => {
        this.districtDropdown = this.initializeFunction(
          this.formItemsData,
          'district',
          'en_name',
          response.data.data
        );
      });
    }
  }

  getThanaDropdown(has_event?: any){
    this.setAutocompleteData(this.formItemsData, 'district','district_code','district_code');
    if(has_event){
      this.clearField(this.formItemsData, 'thana');
      this.clearField(this.formItemsData, 'post_office');
    }
    if(this.formItemsData.value.district_code){
      let tempSearch: any = {
        district_code: Number(this.formItemsData.value.district_code)
      }
      this.api.get(`settings/thana?search=${this.api.getSearchData(tempSearch)}`).subscribe((response: any) => {
        this.thanaDropdown = this.initializeFunction(
          this.formItemsData,
          'thana',
          'en_name',
          response.data.data
        );
      });
    }
  }

  getPostOfficeDropdown(has_event?: any){
    this.setAutocompleteData(this.formItemsData, 'thana','thana_code','thana_code');
    if(has_event){
      this.clearField(this.formItemsData, 'post_office');
    }
    if(this.formItemsData.value.thana_code){
      let tempSearch: any = {
        thana_code: Number(this.formItemsData.value.thana_code)
      }
      this.api.get(`settings/post-office?search=${this.api.getSearchData(tempSearch)}`).subscribe((response: any) => {
        this.postOfficeDropdown = this.initializeFunction(
          this.formItemsData,
          'post_office',
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
        organization_type_id: this.data.data.organization_type_id,
        name_bn: this.data.data.name_bn,
        name_en: this.data.data.name_en,
        short_name: this.data.data.short_name,
        address: this.data.data.address,
        division_code: Number(this.data.data.division_code),
        division: this.data.data.division,
        district_code: Number(this.data.data.district_code),
        district: this.data.data.district,
        thana_code: Number(this.data.data.thana_code),
        thana: this.data.data.thana,
        post_code: Number(this.data.data.post_code),
        post_office: this.data.data.post_office,
        eiin_no: this.data.data.eiin_no,
        institute_type: this.data.data.institute_type,
        website_url: this.data.data.website_url,
        status: this.data.data.status,
        _method: ['PUT']
      });
      this.getDistrictDropdown();
      this.getThanaDropdown();
      this.getPostOfficeDropdown();
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

  clearField(formData: FormGroup, control: string){
    formData.controls[control].markAsPristine();
    formData.controls[control].markAsUntouched();
    formData.controls[control].setValue('');
  }

  loadFile(event: any, control: string) {
    if (event.target.files && event.target.files.length) {
      this.formItemsData.controls[control].setValue(event.target.files[0]);
    }
  }
}
