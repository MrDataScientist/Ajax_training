<template lang="pug">
.list.reports
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Reports
      el-col(:sm="4")
        el-select(v-model="filters.productToken", placeholder="Product")
          el-option(v-for="p in products", :label="p.name", :value="p.token", :key="p.token")
      el-col(:sm="4")
        el-select(v-model="filters.merchantToken", placeholder="Merchant", clearable)
          el-option(v-for="m in merchants", :label="m.name", :value="m.token", :key="m.token")
      el-col(:sm="4")
        el-select(v-model="filters.userId", placeholder="User", filterable, clearable, remote, :remote-method="userSearch", :loading="usersLoading")
          el-option(v-for="u in users", :label="u.username + ' (' + u.merchantToken + ')'", :value="u._id", :key="u._id")

  el-row.table
    el-col(:sm="24")
      el-table(:data="statisticsMatrix", border)
        el-table-column(prop="year", label="Year", key="year", class-name="year-col")
        el-table-column(prop="total", label="Total", key="total", class-name="total-col")
        el-table-column(v-for="(monthName, m) in months", :prop="m.toString()", :label="monthName", :key="m")
</template>

<script>
export default {
  props: {},
  data () {
    return {
      loading: true,
      usersLoading: false,
      products: [{name: 'ShowMySite', token: '5-0101-109'}],
      merchants: [{name: 'CloudEO Store Testing', token: '0100'}, {name: 'EOhopS Store', token: '0102'}],
      users: [],

      filters: {
        productToken: '5-0101-109',
        merchantToken: null,
        userId: null
      },

      statistics: []
    }
  },
  computed: {
    years () {
      if (!this.statistics.length) {
        return []
      }
      const min = this.statistics[this.statistics.length - 1].year
      const max = this.statistics[0].year
      const years = []
      for (let i = min; i <= max; i++) {
        years.push(i)
      }
      return years
    },
    months () {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Sep', 'Nov', 'Dec']
    },
    statisticsMatrix () {
      const obj = {}
      this.statistics.forEach(s => {
        if (obj[s.year] === undefined) {
          obj[s.year] = {total: 0}
        }
        obj[s.year][s.month] = s.count
        obj[s.year]['total'] += s.count
      })

      const matrix = []
      for (let y of this.years) {
        const year = {year: y, total: obj[y].total}
        for (let m = 1; m <= 12; m++) {
          year[m] = obj[y][m] || ''
        }
        matrix.push(year)
      }

      return matrix
    }
  },
  methods: {
    userSearch (query) {
      this.usersLoading = true
      this.$http.get('/reports/users', {params: {query}})
        .then(response => {
          this.usersLoading = false
          this.users = response.data
        })
        .catch(err => {
          console.log(err)
          this.usersLoading = false
        })
    },
    loadStatistics () {
      this.loading = true
      this.statistics = []
      this.$http.get('/reports', {params: this.filters})
        .then(response => {
          this.loading = false
          this.statistics = response.data
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error loading workflow. Check console.'});
        })
    }
  },
  created () {
    this.$watch('filters', this.loadStatistics, {deep: true, immediate: true})
    // this.loadStatistics()
  }
}
</script>

<style lang="stylus">
.reports
  .year-col
    background rgba(111,111,111,.1)
  .total-col
    background rgba(64,158,255,.1)
    // color #fff
</style>