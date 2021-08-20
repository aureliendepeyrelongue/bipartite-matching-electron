<template>
  <div>
    <div class="col-md-12 mt-2">
      <h4 class="mb-2">Détails de la contrainte "{{ form.name }}"</h4>
      <label for="">Nom</label>
      <p>
        {{ form.name }}
      </p>
      <label for="">Type</label>
      <p>
        {{ constraintsType[form.type] }}
      </p>
      <div v-if="form.type === 'secondary'">
        <label for="">Poids</label>
        <p>
          {{ constraintsType[form.type] }}
        </p>
      </div>
      <label for="">Contenu</label>
      <MonacoEditor
        ref="editor"
        :smallSize="form.content && form.content.length < 100"
        :content="form.content"
        :createOptions="{ readOnly: true }"
      />
      <label for="">Déscription</label>
      <p>
        {{ form.description ? form.description : "--" }}
      </p>
      <div class="text-right mt-4 mb-2">
        <b-button type="reset" variant="info" @click="$emit('on-return')"
          >Retour</b-button
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
    return {
      constraintsType: {
        necessary: "Nécessaire",
        secondary: "Secondaire",
      },
    };
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
