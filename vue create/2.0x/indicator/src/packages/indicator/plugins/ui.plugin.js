/*
 * @Author: wqsong2
 * @Date: 2023/7/27 19:08
 * @Description:UI引用配置
 */
import Vue from 'vue';
import Fragment from 'vue-fragment';
import 'element-ui/packages/theme-chalk/src/index.scss';
import ElementUI, {Message} from 'element-ui'
Vue.use(Fragment.Plugin);
Vue.use(ElementUI);
// 默认提示
Vue.prototype.$message = function(msg,duration) {
    return Message({
        message: msg,
        duration: duration || 4000
    });
};
// 错误提示
Vue.prototype.$message.error = function(msg,duration) {
    return Message.error({
        message: msg,
        duration: duration || 4000
    });
};
// 警告提示
Vue.prototype.$message.warning = function(msg,duration) {
    return Message.warning({
        message: msg,
        duration: duration || 4000
    });
};
// 成功提示
Vue.prototype.$message.success = function(msg,duration) {
    return Message.success({
        message: msg,
        duration: duration || 4000
    });
};
