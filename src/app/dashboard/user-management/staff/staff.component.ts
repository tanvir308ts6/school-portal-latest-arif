import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ViewDetailsFormComponent } from '../employee/view-details-form/view-details-form.component';
import { UserDetailsRootComponent } from '../user-details/user-details-root/user-details-root.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

 
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
      father_name: [],
      mother_name: [],
      institute_id: [],
      email: [],
      mobile_no: [],
      // nid: ['', checkRequired('Nid')],
      blood_group:[],
      birth_date:[],
      nationality:[],
      gender:[],
      religion_id:[],
      present_address:[],
      permanent_address:[],
      office_room:[],
      employee_code:[],
      joining_date:[],
      department_id:[],
      supervisor_id:[],
      designation_id:[],
      type:['Staff'],
    });
  }
  searchString:any='';
  tableStructure: any = {
    headers: [
      'id',
      'name',
      'email',
      'mobile_no',
      'office_room',
      'employee_code',
      'actions',
    ],
    banned: [
      'Sl No',
      'Name',
      'E-Mail',
      'Mobile Number',
      'Office Room',
      'Employee Code',
      'Actions',
    ],
  };
  tableButtons: any[] = [
    {
      tooltip: 'Edit',
      action: 'edit',
      icon: 'edit',
      color: 'primary'
    },
    {
      tooltip: 'Delete',
      action: 'delete',
      icon: 'delete',
      color: 'warn'
    },
    {
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent'
    },
  ];
  table_reload: boolean = false;
  instituteDropdown: any[] = [];
  religionDropdown: any[] = [];
  searchData:any = {
    type:'Staff'
  };
  superVisorDropdown: any[] = [];
  designationDropdown: any[] = [];
  bloodGroupDropdown: any[] = [
    {
      text:"A+"
    },
    {
      text:"A-"
    },
    {
      text:"B+"
    },
    {
      text:"B-"
    },
    {
      text:"AB+"
    },
    {
      text:"AB-"
    },
    {
      text:"O+"
    },
    {
      text:"O(-)"
    },
  ];
   genderDropdown: any[] = [
    {
      text:"Male"
    },
    {
      text:"Female"
    },
    {
      text:"Others"
    }
  
  ];
  statusDropdown: any[] = [
    {
      id: 0,
      text: 'Inactive',
    },
    {
      id: 1,
      text: 'Active',
    }
  ];
  // instituteDropdown: any[] = [];

  ngOnInit(): void {
    this.api.get('settings/religion').subscribe((response) => {
      this.religionDropdown = response.data.data;
    });
    //  this.api.get('settings/department').subscribe((response) => {
      //   this.departmentDropdown = response.data.data;
      // });
      this.api.get('settings/designation').subscribe((response) => {
        this.designationDropdown = response.data.data;
      });
   
    this.getInstituteDropdown();
  }

  getInstituteDropdown(){
    this.api.get('settings/institute').subscribe((response) => {
      this.instituteDropdown = response.data.data;
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
    const dialogRef = this.dialog.open(StaffFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          status: this.statusDropdown,
          institute: this.instituteDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addData(result, dialogRef);
      }
    });
  }

  addData(data: any, dialogRef: any) {
    this.api.post('user/employee', data).subscribe(
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

  actionForEdit(data: any) {
    const dialogRef = this.dialog.open(StaffFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          status: this.statusDropdown,
          division: this.instituteDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editData(result, data.id, dialogRef);
      }
    });
  }

  editData(data: any, id: number, dialogRef: any) {
    this.api.post(`user/employee/${id}`, data).subscribe(
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
        title: 'Do you want to delete location?',
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
    this.api.delete('user/employee/', id).subscribe(
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

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForDelete(event.data);
    } else if (event.action === 'details') {
      this.actionForDetails(event.data);
    }
  }
   actionForDetails(data: any) {
     console.log(data);
    const dialogRef = this.dialog.open(UserDetailsRootComponent, {
      width: `100%`,
      height: '100%',
      disableClose: true,
      data: {
        data: data,
        rootData: {
          title: `Details data of ${data?.name}`,
          // subtitle: `Student ID: ${data?.student_id}`,
        },
        basicTable: {
          tableData: [
            {
              title: 'Personal Information',
              image: data?.profile_image_id,
              data: {
                Name: data?.name,
                // 'Birth Cirtificate Number': data?.birth_certificate_no,
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
            // {
            //   title: 'Academic Information',
            //   image: data?.id_card_id,
            //   data: {
            //     '': data?.student_id,
            //     Roll: data?.class_roll,
            //     'CRVS ID': data?.crvs_id,
            //     Institute: data?.institute?.en_name,
            //     Session: data?.session?.title,
            //     Class: data?.class?.title,
            //     Group: data?.group?.title,
            //     Section: data?.section?.title,
            //   },
            // },
            {
              title: 'Contact Information',
              // image: data?.birth_certificate_id,
              data: {
                'E-Mail': data?.email,
                'Mobile Number': data?.mobile_no,
                'Present Address': data?.present_address,
                'Permanent Address': data?.permanent_address,
              },
            },
          ],
        },
      },
    });
  }
  viewDetailsAction(data:any){
    // console.log(data);
     const dialogRef = this.dialog.open(ViewDetailsFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
      
      },
    });
    // dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
    //   if (result != null) {
    //     this.loaderService.setLoaderStatus(true);
    //     this.editData(result, data.id, dialogRef);
    //   }
    // });
  }
}
