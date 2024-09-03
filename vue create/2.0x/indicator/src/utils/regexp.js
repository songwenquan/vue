export const url = /^(https?:)?\/{2}/;
// 手机号 || 电话号码
export function validatePhone(str) {
    return /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/.test(str);
}
// 手机号 由以1 开头的11位数字组成
export function validateMobile(str) {
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!str) {
        return true;
    } else {
        return reg.test(str);
    }
}
