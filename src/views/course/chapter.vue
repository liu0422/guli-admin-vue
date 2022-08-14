<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="text" @click="openDialog">添加章节</el-button>
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button
              type="text"
              @click="addVideo(chapter.id)"
            >添加课时</el-button>
            <el-button
              type="text"
              @click="editChapter(chapter.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delChapter(chapter.id)"
            >删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="videoItem in chapter.children" :key="videoItem.id">
            <p>
              {{ videoItem.title }}
              <span class="acts">
                <el-button
                  type="text"
                  @click="editVideo(videoItem.id)"
                >编辑</el-button>
                <el-button
                  type="text"
                  @click="delVideo(videoItem.id)"
                >删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="next"
        >下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 章节 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapterInfo" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapterInfo.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapterInfo.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 小节 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form ref="videoForm" :model="video" label-width="120px">
        <el-form-item label="课时标题" prop="title">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序" prop="sort">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费" prop="isFree">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频" prop="videoSourceId">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-exceed="handleUploadExceed"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :file-list="fileList"
            :action="BASE_API + '/vod/video/uploadAiLiYunVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" style="margin-left:10px;" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { chapter } from '@/api/chapter'
import { video } from '@/api/video'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId: '',
      dialogChapterFormVisible: false,
      chapterInfo: {
        title: '',
        sort: 0,
        id: ''
      },
      dialogVideoFormVisible: false,
      video: {
        title: '',
        sort: '',
        isFree: 0,
        chapterId: '',
        videoSourceId: '',
        videoOriginalName: '',
        size: 0
      },
      fileList: [],
      BASE_API: process.env.VUE_APP_BASE_API // 接口API地址
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapterVideo()
    }
  },
  methods: {
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` })
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` })
    },
    getChapterVideo() {
      chapter.getChapterVideo(this.courseId).then((res) => {
        this.chapterVideoList = res.data.all
      })
    },
    openDialog() {
      this.dialogChapterFormVisible = true
      this.chapterInfo.title = ''
      this.chapterInfo.sort = 0
    },
    // 新增或修改
    saveOrUpdate() {
      this.chapterInfo.courseId = this.courseId
      chapter.addOrUpdateChapter(this.chapterInfo).then((res) => {
        this.$message({
          message: this.chapterInfo.id ? '修改成功' : '添加成功',
          type: 'success',
          onClose: () => {
            this.dialogChapterFormVisible = false
            this.getChapterVideo()
          }
        })
      })
    },
    // 编辑
    editChapter(id) {
      chapter.getChapterById(id).then((res) => {
        this.chapterInfo = res.data.chapter
        this.$nextTick(() => {
          this.dialogChapterFormVisible = true
        })
      })
    },
    delChapter(id) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.delChapter(id).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getChapterVideo()
        })
      })
    },
    // //////////////////////////小节////////////////////
    addVideo(id) {
      this.dialogVideoFormVisible = true
      this.video.chapterId = id
      this.fileList = []
      this.$nextTick(() => {
        this.$refs['videoForm'].resetFields()
      })
    },
    saveOrUpdateVideo() {
      this.video.courseId = this.courseId
      video.addOrUpdateVideo(this.video).then((res) => {
        this.$message({
          message: this.video.id ? '修改成功' : '添加成功',
          type: 'success',
          onClose: () => {
            this.dialogVideoFormVisible = false
            this.getChapterVideo()
          }
        })
      })
    },
    delVideo(id) {
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.delVideo(id).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getChapterVideo()
        })
      })
    },
    editVideo(id) {
      video.getVideoById(id).then((res) => {
        this.video = res.data.video
        console.log(this.video)
        this.$nextTick(() => {
          this.dialogVideoFormVisible = true
        })
      })
    },
    // 成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
      this.video.size = file.size
    },
    // 视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    handleVodRemove() {
      // 删除视频接口
      video.delALiVideo(this.video.videoSourceId).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success',
          onClose: () => {
            this.fileList = []
            this.video.videoSourceId = ''
            this.video.videoOriginalName = ''
            this.video.size = 0
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  /* float: left; */
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
