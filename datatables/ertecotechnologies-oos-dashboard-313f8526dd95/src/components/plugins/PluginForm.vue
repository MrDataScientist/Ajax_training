<template lang="pug">
el-dialog(:title="isNew ? 'New Plugin' : 'Edit Plugin'", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="150px" ref="form", :model="record", :rules="rules")
    el-form-item(prop="name", label="Name")
      el-input(v-model="record.name")
    el-form-item(prop="description", label="Description")
      el-input(v-model.number="record.description", type="texarea")
    el-form-item(prop="active", label="Active")
      el-switch(v-model="record.active")

    h3 Plugin Values
    el-form-item(v-for="(pluginValue, i) in record.PluginValues", prop="active", :label="pluginValue.key", :key="pluginValue.pluginValueID")
      el-input(v-model.number="record.PluginValues[i].value")

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'

export default {
  name: 'PluginForm',
  mixins: [dialogFormMixin],
  props: {},
  data () {
    return {
      apiUrl: '/plugins',
      url: '/plugins',
      primaryKey: 'pluginID',
      loading: true,
      showDialog: false,
      record: {
        pluginID: null,
        name: '',
        description: '',
        active: false,
        PluginValues: [],
        PluginInstanceValues: []
      },
      rules: {
        name: {required: true},
        description: {},
      }
    }
  }
}
</script>