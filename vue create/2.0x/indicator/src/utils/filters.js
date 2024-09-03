/*
* @Author: wqsong2
* @Date: 2024/04/03 17:50
* @Desciption: 过滤器
*/
export function formatNumber (value) {
    if (!value) {
        return 0.00
    }
    const newVal = value.toString()
    const arr = newVal.split('.')
    const intpart = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    if (arr[1]) {
        return intpart + '.' + arr[1]
    } else {
        return intpart
    }
}
