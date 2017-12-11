<template>
  <div class="error">
    <div class="row">
      <div class="col-sm-12">
        <div class="panel panel-danger">
          <div class="panel-heading">
            <div class="panel-title">Error</div>
          </div>
          <div class="panel-body">
            <pre>{{ error }}</pre>
            <router-link class="btn btn-primary" :to="{ name: 'home' }">Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'not-found',
  computed: {
    ...mapGetters({
      error: 'error'
    })
  }
}
</script>

<style scoped>
</style>
