<template lang="pug">
el-dialog(v-if="orderJson", :title="'Order.json - ' + orderJson.order.OrderNumber", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  pre.order-json(v-loading="loading")
    code {{ JSON.stringify(orderJson, null, 4) }}
</template>

<script>
import dialogMixin from '../../mixins/dialogMixin'

export default {
  name: 'UnknownOrderJson',
  mixins: [dialogMixin],
  data () {
    return {
      url: '/unknown-orders',
      apiUrl: '/unknown-orders',
      showDialog: false,
      loading: false,
      orderJson: null
    }
  },
  computed: {},
  methods: {
    loadData(id) {
      this.orderJson = null
      this.loading = true
      this.showDialog = true
      this.$http.get(`${this.url}/${id}/json`)
        .then(response => {
          this.orderJson = response.data
          this.loading = false
        }).catch(error => {
          console.error(error)
          this.loading = false
          this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error loading json. Check console.'});
        })
    }
  }
}
</script>