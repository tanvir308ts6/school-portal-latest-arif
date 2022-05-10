import { Component, OnInit,Inject } from '@angular/core';
import { LoaderService } from 'src/app/service/loader/loader.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
@Component({
  selector: 'app-view-details-form',
  templateUrl: './view-details-form.component.html',
  styleUrls: ['./view-details-form.component.scss']
})
export class ViewDetailsFormComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data.data)
  }

}
