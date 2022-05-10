import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { UserDetailsRootComponent } from '../user-details/user-details-root/user-details-root.component';
import { StudentBulkFormComponent } from './student-bulk-form/student-bulk-form.component';
import { StudentFormComponent } from './student-form/student-form.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  panelOpenState: boolean = false;
  searchParam: FormGroup;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) {
    this.searchParam = this.formBuild.group({
      name: [],
      student_id: [],
      class_roll: [],
      session_id: [],
      class_id: [],
      section_id: [],
      group_id: [],
    });
  }

  tableStructure: any = {
    headers: [
      'id',
      'name',
      'email',
      'student_id',
      'mobile_no',
      'session.title',
      'class.title',
      'section.title',
      'class_roll',
      'actions',
    ],
    banned: [
      'Sl No',
      'Name',
      'E-Mail',
      'ID',
      'Contact No.',
      'Session',
      'Class',
      'Section',
      'Roll',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary',
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn',
    },
    {
      tooltip: 'Download ID Card',
      action: 'download_id_card',
      icon: 'cloud_download',
      color: 'primary',
    },
  ];
  table_reload: boolean = false;

  instituteDropdown: any[] = [];
  bloodGroupDropdown: string[] = [
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-',
  ];
  nationalityDropdown: string[] = [
    'Bangladeshi',
    'Nepalis',
    'Bhutanese',
    'Indian',
    'Pakistani',
    'Malaysians',
    'Chinese'
  ];
  genderDropdown: string[] = ['Male', 'Female', 'Others'];
  religionDropdown: any[] = [];
  sessionDropdown: any[] = [];
  groupDropdown: any[] = [];
  classDropdown: any[] = [];
  sectionDropdown: any[] = [];
  shiftDropdown: any[] = [];

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.getReligionDropdown();
    this.getSessionDropdown();
    this.getGroupDropdown();
    this.getClassDropdown();
    this.getSectionDropdown();
    this.getShiftDropdown();
  }

  getInstituteDropdown() {
    this.api.get('settings/institute').subscribe((response: any) => {
      this.instituteDropdown = response.data.data;
    });
  }

  getReligionDropdown() {
    this.api.get('settings/religion').subscribe((response: any) => {
      this.religionDropdown = response.data.data;
    });
  }

  getSessionDropdown() {
    this.api.get('settings/session').subscribe((response: any) => {
      this.sessionDropdown = response.data.data;
    });
  }

  getGroupDropdown() {
    this.api.get('settings/group').subscribe((response: any) => {
      this.groupDropdown = response.data.data;
    });
  }

  getClassDropdown() {
    this.api.get('settings/class').subscribe((response: any) => {
      this.classDropdown = response.data.data;
    });
  }

  getSectionDropdown() {
    this.api.get('settings/section').subscribe((response: any) => {
      this.sectionDropdown = response.data.data;
    });
  }

  getShiftDropdown() {
    this.api.get('settings/shift').subscribe((response: any) => {
      this.shiftDropdown = response.data.data;
    });
  }

  showBackendMessage(response: any) {
    let snackbarRef = this.dialog.open(SnackberMessageComponent, {
      position: {
        top: '0px',
        right: '0px',
      },
      data: response,
    });
  }

  resetSearch() {
    this.searchParam.reset();
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          institute: this.instituteDropdown,
          bloodGroup: this.bloodGroupDropdown,
          nationality: this.nationalityDropdown,
          gender: this.genderDropdown,
          religion: this.religionDropdown,
          session: this.sessionDropdown,
          group: this.groupDropdown,
          class: this.classDropdown,
          section: this.sectionDropdown,
          shift: this.shiftDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(this.api.getAsFormData(result.value), dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('user/student', data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForBulkAdd() {
    const dialogRef = this.dialog.open(StudentBulkFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        file_url: '',
        dropdowns: {
          institute: this.instituteDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.bulkAddData(this.api.getAsFormData(result.value), dialogRef);
      }
    });
  }

  bulkAddData(data: any, dialog: any) {
    this.api.post('user/student-bulk', data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForEdit(data: any) {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
          bloodGroup: this.bloodGroupDropdown,
          nationality: this.nationalityDropdown,
          gender: this.genderDropdown,
          religion: this.religionDropdown,
          session: this.sessionDropdown,
          group: this.groupDropdown,
          class: this.classDropdown,
          section: this.sectionDropdown,
          shift: this.shiftDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(this.api.getAsFormData(result.value), data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`user/student/${id}`, data).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to delete student?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        this.deleteData(data.id, dialogRef);
      } else {
        dialogRef.close();
      }
    });
  }

  deleteData(id: number, dialogRef: any) {
    this.api.delete('user/student/', id).subscribe(
      (response) => {
        this.reloadTable();
        this.showBackendMessage(response);
        this.loaderService.setLoaderStatus(false);
        dialogRef.close();
      },
      (error) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      }
    );
  }

  actionForDetails(data: any) {
    const dialogRef = this.dialog.open(UserDetailsRootComponent, {
      width: `100%`,
      height: '100%',
      disableClose: true,
      data: {
        data: data,
        rootData: {
          title: `Details data of ${data?.name}`,
          subtitle: `Student ID: ${data?.student_id}`,
        },
        basicTable: {
          tableData: [
            {
              title: 'Personal Information',
              image: data?.profile_image_id,
              data: {
                Name: data?.name,
                'Birth Cirtificate Number': data?.birth_certificate_no,
                'Father Name': data?.father_name,
                'Mother Name': data?.mother_name,
                'Birth Date': formatDate(
                  data?.birth_date,
                  'MMMM d, y',
                  'en-US'
                ),
                'Blood Group': data?.blood_group,
                Nationality: data?.nationality,
                Gender: data?.gender,
                Religion: data?.religion?.title,
              },
            },
            {
              title: 'Contact Information',
              image: data?.birth_certificate_id,
              data: {
                'E-Mail': data?.email,
                'Mobile Number': data?.mobile_no,
                'Present Address': data?.present_address,
                'Permanent Address': data?.permanent_address,
              },
            },
            {
              title: 'Academic Information',
              image: data?.id_card_id,
              data: {
                'Student ID': data?.student_id,
                Roll: data?.class_roll,
                'CRVS ID': data?.crvs_id,
                Institute: data?.institute?.en_name,
                Session: data?.session?.title,
                Class: data?.class?.title,
                Shift: data?.shift?.title,
                Group: data?.group?.title,
                Section: data?.section?.title,
              },
            },
          ],
        },
      },
    });
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      this.actionForDetails(event.data);
    }
  }
}
