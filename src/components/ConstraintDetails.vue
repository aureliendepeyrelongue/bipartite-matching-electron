<template>
  <div>
    <div class="col-md-12 mt-2">
      <h4 class="mb-2">
        {{ $t("constraints.constraintDetails") }} "{{ form.name }}"
      </h4>
      <label for="">{{ $t("common.name") }}</label>
      <p>
        {{ form.name }}
      </p>
      <label for="">{{ $t("common.type") }}</label>
      <p>
        {{ constraintsType[form.type] }}
      </p>
      <div v-if="form.type === 'secondary'">
        <label for="">{{ $t("constraints.weight") }}</label>
        <p>
          {{ constraintsType[form.type] }}
        </p>
      </div>
      <label for="">{{ $t("common.content") }}</label>
      <MonacoEditor
        ref="editor"
        :smallSize="form.content && form.content.length < 100"
        :content="form.content"
        :createOptions="{ readOnly: true }"
      />
      <label for="">{{ $t("common.description") }}</label>
      <p>
        {{ form.description ? form.description : "--" }}
      </p>
      <div class="text-right mt-4 mb-2">
        <b-button type="reset" variant="info" @click="$emit('on-return')">
          {{ $t("common.back") }}</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from "@/components/MonacoEditor";

export default {
  components: {
    MonacoEditor,
  },
  props: {
    editMode: {
      type: Boolean,
    },
    form: {
      type: Object,
    },
  },
  data() {
    return {};
  },

  computed: {
    constraintsType() {
      return {
        necessary: this.$t("constraints.necessary"),
        secondary: this.$t("constraints.secondary"),
      };
    },
  },

  watch: {
    form: {
      handler() {
        if (!this.form.weight && this.form.type === "secondary") {
          this.form.weight = 5;
        } else if (this.form.type === "necessary") {
          delete this.form.weight;
        }
      },
      deep: true,
    },
  },

  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.form.content = this.$refs.editor.getEditorValue();
      if (this.editMode) {
        this.$emit("on-edit", this.form);
      } else {
        this.$emit("on-save", this.form);
      }
    },
  },
};
</script>
