<template lang="pug">
.list.workflow(v-if="product", v-loading="loading")
  .list-header
    el-row
      el-col(:sm="16")
        h1 {{ product.name }} ({{ product.token }}) - Workflow
      //- el-col(:sm="6")
      //-   el-select(placeholder="Add submodule", @input="addWorkflow", :value="null")
      //-     el-option(v-for="submodule in submodules", :key="submodule.submoduleID", :label="submodule.name", :value="submodule.submoduleID")
      el-col(:sm="8")
        el-button.fr(type="success", icon="el-icon-plus", @click="newRecord") Add Task
  el-row
    el-col(:sm="24")
      el-table.tasks-table(:data="tasks", row-key="id", ref="table", border)
        el-table-column(prop="id", label="Task ID", :min-width="50")
        el-table-column(prop="Plugin.name", label="Plugin", :min-width="100")
        //- el-table-column(prop="priority", label="Priority", :min-width="50")
        el-table-column(prop="blockers", label="Blockers", :min-width="300")
          template(slot-scope="scope")
            small(v-for="blocker in scope.row.blockers") {{ tasks[blocker - 1].Plugin.name }} (Task ID: {{ tasks[blocker - 1].id }})

        el-table-column(prop="actions", label="Actions", min-width="120")
          template(slot-scope="scope")
            .action-buttons
              el-button(@click="$router.push({path: `${url}/${scope.row.ProductId}/tasks/${scope.row.id}/blockers`})") Blockers
              el-button(@click="$router.push({path: `${url}/${scope.row.ProductId}/tasks/${scope.row.id}`})") Edit
              el-button(type="danger", @click="deleteTask(scope.row)") Delete

  router-link(:to="url")
    el-button(:style="{marginTop: '20px'}")
      i.el-icon-arrow-left
      span Back to products

  router-view
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'ProductTaskList',
  props: {},
  data () {
    return {
      apiUrl: '/products',
      url: '/products',
      primaryKey: 'productID',
      loading: true,
      product: null,
      plugins: [],
      tasks: [],
    }
  },
  computed: {
  },
  methods: {
    newRecord () {
      this.$router.push({path: `${this.url}/${this.$route.params.id}/tasks/new`})
    },
    loadTasks () {
      this.loading = true
      this.tasks = []
      this.$http.get(`/products/${this.$route.params.id}`)
        .then(response => {
          this.product = response.data
          this.$http.get(`/products/${this.$route.params.id}/tasks`)
            .then(response => {
              this.loading = false
              this.tasks = response.data
              this.handleSort()
            })
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$notify.error({title: 'Error', message: 'Error loading tasks. Check console.'});
        })
    },
    deleteTask (task) {
      this.$confirm(`Delete task ?`, 'Delete', {
        confirmButtonText: 'Delete',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`/products/${task.ProductId}/tasks/${task.id}`)
            .then(response => {
              this.$notify({title: 'Deleted', message: 'Record deleted', type: 'success'})
              this.loadTasks()
            })
            .catch(err => {
              console.log(err)
              this.$notify.error({title: 'Error', message: 'Error deleting record. Check console.'})
            })
        })
        .catch(() => {

        })
    },
    updateWorkflow (tasks) {
      const newOrder = tasks.map(task => ({
        id: task.id,
        priority: task.priority,
        blockers: task.blockers
      }))
      this.loading = true
      this.$http.put(`/products/${this.product.id}/tasks`, {tasks: newOrder})
        .then(response => {
          this.loadTasks()
        })
        .catch(err => {
          console.log(err)
          this.$notify.error({title: 'Error', message: 'Error updating tasks order. Check console.'});
          this.loadTasks()
        })
    },
    handleSort () {
      if (this.tasks.length) {
        // Initialize sortable after vue renders
        this.$nextTick(function () {
          if (this.sortable) {
            this.sortable.destroy()
          }
          this.sortable = Sortable.create(document.querySelector('.tasks-table .el-table__body-wrapper tbody'), {
            onEnd: (e => {
              if (e.newIndex === e.oldIndex) {
                return
              }

              // Clone array and swap elements
              const newOrdered = JSON.parse(JSON.stringify(this.tasks))
              newOrdered.splice(e.newIndex, 0, newOrdered.splice(e.oldIndex, 1)[0])

              // Set new priorities
              let validBlockers = true
              newOrdered.forEach((t, taskIndex) => {
                t.priority = taskIndex + 1
              })

              // Check if blockers are valid and fix blockers
              newOrdered.forEach((t, taskIndex) => {
                t.blockers = t.blockers.map((b, blockerIndex) => {
                  if (b >= t.priority) {
                    validBlockers = false
                  }

                  const oldTask = this.tasks.find(t => t.priority === b)
                  const newTask = newOrdered.find(t => t.id ===  oldTask.id)

                  return newTask.priority
                })
              })

              // this.tasks = newOrdered

              if (validBlockers) {
                this.updateWorkflow(newOrdered)
              } else {
                this.$notify.error({title: 'Error', message: 'Invalid blockers'});
                this.loadTasks()
              }
            })
          })

        })

      }
    }
  },
  watch: {
    $route () {
      // console.info(this.$options.name, this.$route.path, this.url)
      if (this.$route.path === `${this.url}/${this.product.id}/tasks`) {
        this.loadTasks()
      }
    }
  },
  beforeDestroy () {
    if (this.sortable) {
      this.sortable.destroy()
    }
  },
  mounted () {
    this.loadTasks()
  }
}
</script>