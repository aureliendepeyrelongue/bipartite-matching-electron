<template>
  <div>
    <b-form @submit="onSubmit">
      <div class="row">
        <div class="col-sm-6">
          <b-form-group id="input-group-1" label="Nom" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="formModel.name"
              required
              type="text"
              placeholder="Nom"
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
            id="input-group-3"
            label="Type de contrainte"
            label-for="input-3"
          >
            <b-form-select
              id="input-3"
              v-model="formModel.type"
              required
              :options="constraintsType"
            ></b-form-select>
          </b-form-group>
        </div>

        <div v-if="formModel.type === 'secondary'" class="col-sm-3">
          <b-form-group
            id="input-group-1"
            label="Poids de la contrainte"
            :disabled="true"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model.number="formModel.weight"
              type="number"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>

      <label>Contenu</label>
      <MonacoEditor ref="editor" :content="formModel.content" />
      <label for="">Description</label>
      <b-form-textarea
        id="textarea"
        v-model="formModel.description"
        placeholder="Décrivez la contrainte afin de faciliter sa lecture (ou relecture)."
        rows="3"
        max-rows="6"
      ></b-form-textarea>

      <div class="text-right mt-4">
        <b-button type="submit" class="mr-1" variant="primary"
          >Enregistrer</b-button
        >
        <b-button type="reset" variant="danger" @click="$emit('on-cancel')"
          >Annuler</b-button
        >
      </div>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ formModel }}</pre>
    </b-card>
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
      constraintsType: [
        { text: "Nécessaire", value: "necessary" },
        { text: "Secondaire", value: "secondary" },
      ],
    };
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
