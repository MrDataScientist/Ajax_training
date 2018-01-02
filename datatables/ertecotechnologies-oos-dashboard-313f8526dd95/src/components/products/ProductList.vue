<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Products

      el-col(:sm="4")
        el-form-item
          el-input(v-model="filters.search", placeholder="Search...")

      el-col(:sm="16")
        el-button.fr(type="success", icon="el-icon-plus", @click="newRecord") Add Product


  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="token", label="Token", min-width="160", sortable="custom")
    el-table-column(prop="name", label="Name", min-width="200", sortable="custom")
    el-table-column(prop="description", label="Description", min-width="200", sortable="custom")
    el-table-column(prop="archiveOrder", label="Archive (days)", min-width="140", sortable="custom")

    el-table-column(prop="needsApproval", label="Approval", min-width="80", sortable="custom")
      template(slot-scope="scope")
        el-tag(v-if="scope.row.needsApproval", type="success") Needed

    el-table-column(prop="createdAt", label="Created/Updated", min-width="160", sortable="custom")
      template(slot-scope="scope")
        div: small {{ scope.row.createdAt | formatDate }}
        div: small {{ scope.row.updatedAt | formatDate}}

    el-table-column(prop="actions", label="Actions", min-width="220")
      template(slot-scope="scope")
        .action-buttons
          el-button(@click="$router.push({path: `${url}/${scope.row[primaryKey]}/workflows`})") Workflow
          el-button(@click="editRecord(scope.row)") Edit
          el-button(type="danger", @click="deleteRecord(scope.row)") Delete

  router-view
</template>

<script>
import Datatable from '../Datatable.vue'
import listMixin from '../../mixins/listMixin.js'

export default {
  name: 'ProductList',
  mixins: [listMixin],
  data () {
    return {
      url: '/products',
      apiUrl: '/products',
      primaryKey: 'productID',
      filters: {
        search: ''
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