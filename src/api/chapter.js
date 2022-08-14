import request from '@/utils/request'
const api_name = '/edu/chapter'

export const chapter = {
  getChapterVideo(courseId) {
    return request({
      url: `${api_name}/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  addOrUpdateChapter(chapter) {
    return request({
      url: `${api_name}/addOrUpdateChapter`,
      method: 'post',
      data: chapter
    })
  },
  getChapterById(courseId) {
    return request({
      url: `${api_name}/getChapterInfo/${courseId}`,
      method: 'get'
    })
  },
  delChapter(courseId) {
    return request({
      url: `${api_name}/delChapter/${courseId}`,
      method: 'delete'
    })
  }
}
