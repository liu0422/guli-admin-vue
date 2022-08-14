import request from '@/utils/request'
const api_name = '/edu/course'

export const course = {
  saveOrUpdateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/${courseInfo.id ? 'updateCourseInfo' : 'addCourseInfo'}`,
      method: 'post',
      data: courseInfo
    })
  },
  getInfoById(id) {
    return request({
      url: `${api_name}/getInfoById/${id}`,
      method: 'get'
    })
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getInfo(courseId) {
    return request({
      url: `${api_name}/getPublishInfo/${courseId}`,
      method: 'get'
    })
  },
  publishCourse(courseId) {
    return request({
      url: `${api_name}/publishInfo/${courseId}`,
      method: 'post'
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  delCourse(courseId) {
    return request({
      url: `${api_name}/delCourse/${courseId}`,
      method: 'delete'
    })
  }
}
