import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-details-form.component.scss']
})
export class UserDetailsFormComponent implements OnInit {

  @Input() table_data: any;
  parentTable: any[] = [];
  style: any = {
    width: '200px',
    height: 'auto'
  }

  constructor() { }

  ngOnInit(): void {
    this.parentTable = this.table_data.tableData;
  }

  objectToArray(obj: any){
    return Object.entries(obj);
  }

  hasKey(key: string, obj: any): boolean{
    return key in obj;
  }

}
