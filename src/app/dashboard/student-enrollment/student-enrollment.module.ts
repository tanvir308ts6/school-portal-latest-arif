import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { PromoteStudentFormComponent } from './enroll-student/promote-student-form/promote-student-form.component';
import { SectionChangeFormComponent } from './enroll-student/section-change-form/section-change-form.component';
import { InstitutionalLayoutComponent } from './institutional-layout/institutional-layout.component';
import { SectionChangeComponent } from './section-change/section-change.component';
// import { SectionChangeFormComponent } from './section-change/section-change-form/section-change-form.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionalLayoutComponent,
    children: [
      {
        path: '',
        component: EnrollStudentComponent
      },
       {
        path: 'section-change',
        component: SectionChangeComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    EnrollStudentComponent,
    PromoteStudentFormComponent,
    // SectionChangeFormComponent,
    InstitutionalLayoutComponent,
    SectionChangeComponent,
    SectionChangeFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
  ]
})
export class StudentEnrollmentModule { }
