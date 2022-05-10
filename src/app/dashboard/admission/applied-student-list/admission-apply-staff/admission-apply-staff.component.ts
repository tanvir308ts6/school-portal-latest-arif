import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { DataComService } from 'src/app/service/data-com/data-com.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { environment } from 'src/environments/environment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-admission-apply-staff',
  templateUrl: './admission-apply-staff.component.html',
  styleUrls: ['./admission-apply-staff.component.scss']
})
export class AdmissionApplyStaffComponent implements OnInit {
  config:
    | {
        timeOut: number;
        closeButton: boolean;
        positionClass: string;
        enableHtml: boolean;
      }
    | undefined;
  formItemsData: FormGroup;
  academicInfoForm: FormGroup;
  siblingInfoForm: FormGroup;
  paymentFormGroup: FormGroup;
  academicInfoStat: boolean = true;
  sibInfoStat: boolean = true;
  guardianArr: any[] = [
    {
      name_en: '',
      name_bn: '',
      profession: '',
      contact_no: '',
      email: '',
      educational_qualification: '',
      office_address: '',
      designation: '',
      nid_no: '',
      is_institute_employee: false,
      is_guardian: true,
      is_emergency_contact: false,
      relationship: '',
    },
  ];
  combinedArr: any[] = [];
  checked: any = '';
  checkedForPermanentAddress: any = '';
  checkedIsGuardian: boolean = false;
  iAgree: boolean = false;
  checkbox1 = 'true';
  editor = ClassicEditor;
  code: string = '';
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  branchDropdown: any[] = [];
  livewithfield: boolean = true;
  bankDropdown: any[] = [];
  emergencyContactArr: any[] = [
    {
      name_en: '',
      name_bn: '',
      profession: '',
      contact_no: '',
      email: '',
      educational_qualification: '',
      office_address: '',
      designation: '',
      nid_no: '',
      is_guardian: false,
      relationship: '',
      is_emergency_contact: true,
      is_institute_employee: false,
    },
  ];
  sessionDropdown: any[] = [];
  sessionObj: any = {};
  divisionDropdown: any[] = [];
  districtDropdown: any[] = [];
  permanentdistrictDropdown: any[] = [];
  permanentthanaDropdown: any[] = [];
  thanaDropdown: any[] = [];
  postOfficeDropdown: any[] = [];
  permanentpostOfficeDropdown: any[] = [];
  file: any;
  birthCertificatefile: any;
  manualUpBtn: boolean = true;
  wholeApplyByStaffBtn: boolean = true;
  vaccineCardFile: any;
  medicalDiagnoisFile: any;
  onSubmitEvent = new EventEmitter();
  staffLeaveReportArr: any[] = [];
  instituteDropdown: any[] = [];
  userInfo: any = {};
  parents: any[] = [
    {
      name_en: '',
      name_bn: '',
      profession: '',
      contact_no: '',
      email: '',
      educational_qualification: '',
      office_address: '',
      designation: '',
      nid_no: '',
      is_guardian: false,
      relationship: 'mother',
      is_emergency_contact: false,
      is_institute_employee: false,
    },
    {
      name_en: '',
      name_bn: '',
      profession: '',
      contact_no: '',
      email: '',
      educational_qualification: '',
      office_address: '',
      designation: '',
      nid_no: '',
      is_guardian: false,
      relationship: 'father',
      is_emergency_contact: false,
      is_institute_employee: false,
    },
  ];
  academicInfoPrimaryIndex: number = 0;
  parsedData: any = {};
  appliedDayCount: number = 0;
  classDropdown: any[] = [];
  bloodGroups: any[] = [
    {
      text: 'A+',
    },
    {
      text: 'A-',
    },
    {
      text: 'B+',
    },
    {
      text: 'B-',
    },
    {
      text: 'AB+',
    },
    {
      text: 'AB-',
    },
    {
      text: 'O+',
    },
    {
      text: 'O-',
    },
  ];

  payment: any = {
    applicant_personal_info_id: '',
    bank_name: '',
    branch_name: '',
    description: '',
    date: '',
    slip_no: '',
    amount: '',
    depositor_contact_no: '',
    payment_url: '',
    institute_id: '',
    created_by: '',
  };
  academic_info: any[] = [];
  sibling_info: any[] = [];
  versionDropdown: any[] = [];
  shiftDropdown: any[] = [];
  statusDropdown: any[] = [
    {
      id: '0',
      text: 'Inactive',
    },
    {
      id: '1',
      text: 'Active',
    },
  ];
  groupDropdown: any[] = [];
  religionDropdown: any[] = [];
  genderDropdown: any[] = [];
  genderDropdownSibling: any[] = [
    {
      text: 'Male',
    },
    {
      text: 'Female',
    },
  ];
  professionDropdownFather: any[] = [
    {
      text: 'Govt Job',
    },
    {
      text: 'Non-Govt Job',
    },
    {
      text: 'Business',
    },
    {
      text: 'Others',
    },
  ];
  professionDropdownMother: any[] = [
    {
      text: 'Govt Job',
    },
    {
      text: 'Non-Govt Job',
    },
    {
      text: 'Business',
    },
    {
      text: 'Housewife',
    },
    {
      text: 'Others',
    },
  ];
  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private router: Router,
    public storage: StorageService,
    private formBuild: FormBuilder,
    private loaderService: LoaderService,
    private dataCom: DataComService,
    public dialogRef: MatDialogRef<AdmissionApplyStaffComponent>
  ) {
    this.paymentFormGroup = this.formBuild.group({
      bank_name: ['', checkRequired('field')],
      branch_name: ['', checkRequired('field')],
      description: [],
      date: ['', checkRequired('field')],
      slip_no: ['', checkRequired('field')],
      depositor_contact_no: ['', checkRequired('field')],
      amount: ['', checkRequired('field')],
    });
    this.siblingInfoForm = this.formBuild.group({
      institute_name: ['', checkRequired('field')],
      name: ['', checkRequired('field')],
      gender: ['', checkRequired('field')],
      relationship: ['', checkRequired('field')],
      class: ['', checkRequired('field')],
      roll: ['', checkRequired('field')],
      section: ['', checkRequired('field')],
    });

    this.academicInfoForm = this.formBuild.group({
      examination_name: ['', checkRequired('field')],
      passing_year: ['', checkRequired('field')],
      obtain_gpa: ['', checkRequired('field')],
      gpa_scale: ['', checkRequired('field')],
      reason_for_leave: ['', checkRequired('field')],
      institute_name: ['', checkRequired('field')],
      upload_certificate: [],
      upload_testimonial: [],
    });
    this.formItemsData = this.formBuild.group({
      _method: ['POST'],
      apply_process: ['In Person Submission'],
      form_fillup_by: ['Staff'],
      applicants_status: ['Applied'],
      mother_name_en: [''],
      mother_name_bn: [''],
      mother_profession: [''],
      mother_designation: [],
      mother_education: [],
      mother_office_address: [],
      mother_nid_no: [],
      mother_contact_no: [],
      mother_email: [],
      mother_isguardian: [],
      mother_working: [],
      mother_relationship: ['mother'],
      mother_upload_nid: [],
      mother_upload_photo: [],
      father_name_en: [''],
      father_name_bn: [''],
      father_profession: [''],
      father_designation: [],
      father_education: [],
      father_office_address: [],
      father_nid_no: [],
      father_contact_no: [],
      father_email: [],
      father_isguardian: [],
      father_working: [],
      father_relationship: ['father'],
      father_upload_nid: [],
      father_upload_photo: [],
      guardian_name_en: [''],
      guardian_name_bn: [''],
      guardian_profession: [],
      guardian_designation: [],
      guardian_education: [],
      guardian_office_address: [],
      guardian_nid_no: [],
      guardian_contact_no: [''],
      guardian_email: [],
      guardian_working: [],
      guardian_relationship: ['guardian'],
      guardian_upload_nid: [],
      guardian_upload_photo: [],
      emergency_relationship: [''],
      emergency_name_en: [''],
      emergency_name_bn: [''],
      emergency_profession: [],
      emergency_designation: [],
      emergency_education: [],
      emergency_office_address: [],
      emergency_nid_no: [],
      emergency_contact_no: [''],
      emergency_email: [],
      emergency_working: [],
      emergency_upload_nid: [],
      emergency_upload_photo: [],
      name_en: [''],
      name_bn: [''],
      class_id: [''],
      appliedBefore: [],
      date_of_birth: [''],
      place_of_birth: [''],
      presentAndPermanentSame: [],
      crvs_id: [],
      live_with: [''],
      gender_id: [''],
      group_id: [],
      nationality: [],
      religion_id: ['1'],
      present_address: [''],
      permanent_address: [''],
      birth_certificate_no: [''],
      contact_no: [''],
      email: [],
      institute_id: [],
      parents: [],
      apply_before: [],
      version_id: [],
      shift_id: [],
      disability: [],
      special_medical_condition: [],
      branch_id: [],
      session_id: [1],
      blood_group: [],
      present_division_id: [],
      present_district_id: [],
      present_thana_id: [],
      present_post_office_id: [],
      permanent_post_office_id: [],
      permanent_district_id: [],
      permanent_division_id: [],
      permanent_thana_id: [],
      upload_birth_certificate: [],
      upload_profile: [],
      upload_vaccine_card: [],
      upload_medical_diagnosis_card: [],
      academic_info: this.formBuild.array([]),
      sibling_info: this.formBuild.array([]),
    });
  }

  getFormArray(control: string) {
    return this.formItemsData.controls[control] as FormArray;
  }

  ngOnInit(): void {
    this.dataCom.modifyStyleClass('form-title-image-container', 'select_image_1.png');
    this.formItemsData.controls['nationality'].setValue('Bangladeshi');
    this.api
      .get(`admission/division/public?page=1&size=-1`)
      .subscribe((response: any) => {
        this.divisionDropdown = response.data;
      });
    this.userInfo = window.localStorage.getItem('currentStudent');
    this.api
      .get(`admission/institute/public?page=1&size=-1`)
      .subscribe((response: any) => {
        this.instituteDropdown = response.data;
      });
    if (window.localStorage.getItem('staffLoggedIn') == 'true') {
      this.manualUpBtn = false;
    }
    if (window.localStorage.getItem('wholeapplyByStaff') == 'false') {
      this.wholeApplyByStaffBtn = false;
    }
    if (window.localStorage.getItem('wholeapplyByStaff') == 'true') {
      this.wholeApplyByStaffBtn = true;
    }
    this.parsedData = JSON.parse(this.userInfo);
    if (this.userInfo) {
      if (this.parsedData.name_en) {
        this.formItemsData.controls['name_en'].setValue(
          this.parsedData.name_en
        );
      }
      if (this.parsedData.name_bn) {
        this.formItemsData.controls['name_bn'].setValue(
          this.parsedData.name_bn
        );
      }
      if (this.parsedData.class_id) {
        let class_id = Number(this.parsedData.class_id);
        this.formItemsData.controls['class_id'].setValue(class_id);
      }
      if (this.parsedData.institute.id) {
        let institute_id = String(this.parsedData.institute.id);
        this.formItemsData.controls['institute_id'].setValue(institute_id);
        this.api
          .get(
            `admission/class/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.classDropdown = response?.data;
          });
        this.api
          .get(
            `admission/session/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.sessionObj = response?.data;
            this.formItemsData.controls['session_id'].setValue(
              response?.data?.id
            );
          });
        this.api
          .get(
            `admission/shift/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.shiftDropdown = response.data;
          });
        this.api
          .get(
            `admission/gender/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.genderDropdown = response.data;
          });
        this.api
          .get(
            `admission/group/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.groupDropdown = response.data;
          });
        this.api
          .get(
            `admission/version/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.versionDropdown = response.data;
          });
        this.api
          .get(
            `admission/bank/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.bankDropdown = response.data;
          });
        this.api
          .get(
            `admission/religion/public?institute_id=${this.parsedData.institute.id}&page=1&size=-1`
          )
          .subscribe((response: any) => {
            this.religionDropdown = response.data;
          });
      }
      if (this.parsedData.mother) {
        this.parents[0] = this.parsedData.mother;
        if (this.parents[0].is_guardian == '0') {
          this.parents[0].is_guardian = false;
        }
        if (this.parents[0].is_guardian == '1') {
          this.parents[0].is_guardian = true;
        }
        Object.keys(this.formItemsData.controls).forEach((control: string) => {
          if(control.includes('mother')){
            let from_control: string = control.replace('mother_', '');
            this.formItemsData.controls[control].setValue(this.parsedData.mother[from_control]);
          }
        })
      }
      if (this.parsedData.father) {
        this.parents[1] = this.parsedData.father;
        if (this.parents[1].is_guardian == '0') {
          this.parents[1].is_guardian = false;
        }
        if (this.parents[1].is_guardian == '1') {
          this.parents[1].is_guardian = true;
        }
        Object.keys(this.formItemsData.controls).forEach((control: string) => {
          if(control.includes('father')){
            let from_control: string = control.replace('father_', '');
            this.formItemsData.controls[control].setValue(this.parsedData.mother[from_control]);
          }
        })
      }
      if (this.parsedData.blood_group) {
        this.formItemsData.controls['blood_group'].setValue(
          this.parsedData.blood_group
        );
      }

      if (this.parsedData.permanent_division_id) {
        let divisionObj = {
          value: Number(this.parsedData.permanent_division_id),
        };
        this.getPermanentDistrictOnchange(divisionObj);
        this.formItemsData.controls['permanent_division_id'].setValue(
          Number(this.parsedData.permanent_division_id)
        );
      }
      if (this.parsedData.permanent_district_id) {
        let districtObj = {
          value: Number(this.parsedData.permanent_district_id),
        };
        this.getPermanentThanaOnchange(districtObj);
        this.formItemsData.controls['permanent_district_id'].setValue(
          Number(this.parsedData.permanent_district_id)
        );
      }
      if (this.parsedData.permanent_thana_id) {
        let thanaObj = {
          value: Number(this.parsedData.permanent_thana_id),
        };
        this.getPermanentPostOfficeOnchange(thanaObj);

        this.formItemsData.controls['permanent_thana_id'].setValue(
          Number(this.parsedData.permanent_thana_id)
        );
      }

      if (this.parsedData.permanent_post_office_id) {
        this.formItemsData.controls['permanent_post_office_id'].setValue(
          Number(this.parsedData.permanent_post_office_id)
        );
      }

      // present address
      if (this.parsedData.present_division_id) {
        let divisionObj = {
          value: Number(this.parsedData.present_division_id),
        };
        this.getDistrictOnchange(divisionObj);
        this.formItemsData.controls['present_division_id'].setValue(
          Number(this.parsedData.present_division_id)
        );
      }
      if (this.parsedData.present_district_id) {
        let districtObj = {
          value: Number(this.parsedData.present_district_id),
        };
        this.getThanaOnchange(districtObj);
        this.formItemsData.controls['present_district_id'].setValue(
          Number(this.parsedData.present_district_id)
        );
      }
      if (this.parsedData.present_thana_id) {
        let thanaObj = {
          value: Number(this.parsedData.present_thana_id),
        };
        this.getPostOfficeOnchange(thanaObj);

        this.formItemsData.controls['present_thana_id'].setValue(
          Number(this.parsedData.present_thana_id)
        );
      }

      if (this.parsedData.present_post_office_id) {
        this.formItemsData.controls['present_post_office_id'].setValue(
          Number(this.parsedData.present_post_office_id)
        );
      }

      if (this.parsedData.disability) {
        this.formItemsData.controls['disability'].setValue(
          this.parsedData.disability
        );
      }
      if (this.parsedData.apply_before != null) {
        this.checked = '1';
        this.formItemsData.controls['apply_before'].setValue(
          this.parsedData.apply_before
        );
      }
      if (this.parsedData.special_medical_condition) {
        this.formItemsData.controls['special_medical_condition'].setValue(
          this.parsedData.special_medical_condition
        );
      }
      if (this.parsedData.live_with) {
        this.formItemsData.controls['live_with'].setValue(
          this.parsedData.live_with
        );
      }
      if (this.parsedData.gender_id) {
        this.formItemsData.controls['gender_id'].setValue(
          Number(this.parsedData.gender_id)
        );
      }
      if (this.parsedData.version_id) {
        this.formItemsData.controls['version_id'].setValue(
          this.parsedData.version.id
        );
      }
      if (this.parsedData.shift_id) {
        this.formItemsData.controls['shift_id'].setValue(
          Number(this.parsedData.shift_id)
        );
      }
      if (this.parsedData.disability) {
        this.formItemsData.controls['disability'].setValue(
          this.parsedData.disability
        );
      }
      if (this.parsedData.special_medical_condition) {
        this.formItemsData.controls['special_medical_condition'].setValue(
          this.parsedData.special_medical_condition
        );
      }
      if (this.parsedData.branch_id) {
        this.formItemsData.controls['branch_id'].setValue(
          Number(this.parsedData.branch_id)
        );
      }
      if (this.parsedData.group_id) {
        this.formItemsData.controls['group_id'].setValue(
          Number(this.parsedData.group_id)
        );
      }
      if (this.parsedData.session_id) {
        this.formItemsData.controls['session_id'].setValue(
          Number(this.parsedData.session_id)
        );
      }
      if (this.parsedData.religion_id) {
        this.formItemsData.controls['religion_id'].setValue(
          this.parsedData.religion_id
        );
      }
      if (this.parsedData.birth_certificate_no) {
        this.formItemsData.controls['birth_certificate_no'].setValue(
          this.parsedData.birth_certificate_no
        );
      }
      if (this.parsedData.email) {
        this.formItemsData.controls['email'].setValue(this.parsedData.email);
      }
      if (this.parsedData.nationality) {
        this.formItemsData.controls['nationality'].setValue(
          this.parsedData.nationality
        );
      }
      if (this.parsedData.present_address) {
        this.formItemsData.controls['present_address'].setValue(
          this.parsedData.present_address
        );
      }
      if (this.parsedData.permanent_address) {
        this.formItemsData.controls['permanent_address'].setValue(
          this.parsedData.permanent_address
        );
      }
      if (this.parsedData.date_of_birth) {
        this.formItemsData.controls['date_of_birth'].setValue(
          this.parsedData.date_of_birth
        );
      }
      if (this.parsedData.place_of_birth) {
        this.formItemsData.controls['place_of_birth'].setValue(
          this.parsedData.place_of_birth
        );
      }
      if (this.parsedData.crvs_id) {
        this.formItemsData.controls['crvs_id'].setValue(
          this.parsedData.crvs_id
        );
      }
      if (this.parsedData.contact_no) {
        this.formItemsData.controls['contact_no'].setValue(
          this.parsedData.contact_no
        );
      }
      // console.log("this.parsedData.guardian.length",this.parsedData.guardian.length);
      if (this.parsedData.payment_info) {
        this.payment = this.parsedData.payment_info;
      }
      if (this.parsedData.guardian) {
        let obj = this.parsedData.guardian;
        let myArr: any[] = [];
        myArr.push(obj);
        this.guardianArr = myArr;
      }
      if (this.parsedData.emergency_contact) {
        let obj = this.parsedData.emergency_contact;
        let myArr: any[] = [];
        myArr.push(obj);
        this.emergencyContactArr = myArr;
      }
      if (this.parsedData.sibling_info) {
        this.sibling_info = this.parsedData.sibling_info;
      }
      if (this.parsedData.academic_info) {
        this.academic_info = this.parsedData.academic_info;
      }
    }
  }
  actionForManualApply() {
    this.router.navigateByUrl('/dashboard/student/upload-application-form');
  }
  actionForPayment() {
    this.router.navigateByUrl('/dashboard/student/payment');
  }
  actionForApply() {
    if (!this.formItemsData.value.live_with) {
      this.livewithfield = false;
    }
    if (this.academic_info.length >= 1) {
      Object.keys(this.academicInfoForm.controls).forEach((field) => {
        const control = this.academicInfoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.academic_info.forEach((acad: any) => {
        this.academicInfoForm.patchValue(acad);
        this.getFormArray('academic_info').push(this.academicInfoForm);
      });
    }
    if (this.academic_info.length != 0 && !this.academicInfoForm.valid) {
      this.academicInfoStat = false;
    }
    if (this.sibling_info.length >= 1) {
      Object.keys(this.siblingInfoForm.controls).forEach((field) => {
        const control = this.siblingInfoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.sibling_info.forEach((sbin: any) => {
        this.siblingInfoForm.patchValue(sbin);
        this.getFormArray('sibling_info').push(this.siblingInfoForm);
      });
    }
    if (this.sibling_info.length != 0 && !this.siblingInfoForm.valid) {
      this.sibInfoStat = false;
    }
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.formItemsData.valid && this.sibInfoStat && this.academicInfoStat) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: '150px',
        width: '300px',
        disableClose: true,
        data: {
          leftBtn: 'Cancel',
          rightBtn: 'Yes',
          leftBtnIcon: 'cancel',
          rightBtnIcon: 'check_circle',
          title: 'Do you want to proceed?',
        },
      });
      dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
        if (result.status == 1) {
          this.loaderService.setLoaderStatus(true);
          this.validateForm(dialogRef);
        } else {
          dialogRef.close();
        }
      });
    }
  }

  validateForm(dialogRef: any) {
    if (this.formItemsData.value.date_of_birth) {
      let val = this.formItemsData.value['date_of_birth'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['date_of_birth'].setValue(val);
    }
    this.addItem(this.formItemsData, dialogRef);
  }
  validateFormByStaff(dialogRef: any) {
    if (this.formItemsData.value.date_of_birth) {
      let val = this.formItemsData.value['date_of_birth'];
      val = formatDate(val, 'yyyy-MM-dd', 'en');
      this.formItemsData.controls['date_of_birth'].setValue(val);
    }
    this.addItemByStaff(this.formItemsData, dialogRef);
  }

  addItemByStaff(data: any, dialogRef: any) {
    if (
      this.parents[0].is_guardian == true ||
      this.parents[1].is_guardian == true
    ) {
      this.guardianArr = [];
    }
    if (window.localStorage.getItem('staffLoggedIn') == 'true') {
      this.formItemsData.controls['apply_process'].setValue(
        ' In Person Submission'
      );
      this.formItemsData.controls['form_fillup_by'].setValue('Staff');
      this.formItemsData.controls['applicants_status'].setValue('Applied');
    }
    this.formItemsData.controls['academic_info'].setValue(this.academic_info);
    this.formItemsData.controls['sibling_info'].setValue(this.sibling_info);
    if (this.guardianArr.length >= 1 || this.emergencyContactArr.length >= 1) {
      this.combinedArr = this.guardianArr
        .concat(this.parents)
        .concat(this.emergencyContactArr);
      this.formItemsData.controls['parents'].setValue(this.combinedArr);
    }
    if (this.guardianArr.length == 0 && this.emergencyContactArr.length == 0) {
      this.formItemsData.controls['parents'].setValue(this.parents);
    }
    if (this.payment.date) {
      let val2 = this.payment.date;
      val2 = formatDate(val2, 'yyyy-MM-dd', 'en');
      this.payment.date = val2;
    }

    const obj = data.value;
    const copy = Object.assign(this.payment, obj);

    this.api
      .update(
        `admission/manual-application/${this.parsedData.id}`,
        copy
      )
      .subscribe(
        (response: any) => {
          // this.getDataFromApi();
          this.showBackendMessage(response.response);
          // this.loaderService.setLoaderStatus(false);
          dialogRef.close();
        },
        (error: any) => {
          this.showBackendMessage(error.error.response);
          dialogRef.close();
        }
      );
  }
  goToAdmissionStudentList() {
    this.router.navigateByUrl('/dashboard/admission/applied-students');
  }
  replaceGuardianWith(control: string){
    Object.keys(this.formItemsData.controls).forEach((field) => {
      if(field.includes(control) && !field.includes('relationship') && !field.includes('isguardian')){
        let toField = field.replace(control, 'guardian');
        this.formItemsData.controls[toField].setValue(this.formItemsData.value[field]);
      }
      if(field === 'guardian_relationship'){
        this.formItemsData.controls[field].setValue('guardian');
      }
    })
  }
  addItem(data: any, dialogRef: any) {
    if(this.formItemsData.controls['mother_isguardian'].value){
      this.replaceGuardianWith('mother');
    }else if(this.formItemsData.controls['father_isguardian'].value){
      this.replaceGuardianWith('father');
    }
    let out_going_data: any = { ...data.value };
    out_going_data.parents = [];
    out_going_data.parents.push(
      this.separateParentalInformations(data.value, 'mother')
    );
    out_going_data = this.removeSpecifiedFields(out_going_data, 'mother');
    out_going_data.parents.push(
      this.separateParentalInformations(data.value, 'father')
    );
    out_going_data = this.removeSpecifiedFields(out_going_data, 'father');
    out_going_data.parents.push(
      this.separateParentalInformations(data.value, 'guardian')
    );
    out_going_data = this.removeSpecifiedFields(out_going_data, 'guardian');
    out_going_data.parents.push(
      this.separateParentalInformations(data.value, 'emergency')
    );
    out_going_data = this.removeSpecifiedFields(out_going_data, 'emergency');

    let url = '';
    if(this.parsedData?.id){
      this.formItemsData.controls['_method'].setValue('PUT');
      url = `admission/manual-application/${this.parsedData.id}`;
    }else{
      this.formItemsData.controls['_method'].setValue('POST')
      url = 'admission/manual-application'
    }
    this.api
      .post(
        url,
        this.api.getAsFormData(out_going_data)
      )
      .subscribe(
        (response: any) => {
          this.showBackendMessage(response.response);
          dialogRef.close();
          this.closeDialog();
        },
        (error: any) => {
          this.showBackendMessage(error.error.response);
          dialogRef.close();
        }
      );
  }
  closeDialog(){
    this.dialogRef.close();
    window.localStorage.removeItem('currentStudent');
  }

  separateParentalInformations(form: any, control: string) {
    return Object.entries(form).reduce((prevVal: any, [key, value]) => {
      return key.includes(control)
        ? { ...prevVal, [key.replace(`${control}_`, '')]: value }
        : { ...prevVal };
    }, {});
  }

  removeSpecifiedFields(form: any, control: string) {
    return Object.entries(form).reduce((prevVal: any, [key, value]) => {
      return key.includes(control)
        ? { ...prevVal }
        : { ...prevVal, [key]: value };
    }, {});
  }

  showBackendMessage(response: any) {
    let snackbarRef = this.dialog.open(SnackberMessageComponent, {
      position: {},
      data: response,
    });
  }

  resetAction() {
    this.resetForm();
  }

  resetForm() {
    this.formItemsData.markAsPristine();
    this.formItemsData.markAsUntouched();
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.setValue('');
    });
    this.code = '';
  }
  addAcademicInfo() {
    let obj = {
      institute_name: '',
      examination_name: '',
      passing_year: '',
      obtain_gpa: '',
      max_gpa: '',
      certificate_url: '',
      transfer_certificate_url: '',
      testimonial_url: '',
      reason_for_leave: '',
    };
    this.academic_info.push(obj);
    //   if (this.academicInfoForm.valid) {

    // }
  }
  addGuardianInfo() {
    let obj = {
      name_en: '',
      name_bn: '',
      profession: '',
      contact_no: '',
      email: '',
      educational_qualification: '',
      office_address: '',
      designation: '',
      nid_no: '',
      is_institute_employee: false,
      is_guardian: true,
      is_emergency_contact: false,
      relationship: '',
    };
    this.guardianArr.push(obj);
  }
  addEmergencyContactInfo() {
    let obj = {
      name_en: '',
      name_bn: '',
      profession: '',
      contact_no: '',
      email: '',
      educational_qualification: '',
      office_address: '',
      designation: '',
      nid_no: '',
      is_guardian: false,
      relationship: '',
      is_emergency_contact: true,
      is_institute_employee: false,
    };
    this.emergencyContactArr.push(obj);
  }
  addSiblingInfo() {
    let obj = {
      name: '',
      gender: '',
      relationship: '',
      class: '',
      roll: '',
      section: '',
    };
    this.sibling_info.push(obj);
  }

  setDateFormat() {
    let val = this.formItemsData.value['start_date'];
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.formItemsData.controls['start_date'].setValue(val);
    let val2 = this.formItemsData.value['end_date'];
    val2 = formatDate(val2, 'yyyy-MM-dd', 'en');
    this.formItemsData.controls['end_date'].setValue(val2);
  }
  deleteGuardianInfoRow(eve: any) {
    if (eve > 0) {
      this.guardianArr.splice(eve, 1);
    }
    if (eve == 0) {
      this.guardianArr.shift();
    }
  }
  deleteEmergencyContactInfoRow(eve: any) {
    if (eve > 0) {
      this.emergencyContactArr.splice(eve, 1);
    }
    if (eve == 0) {
      this.emergencyContactArr.shift();
    }
  }
  deleteAcademicInfoRow(eve: any) {
    if (eve > 0) {
      this.academic_info.splice(eve, 1);
    }
    if (eve == 0) {
      this.academic_info.shift();
    }
  }
  deleteSiblingInfoRow(eve: any) {
    if (eve > 0) {
      this.sibling_info.splice(eve, 1);
    }

    if (eve == 0) {
      this.sibling_info.shift();
    }
  }
  getIncrement(eve: any) {
    this.api
      .get(
        `admission/class/public?institute_id=${eve.value}&page=1&size=-1`
      )
      .subscribe((response: any) => {
        this.classDropdown = response.data;
      });
  }
  getDistrictOnchange(eve: any) {
    this.api
      .get(`admission/district/public?division_id=${eve.value}`)
      .subscribe((response: any) => {
        this.districtDropdown = response.data;
      });
  }
  getPermanentDistrictOnchange(eve: any) {
    this.api
      .get(`admission/district/public?division_id=${eve.value}`)
      .subscribe((response: any) => {
        this.permanentdistrictDropdown = response.data;
      });
  }
  getThanaOnchange(eve: any) {
    this.api
      .get(`admission/thana/public?district_id=${eve.value}`)
      .subscribe((response: any) => {
        this.thanaDropdown = response.data;
      });
  }
  getPermanentThanaOnchange(eve: any) {
    this.api
      .get(`admission/thana/public?district_id=${eve.value}`)
      .subscribe((response: any) => {
        this.permanentthanaDropdown = response.data;
      });
  }
  getPostOfficeOnchange(eve: any) {
    this.api
      .get(`admission/post-office/public?thana_id=${eve.value}`)
      .subscribe((response: any) => {
        this.postOfficeDropdown = response.data;
      });
  }
  getPermanentPostOfficeOnchange(eve: any) {
    this.api
      .get(`admission/post-office/public?thana_id=${eve.value}`)
      .subscribe((response: any) => {
        this.permanentpostOfficeDropdown = response.data;
      });
  }
  changeValue(val: any) {}
  changeValueIsGuardianMother(val: any) {
    if (val == true) {
      this.parents[1].is_guardian = false;
    }
  }
  changeValueIsGuardianFather(val: any) {
    if (val == true) {
      this.parents[0].is_guardian = false;
    }
  }
  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    var startDate = dateRangeStart.value;
    var endDate = dateRangeEnd.value;
    var newStartdate = startDate.split('/').reverse().join('-');
    var newEnddate = endDate.split('/').reverse().join('-');
    var date1 = new Date(newStartdate);
    var date2 = new Date(newEnddate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
    this.appliedDayCount = Difference_In_Days;
  }

  downloadAdmitCard() {
    this.goToLink(
      environment.api_url_admission +
        'api/' +
        `admission/admit-card/${this.parsedData.id}?institute_id=${this.parsedData.institute.id}&class_id=${this.parsedData.class_id}`
    );
  }
  private goToLink(url: string) {
    window.open(url);
  }
  radioChange(data: any) {
    if (data.value) {
      this.livewithfield = true;
    }
  }

  actionForEdit() {
    if (!this.formItemsData.value.live_with) {
      this.livewithfield = false;
    }
    console.log(
      'this.academic_info.length',
      this.academic_info.length,
      this.academicInfoForm.valid
    );
    if (this.academic_info.length >= 1)
      Object.keys(this.academicInfoForm.controls).forEach((field) => {
        const control = this.academicInfoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    if (this.academic_info.length != 0 && !this.academicInfoForm.valid) {
      this.academicInfoStat = false;
    }
    if (this.sibling_info.length >= 1) {
      Object.keys(this.siblingInfoForm.controls).forEach((field) => {
        const control = this.siblingInfoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
    if (this.sibling_info.length != 0 && !this.siblingInfoForm.valid) {
      this.sibInfoStat = false;
    }
    Object.keys(this.formItemsData.controls).forEach((field) => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    Object.keys(this.paymentFormGroup.controls).forEach((field) => {
      const control = this.paymentFormGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (
      this.formItemsData.valid &&
      this.sibInfoStat &&
      this.academicInfoStat &&
      this.paymentFormGroup.valid
    ) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: '150px',
        width: '300px',
        disableClose: true,
        data: {
          leftBtn: 'Cancel',
          rightBtn: 'Yes',
          leftBtnIcon: 'cancel',
          rightBtnIcon: 'check_circle',
          title: 'Do you want to apply?',
        },
      });
      dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
        if (result.status == 1) {
          this.loaderService.setLoaderStatus(true);
          this.validateFormByStaff(dialogRef);
        } else {
          dialogRef.close();
        }
      });
    }
  }
  getBranchOnchange(data: any) {
    var bankDropdown = this.bankDropdown;
    var result = bankDropdown.filter((obj) => {
      return obj.title === data.value;
    });
    this.payment.branch_name = result[0].branch;
  }
  presentAndPermanentSameAction(data: any) {
    if (data == true) {
      this.formItemsData.controls['permanent_division_id'].setValue(
        this.formItemsData.value.present_division_id
      );
      let divObj = {
        value: this.formItemsData.value.present_division_id,
      };
      this.getPermanentDistrictOnchange(divObj);
      this.formItemsData.controls['permanent_district_id'].setValue(
        this.formItemsData.value.present_district_id
      );
      let districtObj = {
        value: this.formItemsData.value.present_district_id,
      };
      this.getPermanentThanaOnchange(districtObj);
      this.formItemsData.controls['permanent_thana_id'].setValue(
        this.formItemsData.value.present_thana_id
      );
      let thanaObj = {
        value: this.formItemsData.value.present_thana_id,
      };
      this.getPermanentPostOfficeOnchange(thanaObj);
      this.formItemsData.controls['permanent_post_office_id'].setValue(
        this.formItemsData.value.present_post_office_id
      );
      this.formItemsData.controls['permanent_address'].setValue(
        this.formItemsData.value.present_address
      );
    }
  }

  dynamicallyOpenFile(data: string) {
    document.getElementById(data)?.click();
  }

  async loadFile(
    event: any,
    control: string,
    form: FormGroup,
    name_input?: string
  ) {
    if (event.target.files && event.target.files.length) {
      let image_file = event.target.files[0];
      // let binaryImage = await this.toBase64(image_file);
      form.controls[control].setValue(image_file);
      if (name_input) {
        let nameInput: any = document.getElementById(name_input);
        nameInput.value = event.target.files[0].name;
      }
    }
  }

  private toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  dynamicallyOpenandLoadFile(data: string) {
    this.dynamicallyOpenFile(data);
  }

  loadFileAndShow(event: any, id: string, control: string, form: FormGroup) {
    if (event.target.files && event.target.files.length) {
      let reader: any = new FileReader();
      let selectFile: any = event.target.files[0];
      let imgTag: any = document.getElementById(id);
      imgTag.title = selectFile.name;
      reader.onload = (eve: any) => {
        if (imgTag) {
          imgTag.src = eve.target.result;
        }
      };
      reader.readAsDataURL(selectFile);
      this.loadFile(event, control, form);
    }
  }
}
