<template lang="pug">
el-dialog(v-if="order", :title="'Order logs - ' + order.id", :visible.sync="showDialog", width="90%", top="5%", @close="onCancel")
  el-table(border, style="width:100%", v-loading.body="loading", :data="logs", :highlight-current-row="false")
    el-table-column(prop="id", label="ID", width="100")
    el-table-column(prop="state", label="State", width="100")
    el-table-column(prop="message", label="Message")
    el-table-column(prop="createdAt", label="Created/Updated", width="160")
      template(slot-scope="scope")
        div: small {{ scope.row.createdAt | formatDate }}
        div: small {{ scope.row.updatedAt | formatDate}}


</template>

<script>
import dialogMixin from '../../mixins/dialogMixin'

export default {
  name: 'OrderLogs',
  mixins: [dialogMixin],
  data () {
    return {
      apiUrl: '/orders',
      url: '/orders',
      showDialog: false,
      loading: false,
      order: null,
      logs: []
    }
  },
  computed: {},
  methods: {
    loadData(id) {
      this.logs = []
      this.loading = true
      this.showDialog = true
      this.$http.get(`${this.url}/${id}`)
        .then(response => {
          this.order = response.data
          return this.$http.get(`${this.url}/${id}/logs`)
            .then(response => {
              this.logs = response.data
              this.loading = false
            })
        })
        .catch(error => {
          console.error(error)
          // this.loading = false
          // this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error loading logs. Check console.'});
        })
    }
  },
}
</script>