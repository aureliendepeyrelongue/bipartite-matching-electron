<template>
  <div>
    <b-form @submit="onSubmit">
      <div class="row">
        <div class="col-sm-6">
          <b-form-group
            id="input-group-1"
            :label="$t('common.name')"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="formModel.name"
              required
              type="text"
              autofocus
              :placeholder="$t('common.name')"
            ></b-form-input>
          </b-form-group>
        </div>
        <div
          :class="{
            'col-sm-3': formModel.type === 'secondary',
            'col-sm-6': formModel.type === 'necessary',
          }"
        >
          <b-form-group
            id="input-group-2"
            :label="$t('constraints.constraintType')"
            label-for="input-2"
          >
            <b-form-select
              id="input-2"
              v-model="formModel.type"
              required
              :options="constraintsTypeComputed"
            ></b-form-select>
          </b-form-group>
        </div>

        <div v-if="formModel.type === 'secondary'" class="col-sm-3">
          <b-form-group
            id="input-group-3"
            :label="$t('constraints.constraintWeight')"
            :disabled="true"
            label-for="input-3"
          >
            <b-form-input
              id="input-3"
              v-model.number="formModel.weight"
              type="number"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>

      <label>{{ $t("common.content") }}</label>
      <MonacoEditor ref="editor" :content="formModel.content" />
      <label for="textarea">{{ $t("common.description") }}</label>
      <b-form-textarea
        id="textarea"
        v-model="formModel.description"
        :placeholder="$t('constraints.descriptionPlaceholder')"
        rows="3"
        max-rows="6"
      ></b-form-textarea>

      <div class="text-right mt-4">
        <b-button type="submit" class="mr-1" variant="primary">{{
          $t("common.save")
        }}</b-button>
        <b-button type="reset" variant="danger" @click="$emit('on-cancel')">{{
          $t("common.cancel")
        }}</b-button>
      </div>
    </b-form>
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
    return {
      formModel:
        this.editMode && this.form
          ? this.form
          : {
              name: "",
              type: "necessary",
              content: "",
              weight: 5,
              description: "",
            },
      constraintsType: [],
    };
  },

  computed: {
    constraintsTypeComputed() {
      return [
        { text: this.$t("constraints.necessary"), value: "necessary" },
        { text: this.$t("constraints.secondary"), value: "secondary" },
      ];
    },
  },

  watch: {
    formModel: {
      handler() {
        if (!this.formModel.weight && this.formModel.type === "secondary") {
          this.formModel.weight = 5;
        } else if (this.formModel.type === "necessary") {
          delete this.formModel.weight;
        }
      },
      deep: true,
    },
  },

  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.formModel.content = this.$refs.editor.getEditorValue();
      if (this.editMode) {
        this.$emit("on-edit", this.formModel);
      } else {
        this.$emit("on-save", this.formModel);
      }
    },
  },
};
</script>
