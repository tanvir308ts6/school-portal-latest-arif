import { Component, OnInit, Inject } from '@angular/core';
import { LoaderService } from 'src/app/service/loader/loader.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
})
export class ViewDetailsComponent implements OnInit {
  imageData: any = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService
  ) {}

  ngOnInit(): void {
    let content_id = this.data.data.attachment_id;
    this.api.get(`content/${content_id}`).subscribe((response) => {
      console.log('response', response);
    });
    // this.loaderService.setSubmissionStatus(true);
  }
}
