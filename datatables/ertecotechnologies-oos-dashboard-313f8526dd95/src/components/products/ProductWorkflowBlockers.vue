<template lang="pug">
el-dialog(v-if="product && workflow", :title="dialogTitle", :visible.sync="showDialog", width="30%", top="5%", @close="onCancel")
  strong(v-if="!availableBlockers.length") No blockers available
  el-checkbox-group(v-if="availableBlockers.length", v-model="blockers")
    el-checkbox(v-for="id in availableBlockers", :label="id", :key="id")

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(type="primary" @click="updateBlockers") Update blockers
</template>

<script>
export default {
  name: 'ProductWorkflowBlockers',
  data () {
    return {
      showDialog: false,
      product: null,
      workflows: [],
      workflowIndex: null,
      blockers: []
    }
  },
  computed: {
    dialogTitle () {
      if (this.product && this.workflow) {
        return 'Workflow blockers: ' + this.product.name + ' - ' + this.workflow.submodulesWorkflowID + ' (' + this.workflow.submodule.name + ')'
      }
      return 'Loading'
    },
    workflowIds () {
      return this.workflows.map(w => w.submodulesWorkflowID)
    },
    availableBlockers () {
      return this.workflowIds.slice(0, this.workflowIndex)
    },
    workflow () {
      return this.workflows[this.workflowIndex] ? this.workflows[this.workflowIndex] : null
    }
  },
  methods: {
    showBlockers (product, workflows, index) {
      this.product = product
      this.workflows = workflows
      this.workflowIndex = index
      this.blockers = this.workflow.blockers
      this.showDialog = true
    },
    updateBlockers () {
      this.$emit('update', this.workflowIndex, JSON.parse(JSON.stringify(this.blockers)))
      this.showDialog = false
      this.blockers = []
    },
    onCancel () {
      this.showDialog = false
    },
  }
}
</script>