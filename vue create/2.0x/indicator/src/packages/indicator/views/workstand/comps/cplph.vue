<template>
  <div class="cplph flex-col">
    <div class="title_content flex-bet">
      <p class="lineTitle">差评率排行</p>
      <div class="tab">
        <span :class="params.queryOrgType === 'sjbm' ? 'active' : ''" @click="tabClick('sjbm')">市级部门</span>
        <span :class="params.queryOrgType === 'qh' ? 'active' : ''" @click="tabClick('qh')">区划</span>
      </div>
    </div>
    <div class="content flex-h-1">
      <tableList
        ref="tableList"
        :key-list="keyList"
        :params="params"
        :service="'workstand'"
        :api="'badEvaluationRateRank'"
        :show-index="false"
        :show-page="false"
        :handle-data="handleData"
        :defaultSort="defaultSort"
      ></tableList>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cplph',
  components: {
    tableList: () => import('@/components/table/tableList'),
  },
  data() {
    return {
      keyList: [
        {
          name: '排名',
          width: 50,
          render: (createElement, item) => {
            return createElement(
              'div',
              {
                class: {
                  'flex-col-center': true,
                },
              },
              [
                createElement('img', {
                  attrs: {
                    src: item.index < 3 ? require(`@indicator/assets/img/workstand/no${item.index + 1}.png`) : '',
                  },
                  class: {
                    mr5: true,
                  },
                }),
                createElement('span', {
                  domProps: {
                    innerHTML: item.index > 2 ? item.index + 1 : '',
                  },
                }),
              ]
            );
          },
        },
        {
          name: '责任单位',
          code: 'orgName',
        },
        {
          name: '差评率(%)',
          code: 'badEvaluationRate',
          width: 120,
          sortable: true,
          render: (createElement, item) => {
            return createElement('div', [
              createElement('span', {
                class: {
                  ell: true,
                },
                domProps: {
                  innerHTML: item.row.badEvaluationRate.toFixed(2),
                },
              }),
            ]);
          },
        },
        {
          name: '操作',
          width: 100,
          render: (createElement, item) => {
            return createElement('div', [
              createElement('span', {
                class: {
                  'text-btn': true,
                  ell: true,
                },
                domProps: {
                  innerHTML: '查看详情',
                },
                on: {
                  click: () => {
                    this.viewDetails(item.row);
                  },
                },
              }),
            ]);
          },
        },
      ],
      params: {
        queryOrgType: 'sjbm',
        reciveDateEnd: this.$moment().format('YYYY-MM-DD'),
        reciveDateStart: this.$moment().subtract(1, 'month').format('YYYY-MM-DD'),
      },
      defaultSort: { prop: 'badEvaluationRate', order: 'descending' },
    };
  },
  methods: {
    // 处理列表数据
    handleData(data) {
      data.forEach((item) => {
        item.badEvaluationRate = Number(item.badEvaluationRate);
      });
      return data;
    },
    tabClick(val) {
      this.params.queryOrgType = val;
      this.$refs.tableList.init();
    },
    viewDetails(item) {
      this.$router.push({
        name: 'evaluate',
        params: { id: item.orgCode, label: item.orgName, type: item.orgType },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cplph {
  height: 100%;
  .title_content {
    align-items: center;
    .tab {
      span {
        font-size: 14px;
        font-weight: 500;
        color: #666666;
        line-height: 20px;
        padding: 4px 12px;
        cursor: pointer;
        &.active {
          background: rgba(33, 127, 255, 0.1);
          border-radius: 15px;
          color: #217fff;
        }
      }
    }
  }
  .content {
    overflow: auto;
    margin-top: 16px;
  }
}
</style>
