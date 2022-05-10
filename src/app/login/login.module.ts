import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {MatModule} from "../mat/mat.module";
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { NgxCaptchaModule } from 'ngx-captcha';
const routes: Routes = [
 
  {
    path: '',
    component: LoginComponent,
    
  },
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
      MatModule,
      ReactiveFormsModule,
    CKEditorModule,
    // NgxCaptchaModule,
  ]
})
export class LoginModule { }
