<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Submodules

      el-col(:sm="4")
        el-form-item
          el-input(v-model="filters.search", placeholder="Search...")

      el-col(:sm="16")
        el-button.fr(type="success", icon="el-icon-plus", @click="newRecord") Add Submodule


  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="token", label="Token", min-width="160", sortable="custom")
    //- el-table-column(prop="submoduleID", label="ID", min-width="80", sortable="custom")
    el-table-column(prop="Plugins", label="Paired", min-width="70")
      template(slot-scope="scope")
        i.el-icon-check(v-if="scope.row.Plugins.length > 0")
    el-table-column(prop="name", label="Name", min-width="200", sortable="custom")
    el-table-column(prop="type", label="Type", min-width="200", sortable="custom")
    el-table-column(prop="responseTime", label="Response Time", min-width="150", sortable="custom")
    el-table-column(prop="XmlParts", label="Order Parts", min-width="160")
      template(slot-scope="scope")
        div(v-for="part in scope.row.XmlParts") {{ part.name }}

    el-table-column(prop="description", label="Description", min-width="200", sortable="custom")

    el-table-column(prop="createdAt", label="Created/Updated", min-width="160", sortable="custom")
      template(slot-scope="scope")
        div: small {{ scope.row.createdAt | formatDate }}
        div: small {{ scope.row.updatedAt | formatDate}}

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
  name: 'SubmoduleList',
  mixins: [listMixin],
  data () {
    return {
      url: '/submodules',
      apiUrl: '/submodules',
      primaryKey: 'submoduleID',
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