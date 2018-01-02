<template lang="pug">
el-dialog(:title="isNew ? 'New Product' : 'Edit Product'", :visible.sync="showDialog", width="30%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="120px" ref="form", :model="record", :rules="rules")
    el-form-item(prop="token", label="Token")
      el-input(v-model="record.token")
    el-form-item(prop="name", label="Name")
      el-input(v-model="record.name")
    el-form-item(prop="archiveOrder", label="Archive (days)")
      el-input-number(v-model="record.archiveOrder")
    el-form-item(prop="description", label="Description")
      el-input(v-model.number="record.description", type="texarea")
    el-form-item(prop="needsApproval", label="Needs approval")
      el-switch(v-model="record.needsApproval")

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'

export default {
  name: 'ProductForm',
  mixins: [dialogFormMixin],
  props: {},
  data () {
    return {
      apiUrl: '/products',
      url: '/products',
      primaryKey: 'productID',
      loading: true,
      showDialog: false,
      record: {
        productID: null,
        name: '',
        token: '',
        archiveOrder: 0,
        description: '',
        needsApproval: false
      },
      rules: {
        name: {required: true},
        token: {required: true},
        archiveOrder: {required: true},
        description: {}
      }
    }
  }
}
</script>