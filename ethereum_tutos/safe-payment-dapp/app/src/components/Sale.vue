<template>
  <div class="sale">
    <div class="row">
      <div class="col-sm-12">
        <div class="panel panel-primary table-responsive">
          <div class="panel-heading">
            <div class="panel-title">Sale</div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Status</th>
                <th>Price (ETH)</th>
                <th>Balance (ETH)</th>
              </tr>
            </thead>
            <tbody id="info-rows">
              <tr>
                <td>{{ address }}</td>
                <td>{{ status }}</td>
                <td>{{ value.toString() }}</td>
                <td>{{ balance.toString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-7">
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <div class="panel-title">Event Log</div>
          </div>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Type</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody id="event-rows">
              <tr v-for="event in events">
                <td>{{ event.name }}</td>
                <td>{{ event.time.toString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="panel panel-default">
          <div class="panel-heading">
            <div class="panel-title">Actions</div>
          </div>
          <div class="list-group">
            <div @click="abortHandler" class="action list-group-item list-group-item-danger"
              :class="{disabled: account !== seller || status !== 'Created'}">
              Abort
            </div>
            <div @click="purchaseHandler" class="action list-group-item list-group-item-warning"
              :class="{disabled: account === seller || status !== 'Created'}">
              Purchase
            </div>
            <div @click="confirmHandler" class="action list-group-item list-group-item-success"
              :class="{disabled: !allowConfirmation() || status !== 'Locked'}">
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Sale } from '../contracts'
import { isZero, toDate } from '../utils'
import * as types from '../store/mutation-types'

export default {
  name: 'sale',
  data () {
    return {
      watchers: []
    }
  },
  computed: {
    ...mapGetters({
      account: 'account',
      address: 'address',
      balance: 'balance',
      value: 'value',
      status: 'status',
      buyer: 'buyer',
      seller: 'seller',
      events: 'events'
    })
  },
  methods: {
    allowConfirmation () {
      return !isZero(this.buyer) && this.buyer === this.account
    },
    isDisabled (ele) {
      return ele.classList.contains('disabled')
    },
    abortHandler (e) {
      if (this.isDisabled(e.target)) return

      if (confirm(`Are you sure you want to abort the sale?

If you choose to abort, ${this.value.times(2)} ETH will be returned to your account.`)) {
        this.$store.dispatch('abort')
      }
    },
    purchaseHandler (e) {
      if (this.isDisabled(e.target)) return

      if (confirm(`Are you sure you want to make the purchase?

If you choose to make the purchase, ${this.value.times(2)} ETH will be transferred from your account into the contract's account. Upon confirming that you have received the item you purchased, ${this.value} ETH will be transferred back into your account.`)) {
        this.$store.dispatch('purchase')
      }
    },
    confirmHandler (e) {
      if (this.isDisabled(e.target)) return

      if (confirm(`Are you sure you want to confirm the sale?

By confirming, you inform the contract that you have received the item purchased from the seller. ${this.value.times(3)} ETH will be transferred to the seller's account and ${this.value} ETH will be transferred to yours.`)) {
        this.$store.dispatch('confirm')
      }
    },
    hydrate () {
      this.$store.dispatch('getSaleInfo', this.$router)
      this.listen()
    },
    listen () {
      Sale.at(this.address).then((instance) => {
        let sale = instance
        const range = {fromBlock: 0, toBlock: 'latest'}

        const getter = (err, logs) => {
          logs.forEach(({ event, args }) => {
            if (err) {
              console.error(err)
              return
            }

            this.$store.commit(types.NEW_EVENT, { name: event, time: toDate(args._time) })
          })
        }

        const watcher = (err, { event, args }) => {
          if (err) {
            console.error(err)
            return
          }

          this.$store.commit(types.NEW_EVENT, { name: event, time: toDate(args._time) })
          this.$store.dispatch('getSaleInfo', this.$router)
        }

        // getters
        sale.Aborted({ _sale: this.address }, range).get(getter)

        sale.Purchased({ _sale: this.address }, range).get(getter)

        sale.Confirmed({ _sale: this.address }, range).get(getter)

        const watchers = []
        // watchers
        if (status === 'Created') {
          const abortedEvent = sale.Aborted({ _sale: this.address })
          abortedEvent.watch(watcher)
          watchers.push(abortedEvent)
        }

        if (status === 'Created') {
          const purchasedEvent = sale.Purchased({ _sale: this.address })
          purchasedEvent.watch(watcher)
          watchers.push(purchasedEvent)
        }

        if (status === 'Locked') {
          const confirmedEvent = sale.Confirmed({ _sale: this.address })
          confirmedEvent.watch(watcher)
          watchers.push(confirmedEvent)
        }

        this.watchers.forEach((event) => { event.stopWatching() })
        this.watchers = watchers
      })
    }
  },
  watch: {
    address () {
      this.hydrate()
    }
  },
  mounted () {
    this.hydrate()
  },
  beforeDestroy () {
    this.watchers.forEach((event) => { event.stopWatching() })
  }
}
</script>

<style scoped>
.action {
  cursor: pointer;
}
</style>
