<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="tree"
      :data="treeList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import { subject } from '@/api/subject'
export default {
  data() {
    return {
      filterText: '',
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    //   忽略大小写比较
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    getTreeList() {
      subject.treeList().then((res) => {
        if (res.code === 20000) {
          this.treeList = res.data.items
        }
      })
    }
  }
}
</script>
