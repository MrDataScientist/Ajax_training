<template lang="pug">
el-dialog(v-if="plugin", :title="'Plugin Instances: ' + plugin.name ", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-button(type="success", @click="addInstance") Add instance
  el-form(v-loading.body="loading", label-position="right", label-width="120px" ref="form", :model="instances")
    div(v-for="(instanceValues, instanceID) in instances")
      h3
        span Instance {{ instanceID }}
        el-button.fr(type="danger", @click="deleteInstance(instanceID)") Delete instance
      el-form-item(v-for="(value, i) in instanceValues", prop="key", :label="value.key", :key="value.ID")
        el-input(v-model="instances[instanceID][i].value")


  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="saveInstanceValues") Update values
</template>

<script>
export default {
  name: 'PluginInstances',
  props: {},
  data () {
    return {
      apiUrl: '/plugins',
      url: '/plugins',
      loading: true,
      showDialog: false,
      instances: {},
      plugin: null,
    }
  },
  methods: {
    loadInstances (pluginId) {
      // this.plugin = null
      this.instances = {}
      this.loading = true
      this.$http.get(`${this.apiUrl}/${pluginId}`)
        .then(response => {
          this.plugin = response.data

          return this.$http.get(`${this.apiUrl}/${pluginId}/instances`)
            .then(response => {
              this.showDialog = true
              this.loading = false
              // this.instances = {...response.data}
              this.instances = response.data.reduce((obj, i) => {
                if (!obj[i.instanceID]) {
                  obj[i.instanceID] = []
                }
                obj[i.instanceID].push(i)
                return obj
              }, {})

            })
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error. Check console.'});
        })
    },
    addInstance () {
      this.$http.post(`${this.apiUrl}/${this.plugin.pluginID}/instances`)
        .then(response => {
          this.loadInstances(this.plugin.pluginID)
        })
    },
    deleteInstance (instanceID) {
      this.$confirm(`Delete Instance ${instanceID} ?`, 'Delete', {
        confirmButtonText: 'Delete',
        type: 'warning',
      })
      .then(() => {
        this.$http.delete(`${this.apiUrl}/${this.plugin.pluginID}/instances/${instanceID}`).then(response => {
          this.loadInstances(this.plugin.pluginID)
        })
      })
      .catch(() => {

      })
    },
    saveInstanceValues () {
      let instanceValues = []

      Object.keys(this.instances).forEach(instanceID => {
        instanceValues = instanceValues.concat([...this.instances[instanceID]])
      })

      this.$http.put(`${this.apiUrl}/${this.plugin.pluginID}/instances`, {instanceValues})
        .then(response => {
          this.loadInstances(this.plugin.pluginID)
        })
        .catch(err => {
          console.log(err)
          this.$notify.error({title: 'Error', message: 'Error. Check console.'});
        })
    },
    onCancel () {
      this.showDialog = false
      this.$router.push({path: this.url})
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadInstances(to.params.id)
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.loadInstances(to.params.id)
    next()
  }
}
</script>