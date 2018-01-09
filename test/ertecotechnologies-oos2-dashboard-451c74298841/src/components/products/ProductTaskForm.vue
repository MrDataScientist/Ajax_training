<template lang="pug">
el-dialog(:title="isNew ? 'New Product Task' : 'Edit Product Task'", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="150px" ref="form", :model="record", :rules="rules")
    el-form-item(prop="PluginId", label="Plugin")
      el-select(v-model="record.PluginId", remote, :remote-method="getPlugins")
        el-option(v-for="plugin in plugins", :key="plugin.id", :label="plugin.name", :value="plugin.id")

    h4 Plugin Settings
    settings-form(v-if="!loading", v-model="record.settings", :plugin-id="record.PluginId", scope="task")

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'
import SettingsForm from '../SettingsForm.vue'

export default {
  name: 'ProductTaskForm',
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
        PluginId: null,
        settings: {}
      },
      rules: {
        PluginId: {required: true}
      },
      plugins: []
    }
  },
  computed: {
    saveApiUrl () {
      return this.apiUrl + '/' + this.$route.params.id + '/tasks' + (this.isNew ? '' : '/' + this.recordId)
    },
  },
  methods: {
    newRecord (productId) {
      this.loadRecord(productId)
    },
    getPlugins() {
      this.$http.get(`/plugins?pageSize=10000`)
        .then(response => {
          this.plugins = response.data.records
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

      if (taskId === 'new') {
        this.record = {...this.defaultRecord}
        this.loading = false
        this.showDialog = true
      } else {
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

    }
  },
  created () {
    this.getPlugins()
  },
  components: {
    SettingsForm
  }
}
</script>