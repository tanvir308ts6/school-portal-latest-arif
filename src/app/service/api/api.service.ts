import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from "@angular/common/http";
import {StorageService} from "../storage/storage.service";
import {HelperService} from "../helper/helper.service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string;
  private readonly apiUrl: string;
  private headers = {};
  private fileHeader = {};

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private helper: HelperService,
    private router: Router
    ) {
    this.baseUrl = environment.base_url;
    this.apiUrl = environment.api_url+"api/";

    this.router.events.subscribe((event: any) => {
      if(event instanceof NavigationStart){
        // console.log('route change start');
        this.storage.setFilterData({pageIndex: 1, pageSize: 10, filterData: '', search: 'clear'})
      }else if(event instanceof NavigationEnd){
        // console.log('route change end');
      }else if(event instanceof NavigationError){
        // console.log('route change error');
      }
    })
  }

  getPageData = {
    size: 10,
    pageSizeOptions: [10, 25, 50, 100, 200],
    sort: "createdAt%2Cdesc"
  };

  getSearchData(data: any) {
    let searchString: string = "";
    if (data) {
      for(let [key, value] of Object.entries(data)){
        if(searchString == ""){
          if(typeof value == 'string' && value != '' && key != 'approval_status'){
            searchString = `${key} like '%${value}%'`;
          }else if(typeof value == 'number' && value){
            searchString = `${key}=${value}`;
          }else if(key == 'approval_status' && value && value != ''){
            searchString = `${key}='${value}'`;
          }
        }else{
          if(typeof value == 'string' && value != '' && key != 'approval_status'){
            searchString = `${searchString} and ${key} like '%${value}%'`;
          }else if(typeof value == 'number' && value){
            searchString = `${searchString} and ${key}=${value}`;
          }else if(key == 'approval_status' && value && value != ''){
            searchString = `${searchString} and ${key}='${value}'`;
          }
        }
      }
      searchString = encodeURIComponent(searchString);
    }
    return searchString;
  }

  getAsFormData(data: any, before_string?: string, form_data?: FormData): any{
    let formData = new FormData();
    for(let [key, value] of Object.entries(data)){
      if(value && JSON.stringify(value)!='[{},null]' && !Array.isArray(value)){
        if(form_data){
          form_data.append(`${before_string}[${key}]`, data[key]);
        }else{
          formData.append(key, data[key]);
        }
      }else if(Array.isArray(value)){
        value.forEach((val: any, index: number) => {
          this.getAsFormData(val, `${key}[${index}]`, formData);
        })
      }
    }
    return formData;
  }

  getFilterData(data: any, forEdutube?: boolean,optional?: boolean) {
    const filterStorageData = this.storage.getFilterData();
    let filterData = {
      "size": this.getPageData.size,
      "page": 1,
      "paginateStartNo": 0,
      "searchData": "",
      "filterData": "",
    };
    if (filterStorageData && filterStorageData["pageSize"]) {
      filterData.size = filterStorageData["pageSize"];
      filterData.page = filterStorageData["pageIndex"];
      filterData.paginateStartNo = (filterData.page-1) * filterData.size;
    }
    let pagination = "";
    // @ts-ignore
    if (data && data["pagination"])
      pagination = `?page=${filterData.page - (forEdutube ? 1 : 0)}&size=${filterData.size}`;//&sort=${this.getPageData.sort}`;
    let sort = "";
    // @ts-ignore
    if (data && data["sort"])
      { // @ts-ignore
        sort = `&sort=${data["sort"]}`;
      }
      let session_id = "";
      if (data && data["session_id"])
        { // @ts-ignore
          session_id = `&session_id=${data["session_id"]}`;
        }
         let assignment_id = "";
      if (data && data["assignment_id"])
        { // @ts-ignore
          assignment_id = `&assignment_id=${data["assignment_id"]}`;
        }
        let date = "";
        if (data && data["date"])
          { // @ts-ignore
            date = `date=${data["date"]}`;
          }
        let search = ""
        // @ts-ignore
        if (data && data["search"] && filterStorageData) {
          search = filterStorageData["search"] ? `&search=${filterStorageData["search"]}` : "";
        }

        // @ts-ignore
        filterData["searchData"] = pagination + sort + session_id + date + assignment_id + search ;
        // @ts-ignore
        filterData["filterData"] = filterStorageData && filterStorageData["filterData"] ? filterStorageData["filterData"] : "";
        return filterData;
      }

      getHeader() {
        return {headers: this.helper.getAuthHeader()};
      }

      public get(route: string): Observable<any> {
        const url = this.apiUrl + route;
        return this.http.get(url, this.getHeader());
      }

      public async fileGet(route: string){
        const url = this.apiUrl + route;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.storage.getAccessToken()}`
          }
        }).then((result1) => {
          return result1.blob();
        }).then(async (result2) => {
          return this.blobToBase64(result2);
        });
        return response;
      }

      private blobToBase64(blob: any) {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      public post(route: string, data: any): Observable<any> {
        const url = this.apiUrl + route;
        return this.http.post(url, data, this.getHeader());
      }

      public getByParams(route: string, data: any, optional?:any): Observable<any> {
        let params = new HttpParams();
        params = data;
        const url = this.apiUrl + route;
        if(optional){
          return this.http.get(url, {params});
        }
        else
        {
          return this.http.get(url, {...this.getHeader(), params});
        }


      }
      public getWithoutPagination(route: string, data: any): Observable<any> {
        let searchString: string = "";
        if (data) {
          for(let [key, value] of Object.entries(data)){
            if(searchString == ""){
              if(typeof value == 'string' && value != '' && key != 'approval_status'){
                searchString = `${key} like '%${value}%'`;
              }else if(typeof value == 'number' && value){
                searchString = `${key}=${value}`;
              }else if(key == 'approval_status' && value && value != ''){
                searchString = `${key}='${value}'`;
              }
            }else{
              if(typeof value == 'string' && value != '' && key != 'approval_status'){
                searchString = `${searchString} and ${key} like '%${value}%'`;
              }else if(typeof value == 'number' && value){
                searchString = `${searchString} and ${key}=${value}`;
              }else if(key == 'approval_status' && value && value != ''){
                searchString = `${searchString} and ${key}='${value}'`;
              }
            }
          }
          searchString = encodeURIComponent(searchString);

        }
        console.log('searchString...............',searchString);
        let search = `?search=${searchString}`
        
        const url = this.apiUrl + route + search;
        
        return this.http.get(url, this.getHeader());


      }

      public update(route: string, data: any): Observable<any> {
        const url = this.apiUrl + route;
        return this.http.put(url, data, this.getHeader());
      }

      public delete(route: string, id: any): Observable<any> {
        const url = this.apiUrl + route + id;
        return this.http.delete(url, this.getHeader());
      }

      public login(route: string, data: any): Observable<any> {
        const url = this.apiUrl + route;
        return this.http.post(url, data);
      }

      public saveWithoutToken(route: string, data: any): Observable<any> {
        const url = this.apiUrl + route;
        return this.http.post(url, data);
      }

      public getFileData(route: string): Observable<any>{
        const url = this.baseUrl + route;
        return this.http.get(url);
      }

    }
