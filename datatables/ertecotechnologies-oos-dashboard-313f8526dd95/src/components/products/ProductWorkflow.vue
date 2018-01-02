<template lang="pug">
.list.workflow(v-if="product", v-loading="loading")
  .list-header
    el-row
      el-col(:sm="12")
        h1 Workflow - {{ product.name }} ({{ product.token }})
      el-col(:sm="6")
        el-select(placeholder="Add submodule", @input="addWorkflow", :value="null")
          el-option(v-for="submodule in submodules", :key="submodule.submoduleID", :label="submodule.name", :value="submodule.submoduleID")

  el-table(:data="workflowsOrdered", :row-key="'submodulesWorkflowID'", ref="table")
    el-table-column(prop="submodulesWorkflowID", label="Submodule Workflow ID", :min-width="200")
    el-table-column(prop="submodulesWorkflowNext", label="Next", :min-width="200")
    el-table-column(prop="submodule.name", label="Submodule Type", :min-width="200")
    el-table-column(prop="blockers", label="Blockers", :min-width="250")
      template(slot-scope="scope")
        span {{ scope.row.blockers && scope.row.blockers.length ? scope.row.blockers.join(', ') : 'no blockers set' }}
    el-table-column(prop="actions", label="Actions", min-width="220")
      template(slot-scope="scope")
        .action-buttons
          el-button(@click="$router.push({path: `${url}/${product.productID}/workflows/${scope.row.submodulesWorkflowID}/values`})") Values
          el-button(@click="$refs.productWorkflowBlockers.showBlockers(product, workflowsOrdered, scope.$index)") Blockers
          el-button(type="danger", @click="deleteWorkflow(scope.row)") Delete

  router-link(:to="url")
    el-button(:style="{marginTop: '20px'}")
      i.el-icon-arrow-left
      span Back to products
  router-view
  product-workflow-blockers(ref="productWorkflowBlockers", @update="updateBlockers")
</template>

<script>
import Sortable from 'sortablejs'
import ProductWorkflowBlockers from './ProductWorkflowBlockers.vue'

export default {
  name: 'ProductWorkflow',
  props: {},
  data () {
    return {
      apiUrl: '/products',
      url: '/products',
      primaryKey: 'productID',
      loading: true,
      submodules: [],
      product: null,
      workflows: [],
    }
  },
  computed: {
    workflowsOrdered () {
      if (!this.workflows.length) {
        return []
      }
      let wf = this.firstWorkflow
      if (!wf) {
        return this.workflows
      }
      const workflowsOrdered = [wf]
      while(wf.submodulesWorkflowNext) {
        wf = this.workflows.find(w => w.submodulesWorkflowID === wf.submodulesWorkflowNext)
        workflowsOrdered.push(wf)
      }

      return workflowsOrdered
    },
    firstWorkflow () {
      if (this.workflows.length === 0) {
        return null
      }

      if (this.product.fk_firstSubmoduleworkflowID && this.workflows.find(w => w.submodulesWorkflowID === this.product.fk_firstSubmoduleworkflowID)) {
        return this.workflows.find(w => w.submodulesWorkflowID === this.product.fk_firstSubmoduleworkflowID)
      }

      if (this.workflows.length === 1) {
        return this.workflows[0]
      }

      const allNextIds = this.workflows.filter(w => w.submodulesWorkflowNext).map(w => w.submodulesWorkflowID)
      const notPointedWorkflows = this.workflows.filter(w => !allNextIds.includes(w.submodulesWorkflowID))

      if (notPointedWorkflows.length === 0) {
        return null
      }

      if (notPointedWorkflows.length === 1) {
        return notPointedWorkflows[0]
      }

      const pointingWorkflows = notPointedWorkflows.filter(w => w.submodulesWorkflowNext)

      if (pointingWorkflows.length === 0) {
        return this.workflows[0]
      }

      if (pointingWorkflows.length === 1) {
        return pointingWorkflows[0]
      }

      return pointingWorkflows[0]
    },
    lastWorkflow () {
      return this.workflowsOrdered.length ? this.workflowsOrdered[this.workflowsOrdered.length - 1] : null
    }
  },
  methods: {
    loadSumobules () {
      return this.$http.get(`/submodules`)
        .then(response => {
          this.submodules = response.data.records
        })
        .catch(err => {
          console.log(err)
          this.$error({title: 'Error', message: 'Error loading sumodiles. Check console.'})
        })
    },
    loadWorkflows () {
      this.loading = true
      this.workflows = []
      return this.$http.get(`/products/${this.$route.params.id}`)
        .then(response => {
          this.product = response.data
          return this.$http.get(`/products/${this.$route.params.id}/workflows`)
            .then(response => {
              // console.log(response.data)
              if (response.data && response.data.length) {
                this.workflows = response.data
              }
              this.handleSort()
              this.loading = false
            })
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error loading workflow. Check console.'});
        })
    },
    updateWorkflows () {
      return this.$http.put(`/products/${this.$route.params.id}/workflows`, this.workflowsOrdered)
        .then(response => {
          this.loadWorkflows()
        })
        .catch(err => {
          console.log(err)
        })
    },
    addWorkflow (submoduleId) {
      this.$http.post(`/products/${this.$route.params.id}/workflows`, {submoduleID: submoduleId})
        .then(response => {
          return this.loadWorkflows()
        })
        .then(response => {
          // Update after add
          this.appendUnassigned()
          this.updateWorkflows()
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteWorkflow (workflow) {
      return this.$confirm(`Delete workflow ?`, 'Delete', {
        confirmButtonText: 'Delete',
        type: 'warning',
      })
        .then(() => {
          const isFirst = workflow.submodulesWorkflowID === this.firstWorkflow.submodulesWorkflowID

          return this.$http.delete(`/products/${this.product.productID}/workflows/${workflow.submodulesWorkflowID}`)
            .then(response => {
              return this.loadWorkflows()
            })
            .then(response => {
              // Update if first is deleted
              if (isFirst) {
                this.product.fk_firstSubmoduleworkflowID = workflow.submodulesWorkflowNext
                this.appendUnassigned()
                this.updateWorkflows()
              }

              this.$notify({title: 'Deleted', message: 'Record deleted', type: 'success'})
            })
            .catch(err => {
              console.log(err)
              this.$notify.error({title: 'Error', message: 'Error deleting record. Check console.'})
            })
        })
        .catch(() => {

        })
    },
    appendUnassigned () {
      this.workflows.forEach(wf => {
        if (!this.workflowsOrdered.find(w => w.submodulesWorkflowID === wf.submodulesWorkflowID)) {
          this.lastWorkflow.submodulesWorkflowNext = wf.submodulesWorkflowID
        }
      })
    },
    updateBlockers (index, blockers) {
      this.workflowsOrdered[index].blockers = blockers
      this.updateWorkflows()
    },
    handleSort () {
      if (this.workflows.length) {
        // Initialize sortable after vue renders
        this.$nextTick(function () {
          if (this.sortable) {
            this.sortable.destroy()
          }
          this.sortable = Sortable.create(document.querySelector('.el-table__body-wrapper tbody'), {
            onEnd: (e => {
              if (e.newIndex === e.oldIndex) {
                return
              }

              // Clone array and swap elements
              const newOrdered = JSON.parse(JSON.stringify(this.workflowsOrdered))
              newOrdered.splice(e.newIndex, 0, newOrdered.splice(e.oldIndex, 1)[0])

              // Fix 'next'
              for(let i = 0; i < newOrdered.length; i++) {
                if (i === newOrdered.length - 1) {
                  newOrdered[i].submodulesWorkflowNext = null
                } else {
                  newOrdered[i].submodulesWorkflowNext = newOrdered[i+1].submodulesWorkflowID
                }
              }

              // Change product first workflow if needed
              if (e.newIndex === 0 || e.oldIndex === 0) {
                this.product.fk_firstSubmoduleworkflowID = newOrdered[0].submodulesWorkflowID
              }

              // Check for blockers conflicts
              const allIds = newOrdered.map(w => w.submodulesWorkflowID)
              const isValid = newOrdered.every((w, i) => {
                return w.blockers.every(id => allIds.slice(0, i).includes(id))
              })

              if (isValid) {
                this.workflows = newOrdered
                this.updateWorkflows()
              } else {
                // this.$notify.error({title: 'Error', message: 'There are conflict blockers. Moving not successful'});
                this.$message.error('There are conflicting blockers. Moving not successful')
                this.loadWorkflows()
              }

            })
          })

        })

      }
    }
  },
  mounted () {
    this.loadSumobules()
    this.loadWorkflows()
  },
  components: {
    ProductWorkflowBlockers
  }
}
</script>