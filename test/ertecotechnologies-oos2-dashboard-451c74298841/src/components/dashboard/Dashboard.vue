<template lang="pug">
.dashboard(v-loading="loading")
  el-row
    el-col(:sm="24")
      h1
       span Dashboard OOS
       //- el-tag(type="danger", style="position: relative; top: -5px; left: 10px") development
  //- div(v-if="counts") {{ JSON.stringify(counts) }}
  el-row
    el-col(:sm="6")
      el-card(header="Statistics")
        el-table(v-if="counts", :data="counts", show-summary, :row-class-name="tableRowClassName")
          el-table-column(prop="label", label="State", width="140")
            template(slot-scope="scope")
              el-tag(:type="scope.row.type", :color="scope.row.color || ''") {{ scope.row.label }}
          el-table-column(prop="count", label="Orders count")


</template>

<script>
import config from '../../config'

export default {
  name: 'Dashboard',
  props: {},
  data () {
    return {
      loading: false,
      counts: null
    }
  },
  computed: {},
  methods: {
    loadStatistics () {
      this.loading = true
      this.$http.get('/dashboard').then(response => {
        this.loading = false
        this.counts = config.states.map(ps => {
          ps.count = response.data[ps.value] ? response.data[ps.value] : 0
          return ps
        })


      }).catch(err => {
        console.log(err)
      })
    },
    tableRowClassName (row, index) {
      // row.
    }
  },
  mounted () {
    this.loadStatistics()
  }
}
</script>