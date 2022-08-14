import request from '@/utils/request'
export const teacher = {
  findAllTeacher() {
    return request({
      url: `/edu/teacher/findAll`,
      method: 'get'
      // json requestBoay 用data
    })
  },
  getTeacherList(pageNum, pageSize, params) {
    return request({
      url: `/edu/teacher/queryPage/${pageNum}/${pageSize}`,
      method: 'post',
      // json requestBoay 用data
      data: params
    })
  },
  deleteById(id) {
    return request({
      url: `/edu/teacher/deleteById/${id}`,
      method: 'delete'
    })
  },
  saveOrUpdate(params) {
    return request({
      url: `/edu/teacher/${params.id ? 'update' : 'add'}`,
      method: 'post',
      data: params
    })
  },
  getInfoById(id) {
    return request({
      url: `/edu/teacher/getTeacher/${id}`,
      method: 'get'
    })
  }
}

// export function getTeacherList(pageNum, pageSize, params) {
//   return request({
//     url: `/edu/teacher/queryPage/${pageNum}/${pageSize}`,
//     method: 'post',
//     params
//   })
// }
