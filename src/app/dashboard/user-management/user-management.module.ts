import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeFormComponent } from './employee/employee-form/employee-form.component';
import { StudentComponent } from './student/student.component';
import { StudentFormComponent } from './student/student-form/student-form.component';
import { StudentBulkFormComponent } from './student/student-bulk-form/student-bulk-form.component';
import { UserDetailsRootComponent } from './user-details/user-details-root/user-details-root.component';
import { ViewDetailsFormComponent } from './employee/view-details-form/view-details-form.component';
import { UserDetailsFormComponent } from './user-details/user-details-form/user-details-form.component';
import { StaffComponent } from './staff/staff.component';
import { StaffFormComponent } from './staff/staff-form/staff-form.component';
import { UserAcademicDataComponent } from './user-details/user-academic-data/user-academic-data.component';
import { UserAcademicFormComponent } from './user-details/user-academic-data/user-academic-form/user-academic-form.component';
import { UserAcademicDetailsComponent } from './user-details/user-academic-data/user-academic-details/user-academic-details.component';
const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
  },
  {
    path: 'staff',
    component: StaffComponent,
  },
  {
    path: 'student',
    component: StudentComponent,
  },
];

@NgModule({
  declarations: [EmployeeComponent, EmployeeFormComponent, StudentComponent, StudentFormComponent, StudentBulkFormComponent, UserDetailsRootComponent, ViewDetailsFormComponent, UserDetailsFormComponent, StaffComponent, StaffFormComponent, UserAcademicDataComponent, UserAcademicFormComponent, UserAcademicDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
  ],
})
export class UserManagementModule {}
