<template lang="pug">
el-dialog(title="Product Task Blockers", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-form.blockers-form(v-loading.body="loading", label-position="right", label-width="150px" ref="form", :model="record", :rules="rules")
    //- el-form-item(prop="blockers", label="Blockers")
    el-checkbox-group(v-model="record.blockers")
      el-checkbox(v-for="t in tasks", v-if="t.priority < record.priority", :label="t.priority", :key="t.id") {{ t.Plugin.name }}

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") Update
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'

export default {
  name: 'ProductTaskBlockers',
  mixins: [dialogFormMixin],
  props: {},
  data () {
    return {
      apiUrl: '/products',
      url: '/products',
      loading: true,
      showDialog: false,
      record: {
        id: null,
        priority: 0,
        blockers: []
      },
      rules: {
        PluginId: {required: true}
      },
      product: null,
      tasks: []
    }
  },
  computed: {
    saveApiUrl () {
      return this.apiUrl + '/' + this.$route.params.id + '/tasks/' + this.recordId
    },
  },
  methods: {
    newRecord (productId) {
      this.loadRecord(productId)
    },
    getTasks() {
      this.$http.get(`/products/${this.$route.params.id}/tasks`)
        .then(response => {
          this.tasks = response.data
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error. Check console.'})
        })
    },
    loadRecord (productId) {
      const taskId = this.$route.params.taskId

      this.showDialog = true // NOT SURE
      this.loading = true
      this.record = {...this.defaultRecord}

      this.url = `/products/${productId}/tasks`

      this.$http.get(`${this.apiUrl}/${productId}/tasks/${taskId}`)
        .then(response => {
          this.showDialog = true
          this.loading = false
          // this.record = {...this.defaultRecord, ...response.data}
          this.record = {...this.defaultRecord}
          Object.keys(this.record).forEach(k => {
            this.record[k] = response.data[k]
          })
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error. Check console.'})
        })
    }
  },
  created () {
    this.getTasks()
  }
}
</script>

<style lang="stylus">
.blockers-form
  .el-checkbox
    display block
    margin 0 0 10px 0
</style>