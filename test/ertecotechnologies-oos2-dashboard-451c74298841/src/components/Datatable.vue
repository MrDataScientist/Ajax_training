<template lang="pug">
.datatable(v-loading.body="loading")
  el-row(v-if="showTopPagination")
    el-col(:span="24")
      el-pagination(
        layout="prev, pager, next",
        :current-page.sync="pageNo",
        :page-size="pageSize",
        :page-sizes="[10, 20, 50, 100]",
        :total="filteredCount"
      )
  el-row
    el-col(:span="24")
      el-table(
        border,
        style="width:100%",
        :data="records",
        :row-class-name="rowClassName",
        :highlight-current-row="false",
        :default-sort="{prop: defaultOrderBy, order: defaultOrderDir}",
        @sort-change='onSortChange'
      )
        slot
  el-row
    el-col(:span="24")
      el-pagination(
        layout="prev, pager, next, sizes, ->, total, slot",
        :current-page.sync="pageNo",
        :page-size="pageSize",
        :page-sizes="[10, 20, 50, 100]",
        :total="filteredCount",
        @size-change="onPageSizeChange"
      )
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Datatable',
  props: {
    url: { type: String, default: ''},
    filters: {type: Object},
    defaultPageSize: {type: Number, default: 10},
    defaultOrderBy: {type: String, default: null},
    defaultOrderDir: {type: String, default: 'ascending'},
    showTopPagination: {type: Boolean, default: false},
    rowClassName: {}
  },
  data () {
    return {
      loading: true,
      records: [],
      totalCount: 0,
      filteredCount: 0,
      pageNo: 1,
      pageSize: this.defaultPageSize,
      orderBy: this.defaultOrderBy,
      orderDir: this.defaultOrderDir
    }
  },
  computed: {},
  methods: {
    // onPageChange (page) {
    //   this.pageNo = page
    //   this.loadData()
    // },
    onPageSizeChange (size) {
      this.pageSize = size
    },
    onSortChange (sort) {
      // this.pageNo = 1
      this.orderBy = sort.prop
      this.orderDir = sort.order
      // this.orderDir = sort.order == 'ascending' ? 'asc' : sort.order == 'descending' ? 'desc' : sort.order
      // this.loadData()
    },
    loadData () {
      this.loading = true
      this.$http.get(this.url, {
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          orderBy: this.orderBy,
          orderDir: this.orderDir === 'descending' ? 'desc' : 'asc',
          ...this.filters
        }
      }).then(response => {
        Object.keys(this.$data).forEach(key => {
          if (response.data[key] !== undefined) {
            Vue.set(this.$data, key, response.data[key])
          }
        })
        this.loading = false
      }).catch(error => {
        console.error(error)
        this.loading = false
        this.$notify.error({title: 'Error', message: 'Error loading records. Check console.'});
      })
    }
  },
  created () {
    const checkAndLoad = () => {
      if (this.pageNo === 1) {
        this.loadData()
      } else {
        this.pageNo = 1
      }
    }

    this.$watch('filters', checkAndLoad, {deep: true, immediate: true})
    this.$watch(() => [this.pageSize, this.orderBy, this.orderDir].join('_'), checkAndLoad)

    // If pageNo change
    this.$watch('pageNo', () => {
      this.loadData()
    })
  }
}
</script>