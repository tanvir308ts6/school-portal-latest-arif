import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { AdmissionCircularComponent } from './admission-circular/admission-circular.component';
import { AdmissionCircularFormComponent } from './admission-circular/admission-circular-form/admission-circular-form.component';
import { ApproveDialogComponent } from './admission-circular/approve-dialog/approve-dialog.component';
import { UploadApplicationFormComponent } from './admission-circular/upload-application-form/upload-application-form.component';
import { AdmissionClassComponent } from './admission-class/admission-class.component';
import { AdmissionClassFormComponent } from './admission-class/admission-class-form/admission-class-form.component';
import { AdmitCardComponent } from './admit-card/admit-card.component';
import { AdmitCardFormComponent } from './admit-card/admit-card-form/admit-card-form.component';
import { AppliedStudentListComponent } from './applied-student-list/applied-student-list.component';
import { ViewDetailsComponent } from './applied-student-list/view-details/view-details.component';
import { ApproveElegibleStudentComponent } from './applied-student-list/approve-elegible-student/approve-elegible-student.component';
import { AdmitStudentComponent } from './applied-student-list/admit-student/admit-student.component';
import { AdmissionApplyStaffComponent } from './applied-student-list/admission-apply-staff/admission-apply-staff.component';

const routes: Routes = [
  {
    path: 'circular',
    component: AdmissionCircularComponent,
  },
  {
    path: 'class',
    component: AdmissionClassComponent,
  },
  {
    path: 'admit-card',
    component: AdmitCardComponent,
  },
  {
    path: 'applied-student-list',
    component: AppliedStudentListComponent,
  },
];
@NgModule({
  declarations: [
    AdmissionCircularComponent,
    AdmissionCircularFormComponent,
    ApproveDialogComponent,
    UploadApplicationFormComponent,
    AdmissionClassComponent,
    AdmissionClassFormComponent,
    AdmitCardComponent,
    AdmitCardFormComponent,
    AppliedStudentListComponent,
    ViewDetailsComponent,
    ApproveElegibleStudentComponent,
    AdmitStudentComponent,
    AdmissionApplyStaffComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
  ],
})
export class AdmissionModule {}
