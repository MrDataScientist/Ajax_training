<template lang="pug">
el-dialog(:title="isNew ? 'New Plugin' : 'Edit Plugin'", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="150px" ref="form", :model="record", :rules="rules")
    el-form-item(prop="name", label="Name")
      el-input(v-model="record.name")
    el-form-item(prop="source", label="Source")
      el-select(v-model="record.source", remote, :remote-method="getSources", :loading="sourcesLoading")
        el-option(v-for="option in sources", :key="option.file", :label="option.file + ' (' + option.count + ')'", :value="option.file")
    el-form-item(prop="description", label="Description")
      el-input(v-model.number="record.description", type="texarea")
    el-form-item(prop="timeout", label="Timeout (sec)")
      el-input-number(v-model="record.timeout")
    el-form-item(prop="isActive", label="Active")
      el-switch(v-model="record.isActive")

    h4 Plugin Settings
    settings-form(v-model="record.settings", :plugin-id="null", :source="record.source", scope="plugin")


  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'
import SettingsForm from '../SettingsForm.vue'

export default {
  name: 'PluginForm',
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
        name: '',
        source: '',
        description: '',
        timeout: 86400,
        isActive: false,
        settings: {}
      },
      rules: {
        name: {required: true},
        source: {required: true},
        description: {},
      },
      sourcesLoading: false,
      sources: []
    }
  },
  methods: {
    getSources() {
      console.log('GETTING SOURCES')
      this.sourcesLoading = true
      this.$http.get(`/plugins/sources`)
        .then(response => {
          this.sourcesLoading = false
          this.sources = response.data
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
    this.getSources()
  },
  components: {
    SettingsForm
  }
}
</script>