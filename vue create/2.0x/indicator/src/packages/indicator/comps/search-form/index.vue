/*
* @Author: wqsong2
* @Date: 2023/8/3 15:42
* @Desciption:搜索条件 name:名字 code:字段 span:宽度 type:组件类型  dictkey:当前搜索条件字典key fuc:自定义方法
* @type 1:文本框 2:下拉框 3.部门tree 4.时间范围
*/
<template>
  <div class="searchForm bf">
    <el-form ref="searchForm" :model="searchForm" size="small" :label-width="labelWidth" class="adv-search-form">
      <el-row>
        <el-col v-for="(item, index) in list" :span="item.span || 8" :key="index">
          <el-form-item :label="item.name + ':'" v-if="item.type === 1">
            <el-input :placeholder="item.placeholder || '请输入'" v-model.trim="searchForm[item.code]"></el-input>
          </el-form-item>
          <el-form-item :label="item.name + ':'" v-if="item.type === 2">
            <el-select v-model="searchForm[item.code]" :multiple="item.multiple || false" :placeholder="item.placeholder || '请选择'" clearable
                       @change=" (val) => {item.change && item.change(val);}" >
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in item.dictList ? item.dictList : dictGetter[item.dictKey]" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="item.name + ':'" v-if="item.type === 3">
            <Treeselect @change="valChange($event, item.fuc, item.keyValue)" v-model="searchForm[item.code]" :departmentData="departmentData"></Treeselect>
          </el-form-item>
          <el-form-item :label="item.name + ':'" v-if="item.type === 4">
            <el-date-picker
              v-model="searchForm[item.code]"
              type="daterange"
              @change="valChange($event, item.fuc, item.code)"
              :clearable="true"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="item.pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="item.name + ':'" v-if="item.type === 'slot'">
            <slot name="slot" :item="item" :searchForm="searchForm"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="search-bar-btns mb20 ml10">
      <el-button class="wide-btn" size="small" type="primary" @click="onSearch">查询</el-button>
      <el-button size="small" @click="resetForm">清除</el-button>
      <div v-if="moreButton">
        <div class="button fz14 mt10 cursor-p" v-if="advancedSearch" @click="advancedSearch = !advancedSearch"
          >高级搜索<i class="el-icon-arrow-down"></i
        ></div>
        <div class="button fz14 mt10 cursor-p" v-else @click="advancedSearch = !advancedSearch"
          >收起<i class="el-icon-arrow-up"></i
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from '@indicator/comps/Treeselect';
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'searchForm',
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    labelWidth: {
      type: String,
      default: '100px',
    },
    Initialize: {
      // 数据二次处理
      type: Function,
    },
    // 高级查询条件是否显示
    moreButton: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Treeselect,
  },
  data() {
    return {
      searchForm: {},
      departmentData: [],
      advancedSearch: true,
      once: true,
    };
  },
  computed: {
    ...mapState('auth/user', ['userInfo']),
    ...mapGetters('base/dictList', ['dictGetter']),
  },
  methods: {
    // 数值变化调用回调方法
    valChange(nodes, callback, code) {
      callback(nodes, this.searchForm, code);
    },
    // 查询
    onSearch() {
      this.$emit('search', this.searchForm);
    },
    /**
     * @description: 清空
     * @return {*}
     */
    resetForm() {
      for (const key in this.searchForm) {
        if (Object.hasOwnProperty.call(this.searchForm, key)) {
          this.searchForm[key] = '';
        }
      }
      this.$emit('resetCallBack')
    },
  },
  watch: {
    list: {
      handler(val) {
        if (this.once) {
          val.forEach((item) => {
            this.$set(this.searchForm, item.code, item.value || null);
          });
          if (this.Initialize) {
            this.Initialize(this.searchForm);
          }
          this.once = false;
          console.log(this.searchForm)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    const data = {
      type: this.userInfo.dataRangeType,
      areaName: this.userInfo.dataRangeName,
      id: this.userInfo.dataRangeCode,
      hasChild: !(this.userInfo.dataRangeType === 1),
      children: null,
    };
    this.departmentData.push(data);
  },
};
</script>

<style scoped lang="scss">
.searchForm {
  display: flex;
  padding: 27px 10px 9px 10px;
  align-items: flex-start;
  margin-bottom: 16px;
  .el-form {
    flex: 1;
  }
  .button {
    color: #0079fe;
  }
  ::v-deep .el-form-item__content {
    height: 32px;
  }
}
</style>
