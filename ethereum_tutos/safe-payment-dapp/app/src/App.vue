<template>
  <div id="app">
    <div class="container" :class="{loading: loading}">
      <div class="page-header">
        <router-link :to="{name: 'home'}"><h1>Safe Pay <small>make remote purchases securely with ether</small></h1></router-link>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <transition name="fade">
      <div id="loading" v-if="loading">
        <div class="panel panel-default">
          <div class="panel-heading">
            <div class="panel-title">{{ loadingText }}</div>
          </div>
          <div class="panel-body">
            <div class="progress">
              <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* global web3:true */

import Web3 from 'web3'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      accountInterval: null
    }
  },
  computed: {
    ...mapGetters({
      account: 'account',
      loading: 'loading',
      loadingText: 'loadingText'
    })
  },
  mounted () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 === 'undefined') {
      console.error('No web3 detected. Please use MetaMask for development. https://metamask.io/')
      return
    }

    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)

    // keep account updated if user decides to switch
    this.$store.dispatch('setAccount', { account: web3.eth.accounts[0], router: this.$router })
    this.accountInterval = setInterval(() => {
      const account = web3.eth.accounts[0]
      if (account !== this.account) {
        this.$store.dispatch('updateAccount', { account, router: this.$router })
      }
    }, 100)
  },
  beforeDestroy () {
    clearInterval(this.accountInterval)
  }
}
</script>

<style lang="scss">
a:hover, a:focus {
  text-decoration: none;
}

a h1 {
  color: rgb(51, 51, 51);
}

* {
  box-sizing: border-box;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

#app {
  > .container {
    transition: filter 200ms;
    &.loading {
      filter: blur(5px) grayscale(100%);
    }
  }

  #loading {
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background-color: transparent;
    position: absolute;
    padding: 1em;

    .panel {
      position: relative;
      top: 50%;
      margin: -47px auto 0 auto;
      max-width: 500px;

      .progress {
        margin-bottom: 0;
      }
    }
  }
}
</style>
