<template lang="pug">
el-dialog(:title="isNew ? 'New Order Part' : 'Edit Order Part'", :visible.sync="showDialog", width="30%", top="5%", @close="onCancel")
  el-form(v-loading.body="loading", label-position="right", label-width="100px", ref="form", :model="record", :rules="rules", )
    el-form-item(prop="name", label="Name")
      el-input(v-model="record.name")
    el-form-item(prop="description", label="Description")
      el-input(v-model.number="record.description", type="texarea")

  .dialog-footer.cf(slot="footer")
    el-button.fl(@click="onCancel") Cancel
    el-button.fr(v-if="!loading", type="primary" @click="onSubmit") {{ isNew ? 'Create' : 'Update' }}
</template>

<script>
import dialogFormMixin from '../../mixins/dialogFormMixin'

export default {
  name: 'OrderPartForm',
  mixins: [dialogFormMixin],
  props: {},
  data () {
    return {
      apiUrl: '/order-parts',
      url: '/order-parts',
      primaryKey: 'xmlPartID',
      loading: true,
      showDialog: false,
      record: {
        xmlPartID: null,
        name: '',
        description: '',
      },
      rules: {
        name: {required: true},
        description: {},
      },
    }
  }
}
</script>