import { environment } from '../../../../environments/environment';

export const menuList: any[] = [
  // Dashboard
  {
    parentId: 1,
    name: 'Dashboard',
    path: '/dashboard',
    parentPosition: 0,
    icon: 'dashboard.png',
    location: 'sideBar',
    hasChildren: null,
  },
  {
    parentId: 4,
    name: 'Web Portal',
    path: '/dashboard/admin-web-portal',
    parentPosition: 2,
    icon: 'web-portal.png',
    location: 'sideBar',
    hasChildren: null,
    permissions: [
      {
        id: 1,
        name: 'Slider, Contact & About',
        path: '/dashboard/admin-web-portal/slider-about-contact',
        icon: 'web-portal-config.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Welcome Message & Governing Body',
        path: '/dashboard/admin-web-portal/welcome-govern',
        icon: 'web-portal-config.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        name: 'Notice',
        path: '/dashboard/admin-web-portal/notice',
        icon: 'web-portal-config.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Event',
        path: '/dashboard/admin-web-portal/event',
        icon: 'web-portal-config.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'User Mails',
        path: '/dashboard/admin-web-portal/portal-user-message',
        icon: 'portal-user-message.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
    ],
  },
  {
    parentId: 4,
    name: 'User Management',
    path: '/dashboard/user',
    parentPosition: 2,
    icon: 'team(2).png',
    location: 'sideBar',
    hasChildren: null,
    permissions: [
      {
        id: 1,
        name: 'Teacher',
        path: '/dashboard/user/employee',
        icon: 'attendance.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Staff',
        path: '/dashboard/user/staff',
        icon: 'attendance.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Student',
        path: '/dashboard/user/student',
        icon: 'attendance.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
    ],
  },
  {
    parentId: 4,
    name: 'Student Enrollment',
    path: '/dashboard/student-enrollment',
    parentPosition: 2,
    icon: 'student-enrollment.png',
    location: 'sideBar',
    hasChildren: null,
  },
  
  // {
  //   parentId: 4,
  //   name: 'Student Section Change',
  //   path: '/dashboard/student-enrollment/section-change',
  //   parentPosition: 2,
  //   icon: 'student-enrollment.png',
  //   location: 'sideBar',
  //   hasChildren: null,
  // },
  {
    parentId: 4,
    name: 'Admission',
    path: '/dashboard/admission',
    parentPosition: 2,
    icon: 'category.png',
    location: 'sideBar',
    hasChildren: null,
    permissions: [
      {
        id: 1,
        name: 'Circular',
        path: '/dashboard/admission/circular',
        icon: 'time.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Admission Class',
        path: '/dashboard/admission/class',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Version',
        path: '/dashboard/admission/version',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Admit Card',
        path: '/dashboard/admission/admit-card',
        icon: 'category.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Applied student list',
        path: '/dashboard/admission/applied-student-list',
        icon: 'attendance.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
    ],
  },
  {
    parentId: 4,
    name: 'Class Management',
    path: '/dashboard/class-management',
    parentPosition: 2,
    icon: 'class-management.png',
    location: 'sideBar',
    hasChildren: null,
    permissions: [
      {
        id: 1,
        name: 'Class',
        path: '/dashboard/class-management/class',
        icon: 'class-section.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Class Details',
        path: '/dashboard/class-management/class-details',
        icon: 'class-section.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Section',
        path: '/dashboard/class-management/class-section',
        icon: 'class-section.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Section Details',
        path: '/dashboard/class-management/class-section-details',
        icon: 'class-section.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Student Enroll',
        path: '/dashboard/class-management/enroll-student-section',
        icon: 'class-section.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },

      {
        id: 1,
        name: 'Class Routine',
        path: '/dashboard/class-management/class-routine',
        icon: 'class-routine.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Class Subject',
        path: '/dashboard/class-management/class-subject',
        icon: 'class-subject-list.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 3,
        name: 'Subject Details',
        path: '/dashboard/class-management/class-subject-details',
        icon: 'class-subject-details.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 3,
        name: 'Subject Teacher',
        path: '/dashboard/class-management/subject-teacher',
        icon: 'subject-teacher.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Subject Material',
        path: '/dashboard/class-management/subject-material',
        icon: 'subject-material.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 2,
        name: 'Assignment',
        path: '/dashboard/class-management/assignment',
        icon: 'assignment.png',
        position: 2,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 2,
        name: 'Attendance Report(Live Class)',
        path: '/dashboard/class-management/attendance',
        icon: 'attendance.png',
        position: 2,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
       {
        id: 2,
        name: 'Daily Attendance',
        path: '/dashboard/class-management/daily-attendance',
        icon: 'attendance.png',
        position: 2,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
       {
        id: 2,
        name: 'Daily Attendance report',
        path: '/dashboard/class-management/daily-attendance-report',
        icon: 'attendance.png',
        position: 2,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 2,
        name: 'Class Attendance',
        path: '/dashboard/class-management/manual-class-attendance',
        icon: 'attendance.png',
        position: 2,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
    ]
  },
  {
    parentId: 4,
    name: 'Settings',
    path: '/dashboard/settings',
    parentPosition: 2,
    icon: 'team(2).png',
    location: 'sideBar',
    hasChildren: null,
    permissions: [
     {
        id: 1,
        name: 'Country',
        path: '/dashboard/settings/country',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Division',
        path: '/dashboard/settings/division',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'District',
        path: '/dashboard/settings/district',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Upazila',
        path: '/dashboard/settings/thana',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Union Parishads',
        path: '/dashboard/settings/post-office',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Organization type',
        path: '/dashboard/settings/organization-type',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Institute',
        path: '/dashboard/settings/institute',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Session',
        path: '/dashboard/settings/session',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },

      {
        id: 1,
        name: 'Group',
        path: '/dashboard/settings/group',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },

      {
        id: 1,
        name: 'Educational level',
        path: '/dashboard/settings/educational-level',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Class',
        path: '/dashboard/settings/class',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Designation',
        path: '/dashboard/settings/designation',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Section',
        path: '/dashboard/settings/section',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Religion',
        path: '/dashboard/settings/religion',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Subject',
        path: '/dashboard/settings/subject',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Bank',
        path: '/dashboard/settings/bank',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
       {

        id: 1,
        name: 'Shift',
        path: '/dashboard/settings/shift',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
      {
        id: 1,
        name: 'Version',
        path: '/dashboard/settings/version',
        icon: 'leave-apply.png',
        position: 1,
        isMaintenance: null,
        adminPermission: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        permissionParentId: null,
        permissionParentName: null,
        serviceActions: null,
      },
    ],

  },
    {
    parentId: 4,
    name: 'Content Management',
    path: '/dashboard/content-management/content',
    parentPosition: 2,
    icon: 'content-management.png',
    location: 'sideBar',
    hasChildren: null
  }
];
