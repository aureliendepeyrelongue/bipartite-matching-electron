<template>
  <div ref="editor" id="editor"></div>
</template>

<script>
import { mapState } from "vuex";
import * as monaco from "monaco-editor";

export default {
  data() {
    return {
      monaco,
    };
  },
  components: {},
  props: {},
  mounted() {
    this.$nextTick(function() {
      monaco.languages.register({ id: "mentoringLanguage" });
      monaco.languages.setMonarchTokensProvider("mentoringLanguage", {
        tokenizer: {
          root: [
            ["mentee", "mentee-token"],
            ["mentor", "mentor-token"],
            [/\.([a-z])*/, "var-token"],
            [
              /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
              "string-token",
            ],
            [/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number-token"],
            ["not", "not-token"],
            ["and", "and-token"],
          ],
        },
      });
      monaco.editor.defineTheme("mentoringTheme", {
        base: "vs",
        inherit: false,
        rules: [
          { token: "mentee-token", foreground: "3BAFDA", fontStyle: "bold" },
          { token: "mentor-token", foreground: "3BAFDA", fontStyle: "bold" },
          { token: "var-token", fontStyle: "italic" },
          { token: "string-token", foreground: "F1556C", fontStyle: "italic" },
          { token: "number-token", foreground: "F1556C" },
          { token: "and-token", foreground: "1ABC9C", fontStyle: "bold" },
          { token: "not-token", foreground: "1ABC9C", fontStyle: "bold" },
        ],
      });
      monaco.editor.create(this.$refs.editor, {
        theme: "mentoringTheme",
        value: `mentee.age < mentor.age and mentee.name = mentor.name and .city = "Paris" and mentee.age not "angel"`,
        language: "mentoringLanguage",
      });
      monaco.languages.registerCompletionItemProvider("mentoringLanguage", {
        provideCompletionItems: () => {
          let suggestions = this.getSuggestions(monaco);
          return { suggestions: suggestions };
        },
      });
    });
  },

  computed: {
    ...mapState({
      base: (state) => state.project.base,
    }),
  },

  methods: {
    getSuggestions(monaco) {
      const aColumns = this.base.tables.tableA.columnNames;
      const bColumns = this.base.tables.tableB.columnNames;
      let suggestions = [];
      aColumns.forEach((col, index) => {
        suggestions.push({
          label: "mentee." + col.target,
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: "mentee." + col.target,
        });
      });
      bColumns.forEach((col, index) => {
        suggestions.push({
          label: "mentor." + col.target,
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: "mentor." + col.target,
        });
      });
      return suggestions;
    },
  },
};
</script>

<style scoped>
#editor {
  height: 300px;
}
</style>
