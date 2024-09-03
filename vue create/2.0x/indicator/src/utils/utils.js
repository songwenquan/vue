/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:公共方法
 */
import Vue from 'vue';
import Moment from 'moment'
const vm = new Vue();
// 菜单权限校验
export function checkPermission(key, val, arr) {
    let result = -1 // 初始值为-1，表示未找到
    if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] === val) {
                // console.log('匹配成功')
                result = i
                break // 匹配到目标值后，立即终止循环
            } else if (Array.isArray(arr[i].children)) {
                // console.log('匹配下一级')
                const subresult = checkPermission(key, val, arr[i].children)
                if (subresult !== -1) {
                    result = i
                    break // 匹配到目标值后，立即终止循环
                }
            }
        }
    } else {
        // console.log('菜单不存在')
        result = -1
    }
    return result
}
// 部门赋值自定义方法
export function orgCode(nodes, arr, keyValue) {
    const keyCode = keyValue ? keyValue[0] : 'orgCode';
    const keyType = keyValue ? keyValue[1] : 'orgType';
    if (!nodes) {
        arr[keyCode] = null
        arr[keyType] = ''
    } else {
        arr[keyCode] = nodes.id
        arr[keyType] = nodes.type
    }
    arr.orgList = [nodes];

}
// 时间赋值自定义方法
export function time(value, arr, code) {
    const list = ['receiveTime', 'acceptTime', 'receiveDate', 'assessTime']
    if (list.includes(code)) {
        if (value) {
            arr[code + 'Start'] = Moment(value[0]).format("YYYY-MM-DD")
            arr[code + 'End'] = Moment(value[1]).format("YYYY-MM-DD")
        } else {
            arr[code + 'Start'] = ''
            arr[code + 'End'] = ''
        }
    }
}
// 导出功能
export function exportExcel(params, service, api, menuName) {
    vm.$scmp_api[service][api](params).then(async (res) => {
        try {
            const blob = new Blob([res.data], { type: res.headers['content-type'] })
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            let filename;
            if (menuName) {
                filename = menuName + '.xls' // 这里是文件名
            } else {
                const contentDisposition = res.headers['content-disposition'];
                filename = contentDisposition && contentDisposition.split('filename=')[1];
                filename = decodeURIComponent(filename.split('.')[0]) + '.' + filename.split('.')[1]
            }
            link.download = filename;
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            vm.$message.success('导出成功');
        } catch (error) {
            vm.$message.error('导出失败');
        }
    })
}

export function fontChart(res) {
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    // 此处的3840 为设计稿的宽度，记得修改！
    const fontSize = clientWidth / 1920;
    return res * fontSize;
}

