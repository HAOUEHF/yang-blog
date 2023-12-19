import request from '../index'


export const getList = (data: any) => {
    return request({
        url: '/hotlist',
        method: 'GET',
        data
    })
}