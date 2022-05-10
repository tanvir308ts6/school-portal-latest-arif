import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from 'src/app/mat/mat.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RouterModule, Routes } from '@angular/router';
import { DivisionComponent } from './division/division.component';
import { DivisionFormComponent } from './division/division-form/division-form.component';
import { DistrictComponent } from './district/district.component';
import { DistrictFormComponent } from './district/district-form/district-form.component';
import { ThanaComponent } from './thana/thana.component';
import { ThanaFormComponent } from './thana/thana-form/thana-form.component';
import { PostOfficeComponent } from './post-office/post-office.component';
import { PostOfficeFormComponent } from './post-office/post-office-form/post-office-form.component';
import { OrganizationTypeComponent } from './organization-type/organization-type.component';
import { OrganizationTypeFormComponent } from './organization-type/organization-type-form/organization-type-form.component';
import { InstituteComponent } from './institute/institute.component';
import { InstituteFormComponent } from './institute/institute-form/institute-form.component';
import { SessionComponent } from './session/session.component';
import { SessionFormComponent } from './session/session-form/session-form.component';
import { GroupComponent } from './group/group.component';
import { GroupFormComponent } from './group/group-form/group-form.component';
import { EducationalLevelComponent } from './educational-level/educational-level.component';
import { EducationalLevelFormComponent } from './educational-level/educational-level-form/educational-level-form.component';
import { ClassComponent } from './class/class.component';
import { ClassFormComponent } from './class/class-form/class-form.component';
import { CommonComponentModule } from 'src/app/common-component/common-component.module';
import { DesignationComponent } from './designation/designation.component';
import { DesignationFormComponent } from './designation/designation-form/designation-form.component';
import { SectionComponent } from './section/section.component';
import { SectionFormComponent } from './section/section-form/section-form.component';
import { ReligionComponent } from './religion/religion.component';
import { ReligionFormComponent } from './religion/religion-form/religion-form.component';
import { SubjectComponent } from './subject/subject.component';
import { SubjectFormComponent } from './subject/subject-form/subject-form.component';
import { InstituteDetailsComponent } from './institute/institute-details/institute-details.component';
import { ShiftComponent } from './shift/shift.component';
import { ShiftFormComponent } from './shift/shift-form/shift-form.component';
import { BankConfigurationComponent } from './bank-configuration/bank-configuration.component';
import { BankConfigurationFormComponent } from './bank-configuration/bank-configuration-form/bank-configuration-form.component';
import { CountryComponent } from './country/country.component';
import { CountryFormComponent } from './country/country-form/country-form.component';
import { VersionComponent } from './version/version.component';
import { VersionFormComponent } from './version/version-form/version-form.component';
import { InstitutionalSettingsComponent } from './institutional-settings/institutional-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { OfferedSectionComponent } from './offered-section/offered-section.component';
import { OfferedSectionFormComponent } from './offered-section/offered-section-form/offered-section-form.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionalSettingsComponent,
    children: [
      // {
      //   path: 'section',
      //   component: SectionComponent,
      // },
      // {
      //   path: 'offered-section',
      //   component: OfferedSectionComponent,
      // },
    ],
  },
  {
    path: '',
    component: GeneralSettingsComponent,
    children: [
      {
        path: 'section',
        component: SectionComponent,
      },
      {
        path: 'session',
        component: SessionComponent,
      },
      {
        path: 'group',
        component: GroupComponent,
      },
      {
        path: 'educational-level',
        component: EducationalLevelComponent,
      },
      {
        path: 'class',
        component: ClassComponent,
      },
      {
        path: 'designation',
        component: DesignationComponent,
      },
      {
        path: 'shift',
        component: ShiftComponent,
      },
      {
        path: 'district',
        component: DistrictComponent,
      },
      {
        path: 'division',
        component: DivisionComponent,
      },
      {
        path: 'thana',
        component: ThanaComponent,
      },
      {
        path: 'post-office',
        component: PostOfficeComponent,
      },
      {
        path: 'organization-type',
        component: OrganizationTypeComponent,
      },
      {
        path: 'institute',
        component: InstituteComponent,
      },
      {
        path: 'religion',
        component: ReligionComponent,
      },
      {
        path: 'subject',
        component: SubjectComponent,
      },
      {
        path: 'bank',
        component: BankConfigurationComponent,
      },
      {
        path: 'version',
        component: VersionComponent,
      },
      {
        path: 'country',
        component: CountryComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    DistrictComponent,
    DivisionComponent,
    DivisionFormComponent,
    DistrictFormComponent,
    ThanaComponent,
    ThanaFormComponent,
    PostOfficeComponent,
    PostOfficeFormComponent,
    OrganizationTypeComponent,
    OrganizationTypeFormComponent,
    InstituteComponent,
    InstituteFormComponent,
    SessionComponent,
    SessionFormComponent,
    GroupComponent,
    GroupFormComponent,
    EducationalLevelComponent,
    EducationalLevelFormComponent,
    ClassComponent,
    ClassFormComponent,
    DesignationComponent,
    DesignationFormComponent,
    SectionComponent,
    SectionFormComponent,
    ReligionComponent,
    ReligionFormComponent,
    SubjectComponent,
    SubjectFormComponent,
    InstituteDetailsComponent,
    ShiftComponent,
    ShiftFormComponent,
    BankConfigurationComponent,
    BankConfigurationFormComponent,
    VersionComponent,
    VersionFormComponent,
    CountryComponent,
    CountryFormComponent,
    InstitutionalSettingsComponent,
    GeneralSettingsComponent,
    OfferedSectionComponent,
    OfferedSectionFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModule,
    CKEditorModule,
    CommonComponentModule,
  ],
})
export class SettingsModule {}
