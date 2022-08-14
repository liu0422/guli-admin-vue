<template>
  <el-dialog
    :title="form.id ? '修改' : '新增'"
    :visible.sync="dialogVisible"
    width="50%"
    @close="dialogClose()"
  >
    <el-form ref="ruleForm" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" type="number" />
      </el-form-item>
      <el-form-item label="级别">
        <el-select v-model="form.level" placeholder="级别">
          <el-option label="首席讲师" :value="1" />
          <el-option label="高级讲师" :value="2" />
        </el-select>
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="form.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
        >更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          :url="BASE_API + '/oss/upload/uploadFile'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item label="资历">
        <el-input v-model="form.intro" type="textarea" placeholder="" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.career" type="textarea" placeholder="" />
      </el-form-item>
      <el-form-item center>
        <el-button type="primary" @click="saveOrUpdate">立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { teacher } from '@/api/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: {
    ImageCropper, PanThumb
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        level: 1,
        intro: '',
        career: '',
        avatar: '',
        sort: 0
      },
      imagecropperKey: 0,
      imagecropperShow: false,
      dialogVisible: false,
      BASE_API: process.env.VUE_APP_BASE_API // 接口API地址
    }
  },
  methods: {
    init(id) {
      this.form.id = id || ''
      this.dialogVisible = true
      console.log(this.BASE_API)
      this.$nextTick(() => {
        // this.$refs['ruleForm'].resetFields()
        if (id) {
          this.getInfo(id)
        }
      })
    },
    getInfo(id) {
      teacher.getInfoById(id).then((res) => {
        if (res.code === 20000) {
          this.form.name = res.data.teacher.name
          this.form.level = res.data.teacher.level
          this.form.intro = res.data.teacher.intro
          this.form.career = res.data.teacher.career
          this.form.sort = res.data.teacher.sort
        }
      })
    },
    saveOrUpdate() {
      teacher.saveOrUpdate(this.form).then((res) => {
        if (res.code === 20000) {
          this.$message({
            message: this.form.id ? '修改成功' : '保存成功',
            type: 'success',
            onClose: () => {
              this.dialogVisible = false
              this.$emit('refreshData')
            }
          })
        }
      })
    },
    dialogClose() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    // 上传成功后的回调函数
    cropSuccess(data) {
      this.imagecropperShow = false
      this.form.avatar = data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },

    // 关闭上传组件
    close() {
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>
