import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { WelcomeGovernDetailsComponent } from './welcome-govern-details/welcome-govern-details.component';
import { ImageModifierComponent } from 'src/app/common-component/image-modifier/image-modifier.component';

@Component({
  selector: 'app-welcome-govern',
  templateUrl: './welcome-govern.component.html',
  styleUrls: ['./welcome-govern.component.scss'],
})
export class WelcomeGovernComponent implements OnInit {
  welcomeForm: FormGroup;
  welcomeFormAct: string = 'post';
  governingForm1: FormGroup;
  governingForm2: FormGroup;
  governingData: any[] = [{},{}];
  editor = ClassicEditor;
  selectedInstitute_id: number = 0;

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) {
    this.welcomeForm = formBuild.group({
      id: [],
      title: [],
      description: [],
      institute_id: [],
      status: [1],
    });
    this.governingForm1 = formBuild.group({
      id: [],
      _method: ['POST'],
      title: [],
      designation: [],
      message: [],
      upload_attachment: [],
      institute_id: [],
      status: [1],
    });
    this.governingForm2 = formBuild.group({
      id: [],
      _method: ['POST'],
      title: [],
      designation: [],
      message: [],
      upload_attachment: [],
      institute_id: [],
      status: [1],
    });
  }

  statusDropdown: any[] = [
    {
      id: 0,
      text: 'Inactive',
    },
    {
      id: 1,
      text: 'Active',
    },
  ];
  instituteDropdown: any[] = [];

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.getWelcomeMessage();
    this.getGoverningBody();
  }

  getInstituteDropdown() {
    this.api.get('settings/institute').subscribe((response: any) => {
      this.instituteDropdown = response.data.data;
      if (response?.data?.data && response?.data?.data.length == 1) {
        this.welcomeForm.controls['institute_id'].setValue(
          response.data.data[0].id
        );
        this.governingForm1.controls['institute_id'].setValue(
          response.data.data[0].id
        );
        this.governingForm2.controls['institute_id'].setValue(
          response.data.data[0].id
        );
      }
    });
  }

  setFileData(event: any, form: FormGroup, control: string) {
    if (event?.target?.files && event?.target?.files.length) {
      form.controls[control].setValue(event?.target?.files[0]);
    }
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

  getWelcomeMessage() {
    this.api.get('portal/welcome-message').subscribe((response: any) => {
      if (response?.data?.data && response?.data?.data.length > 0) {
        this.welcomeForm.patchValue(response?.data?.data[0]);
        this.welcomeFormAct = 'put';
      }
    });
  }

  getGoverningBody() {
    this.api.get('portal/governing-body').subscribe((response: any) => {
      if (response?.data?.data) {
        if(response?.data?.data.length > 0){
          this.governingForm1.patchValue(response?.data?.data[0]);
          this.governingForm1.controls['_method'].setValue('PUT');
          this.governingData[0] = response?.data?.data[0];
        }
        if(response?.data?.data.length > 1){
          this.governingForm2.patchValue(response?.data?.data[1]);
          this.governingForm2.controls['_method'].setValue('PUT');
          this.governingData[1] = response?.data?.data[1];
        }
      }
    }, (error: any) => {
      
    });
  }

  saveWelcomeMessage(){
    let tempValue: any = {...this.welcomeForm.value, institute_id: this.selectedInstitute_id};
    delete tempValue.id;
    let id: number = this.welcomeForm.value.id;
    if(this.welcomeFormAct === 'post'){
      this.loaderService.setLoaderStatus(true);
      this.api.post('portal/welcome-message', tempValue).subscribe((response: any) => {
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
      }, (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      })
    }else if(this.welcomeFormAct === 'put'){
      this.loaderService.setLoaderStatus(true);
      this.api.update(`portal/welcome-message/${id}`, tempValue).subscribe((response: any) => {
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
      }, (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      })
    }
  }

  saveGoverningBody(formI: number){
    if(formI == 1){
      this.saveGov(this.governingForm1);
    }else if(formI == 2){
      this.saveGov(this.governingForm2);
    }
  }

  saveGov(form: FormGroup){
    let url = form.value['_method'] === 'PUT' ? `portal/governing-body/${form.value.id}` : 'portal/governing-body';
    this.loaderService.setLoaderStatus(true);
    let postData: any = {...form.value};
    delete postData.id;
    this.api.post(url, this.api.getAsFormData({...postData, institute_id: this.selectedInstitute_id})).subscribe((response: any) => {
      this.showBackendMessage(response.response);
      this.loaderService.setLoaderStatus(false);
    }, (error: any) => {
      this.showBackendMessage(error.error.response);
      this.loaderService.setLoaderStatus(false);
    })
  }

  actionForConfirm(index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to clear form?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.deleteGoverningBody(index, dialogRef);
      }else{
        dialogRef.close();
      }
    });
  }

  deleteGoverningBody(index: number, dialog: any){
    let id: number = index == 1 ? this.governingForm1.value.id : index == 2 ? this.governingForm2.value.id : null;
    this.api.delete('portal/governing-body/', id).subscribe((response: any) => {
      this.showBackendMessage(response.response);
      this.loaderService.setLoaderStatus(false);
      this.clearForm(index == 1 ? this.governingForm1 : this.governingForm2);
      dialog.close();
    }, (error: any) => {
      this.showBackendMessage(error.error.response);
      this.loaderService.setLoaderStatus(false);
      dialog.close();
    })
  }

  clearForm(form: FormGroup){
    form.markAsPristine();
    form.markAsUntouched();
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.setValue('');
    });
  }

  detailsForImage(id: number){
    const dialogRef = this.dialog.open(WelcomeGovernDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: this.governingData[id-1]
      },
    })
  }

  openImageCropper(form: FormGroup, control: string){
    const dialogRef = this.dialog.open(ImageModifierComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      data: {ratio: 1/1}
    });
    dialogRef.componentInstance.onImageCrop.subscribe((result: any) => {
      form.controls[control].setValue(result);
    })
  }
}
