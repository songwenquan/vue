/*
* @Author: wqsong2
* @Date: 2023/8/3 18:01
* @Desciption:
*/
<template>
  <div class="treeSelect">
    <Treeselect
      class="tree-select"
      :options="departmentData"
      :normalizer="defaultProps"
      :value="value ? localValue : null"
      value-format="object"
      :load-options="loadOptions"
      :disable-branch-nodes="false"
      clear-all-text="全部清除"
      no-options-text="暂无数据"
      no-results-text="暂无数据"
      no-children-text="暂无数据"
      loading-text="加载中"
      placeholder="请选择区划部门"
      :disabled="disabled"
      @input="selectTree"
      @select="onSelect"
    >
      <label slot="option-label" slot-scope="{ node, labelClassName }" :class="labelClassName" :title="node.label">
        {{ node.label }}
      </label>
      <div slot="value-label" slot-scope="{ node }">
        {{ getLabelName(node) }}
      </div>
    </Treeselect>
  </div>
</template>

<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { last } from 'lodash';
export default {
  name: 'treeSelect',
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    departmentData: {
      type: Array,
      default: () => {
        return null;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    getChildListFunc: {
      type: Function,
    },
  },
  components: {
    Treeselect,
  },
  computed: {
    localValue() {
      return last(this.value) || null;
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * @description: 替换节点name
     * @param {*} node 节点数据
     * @return {*}
     */
    getLabelName(node) {
      if (node.label.lastIndexOf('unknown') > -1) {
        return node.raw.label || node.raw.areaName;
      } else {
        return node.label;
      }
    },
    // 数据格式化处理
    defaultProps(node) {
      // 去掉children = []的children属性
      if (node.hasChild) {
        delete node.children;
      }
      return {
        id: node.id,
        type: node.type,
        // 将name转换成必填的label键
        label: node.areaName,
        children: node.children,
      };
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (this.getChildListFunc) {
          this.getChildListFunc(parentNode, callback);
        } else {
          this.$scmp_api.auth.selectDeptName({ parentCode: parentNode.id }).then((res) => {
            if (res.data.flag) {
              const data = [];
              res.data.data.map((item) => {
                data.push({
                  type: item.orgType,
                  areaName: item.orgName,
                  id: item.orgCode,
                  hasChild: !(item.orgType === 1),
                  children: null,
                });
              });
              if (data && data.length) {
                parentNode.children = data;
              } else {
                parentNode.children = undefined;
              }
              callback();
            } else {
              this.$message.error(res.data.errMsg);
            }
          });
        }
      }
    },
    // 数据回传
    selectTree(node) {
      if (!node) {
        this.$emit('change', node);
      }
    },
    onSelect(node) {
      this.$emit('change', node);
    },
  },
};
</script>

<style scoped lang="scss">
.treeSelect {
  height: 32px;
  ::v-deep .vue-treeselect__control {
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
  }
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    line-height: 31px;
  }
}
</style>
