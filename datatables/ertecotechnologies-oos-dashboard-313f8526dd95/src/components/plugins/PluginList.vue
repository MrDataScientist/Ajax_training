<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Plugins

      el-col(:sm="4")
        el-form-item
          el-input(v-model="filters.search", placeholder="Search...")

  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="name", label="Name", min-width="200", sortable="custom")
    el-table-column(prop="submoduleID", label="Paired", min-width="70")
      template(slot-scope="scope")
        i.el-icon-check(v-if="scope.row.submoduleID")
    el-table-column(prop="type", label="Type", min-width="200", sortable="custom")
    el-table-column(prop="description", label="Description", min-width="200", sortable="custom")

    el-table-column(prop="active", label="Active", min-width="100", sortable="custom")
      template(slot-scope="scope")
        el-tag(v-if="scope.row.active", type="success") Active
        el-tag(v-if="!scope.row.active", type="danger") Not active

    el-table-column(prop="version", label="Version", min-width="120", sortable="custom")
      template(slot-scope="scope")
        span {{ scope.row.version }}
        small {{ scope.row.latestVersion ? ' latest' : ' not latest' }}

    el-table-column(prop="actions", label="Actions", min-width="220")
      template(slot-scope="scope")
        .action-buttons
          el-button(@click="$router.push({path: `${url}/${scope.row[primaryKey]}/instances`})") Instances
          el-button(@click="editRecord(scope.row)") Edit
          el-button(type="danger", @click="deleteRecord(scope.row)") Delete

  router-view
</template>

<script>
import Datatable from '../Datatable.vue'
import listMixin from '../../mixins/listMixin.js'

export default {
  name: 'PluginList',
  mixins: [listMixin],
  data () {
    return {
      url: '/plugins',
      apiUrl: '/plugins',
      primaryKey: 'pluginID',
      filters: {
        search: ''
      }
    }
  },
  components: {
    Datatable
  }
}
</script>