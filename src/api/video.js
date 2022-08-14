import request from '@/utils/request'
const api_name = '/edu/video'

export const video = {
  addOrUpdateVideo(video) {
    return request({
      url: `${api_name}/addOrUpdateVideo`,
      method: 'post',
      data: video
    })
  },
  getVideoById(courseId) {
    return request({
      url: `${api_name}/getVideoInfo/${courseId}`,
      method: 'get'
    })
  },
  delVideo(courseId) {
    return request({
      url: `${api_name}/delVideo/${courseId}`,
      method: 'delete'
    })
  },
  delALiVideo(id) {
    return request({
      url: `/vod/video/delVideoById/${id}`,
      method: 'delete'
    })
  }
}
