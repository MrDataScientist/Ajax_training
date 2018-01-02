<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="6")
        h1: span Unknown Orders

      el-col(:sm="4")
        el-form-item
          el-input(v-model="filters.search", placeholder="Search...")

  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="name", label="Name", min-width="200")

    el-table-column(prop="actions", label="Actions", width="220")
      template(slot-scope="scope")
        .action-buttons
          el-button(@click="$router.push({path: `${url}/${scope.row.name}`})") JSON
          el-button(@click="actionMoveClick(scope.row)") Move to input...
          //- el-button(type="danger", @click="deleteRecord(scope.row)") Delete

  router-view
</template>

<script>
import Datatable from '../Datatable.vue'
import listMixin from '../../mixins/listMixin.js'

export default {
  name: 'UnknownOrderList',
  mixins: [listMixin],
  data () {
    return {
      url: '/unknown-orders',
      apiUrl: '/unknown-orders',
      filters: {
        search: ''
      }
    }
  },
  methods: {
    actionMoveClick(order) {
      this.$confirm(`Move ${order.name} ?`, 'Move to input directory', {
        confirmButtonText: 'Move',
        type: 'warning',
      }).then(() => {
        this.loading = true
        this.$http.post(`${this.url}/${order.name}/move`).then(response => {
          this.$refs.datatable.loadData()
          this.$notify({title: 'Move to input', message: 'Record moved to input directory', type: 'success'})
          this.loading = false
        }).catch(error => {
          console.error(error)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error moving order to input. Check console.'});
        })
      }).catch(() => {

      })
    }
  },
  components: {
    Datatable
  }
}
</script>