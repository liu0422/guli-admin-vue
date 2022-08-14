<template>
  <div>
    <el-form
      size="small"
      :inline="true"
      :model="queryTeacher"
      class="demo-form-inline"
    >
      <el-form-item label="姓名">
        <el-input v-model="queryTeacher.name" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item label="讲师级别">
        <el-select
          v-model="queryTeacher.level"
          placeholder="讲师级别"
          clearable
        >
          <el-option label="高级讲师" :value="1" />
          <el-option label="首席讲师" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-col :span="11">
          <el-form-item>
            <el-date-picker
              v-model="queryTeacher.begin"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item>
            <el-time-picker
              v-model="queryTeacher.end"
              type="date"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList">查询</el-button>
        <el-button type="success" @click="saveOrUpdate()">新增</el-button>
      </el-form-item>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="姓名"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="intro"
          label="简介"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="career"
          label="资历"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="level"
          label="级别"
        >
          <template slot-scope="scope">
            {{ scope.row.level == 1 ? '高级讲师' : '首席讲师' }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="gmtCreate"
          label="创建时间"
        />
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="saveOrUpdate(scope.row.id)"
            >修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="removeById(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </el-form>
    <addOrUpdate
      v-if="dialogShow"
      ref="addOrUpdate"
      @refreshData="getDataList()"
    />
  </div>
</template>

<script>
import { teacher } from '@/api/teacher'
import addOrUpdate from './teacherlist-add-or-update.vue'
export default {
  components: {
    addOrUpdate
  },
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      queryTeacher: {
        name: '',
        level: null,
        begin: '',
        end: ''
      },
      dialogShow: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      teacher
        .getTeacherList(this.pageNum, this.pageSize, this.queryTeacher)
        .then((res) => {
          if (res.code === 20000) {
            this.tableData = res.data.rows
            this.total = res.data.total
          }
        })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getDataList()
    },
    removeById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.deleteById(id).then((res) => {
          if (res.code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              onClose: () => {
                this.getDataList()
              }
            })
          }
        })
      })
    },
    saveOrUpdate(id) {
      this.dialogShow = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>
