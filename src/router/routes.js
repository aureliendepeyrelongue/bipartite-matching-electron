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

    component: () => import("../views/pages/apps/constraints"),
  },
  {
    path: "/apps/tables",
    name: "tables",

    component: () => import("../views/pages/apps/tables"),
  },
  {
    path: "/apps/matching",
    name: "matching",

    component: () => import("../views/pages/apps/matching"),
  },
  {
    path: "/doc/doc",
    name: "doc",
    component: () => import("../views/pages/doc/doc"),
  },
];
