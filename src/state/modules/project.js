import { getFirebaseBackend } from "../../authUtils.js";

export const state = {
  base: {
    tables: {
      tableA: {
        empty: true,
      },
      tableB: {
        empty: true,
      },
    },
    constraints: [
      {
        name: "",
        type: "",
        content: "",
        tokens: [],
        description: "",
      },
    ],
    matchingResult: {
      pairs: [],
      rejectedA: [],
      rejectedB: [],
    },
  },
};

export const mutations = {
  SET_PROJECT_BASE(state, base) {
    state.base = base;
  },
};

export const getters = {};

export const actions = {};
