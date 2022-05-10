import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from '../mat/mat.module';
import { LayoutModule } from '../layout/layout.module';
import { CommonComponentModule } from '../common-component/common-component.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
        // canActivate: [DashboardGuardGuard]
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        // canActivate: [DashboardGuardGuard]
      },
      {
        path: 'admin-web-portal',
        loadChildren: () =>
          import('./web-portal/web-portal.module').then(
            (m) => m.WebPortalModule
          ),
        // canActivate: [DashboardGuardGuard]
      },
      {
        path: 'admission',
        loadChildren: () =>
          import('./admission/admission.module').then((m) => m.AdmissionModule),
        // canActivate: [DashboardGuardGuard]
      },
      {
        path: 'content-management',
        loadChildren: () =>
          import('./content-archive/content-archive.module').then(
            (m) => m.ContentArchiveModule
          ),
        // canActivate: [DashboardGuardGuard]
      },
      {
        path: 'class-management',
        loadChildren: () => 
          import('./class-management/class-management.module').then(
            (m) => m.ClassManagementModule
          )
      },
      {
        path: 'student-enrollment',
        loadChildren: () => 
          import('./student-enrollment/student-enrollment.module').then(
            (m) => m.StudentEnrollmentModule
          )
      }
    ],
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    LayoutModule,
    CommonComponentModule,
  ],
})
export class DashboardModule {}
