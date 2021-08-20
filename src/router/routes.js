import store from "@/state/store";

export default [
  {
    path: "/",
    name: "home",
    component: () => import("../views/pages/apps/tables.vue"),
  },

  {
    path: "/apps/constraints",
    name: "constraints",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/apps/constraints"),
  },
  {
    path: "/apps/tables",
    name: "tables",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/apps/tables"),
  },
  {
    path: "/apps/matching",
    name: "matching",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/pages/apps/matching"),
  },
];
