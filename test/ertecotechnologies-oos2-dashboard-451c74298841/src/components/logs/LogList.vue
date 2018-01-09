<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="6")
        h1: span Logs

      //- el-col(:sm="4")
      //-   el-form-item
      //-     el-input(v-model="filters.search", placeholder="Search...")

  datatable(ref="datatable", :url="apiUrl", :filters="filters")
    el-table-column(prop="level", label="Level", width="200")
    el-table-column(type="expand")
      template(slot-scope="scope")
        pre {{ scope.row.stack }}
    el-table-column(prop="message", label="Message")
    el-table-column(prop="timestamp", label="Timestamp", width="200")
      template(slot-scope="scope")
        div: small {{ scope.row.timestamp | formatDate }}
</template>

<script>
import Datatable from '../Datatable.vue'
import listMixin from '../../mixins/listMixin.js'

export default {
  name: 'LogList',
  mixins: [listMixin],
  data () {
    return {
      url: '/logs',
      apiUrl: '/logs',
      filters: {
        // search: ''
      }
    }
  },
  components: {
    Datatable
  }
}
</script>