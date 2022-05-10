import { Component,EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkRequired } from 'src/app/directives/validation/validation.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {
  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; } | undefined;

  code: string = '';
  loaderStatus: boolean = false;
  subCategoryDropdown: any[] = [];
  onSubmitEvent = new EventEmitter();
  // statusDropdown: any[] = [
  //   {
    //     id: '0',
    //     text: 'Inactive',
    //   },
    //   {
      //     id: '1',
      //     text: 'Active',
      //   }
      // ]

      constructor(public dialog: MatDialog,
        private loaderService: LoaderService,
        public dialogRef: MatDialogRef<ViewDetailsComponent>,
        private formBuild: FormBuilder,
        public api: ApiService,
        @Inject(MAT_DIALOG_DATA) public data: any,) {



      }

      ngOnInit(): void {

        console.log("this.data.data",this.data.data);


      }



      downloadDetails() {
        this.goToLink(environment.api_url_admission+"api/"+`admission/applicant-details-pdf/${this.data.data.id}?institute_id=${this.data.data.institute.id}`)
      }
      private goToLink(url: string) {
        window.open(url);
      }
      downloadAdmitCard() {
        this.goToLink(environment.api_url_admission+"api/"+`admission/admit-card/${this.data.data.id}?institute_id=${this.data.data.institute.id}&class_id=${this.data.data.class_id}`)
      }
      private goToLinkAdmitCard(url: string) {
        window.open(url);
      }


    }
