import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { SliderFormComponent } from './slider-form/slider-form.component';
import { ConfirmationDialogComponent } from 'src/app/common-component/confirmation-dialog/confirmation-dialog.component';
import { SliderDetailsComponent } from './slider-details/slider-details.component';
import { ContactAboutDetailsComponent } from './contact-about-details/contact-about-details.component';
import { ImageModifierComponent } from 'src/app/common-component/image-modifier/image-modifier.component';

@Component({
  selector: 'app-slider-contact-about',
  templateUrl: './slider-contact-about.component.html',
  styleUrls: ['./slider-contact-about.component.scss'],
})
export class SliderContactAboutComponent implements OnInit {
  contactForm: FormGroup;
  contactData: any;
  aboutForm: FormGroup;
  sliderOrderForm: any[] = [];
  aboutData: any;
  editor = ClassicEditor;
  selectedInstitute_id: number = 0;

  tableStructure: any = {
    headers: ['id', 'title', 'order', 'actions'],
    banned: ['Sl No', 'Title', 'Order', 'Actions'],
  };
  tableButtons: any[] = [
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
      tooltip: 'Details',
      action: 'details',
      icon: 'remove_red_eye',
      color: 'accent',
    },
  ];
  table_reload: boolean = false;

  instituteDropdown: any[] = [];

  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    public api: ApiService,
    public storage: StorageService,
    private formBuild: FormBuilder
  ) {
    this.contactForm = this.formBuild.group({
      contact_information: [],
      institute_id: [],
      id: [],
      _method: [],
      status: [1],
      location_url: []
    });
    this.aboutForm = this.formBuild.group({
      id: [],
      upload_attachment: [],
      institute_id: [],
      title: [],
      description: [],
      _method: ['POST'],
      status: [1],
    });
  }

  ngOnInit(): void {
    this.getInstituteDropdown();
    this.getData();
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

  getInstituteDropdown() {
    this.api.get('settings/institute').subscribe((response: any) => {
      this.instituteDropdown = response.data.data;
      if (response.data.data.length == 1) {
        this.contactForm.controls['institute_id'].setValue(
          response.data.data[0].id
        );
        this.aboutForm.controls['institute_id'].setValue(
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

  patchForm(form: FormGroup, data: any) {
    form.patchValue(data);
  }

  reloadTable() {
    this.table_reload = true;
    window.setTimeout(() => {
      this.table_reload = false;
    }, 1000);
  }

  actionForConfirm(type: string, data?: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '150px',
      width: '300px',
      disableClose: true,
      data: {
        leftBtn: 'Cancel',
        rightBtn: 'Yes',
        leftBtnIcon: 'cancel',
        rightBtnIcon: 'check_circle',
        title: 'Do you want to Proceed?',
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result) => {
      if (result.status == 1) {
        this.loaderService.setLoaderStatus(true);
        if (type === 'contact') {
          this.saveContact(dialogRef);
        } else if (type === 'about') {
          this.saveAbout(dialogRef);
        } else if (type === 'delete') {
          this.deleteSlider(data, dialogRef);
        }
      } else {
        dialogRef.close();
      }
    });
  }

  getData() {
    this.getContact();
    this.getAbout();
  }

  getContact() {
    this.api.get('portal/contact-us').subscribe((response: any) => {
      if (response.data.data) {
        let result: any = response.data.data[0];
        this.contactData = result;
        this.patchForm(this.contactForm, { ...result, _method: 'PUT' });
      }
    });
  }

  getAbout() {
    this.api.get('portal/about-us').subscribe((response: any) => {
      if (response.data.data) {
        let result: any = response.data.data[0];
        this.aboutData = result;
        this.patchForm(this.aboutForm, { ...result, _method: 'PUT' });
      }
    });
  }

  saveContact(dialog: any) {
    let tempUrl: string =
      this.contactForm.value._method == 'PUT'
        ? `portal/contact-us/${this.contactForm.value.id}`
        : 'portal/contact-us';
    let tempData: any = {
      ...this.contactForm.value,
      institute_id: this.selectedInstitute_id,
    };
    delete tempData.id;
    delete tempData._method;
    this.api[this.contactForm.value._method == 'PUT' ? 'update' : 'post'](tempUrl, tempData).subscribe(
      (response: any) => {
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      }
    );
  }

  saveAbout(dialog: any) {
    let tempUrl: string =
      this.aboutForm.value._method == 'PUT'
        ? `portal/about-us/${this.aboutForm.value.id}`
        : 'portal/about-us';
    let tempData: any = {
      ...this.aboutForm.value,
      institute_id: this.selectedInstitute_id,
    };
    delete tempData.id;
    this.api.post(tempUrl, this.api.getAsFormData(tempData)).subscribe(
      (response: any) => {
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      }
    );
  }

  actionFromTables(event: any) {
    if (event.action === 'edit') {
      this.actionForEdit(event.data);
    } else if (event.action === 'delete') {
      this.actionForConfirm('delete', event.data);
    } else if (event.action === 'details') {
      this.actionForDetails(event.data);
    } else if (event.action === 'drag_drop') {
      this.actionForDragDrop(event.data);
    }
  }

  actionForAdd() {
    const dialogRef = this.dialog.open(SliderFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        dropdowns: {
          institute: this.instituteDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.addSlider(
          this.api.getAsFormData({
            ...result.value,
            institute_id: this.selectedInstitute_id,
          }),
          dialogRef
        );
      }
    });
  }

  addSlider(data: any, dialog: any) {
    this.api.post('portal/slider', data).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  actionForEdit(data: any) {
    const dialogRef = this.dialog.open(SliderFormComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
        dropdowns: {
          institute: this.instituteDropdown,
        },
      },
    });
    dialogRef.componentInstance.onSubmitEvent.subscribe((result: any) => {
      if (result != null) {
        this.loaderService.setLoaderStatus(true);
        this.editSlider(
          this.api.getAsFormData({
            ...result.value,
            institute_id: this.selectedInstitute_id,
          }),
          data.id,
          dialogRef
        );
      }
    });
  }

  editSlider(data: any, id: number, dialog: any) {
    this.api.post(`portal/slider/${id}`, data).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response.response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
        this.loaderService.setSubmissionStatus(false);
      }
    );
  }

  deleteSlider({ id }: { id: number }, dialog: any) {
    this.api.delete(`portal/slider/`, id).subscribe(
      (response: any) => {
        this.reloadTable();
        this.showBackendMessage(response);
        this.loaderService.setLoaderStatus(false);
        dialog.close();
      },
      (error: any) => {
        this.showBackendMessage(error.error.response);
        this.loaderService.setLoaderStatus(false);
      }
    );
  }

  actionForDetails(data: any) {
    const dialogRef = this.dialog.open(SliderDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: data,
      },
    });
  }

  detailsForImage() {
    const dialogRef = this.dialog.open(ContactAboutDetailsComponent, {
      width: `${window.innerWidth}px`,
      disableClose: true,
      data: {
        data: this.aboutData,
      },
    });
  }

  openImageCropper(form: FormGroup, control: string){
    const dialogRef = this.dialog.open(ImageModifierComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      data: {ratio: 1920/1080}
    });
    dialogRef.componentInstance.onImageCrop.subscribe((result: any) => {
      form.controls[control].setValue(result);
    })
  }

  actionForDragDrop(data: any[]){
    console.log(data);
    this.sliderOrderForm = data;
  }

  toggleReorder(){
    if(this.tableButtons.length === 4){
      this.tableButtons = this.tableButtons.slice(0,3);
    }else{
      this.tableButtons.push({
        tooltip: 'Drag & Drop',
        action: 'drag_drop',
        icon: 'drag_indicator',
        color: 'primary',
      })
    }
  }

  saveOrdering(){
    let postData: any = {
      institute_id: this.selectedInstitute_id,
      sliders: this.sliderOrderForm
    }
    this.api.post('portal/slide-order', postData).subscribe((response: any) => {
      this.showBackendMessage(response.response);
      this.reloadTable();
      this.toggleReorder();
    })
  }
}
