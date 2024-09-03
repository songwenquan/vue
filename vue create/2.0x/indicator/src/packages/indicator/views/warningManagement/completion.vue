/*
* @Author: wqsong2
* @Date: 2023/7/25 18:29
* @Desciption:超期办结预警
*/
<template>
  <div class="completion">
    <!--搜索-->
    <SearchForm ref="searchForm" :list="list" :more-button="moreButton" :Initialize="Initialize" @search="onSearch" />
    <div class="list-wrap">
      <tableTitle :matched="matched" show-right-btn @rightBtnClick="add">
        <span slot="rightBtn" class="jtgl">
          <el-button type="primary" size="small">导出</el-button>
        </span>
      </tableTitle>
      <tableList
        ref="tableList"
        :key-list="keyList"
        :params="params"
        :service="'management'"
        :api="'transact'"
        :show-index="false"
        :show-page="true"
        :handle-data="handleData"
      ></tableList>
  </div>
</template>

<script>
import SearchForm from '@indicator/comps/search-form';
import tableTitle from '@/components/table/tableTitle';
import tableList from '@/components/table/tableList';
import {  mapState } from 'vuex';
import { orgCode, time, exportExcel } from '@utils/utils';
export default {
  name: 'completion',
  components: {
    SearchForm,
    tableTitle,
    tableList,
  },
  data() {
    return {
      moreButton: false, // 是否展示更多按钮
      params: {}, // 搜索参数
      list: [
        { code: 'projNo', name: '申报号', span: 8, type: 1 },
        { code: 'warnLevel', name: '预警级别', span: 8, type: 2, dictKey: 'yjjb' },
        { code: 'serviceName', name: '事项名称', span: 8, type: 1 },
        { code: 'orgList', name: '区划及部门', span: 8, type: 3, fuc: orgCode },
        { code: 'itemTypeCode', name: '事项类型', span: 8, type: 2, dictKey: 'sxlx' },
        {
          code: 'acceptTime',
          name: '受理时间',
          span: 8,
          type: 4,
          fuc: time,
          pickerOptions: {
            onPick: ({ maxDate, minDate }) => {
              this.times = minDate.getTime();
              if (maxDate) {
                this.times = '';
              }
            },
            disabledDate: (time) => {
              return time.getTime() > new Date().getTime();
            },
          },
        },
      ], // 搜索条件
      keyList: [
        {
          name: '申报号',
          code: 'projNo',
          width: '200',
          fixed: true,
        },
        {
          name: '预警级别',
          code: 'warnLevelName',
          width: '100',
          fixed: true,
          render: (createElement, item) => {
            return createElement(
              'div',
              {
                class: {
                  'flex-col-center': true,
                },
              },
              [
                createElement('span', {
                  class: {
                    mr5: true,
                  },
                  style: {
                    backgroundColor:
                      item.row.warnLevel === 1 ? '#67c23a' : item.row.warnLevel === 2 ? '#f2e015' : '#ff0000',
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                  },
                }),
                createElement('span', {
                  domProps: {
                    innerHTML: item.row.warnLevelName,
                  },
                }),
              ]
            );
          },
        },
        {
          name: '事项名称',
          code: 'serviceName',
          width: '250',
        },
        {
          name: '事项类型',
          code: 'itemTypeName',
          width: '100',
        },
        {
          name: '地区',
          code: 'areaName',
          width: '100',
        },
        {
          name: '部门名称',
          code: 'deptName',
          width: '250',
        },
        {
          name: '办件来源',
          code: 'applyFromName',
          width: '100',
        },
        {
          name: '受理时间',
          code: 'acceptTime',
          width: '150',
        },
        {
          name: '承诺办结时限',
          code: 'shouldTransactTimeLimit',
          width: '150',
        },
        {
          name: '特殊程序',
          width: '150',
          render: (createElement, item) => {
            return createElement('div', [
              createElement('span', {
                class: {
                  'text-btn': item.row.sepcialApplyTimes !== '',
                  ell: true,
                },
                domProps: {
                  innerHTML: item.row.sepcialApplyTimes ? '特殊程序详情' : '--',
                },
                on: {
                  click: () => {
                    item.row.sepcialApplyTimes &&
                      this.$refs.supplement.changeDrawer('特殊程序', 'sepcialApplyTimes', item.row);
                  },
                },
              }),
            ]);
          },
        },
        {
          name: '数据分析时间',
          code: 'createTime',
          width: '200',
        },
      ],
    };
  },
  computed: {
    ...mapState('auth/menu', ['matched']),
  },
  methods: {
    // 查询
    onSearch(query) {
      this.$refs.tableList.init();
    },
    // 处理列表数据
    handleData(data) {
      return data.rows;
    },
    // 初始化执行方法
    Initialize(data) {
      this.params = data;
    },
    // 导出
    add() {
      const params = JSON.parse(JSON.stringify(this.params));
      delete params.receiveTime;
      delete params.acceptTime;
      const menuName = this.matched.menuName;
      exportExcel(params, 'management', 'transactExport', menuName);
    },
  },
};
</script>

<style scoped lang="scss">
.completion {
}
</style>
