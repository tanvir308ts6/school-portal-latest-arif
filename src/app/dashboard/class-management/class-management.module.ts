import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { SubjectMaterialComponent } from './subject-material/subject-material.component';
import { SubjectMaterialFormComponent } from './subject-material/subject-material-form/subject-material-form.component';
import { SubjectMaterialDetailsComponent } from './subject-material/subject-material-details/subject-material-details.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AssignmentFormComponent } from './assignment/assignment-form/assignment-form.component';
import { ViewDetailsComponent } from './assignment/view-details/view-details.component';
import { ClassSubjectDetailsComponent } from './class-subject-details/class-subject-details.component';
import { ClassSubjectListComponent } from './class-subject-list/class-subject-list.component';
import { AssignmentSolutionComponent } from './assignment/assignment-solution/assignment-solution.component';
import { ViewSolutionListComponent } from './assignment/view-solution-list/view-solution-list.component';
import { ClassSubjectTeacherComponent } from './class-subject-teacher/class-subject-teacher.component';
import { ClassSubjectTeacherFormComponent } from './class-subject-teacher/class-subject-teacher-form/class-subject-teacher-form.component';
import { ClassSubjectStudentComponent } from './class-subject-student/class-subject-student.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { PipeModule } from 'src/app/pipes/pipe/pipe.module';
import { ClassRoutineComponent } from './class-routine/class-routine.component';
import { RoutineFormComponent } from './class-routine/routine-form/routine-form.component';
import { RoutineTeacherComponent } from './class-routine/routine-teacher/routine-teacher.component';
import { RoutineStudentComponent } from './class-routine/routine-student/routine-student.component';
import { RoutineStudentNewComponent } from './class-routine/routine-student-new/routine-student-new.component';
import { SessionalLandingComponent } from './sessional-landing/sessional-landing.component';
import { TimeslotFormComponent } from './class-routine/timeslot-form/timeslot-form.component';
import { ClassSectionComponent } from './class-section/class-section.component';
import { ClassSectionFormComponent } from './class-section/class-section-form/class-section-form.component';
import { ClassSectionSubjectFormComponent } from './class-section/class-section-subject-form/class-section-subject-form.component';
import { ClassSectionDetailsComponent } from './class-section-details/class-section-details.component';
import { OfferedClassComponent } from './offered-class/offered-class.component';
import { OfferedClassFormComponent } from './offered-class/offered-class-form/offered-class-form.component';
import { OfferedClassDetailsComponent } from './offered-class-details/offered-class-details.component';
import { DailyAttendanceComponent } from './daily-attendance/daily-attendance.component';
import { GiveAttendanceFormComponent } from './daily-attendance/give-attendance-form/give-attendance-form.component';
import { ManualClassAttendanceComponent } from './manual-class-attendance/manual-class-attendance.component';
import { DailyAttendanceReportComponent } from './daily-attendance-report/daily-attendance-report.component';
import { EnrollSectionOfferdSectionComponent } from './enroll-section-offerd-section/enroll-section-offerd-section.component';
import { EnrollStudentSectionComponent } from './enroll-student-section/enroll-student-section.component';

const routes: Routes = [
  {
    path: '',
    component: SessionalLandingComponent,
    children: [
      {
        path: 'subject-material',
        component: SubjectMaterialComponent,
      },
      {
        path: 'assignment',
        component: AssignmentComponent,
      },
      {
        path: 'class-subject-details',
        component: ClassSubjectDetailsComponent,
      },
      {
        path: 'class-subject',
        component: ClassSubjectListComponent,
      },
      {
        path: 'subject-teacher',
        component: ClassSubjectTeacherComponent,
      },
      {
        path: 'subject-student',
        component: ClassSubjectStudentComponent,
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
      },
      {
        path: 'class-routine',
        component: ClassRoutineComponent,
      },
      {
        path: 'class-section',
        component: ClassSectionComponent,
      },
      {
        path: 'class-section-details',
        component: ClassSectionDetailsComponent,
      },
      {
        path: 'class',
        component: OfferedClassComponent,
      },
      {
        path: 'class-details',
        component: OfferedClassDetailsComponent,
      },
      {
        path: 'daily-attendance',
        component: DailyAttendanceComponent,
      },
      {
        path: 'manual-class-attendance',
        component: ManualClassAttendanceComponent,
      },
      {
        path: 'daily-attendance-report',
        component: DailyAttendanceReportComponent,
      },
      {
        path: 'enroll-student-section',
        component: EnrollStudentSectionComponent,
      },
    ]
  }
];

@NgModule({
  declarations: [
    SubjectMaterialComponent,
    SubjectMaterialFormComponent,
    SubjectMaterialDetailsComponent,
    AssignmentComponent,
    AssignmentFormComponent,
    ViewDetailsComponent,
    ClassSubjectDetailsComponent,
    ClassSubjectListComponent,
    AssignmentSolutionComponent,
    ViewSolutionListComponent,
    ClassSubjectTeacherComponent,
    ClassSubjectTeacherFormComponent,
    ClassSubjectStudentComponent,
    AttendanceComponent,
    ClassRoutineComponent,
    RoutineFormComponent,
    RoutineTeacherComponent,
    RoutineStudentComponent,
    RoutineStudentNewComponent,
    SessionalLandingComponent,
    TimeslotFormComponent,
    ClassSectionComponent,
    ClassSectionFormComponent,
    ClassSectionSubjectFormComponent,
    ClassSectionDetailsComponent,
    OfferedClassComponent,
    OfferedClassFormComponent,
    OfferedClassDetailsComponent,
    DailyAttendanceComponent,
    GiveAttendanceFormComponent,
    ManualClassAttendanceComponent,
    DailyAttendanceReportComponent,
    EnrollSectionOfferdSectionComponent,
    EnrollStudentSectionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
    PipeModule,
  ],
})
export class ClassManagementModule {}
