export default {
  props: {},
  data () {
    return {
      apiUrl: '/base-api-url',
      url: '/base-url',
      primaryKey: 'id',
      loading: true,
      showDialog: false
    }
  },
  computed: {
    recordId () {
      return this.record[this.primaryKey]
    },
    isNew () {
      return !this.recordId
    },
    saveApiMethod () {
      return this.isNew ? 'post' : 'put'
    },
    saveApiUrl () {
      return this.isNew ? this.apiUrl : this.apiUrl + '/' + this.recordId
    },
    deleteApiUrl () {
      return this.apiUrl + '/' + this.recordId
    }
  },
  methods: {
    newRecord () {
      this.record = {...this.defaultRecord}
      this.loading = false
      this.showDialog = true
    },
    loadRecord (id) {
      this.showDialog = true // NOT SURE
      this.loading = true
      this.record = {...this.defaultRecord}
      this.$http.get(`${this.apiUrl}/${id}`)
        .then(response => {
          this.showDialog = true
          this.loading = false
          // this.record = {...this.defaultRecord, ...response.data}
          this.record = {...this.defaultRecord}
          Object.keys(this.record).forEach(k => {
            this.record[k] = response.data[k]
          })

          this.afterLoadRecord(response)
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error. Check console.'})
        })
    },
    afterLoadRecord (response) {

    },
    saveRecord () {
      this.loading = true
      this.$http[this.saveApiMethod](this.saveApiUrl, {record: this.record})
        .then(response => {
          this.showDialog = false
          this.loading = false
          // this.$emit('update')
          this.$notify({title: 'Saved', message: 'Record saved successfully', type: 'success'})
        })
        .catch(error => {
          console.error(error)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error saving record. Check console.'})
        })
    },
    deleteRecord () {
      this.$confirm(`Delete ?`, 'Delete', {
        confirmButtonText: 'Delete',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(this.deleteApiUrl)
            .then(response => {
              this.$router.push({path: this.url})
              this.$notify({title: 'Deleted', message: 'Record deleted', type: 'success'})
            }).catch(err => {
              console.log(err)
              this.$notify.error({title: 'Error', message: 'Error deleting record. Check console.'})
            })
        })
        .catch(() => {

        })
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveRecord()
        } else {
          this.$message({message: 'Please enter the required fields', type: 'warning'})
        }
      })
    },
    onCancel () {
      this.showDialog = false
      this.$router.push({path: this.url})
    }
  },
  created () {
    this.defaultRecord = {...this.$data.record}
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (to.params.id === 'new') {
        vm.newRecord()
      } else {
        vm.loadRecord(to.params.id)
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (to.params.id === 'new') {
      this.newRecord()
    } else {
      this.loadRecord(to.params.id)
    }
    next()
  }
}
