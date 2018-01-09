export default {
  props: {},
  data () {
    return {
      url: '/base-url',
      primaryKey: 'id',
    }
  },
  methods: {
    onCancel () {
      this.showDialog = false
      this.$router.push({path: this.url})
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadData(to.params.id)
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.loadData(to.params.id)
    next()
  }
}