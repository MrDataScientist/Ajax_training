import dateFnsFormat from 'date-fns/format'

export default {
  data () {
    return {
      apiUrl: '/base-api-url/',
      url: '/base-frontend-url/',
      primaryKey: 'id',
      loading: true
    }
  },
  methods: {
    newRecord () {
      this.$router.push({path: `${this.url}/new`})
    },
    editRecord(record) {
      this.$router.push({path: `${this.url}/${record[this.primaryKey]}`})
    },
    deleteRecord(record) {
      this.$confirm(`Delete ${record.name} ?`, 'Delete', {
        confirmButtonText: 'Delete',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`${this.url}/${record[this.primaryKey]}`)
            .then(response => {
              this.$refs.datatable.loadData()
              this.$notify({title: 'Deleted', message: 'Record deleted', type: 'success'})
            }).catch(err => {
              console.log(err)
              this.$notify.error({title: 'Error', message: 'Error deleting record. Check console.'})
            })
        })
        .catch(() => {

        })
    },
    clearFilters () {
      this.filters = {...this.defaultFilters}
    }
  },
  created () {
    this.defaultFilters = {...this.$data.filters}
  },
  watch: {
    $route () {
      // console.info(this.$options.name, this.$route.path, this.url)
      if (this.$route.path === this.url) {
        this.$refs.datatable.loadData()
      }
    }
  }
}
