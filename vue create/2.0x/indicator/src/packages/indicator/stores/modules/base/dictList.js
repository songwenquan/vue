/*
* @Author: wqsong2
* @Date: 2023/8/3 16:28
* @Desciption: 字典值处理
*/
import Vue from 'vue';
const vm = new Vue();
export default {
    state: {

    },
    getters: {
        // 返回对应字典值
        dictGetter: (state) => {
            return state
        },
    },
    actions: {
        getDicList({ state, commit }) {
            vm.$scmp_api.auth.dicts()
                .then((res) => {
                    for (const key in res.data.data) {
                        commit('SET_TYPE_CODE', {
                            dataType: key,
                            data: res.data.data[key],
                        });
                    }
                });

        },
    },
    mutations: {
        SET_TYPE_CODE(state, info) {
            state[info.dataType] = []
            state[info.dataType] = info.data.map((a) => {
                return {
                    label: a.dataName,
                    value: a.dataCode,
                    id: a.dataCode,
                };
            });
        },
    },
}
