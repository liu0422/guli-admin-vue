import request from '@/utils/request'
export const subject = {

  treeList() {
    return request({
      url: `/edu/subject/treeList`,
      method: 'get'
    })
  }
}
