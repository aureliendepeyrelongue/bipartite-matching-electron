<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h3>{{$t('doc.title1')}}</h3>
                <p>
                  {{$t('doc.p1')}}
                </p>
                <p>
                 {{$t('doc.p2')}}
                </p>
                <h3>{{$t('doc.title2')}}</h3>
                <p>
                  {{$t('doc.p3')}}
                </p>
                <ul>
                  <li>
                   {{$t("doc.li1")}}
                  </li>
                  <li>
                    {{$t('doc.li2')}}
                  </li>
               
                  <li>
                    {{$t('doc.li4')}}
                    
                    <ul>
                      <li>
                        {{$t('doc.li5')}}
                        
                      </li>
                      <li>{{$t('doc.li6')}}</li>
                    </ul>
                    
                    <br />
                    <strong
                      >{{$t('doc.nb1')}}</strong
                    >
                  </li>
                </ul>
                <h3>{{$t('doc.title3')}}</h3>
                <p>
                  {{$t('doc.p4')}}
                 
                  <ul>
                    <li>{{$t('doc.li8')}}</li><li>
                      {{$t('doc.li9')}}</li>
                       <li>{{$t('doc.li10')}} </li>
                       <li>{{$t('doc.li11')}}</li>
                       <li>{{$t('doc.li12')}}</li>
                       <li>{{$t('doc.li13')}}</li>
<li>{{$t('doc.li14')}}</li>
<li>{{$t('doc.li15')}}</li>
                  </ul>
                </p>
                <h3>{{$t('doc.title4')}}</h3>
                <p>
                  {{$t('doc.p5')}}
                </p>
                <p>
                  {{$t('doc.p6')}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/Page-header";
import appConfig from "../../../../app.config";
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
import ConstraintForm from "@/components/ConstraintForm";
import ConstraintDetails from "@/components/ConstraintDetails";

export default {
  components: {
    Layout,
    PageHeader,
    ConstraintForm,
    ConstraintDetails,
  },
  page: {
    title: "Bmatch",
    meta: [{ name: "description", content: appConfig.description }],
  },

  computed: {
    ...mapState({
      constraints: (state) =>
        JSON.parse(JSON.stringify(state.project.base.constraints)),
    }),

    title() {
      return this.$t("doc.title");
    },

    constraintsFormatted() {
      return this.constraints.map((c) => {
        return {
          ...c,
          content:
            c.content && c.content.length > this.maxStringSize
              ? c.content.substring(0, this.maxStringSize) + "..."
              : c.content,
          description:
            c.description && c.description.length > this.maxStringSize
              ? c.description.substring(0, this.maxStringSize) + "..."
              : c.description,
        };
      });
    },

    necessaryConstraints() {
      return this.constraintsFormatted.filter((c) => c.type === "necessary");
    },

    secondaryConstraints() {
      return this.constraintsFormatted.filter((c) => c.type === "secondary");
    },

    items() {
      return [
        {
          text: "Bmatch",
          href: "/",
        },
        {
          text: this.$t("doc.documentation"),
          href: "/",
        },
        {
          text: this.$t("doc.title"),
          active: true,
        },
      ];
    },
  },
  data() {
    return {
      maxStringSize: 40,
      selectedConstraint: {},
      subpage: "home",
      pendingAlert: false,
      pendingRequest: {
        mode: "",
        form: {},
      },
      askingValidation: false,
      sendValidation: true,
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      ipcRenderer.removeAllListeners("constraint-validation-response");
      ipcRenderer.on(
        "constraint-validation-response",
        (event, validationResponse) => {
          if (validationResponse.message === "validation-success") {
            if (this.pendingRequest.mode === "add") {
              ipcRenderer.send("add-constraint", this.pendingRequest.form);
            } else if (this.pendingRequest.mode === "edit") {
              ipcRenderer.send("edit-constraint", this.pendingRequest.form);
            }
            this.subpage = "home";
          } else {
            this.$bvToast.toast(this.$t("constraints.wrongSyntaxMessage"), {
              title: this.$t("common.syntaxError"),
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: true,
            });
          }
          this.askingValidation = false;
        }
      );
    },
    seeDetails(c) {
      this.selectedConstraint = this.constraints.find((c2) => c2.id === c.id);
      this.subpage = "seedetails";
    },
    handleEditMode(c) {
      this.selectedConstraint = this.constraints.find((c2) => c2.id === c.id);
      this.subpage = "edit";
    },
    deleteConstraint(c) {
      ipcRenderer.send("delete-constraint", c.id);
    },
    handleConstraintFormSave(form) {
      if (!this.askingValidation) {
        this.askingValidation = true;
        this.pendingRequest = {
          mode: "add",
          form,
        };
        ipcRenderer.send("ask-constraint-validation", form.content);
      }
    },
    handleConstraintFormCancel() {
      this.subpage = "home";
    },
    handleConstraintFormEdit(form) {
      if (!this.askingValidation) {
        this.askingValidation = true;
        this.pendingRequest = {
          mode: "edit",
          form,
        };
        ipcRenderer.send("ask-constraint-validation", form.content);
      }
    },
    addConstraint() {
      this.subpage = "add";
    },
  },

  middleware: "router-auth",
};
</script>

<style scoped>
#container {
  height: 200px;
}
</style>
