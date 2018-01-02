<template lang="pug">
el-dialog(:title="isNew ? 'New Submodule' : 'Edit Submodule'", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="100px", ref="form", :model="record", :rules="rules")
    el-form-item(prop="name", label="Name")
      el-input(v-model="record.name")
    el-form-item(prop="token", label="Token")
      el-input(v-model="record.token")
    el-form-item(prop="type", label="Type")
      el-input(v-model="record.type")
    el-form-item(prop="responseTime", label="Response Time")
      el-input-number(v-model="record.responseTime")
    el-form-item(prop="description", label="Description")
      el-input(v-model.number="record.description", type="texarea")

    el-form-item(label="Order parts")
      el-checkbox-group(v-model="record.orderPartIds")
        el-checkbox(v-for="op in orderPartsOptions", :label="op.id", :key="op.id") {{ op.name }}

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'

export default {
  name: 'SubmoduleForm',
  mixins: [dialogFormMixin],
  props: {},
  data () {
    return {
      apiUrl: '/submodules',
      url: '/submodules',
      primaryKey: 'submoduleID',
      loading: true,
      showDialog: false,
      record: {
        submoduleID: null,
        name: '',
        token: '',
        type: '',
        responseTime: 0,
        description: '',
        orderPartIds: []
      },
      rules: {
        name: {required: true},
        token: {required: true},
        type: {required: true},
        responseTime: {required: true},
        description: {},
      },
      orderPartsOptions: []
    }
  },
  methods: {
    afterLoadRecord (response) {
      this.record.orderPartIds = response.data.XmlParts.map(p => p.xmlPartID)
    },
  },
  created () {
    this.defaultRecord = {...this.$data.record}

    // Load order parts select options
    if (!this.orderPartsOptions || this.orderPartsOptions.length < 1) {
      this.$http.get(`/order-parts`).then(response => {
        this.orderPartsOptions = response.data.records.map(op => {
          return {
            id: op.xmlPartID,
            name: op.name
          }
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({title: 'Error', message: 'Error. Check console.'});
      })
    }
  }
}
</script>