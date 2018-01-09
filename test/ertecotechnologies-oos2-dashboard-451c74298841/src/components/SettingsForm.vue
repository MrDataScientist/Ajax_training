<template lang="pug">
.settings-form
  el-form(v-loading.body="loading", label-position="right", label-width="120px" ref="form", :model="settings")
    el-form-item(v-for="def in definitions", :prop="def.name", :label="def.name", :key="def.name")
      el-input(v-if="def.type === 'string'", v-model="settings[def.name]", :required="def.required", @input="onChange")
      el-input(v-if="def.type === 'text'", type="textarea", v-model="settings[def.name]", :required="def.required", @input="onChange")
</template>

<script>
export default {
  name: 'SettingsForm',
  props: ['value', 'pluginId', 'source', 'scope'],
  data () {
    return {
      loading: true,
      definitions: [],
      settings: {}
    }
  },
  computed: {},
  methods: {
    loadDefinition () {
      this.loading = true
      this.$http.get(`/plugins/settings-definition`, {
        params: {
          pluginId: this.pluginId || '',
          source: this.source || '',
          scope: this.scope
        }
      })
      .then(response => {
        this.loading = false
        this.definitions = response.data

        this.definitions.forEach(def => {
          if (this.value[def.name] === undefined) {
            this.$set(this.settings, def.name, def.default || '')
          } else {
            this.$set(this.settings, def.name, this.value[def.name])
          }
        })
        this.$emit('input', this.settings)
      })
      .catch(err => {
        this.loading = false
        this.$notify.error({title: 'Error', message: 'Error loading settings. Check console.'})
        console.log(err)
      })
    },
    onChange () {
      this.$emit('input', this.settings)
    }
  },
  created () {
    this.$watch('pluginId', (newValue, oldValue) => {
      if (newValue && newValue !== 'new') {
        this.loadDefinition()
      } else {
        this.loading = false
        this.definitions = []
      }
    }, {
      immediate: true
    }),
    this.$watch('source', (newValue, oldValue) => {
      if (newValue) {
        this.loadDefinition()
      } else {
        this.loading = false
        this.definitions = []
      }
    }, {
      immediate: true
    })
  }
}
</script>

<style lang="stylus">
.settings-form
  textarea
    height 300px
</style>