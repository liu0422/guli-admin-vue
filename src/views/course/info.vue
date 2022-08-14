<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>
      <el-form-item label="所属分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="firstChange"
        >
          <el-option
            v-for="item in firstLevel"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="courseInfo.subjectId"
          style="margin-left: 20px"
          placeholder="二级分类"
        >
          <el-option
            v-for="item in secondLevel"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="item in teachers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          v-model.number="courseInfo.lessonNum"
          :min="0"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <el-form-item label="课程简介">
        <el-input
          v-model="courseInfo.description"
          type="textarea"
          :rows="4"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/oss/upload/uploadFile'"
          class="avatar-uploader"
        >
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          v-model="courseInfo.price"
          :min="0"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate()"
        >保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { course } from '@/api/course'
import { teacher } from '@/api/teacher'
import { subject } from '@/api/subject'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        id: '',
        title: '',
        cover: '',
        lessonNum: 0,
        price: 0,
        description: '',
        teacherId: '',
        subjectParentId: '', // 二级分类
        subjectId: '' // 一级分类
      },
      teachers: [],
      firstLevel: [],
      secondLevel: [],
      BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
      courseId: ''
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getById()
    }
    this.getTeacherList()
    this.getSubjectList()
  },
  methods: {
    saveOrUpdate() {
      course.saveOrUpdateCourseInfo(this.courseInfo).then((result) => {
        this.$message({
          message: this.courseInfo.id ? '修改课程消息成功' : '添加课程消息成功',
          type: 'success'
        })
        this.$router.push({ path: '/course/chapter/' + result.data.courseId })
      })
    },
    getTeacherList() {
      teacher.findAllTeacher().then((res) => {
        this.teachers = res.data.list
      })
    },
    getById() {
      course.getInfoById(this.courseId).then((res) => {
        this.courseInfo = res.data.courseInfo
        this.getSubjectList()
      })
    },
    getSubjectList() {
      subject.treeList().then((res) => {
        this.firstLevel = res.data.items
        // 路径有参数,回显二级分类
        if (this.courseId) {
          const firstLevel = this.firstLevel.find(
            (v) => v.id === this.courseInfo.subjectParentId
          )
          if (firstLevel) {
            this.secondLevel = firstLevel.children
          }
        }
      })
    },
    firstChange(val) {
      this.courseInfo.subjectId = ''
      const first = this.firstLevel.find((v) => v.id === val)
      if (first) {
        this.secondLevel = first.children
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(res) // 上传响应
      console.log(URL.createObjectURL(file.raw)) // base64编码
      this.courseInfo.cover = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或者PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar {
  width: 90px;
  height: 90px;
  display: block;
}
.tinymce-container {
  line-height: 29px;
}
</style>
