<template lang="pug">
el-dialog(:title="isNew ? 'New Plugin Instance' : 'Edit Plugin Instance'", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="150px" ref="form", :model="record", :rules="rules")
    settings-form(v-if="!loading", v-model="record.settings", :plugin-id="$route.params.id", scope="instance")

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fl(v-if="!isNew", type="danger", @click="deleteRecord") Delete
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'
import SettingsForm from '../SettingsForm.vue'

export default {
  name: 'PluginInstanceForm',
  mixins: [dialogFormMixin],
  props: {},
  data () {
    return {
      apiUrl: '/plugins',
      url: '/plugins',
      loading: true,
      showDialog: false,
      record: {
        id: null,
        settings: {}
      },
      rules: {

      }
    }
  },
  computed: {
    saveApiUrl () {
      return this.apiUrl + '/' + this.plugin.id + '/instances' + (this.isNew ? '' : '/' + this.recordId)
    },
    deleteApiUrl () {
      return this.apiUrl + '/' + this.plugin.id + '/instances/' + this.recordId
    }
  },
  methods: {
    newRecord (pluginId) {
      this.loadRecord(pluginId)
    },
    loadRecord (pluginId) {
      const instanceId = this.$route.params.instanceId

      this.showDialog = true // NOT SURE
      this.loading = true
      this.record = {...this.defaultRecord}
      this.$http.get(`${this.apiUrl}/${pluginId}`)
        .then(response => {
          this.plugin = response.data

          if (instanceId === 'new') {
            this.record = {...this.defaultRecord}
            this.loading = false
            this.showDialog = true
          } else {
            return this.$http.get(`${this.apiUrl}/${pluginId}/instances/${instanceId}`)
              .then(response => {
                this.showDialog = true
                this.loading = false
                // this.record = {...this.defaultRecord, ...response.data}
                this.record = {...this.defaultRecord}
                Object.keys(this.record).forEach(k => {
                  this.record[k] = response.data[k]
                })
              })
          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error. Check console.'})
        })
    }
  },
  components: {
    SettingsForm
  }
}
</script>