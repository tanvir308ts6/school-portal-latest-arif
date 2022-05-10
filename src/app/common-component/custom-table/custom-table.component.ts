import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiUrlService } from 'src/app/service/api-url/api-url.service';
import { ApiService } from 'src/app/service/api/api.service';
import { DataComService } from 'src/app/service/data-com/data-com.service';
import { HelperService } from 'src/app/service/helper/helper.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit {
  @Input() table_data_api: any;
  @Input() table_structure: any;
  @Input() search_param: any;
  @Input() table_buttons: any[] = [];
  @Input() reload: boolean = false;
  @Input() forEdutube: boolean = false;
  @Input() no_pagination_details: boolean = false;
  @Input() query_string: any;
  @Input() first_reload_off: boolean = false;
  @Input() unable_to_select: any;
  @Input() selected_items: any;
  @Input() sort_by: string = '';
  @Input() dropdowns: any;

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  selection = new SelectionModel<any>(true, []);

  searchString: string = '';
  size: number = 10;
  page: number = 1;
  total: number | null = null;
  paginateStartNo: number = 0;
  loaderStatus: boolean = false;
  loaderValue: number = 0;

  @Output() actions: EventEmitter<any> = new EventEmitter();

  get drag_drop(): boolean {
    return this.table_buttons.find(
      (button: any) => button.action === 'drag_drop'
    )
      ? true
      : false;
  }

  constructor(
    private api: ApiService,
    private api_url: ApiUrlService,
    private data_com: DataComService,
    private helper: HelperService,
    private loader: LoaderService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    // this.getTableData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes?.table_data_api?.currentValue ||
        changes?.table_structure?.currentValue ||
        changes?.reload?.currentValue) &&
      !this.first_reload_off
    ) {
      this.getTableData();
    }
    // if(changes?.selected_items?.currentValue){
    //   this.preselectDatas(this.dataSource.data);
    // }
  }

  changePagination(event: any) {
    let pageData = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
    };
    this.storage.setFilterData(pageData);
    this.getTableData();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let tempData: any[] = [];
    this.dataSource.data.forEach((tada: any) => {
      tempData.push(tada);
    });
    const numRows = tempData.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => {
          if (!row.selected) {
            this.selection.select(row);
          }
        });
  }

  tableSelectEvent(event: string, data?: any) {
    if (event === 'master') {
      this.masterToggle();
      this.actionEvent('select', this.selection.selected);
    } else if (event === 'slave' && data) {
      this.selection.toggle(data);
      this.actionEvent('select', this.selection.selected);
    }
  }

  checkIfDataPreselected(data: any) {
    return this?.selected_items?.items?.find(
      (tada: any) =>
        tada[this?.selected_items?.control] ===
        data[this?.selected_items?.control]
    )
      ? true
      : false;
  }

  preselectDatas(data: any[]) {
    data?.forEach((tada: any) => {
      if (this.checkIfDataPreselected(tada)) {
        this.tableSelectEvent('slave', tada);
      }
    });
  }

  checkIfDataUnableToSelect(data: any) {
    return this.unable_to_select?.items?.find(
      (tada: any) =>
        tada[this.unable_to_select?.control] ===
        data[this.unable_to_select?.control]
    )
      ? true
      : false;
  }

  setDataCheckBox(data: any[]): any[] {
    return data
      ? data.map((tada: any) => {
          return {
            ...tada,
            no_select: this.checkIfDataUnableToSelect(tada),
          };
        })
      : [];
  }

  getTableData() {
    this.loaderStatus = true;
    this.searchString = this.api.getSearchData(this.search_param) ?? '';
    this.storage.setFilterData({
      search: this.searchString ? this.searchString : 'clear',
    });
    let searchData = this.api.getFilterData(
      { pagination: true, search: true },
      this.forEdutube
    );
    this.paginateStartNo = searchData['paginateStartNo'];
    this.query_string
      ? this.api
          .getByParams(
            this.table_data_api + searchData['searchData'],
            this.query_string
          )
          .subscribe(
            (response) => {
              let response_data = this.sort_by
                ? response.data.data.sort((data1: any, data2: any) =>
                    data1[this.sort_by] > data2[this.sort_by] ? 1 : -1
                  )
                : response.data.data;
              this.dataSource = new MatTableDataSource(
                this.setDataCheckBox(response_data)
              );
              this.preselectDatas(this.dataSource.data);
              this.actionEvent('all_data', response_data);
              this.total = response.data.total;
              this.loaderStatus = false;
            },
            (error) => {
              this.dataSource = new MatTableDataSource();
              this.total = null;
              this.loaderStatus = false;
            }
          )
      : this.api.get(this.table_data_api + searchData['searchData']).subscribe(
          (response) => {
            let response_data = this.sort_by
              ? response.data.data.sort((data1: any, data2: any) =>
                  data1[this.sort_by] > data2[this.sort_by] ? 1 : -1
                )
              : response.data.data;
            this.dataSource = new MatTableDataSource(
              this.setDataCheckBox(response_data)
            );
            this.preselectDatas(this.dataSource.data);
            this.actionEvent('all_data', response_data);
            this.total = response.data.total;
            this.loaderStatus = false;
          },
          (error) => {
            this.dataSource = new MatTableDataSource();
            this.total = null;
            this.loaderStatus = false;
          }
        );
  }

  actionEvent(action: string, data: any) {
    this.actions.emit({
      action: action,
      data: data,
    });
  }

  startLoader() {
    let loader = window.setInterval(() => {
      if (this.loaderStatus) {
        if (this.loaderValue <= 100) {
          this.loaderValue += 1;
        } else {
          this.loaderValue = 0;
        }
      } else {
        this.stopLoader(loader);
      }
    }, 10);
  }

  stopLoader(loader: any) {
    window.clearInterval(loader);
  }

  drop(event: CdkDragDrop<any>) {
    let tempDataSource: any[] = this.dataSource.data;
    moveItemInArray(tempDataSource, event.previousIndex, event.currentIndex);
    this.dataSource = new MatTableDataSource(tempDataSource);
    this.actionEvent(
      'drag_drop',
      this.dataSource.data.map((data: any, index: number) => {
        return {
          id: data.id,
          order: index + 1,
        };
      })
    );
  }

  // {type: 'input_field', label: '', input_type: 'text', placeholder: 'Insert Go', model: '', required: false}
  // {type: 'select_field', label: '', multiple: false, model: '', required: false, list: [], list_control: '', list_view: ''}

  isReadOnly(data: any): boolean{
    return this.selection.selected.find((tada: any) => tada['id'] === data['id']) ? false : true;
  }
}
