import { Notify } from 'quasar'

const routes = [
  {
    path: "/login-layout",
    component: () => import("layouts/LogInLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("src/pages/LogIn.vue"),
        name: "Login",
      }
    ]
  },
  {
    path: "/staff-layout",
    component: () => import("layouts/StaffLayout.vue"),
    children: [
      {
        path: "/nurse-desk",
        component: () => import("pages/staff/NurseDesk.vue"),
        name: "NurseDesk",
        meta: {
          requireLogin: true
        },
        // beforeEnter: (to, from ,next) => {
        //   if(sessionStorage.roles == 1) {
        //     next()
        //   } else {
        //     Notify.create({
        //       message: "You're not allowed to this section.",
        //       type: 'negative',
        //       position: 'top',
        //       actions: [
        //         { label: 'Dismiss', color: 'white', handler: () => { /* ... */ }}
        //       ]
        //     })
        //   }
        // }
      },
      {
        path: "/patient-list",
        component: () => import("src/pages/staff/PatientList.vue"),
        name: "PatientList",
        meta: {
          requireLogin: true
        }
      }
    ],
  },
  {
    path: "/patient-layout",
    component: () => import("layouts/PatientLayout.vue"),
    children: [
      {
        path: "/patient-login",
        component: () => import("pages/patient/PatientLogin.vue"),
        name: "PatientLogin"
      },
      {
        path: "/patient-home",
        component: () => import("pages/patient/PatientHome.vue"),
        name: "PatientHome",
        meta: {
          requireLogin: true
        },
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
