export default {
  data () {
    return {
      apiUrl: '/base-api-url',
      url: '/base-url',
      primaryKey: 'id',
      loading: true
    }
  },
  computed: {
    recordId () {
      return this.record[this.primaryKey]
    },
    isNew () {
      return !this.recordId
    },
    shouldShow () {
      return !this.isNew || (this.isNew && !this.loading)
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveRecord()
        } else {
          this.$message({message: 'Please enter the required fields', type: 'warning'})
        }
      })
    },
    onDelete () {
      this.$confirm('Delete ?', 'Warning', {type: 'warning'})
        .then(() => {
          this.deleteRecord()
        }).catch(() => {

        })
    },
    saveRecord () {
      this.loading = true
      this.$http[this.recordId ? 'put' : 'post'](this.apiUrl + (this.recordId ? '/' + this.recordId : ''), {record: this.record})
        .then(response => {
          if (response.data[this.primaryKey]) {
            this.$router.replace(this.url + '/' + response.data[this.primaryKey])
            this.loadRecord(response.data[this.primaryKey])
          } else {
            this.loadRecord(this.recordId)
          }

          this.$notify({title: 'Saved', message: 'Record saved successfully', type: 'success'})
        }).catch(error => {
          console.error(error)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error saving record. Check console.'})
        })
    },
    deleteRecord () {
      // this.loading = true
      this.$http.delete(this.apiUrl + '/' + this.recordId)
        .then(response => {
          this.$router.replace(this.url)
          this.$notify({title: 'Deleted', message: 'Record deleted', type: 'success'})
        }).catch(error => {
          console.error(error)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error deleting record. Check console.'})
        })
    },
    loadRecord (id) {
      this.loading = true
      this.$http.get(this.apiUrl + '/' + id)
        .then(response => {
          this.record = Object.assign({}, this.defaultRecord, response.data)
          this.loading = false
        }).catch(error => {
          console.error(error)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error loading record. Check console.'})
          this.$router.replace(this.url)
        })
    }
  },
  created () {
    this.defaultRecord = {...this.$data.record}
    // console.info(this.$options.name)
    if (this.$route.params.id === 'new') {
      this.loading = false
    } else {
      this.loadRecord(this.$route.params.id)
    }
  }

  // beforeRouteUpdate (to, from, next) {
  //   // Not working with logout cause it changes the url
  //   // this.loadRecord(to.params.id)
  //   // next()
  // }
}
