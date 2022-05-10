import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { checkRequired } from 'src/app/directive/validation/custom-val.directive';
import { ApiService } from 'src/app/service/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackberMessageComponent } from 'src/app/common-component/snackber-message/snackber-message.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  dataForm: FormGroup;
  imageUrl: string = `../../../${environment.asset_prefix}assets/images/login/login_icon_square.png`;
  message: string = '';
  loaderStatus: boolean = false;
  passwordFieldVisibility = {
    icon: 'visibility',
    type: 'password',
  };

  constructor(
    private formBuild: FormBuilder,
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private loaderService: LoaderService
  ) {
    this.dataForm = this.formBuild.group({
      email: [],
      password: [],
    });
  }

  get curentUser(): any{
    return JSON.parse(window.localStorage.getItem('currentUser') ?? '');
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.dataForm.valid) {
      this.loaderStatus = true;
      this.api.post('login', this.dataForm.value).subscribe(
        (response) => {
          if(response[1] === 'User login successfully.'){
            this.router.navigateByUrl('/dashboard');
            localStorage.setItem("currentUser", JSON.stringify(response[0].user_info));
            window.localStorage.setItem('accessToken', response[0]?.token);
          }else{
            this.showBackendMessage({message: response[1]});
          }
        },
        (error) => {

        }
      );
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

  changeVisibility() {
    this.passwordFieldVisibility.icon =
      this.passwordFieldVisibility.icon == 'visibility'
        ? 'visibility_off'
        : 'visibility';
    this.passwordFieldVisibility.type =
      this.passwordFieldVisibility.type == 'password' ? 'text' : 'password';
  }

  // parseJwt(token) {
  //   var base64Url = token.split('.')[1];
  //   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   var jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split('')
  //       .map(function (c) {
  //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join('')
  //   );
  //   return JSON.parse(jsonPayload);
  // }

  setAccordingToFrontend(data: any) {
    data.name = data.user_data.userType == 'institute' ? 'Admin' : data.name;
    return data;
  }

  redirectToUrl(url: string){
    if(url === 'WEB-PTL'){
      window.location.replace(`${environment.web_portal_url}${this.curentUser?.institute?.short_name}`);
    }
  }
}
