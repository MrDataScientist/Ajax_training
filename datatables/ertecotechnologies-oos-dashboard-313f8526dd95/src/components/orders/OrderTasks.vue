<template lang="pug">
el-dialog(v-if="order", :title="'Order tasks - ' + order.orderNumber", :visible.sync="showDialog", width="90%", top="5%", @close="onCancel")
  el-table(border, style="width:100%", v-loading.body="loading", :data="tasks", :highlight-current-row="false")
    el-table-column(prop="taskID", label="ID", width="160")
    el-table-column(prop="Submodule", label="Submodule", width="200")
      template(slot-scope="scope")
        div {{ scope.row.Submodule.name }}
        small ({{ scope.row.Submodule.token }})


    el-table-column(prop="state", label="State", width="100")
    el-table-column(prop="data", label="Data")
    el-table-column(prop="description", label="Description")
    el-table-column(prop="createdAt", label="Created/Updated", width="160")
      template(slot-scope="scope")
        div: small {{ scope.row.createdAt | formatDate }}
        div: small {{ scope.row.updatedAt | formatDate}}


</template>

<script>
import dialogMixin from '../../mixins/dialogMixin'

export default {
  name: 'OrderTasks',
  mixins: [dialogMixin],
  data () {
    return {
      apiUrl: '/orders',
      url: '/orders',
      showDialog: false,
      loading: false,
      order: null,
      tasks: []
    }
  },
  computed: {},
  methods: {
    loadData(id) {
      this.tasks = []
      this.loading = true
      this.showDialog = true
      this.$http.get(`${this.url}/${id}`)
        .then(response => {
          this.order = response.data
          return this.$http.get(`${this.url}/${id}/tasks`)
            .then(response => {
              this.tasks = response.data
              this.loading = false
            })
        })
        .catch(error => {
          console.error(error)
          // this.loading = false
          // this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error loading tasks. Check console.'});
        })
    }
  },
}
</script>