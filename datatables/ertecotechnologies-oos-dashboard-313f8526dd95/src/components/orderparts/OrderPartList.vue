<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Order Parts
      el-col(:sm="20")
        el-button.fr(type="success", icon="el-icon-plus", @click="newRecord") Add Order Part


  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="xmlPartID", label="ID", min-width="80", sortable="custom")
    el-table-column(prop="name", label="Name", min-width="200", sortable="custom")
    el-table-column(prop="description", label="Description", min-width="200", sortable="custom")

    el-table-column(prop="createdAt", label="Created/Updated", min-width="160", sortable="custom")
      template(slot-scope="scope")
        div: small {{ scope.row.createdAt | formatDate }}
        div: small {{ scope.row.updatedAt | formatDate }}

    el-table-column(prop="actions", label="Actions", min-width="220")
      template(slot-scope="scope")
        .action-buttons
          el-button(@click="editRecord(scope.row)") Edit
          el-button(type="danger", @click="deleteRecord(scope.row)") Delete

  router-view
</template>

<script>
import Datatable from '../Datatable.vue'
import listMixin from '../../mixins/listMixin.js'

export default {
  name: 'OrderPartList',
  mixins: [listMixin],
  data () {
    return {
      url: '/order-parts',
      apiUrl: '/order-parts',
      primaryKey: 'xmlPartID',
      filters: {
      }
    }
  },
  methods: {

  },
  components: {
    Datatable
  }
}
</script>