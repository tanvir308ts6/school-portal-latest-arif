import { Component, OnInit,Inject } from '@angular/core';
import { LoaderService } from 'src/app/service/loader/loader.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-view-event-details',
  templateUrl: './view-event-details.component.html',
  styleUrls: ['./view-event-details.component.scss']
})
export class ViewEventDetailsComponent implements OnInit {
constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data.data)
  }

}