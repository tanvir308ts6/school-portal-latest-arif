import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoaderService } from 'src/app/service/loader/loader.service';

export interface DialogData {
  animal: string;
  name: string;
  title:string;
  leftBtn:string;
  rightBtn:string;
  leftBtnIcon:string;
  rightBtnIcon:string;
}


@Component({
  selector: 'app-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.scss']
})
export class ApproveDialogComponent implements OnInit {
  loaderStatus: boolean = false;
  onSubmitEvent = new EventEmitter();
  constructor(public dialogRef: MatDialogRef<ApproveDialogComponent>,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.loaderService.loaderControl.subscribe((data)=>{
      this.loaderStatus = data;
    })
  }
   onYesClick(): void {
    this.onSubmitEvent.emit({status:'Approved'});
  }

  closeModal(): void {
    this.onSubmitEvent.emit({status:0});
  }
}
