<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Plugins

      el-col(:sm="4")
        el-form-item
          el-input(v-model="filters.search", placeholder="Search...")

      el-col(:sm="16")
        el-button.fr(type="success", icon="el-icon-plus", @click="newRecord") Add Plugin

  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="name", label="Name", min-width="120", sortable="custom")
    el-table-column(prop="source", label="Source", min-width="120", sortable="custom")
    el-table-column(prop="description", label="Description", min-width="200", sortable="custom")
    el-table-column(prop="timeout", label="Timeout", min-width="100", sortable="custom")

    el-table-column(prop="isActive", label="Active", min-width="100", sortable="custom")
      template(slot-scope="scope")
        el-tag(v-if="scope.row.isActive", type="success") Active
        el-tag(v-if="!scope.row.isActive", type="danger") Not active

    el-table-column(prop="PluginInstances", label="Instances", min-width="220", sortable="custom")
      template(slot-scope="scope")
        el-button(v-for="(instance, idx) in scope.row.PluginInstances", @click="$router.push({path: `${url}/${scope.row[primaryKey]}/instances/${instance.id}`})", :key="instance.id") Inst {{ idx + 1 }}

    el-table-column(prop="actions", label="Actions", min-width="220")
      template(slot-scope="scope")
        .action-buttons
          el-button(@click="$router.push({path: `${url}/${scope.row[primaryKey]}/instances/new`})") Add Instance
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