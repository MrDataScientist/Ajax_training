<template lang="pug">
.list
  el-form.list-header(:model="filters", :inline="true")
    el-row
      el-col(:sm="4")
        h1: span Orders

      el-col(:sm="4")
        el-form-item
          el-input(v-model="filters.id", placeholder="OrderNumber")

      el-col(:sm="12")
        el-form-item
          el-checkbox-group(v-model="filters.state")
            el-checkbox-button(v-for="state in states", :label="state.value", :key="state.value") {{ state.label }}

      //- el-col(:sm="2")
      //-   el-form-item
      //-     el-button(@click="clearFilters") Clear

      el-col(:sm="4")
        el-dropdown.auto-update.fr(trigger="click", @command="changeAutoUpdate")
          el-button(:type="autoUpdate ? 'success' : 'danger'")
            span {{ 'Auto Update ' + (autoUpdate ? autoUpdate + 's' : 'Off') }}
            i.el-icon-caret-bottom.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(v-for="i in autoUpdateIntervals", :command="i", :key="i") {{ i ? i + 's' : 'Off' }}

      //- el-col(:sm="6")
      //-   el-form-item()
      //-     el-select(v-model="autoUpdate", clearable, placeholder="Auto Update", @change="changeAutoUpdate")
      //-       el-option(v-for="i in autoUpdateIntervals", :label="i ? i + 's' : 'Off'", :value="i", :key="i")

          //- el-select(v-model="filters.state", clearable, placeholder="Всички")
          //-   el-option(label="Налични", value="1")
          //-   el-option(label="Изчерпани", value="2")

  datatable(ref="datatable", :url="apiUrl", :filters="filters", default-order-by="createdAt", default-order-dir="descending", :showTopPagination="true")
    el-table-column(prop="id", label="Order number", min-width="15", sortable="custom")

    el-table-column(prop="Product.name", label="Product (token)", min-width="15")
      template(slot-scope="scope")
        div {{ scope.row.Product.name }}
        small ({{ scope.row.Product.token }})

    el-table-column(prop="state", label="State", min-width="10", sortable="custom")
      template(slot-scope="scope")
        el-tag(v-bind="statusTagType(scope.row.state)") {{ scope.row.state }}

    el-table-column(prop="CurrentWorkflow", label="Current plugin", min-width="15")
      template(slot-scope="scope")
        div {{ getCurrentTaskPlugins(scope.row) }}
        //- div {{ scope.row.Tasks && scope.row.Tasks.length ? scope.row.Tasks[0].Submodule.name : 'No ative module'}}

    el-table-column(prop="createdAt", label="Created/Updated", min-width="10", sortable="custom")
      template(slot-scope="scope")
        div: small {{ scope.row.createdAt | formatDate }}
        div: small {{ scope.row.updatedAt | formatDate }}

    el-table-column(prop="actions", label="Actions", min-width="25")
      template(slot-scope="scope")
        .action-buttons
          el-button(v-if="!scope.row.isApproved", type="success", @click="actionApproveClick(scope.row)") Approve
          el-button(@click="$router.push({path: `${url}/${scope.row[primaryKey]}/json`})") JSON
          el-button(@click="$router.push({path: `${url}/${scope.row[primaryKey]}/logs`})") Logs
          el-button(@click="$router.push({path: `${url}/${scope.row[primaryKey]}/tasks`})") Tasks

          el-dropdown(v-if="scope.row.state !== 'closed'", trigger="click")
            el-button
              span &bull;&bull;&bull;
              //- span &mldr;
              i.el-icon-caret-bottom.el-icon--right
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(@click.native="actionArchiveClick(scope.row)") Archive...
              el-dropdown-item(@click.native="actionRollbackClick(scope.row)", :disabled="scope.row.state === 'ready'") Rollback last task...
              el-dropdown-item(@click.native="actionResetClick(scope.row)") Reset...
              //- el-dropdown-item(@click.native="actionDeleteClick(scope.row)", divided) Delete...

  router-view
</template>

<script>
import Datatable from '../Datatable.vue'
import listMixin from '../../mixins/listMixin.js'
import config from '../../config'

export default {
  name: 'OrderList',
  mixins: [listMixin],
  data () {
    return {
      url: '/orders',
      apiUrl: '/orders',
      states: config.states,
      autoUpdateIntervals: [0, 2, 5, 10, 20, 30, 60, 120],
      autoUpdate: 0,
      filters: {
        state: config.states.map(state => state.value),
        id: '',
      }
    }
  },
  methods: {
    changeAutoUpdate(value) {
      this.autoUpdate = value
      clearInterval(this.autoUpdateTimer)
      if (this.autoUpdate) {
        this.autoUpdateTimer = setInterval(this.$refs.datatable.loadData, this.autoUpdate * 1000)
      }
    },
    statusTagType (status) {
      const s = config.states.find(s => status === s.value)
      return {
        type: s.type,
        color: s.color || ''
      }
    },
    getCurrentTaskPlugins (order) {
      let currentTask
      if (order.CurrentWorkflow && order.CurrentWorkflow.WorkflowTasks && order.CurrentWorkflow.WorkflowTasks) {
        currentTask = order.CurrentWorkflow.WorkflowTasks.find(task => ['new', 'processing', 'error'].includes(task.state))
      }
      return currentTask ? currentTask.Plugin.name : 'No active plugin'
    },
    actionApproveClick(order) {
      this.$confirm('Approve order?', 'Approve Order ' + order.id, {
        type: 'success',
        confirmButtonText: 'Approve'
      }).then(() => {
        this.$http.put(`${this.url}/${order.id}/approve`).then(response => {
          this.$refs.datatable.loadData()
        }).catch(error => {
          console.error(error)
          this.$notify.error({title: 'Error', message: 'Error approving order. Check console.'});
        })
      }).catch(() => {

      })
    },
    actionJsonClick(order) {
      this.$refs.orderJson.loadJson(order, `${this.url}/${order.id}/json`)
    },
    actionLogsClick(order) {
      this.$refs.orderLogs.loadLogs(order, `${this.url}/${order.id}/logs`)
    },
    actionTasksClick(order) {
      this.$refs.orderTasks.loadTasks(order, `${this.url}/${order.id}/tasks`)
    },
    actionArchiveClick(order) {
      this.$prompt('Description', 'Archive Order ' + order.id, {
        confirmButtonText: 'Archive'
      }).then(message => {
        this.$http.put(`${this.url}/${order.id}/archive`, {description: message.value}).then(response => {
          this.$refs.datatable.loadData()
        }).catch(error => {
          console.error(error)
          this.$notify.error({title: 'Error', message: 'Error archiving order. Check console.'});
        })
      }).catch(() => {

      })
    },
    actionRollbackClick(order) {
      this.$confirm('Rollback order from last working task?', 'Rollback Order ' + order.id, {
        type: 'warning',
        confirmButtonText: 'Rollback'
      }).then(() => {
        this.$http.put(`${this.url}/${order.id}/rollback`, {log: 'Order rollback by user'}).then(response => {
          this.$refs.datatable.loadData()
        }).catch(error => {
          console.error(error)
          this.$notify.error({title: 'Error', message: 'Error rollback order. Check console.'});
        })
      }).catch(() => {

      })
    },
    actionResetClick(order) {
      this.$confirm('Reset order from begining?', 'Reset Order ' + order.id, {
        type: 'warning',
        confirmButtonText: 'Reset'
      }).then(() => {
        this.$http.put(`${this.url}/${order.id}/reset`).then(response => {
          this.$refs.datatable.loadData()
        }).catch(error => {
          console.error(error)
          this.$notify.error({title: 'Error', message: 'Error reseting order. Check console.'});
        })
      }).catch(() => {

      })
    },
    actionDeleteClick(order) {
      this.$confirm('Delete order?', 'Reset Order ' + order.id, {
        type: 'error',
        confirmButtonText: 'Delete'
      }).then(() => {
        this.$http.delete(`${this.url}/${order.id}`).then(response => {
          this.$refs.datatable.loadData()
        }).catch(error => {
          console.error(error)
          this.$notify.error({title: 'Error', message: 'Error deleting order. Check console.'});
        })
      }).catch(() => {

      })
    }
  },
  components: {
    Datatable
  }
}
</script>