<template lang="pug">
el-dialog(:title="dialogTitle", :visible.sync="showDialog", width="90%", top="5%", @close="onCancel")
  el-dropdown(trigger="click", @command="addValue", :style="{marginBottom: '20px'}")
    el-button(type="success")
      span Add value
      i.el-icon-caret-bottom.el-icon--right
    el-dropdown-menu(slot="dropdown")
      el-dropdown-item(command="email_address") Email address
      el-dropdown-item(command="email_subject") Email subject
      el-dropdown-item(command="email_body") Email body
      el-dropdown-item(command="process_state_description", divided) Process state description

  el-form(v-loading.body="loading", label-position="top", label-width="120px" ref="form", :model="values")
    el-row(v-for="(value, i) in values.data", :key="value.ID")
      el-col(:sm="4")
        el-form-item(prop="key", label="")
          el-input(v-model="values.data[i].key")
      el-col(:sm="19")
        el-form-item(prop="value", label="")
          el-input(v-model="values.data[i].value", type="textarea")
      el-col(:sm="1")
        el-button(type="danger", @click="deleteValue(i)")
          i.el-icon-delete


  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="updateWorkflowValues") Update values
</template>

<script>
export default {
  name: 'ProductWorkflowValues',
  props: {},
  data () {
    return {
      apiUrl: '/products',
      url: '/products',
      loading: true,
      showDialog: false,
      values: {
        data: []
      },
      product: null,
      workflow: null
    }
  },
  computed: {
    dialogTitle () {
      if (this.product && this.workflow) {
        return 'Workflow values: ' + this.product.name + ' - ' + this.workflow.submodulesWorkflowID + ' (' + this.workflow.Submodule.name + ')'
      }
      return 'Loading'
    }
  },
  methods: {
    loadValues (productId, workflowId) {
      this.product = null
      this.workflow = null
      this.showDialog = true
      this.values.data = []
      this.loading = true
      this.$http.get(`${this.apiUrl}/${productId}`)
        .then(response => {
          this.product = response.data

          return this.$http.get(`${this.apiUrl}/${productId}/workflows/${workflowId}`)
            .then(response => {
              this.workflow = response.data

              return this.$http.get(`${this.apiUrl}/${productId}/workflows/${workflowId}/values`)
                .then(response => {
                  this.values.data = response.data
                  this.showDialog = true
                  this.loading = false
                })
            })
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error. Check console.'});
        })
    },
    addValue (key) {
      this.values.data.push({key: key, value: ''})

      // this.$http.post(`${this.apiUrl}/${this.plugin.pluginID}/instances`)
      //   .then(response => {
      //     this.loadInstances(this.plugin.pluginID)
      //   })
    },
    deleteValue (i) {
      this.values.data.splice(i, 1)
    },
    updateWorkflowValues () {
      // this.$http.put(`${this.apiUrl}/${this.product.productID}/workflows/${this.workflow.submodulesWorkflowID}/values`, {values})
      this.$http({
        url: `${this.apiUrl}/${this.product.productID}/workflows/${this.workflow.submodulesWorkflowID}/values`,
        method: 'put',
        data: this.values.data
      })
        .then(response => {
          // this.loadValues(this.product.productID, this.workflow.submodulesWorkflowID)
          this.showDialog = false
          this.loading = false
          this.$notify({title: 'Saved', message: 'Values saved successfully', type: 'success'})
        })
        .catch(err => {
          console.log(err)
          this.$notify.error({title: 'Error', message: 'Error. Check console.'});
        })
    },
    onCancel () {
      // this.showDialog = false
      this.$router.push({path: `${this.url}/${this.product.productID}/workflows`})
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadValues(to.params.id, to.params.workflowId)
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.loadValues(to.params.id, to.params.workflowId)
    next()
  }
}
</script>