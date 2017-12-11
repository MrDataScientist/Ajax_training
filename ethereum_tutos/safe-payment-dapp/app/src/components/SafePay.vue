<template>
  <div class="safe-pay">
    <div class="row">
      <div class="col-sm-6">
        <div class="panel panel-success">
          <div class="panel-heading">
            <div class="panel-title">Create Sale</div>
          </div>
          <div class="panel-body">
            <div id="msg"></div>
            <form id="create" @submit.prevent="createHandler">
              <div class="form-group">
                <label for="price">Price (ETH)</label>
                <input type="number" step="any" id="price" class="form-control" placeholder="10" v-model="price"/>
              </div>
              <button type="submit" class="btn btn-success">Create</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="panel panel-info">
          <div class="panel-heading">
            <div class="panel-title">Lookup Sale</div>
          </div>
          <div class="panel-body">
            <div id="msg"></div>
            <form id="lookup" @submit.prevent="lookupHandler">
              <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" class="form-control" placeholder="0xfcb08f41e92dab55fb5b52cb4ddb62bcc7c14271" v-model="address"/>
              </div>
              <button type="submit" class="btn btn-info">Lookup</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global web3:true */

// import * as types from '../store/mutation-types'

export default {
  name: 'safe-pay',
  data () {
    return {
      price: '',
      address: ''
    }
  },
  methods: {
    createHandler () {
      if (this.price === '' || isNaN(this.price) || parseFloat(this.price) === 0) {
        alert('invalid price: ' + this.price)
        return
      }

      const price = new web3.BigNumber(this.price)
      if (confirm(`Are you sure you would like to create a sale for ${this.price} ETH?

${price.times(2)} ETH will be transferred into the contract's account and held until the sale has been confirmed by the buyer at which point you will receive ${price.times(3)} ETH.`)) {
        this.$store.dispatch('createSale', { price, router: this.$router })
      }
    },
    lookupHandler () {
      if (this.address === '') {
        alert('invalid address: ' + this.address)
        return
      }

      this.$router.push({ name: 'sale', params: { address: this.address } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
