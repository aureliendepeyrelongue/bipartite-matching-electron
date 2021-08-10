<template>
  <div>
    <div ref="editor" id="editor"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as monaco from "monaco-editor";

export default {
  data() {
    return {
      editor: null,
      completionProvider: null,
      monaco,
    };
  },
  components: {},
  props: {
    content: {
      type: String,
    },
  },
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
          { token: "and-token", foreground: "F1556C", fontStyle: "bold" },
          { token: "not-token", foreground: "F1556C", fontStyle: "bold" },
        ],
      });
      this.editor = monaco.editor.create(this.$refs.editor, {
        theme: "mentoringTheme",
        value: this.content,
        language: "mentoringLanguage",
      });

      this.completionProvider = monaco.languages.registerCompletionItemProvider(
        "mentoringLanguage",
        {
          provideCompletionItems: () => {
            let suggestions = this.getSuggestions(monaco);
            return { suggestions: suggestions };
          },
        }
      );
    });
  },

  beforeDestroy() {
    this.editor.dispose();
    this.completionProvider.dispose();
  },
  computed: {
    ...mapState({
      base: (state) => state.project.base,
    }),
  },

  methods: {
    getEditorValue() {
      return this.editor.getValue();
    },

    getSuggestions(monaco) {
      const aColumns =
        this.base && this.base.tables && this.base.tables.tableA
          ? this.base.tables.tableA.columns
          : [];
      const bColumns =
        this.base && this.base.tables && this.base.tables.tableB
          ? this.base.tables.tableB.columns
          : [];
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
