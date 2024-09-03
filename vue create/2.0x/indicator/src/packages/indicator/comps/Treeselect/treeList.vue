/*
* @Author: wqsong2
* @Date: 2023/8/23 11:43
* @Desciption:
*/
<template>
  <div class="treeList">
    <el-tree
      ref="tree"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :load="loadNode"
      lazy
      check-strictly
      show-checkbox
      @check="handleCheckChange"
      check-on-click-node
    ></el-tree>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'treeList',
  props: {
    defaultProps: {
      type: Object,
      default: () => ({}),
    },
    loadNodeData: {
      type: Array,
      default: () => [],
    },
    getChildListFunc: {
      type: Function,
    },
  },
  data() {
    return {
      treeData: [],
    };
  },
  computed: {
    ...mapState('auth/user', ['userInfo']),
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return this.treeGetList(resolve);
      }
      if (node.level >= 1) {
        return this.getChildList(node, resolve);
      }
    },
    async treeGetList(resolve) {
      if (this.loadNodeData.length > 0) {
        resolve(this.loadNodeData);
      } else {
        const data = [
          {
            type: this.userInfo.dataRangeType,
            areaName: this.userInfo.dataRangeName,
            id: this.userInfo.dataRangeCode,
            hasChild: !(this.userInfo.dataRangeType === 1),
          },
        ];
        resolve(data);
      }
    },
    async getChildList(node, resolve) {
      if (this.getChildListFunc) {
        this.getChildListFunc(node, resolve);
      } else {
        this.$scmp_api.auth.selectDeptName({ parentCode: node.data.id }).then((res) => {
          if (res.data.flag) {
            if (res.data.data && res.data.data.length > 0) {
              const data = [];
              res.data.data.map((item) => {
                data.push({
                  type: item.orgType,
                  areaName: item.orgName,
                  id: item.orgCode,
                  hasChild: !(item.orgType === 1),
                });
              });
              resolve(data);
            } else {
              const data = [];
              resolve(data);
            }
          } else {
            this.$message.error(res.data.errMsg);
          }
        });
      }
    },
    handleCheckChange(data, checked) {
      this.$emit('change', data, checked);
    },
  },
};
</script>

<style scoped lang="scss">
.treeList {
}
</style>
