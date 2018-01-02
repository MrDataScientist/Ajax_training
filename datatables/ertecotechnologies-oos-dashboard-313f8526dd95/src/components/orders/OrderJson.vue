<template lang="pug">
el-dialog(v-if="order", :title="'Order.json - ' + order.orderNumber", :visible.sync="showDialog", width="50%", top="5%", @close="onCancel")
  pre.order-json(v-loading="loading")
    code {{ JSON.stringify(orderJson, null, 4) }}
</template>

<script>
import dialogMixin from '../../mixins/dialogMixin'

export default {
  name: 'OrderJson',
  mixins: [dialogMixin],
  data () {
    return {
      apiUrl: '/orders',
      url: '/orders',
      showDialog: false,
      loading: false,
      order: null,
      orderJson: null
    }
  },
  methods: {
    loadData(id) {
      this.orderJson = ''
      this.loading = true
      this.showDialog = true
      this.$http.get(`${this.url}/${id}`)
        .then(response => {
          this.order = response.data
          return this.$http.get(`${this.url}/${id}/json`)
            .then(response => {
              this.orderJson = response.data
              this.loading = false
            })
        })
        .catch(error => {
          console.error(error)
          // this.loading = false
          // this.showDialog = false
          this.$notify.error({title: 'Error', message: 'Error loading json. Check console.'});
        })

    }
  },
}
</script>