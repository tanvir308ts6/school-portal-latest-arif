import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { checkBannedString, checkNoSpecialChar, checkRequired } from 'src/app/directive/validation/custom-val.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';


@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnInit {
config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;
  formItemsData: FormGroup;

  loaderStatus: boolean = false;
  instituteDropdown:any[]=[];
  // editor = ClassicEditor;
  onSubmitEvent = new EventEmitter();
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
  classDropdown: any[] = [];
  sectionDropdown: any[] = [];
  groupDropdown: any[] = [];


  constructor(  public dialog: MatDialog,
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<SubjectFormComponent>,
    private formBuild: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
     this.formItemsData = this.formBuild.group({
      title: [],
      code:[],
      institute_id: [],
      class_id: [],
      section_id:[],
      group_id:[],
      status:[] 
      
    });

 
  }

  ngOnInit(): void {
    this.setDataForEdit(true);
     this.api.get('settings/institute').subscribe((response) => {
        this.instituteDropdown =response.data.data;
       
      });
     this.api.get('settings/class').subscribe((response) => {
        this.classDropdown =response.data.data;
       
      });
       this.api.get('settings/section').subscribe((response) => {
        this.sectionDropdown =response.data.data;
       
      });
         this.api.get('settings/group').subscribe((response) => {
        this.groupDropdown =response.data.data;
       
      });
    this.loaderService.loaderControl.subscribe((data)=>{
      this.loaderStatus = data;
    })
   
  }

  validateForm(){
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if(this.formItemsData.valid){
      this.onSubmitEvent.emit(this.formItemsData);
    }
  }

  setDataForEdit(sourceData?: boolean){
    if(this.data.data){
      this.formItemsData.patchValue({
        title: this.data?.data?.title, 
        code: this.data?.data?.code,
        institute_id: this.data?.data?.institute_id,
        class_id: this.data?.data?.academic_class?.id,  
        section_id: this.data?.data?.section?.id, 
        group_id: this.data?.data?.group?.id,
        status: this.data?.data?.status,
      });

    }
  }

  resetAction(){
    if(this.data.data){
      this.setDataForEdit(true);
    }else{
      this.resetForm();
    }
  }

  resetForm(){
    this.formItemsData.markAsPristine();
    this.formItemsData.markAsUntouched();
    Object.keys(this.formItemsData.controls).forEach(field => {
      const control = this.formItemsData.get(field);
      control?.setValue('');
    });

  }



}
