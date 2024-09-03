/*
* @Author: wqsong2
* @Date: 2023/8/7 15:05
* @Desciption:列表通用组件
*/
<template>
  <div class="tableList">
    <el-table
      ref="table"
      :data="fatherList.length > 0 ? fatherList : listData"
      :header-cell-style="{ background: '#FAFAFB' }"
      @expand-change="expandChange"
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      :row-class-name="tableRowClassName"
      @select="selectRow"
      @select-all="selectAll"
      @row-click="rowClickFnc"
      :default-sort="defaultSort"
    >
      <el-table-column type="expand" v-if="showExpand">
        <template slot-scope="scope">
          <el-table :data="scope.row.expandData" class="table_child">
            <el-table-column
              v-for="(item, index1) in expandKey"
              :width="item.width"
              show-overflow-tooltip
              :key="index1"
              :label="item.name"
            >
              <template slot-scope="scope1">
                <span>{{ scope1.row[item.code] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column v-if="multiple" :reserve-selection="reserveSelection" type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="50" v-if="showIndex" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :fixed="item.fixed"
        :label="item.name"
        :min-width="item.minWidth"
        :width="item.width"
        v-for="(item, index) in keyList"
        :key="index"
        :sortable="item.sortable"
        :prop="item.code"
      >
        <template slot-scope="scope">
          <ex-slot v-if="item.render" :render="item.render" :row="scope.row" :index="scope.$index" :column="item" />
          <span v-else>{{ scope.row[item.code] || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="btnObj.name" :width="btnObj.width" :fixed="btnObj.fiexd || false" v-if="btnObj.name">
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in btnObj.list"
            v-show="item.hide === undefined ? true : item.hide"
            :key="index"
            @click="
              handleClick(scope.row, item.callBackName, scope.$index, fatherList.length > 0 ? fatherList : listData)
            "
            :disabled="!btnStatus(scope.row, item)"
            type="text"
            size="small"
          >
            {{ item.name }}
            <i
              class="el-icon-upload-success el-icon-circle-check"
              v-if="scope.row.attrFileDtoList && scope.row.attrFileDtoList.length > 0 && item.icon"
            ></i>
          </el-button>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <div class="pager-wrap tr mt10" v-if="listData.length > 0 && showPage">
      <el-pagination
        background
        :page-sizes="pageSizes"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index,
    };
    if (data.props.column) {
      params.column = data.props.column;
    }
    return data.props.render(h, params);
  },
};
export default {
  name: 'tableList',
  props: {
    // 父级传递数据
    fatherList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 展开行参数
    expandCode: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 展开行展示字段
    expandKey: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 列表展示项数据
    keyList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 获取class
    getTableRowClassName: {
      type: Function,
    },
    // 展开列表数据 二次处理
    expandHandleData: {
      type: Function,
    },
    // 是否显示展开行
    showExpand: {
      type: Boolean,
    },
    // 是否展示序号
    showIndex: {
      type: Boolean,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否在数据更新之后保留之前选中的数据
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    // 操作按钮相关
    btnObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 按钮显示逻辑
    btnShow: {
      type: Function,
    },
    // 页码切换数组
    pageSizes: {
      // 页码切换数组
      type: Array,
      default: () => {
        return [10, 20, 50, 100];
      },
    },
    // 一页个数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 是否展示分页
    showPage: {
      type: Boolean,
    },
    // 附加入参
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 数据二次处理
    handleData: {
      type: Function,
    },
    // 接口service
    service: {
      type: String,
    },
    // 接口api
    api: {
      type: String,
    },
    expandApi: {
      // 接口api
      type: String,
    },
    rowKey: {
      type: String,
    },
    rowClick: {
      // 当前行点击
      type: Function,
    },
    // 排序字段
    defaultSort: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    exSlot: exSlot,
  },
  data() {
    return {
      pager: {
        pageNum: 1,
        pageSize: 10,
      }, // 分页
      listData: [], // 列表数据
      total: 0, // 列表总数
      expandRowKeys: [],
      select: [], // 列表选中数据
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获取列表数据
    init() {
      this.pager.pageNum = 1;
      this.getList();
    },
    getList() {
      this.expandRowKeys = [];
      this.$nextTick(() => {
        const params = this.showPage
          ? Object.assign({}, this.pager, this.params, {
              pageNum: this.pager.pageNum,
            })
          : this.params;
        delete params.receiveTime;
        delete params.acceptTime;
        delete params.receiveDate;
        delete params.assessTime;
        delete params.orgList;
        delete params.reveiveTime;
        this.service &&
          this.api &&
          this.$scmp_api[this.service][this.api](params).then(async (res) => {
            if (res.data.flag) {
              this.total = this.showPage ? res.data.data.total : 0;
              if (this.handleData) {
                this.listData = this.handleData(res.data.data);
              } else if (this.showPage) {
                this.listData = res.data.data.rows;
              } else {
                this.listData = res.data.data;
              }
              this.$nextTick(() => {
                this.multiple && this.setCheckedRows();
              });
            } else {
              this.$message.error(res.data.errMsg);
              this.listData = [];
            }
          });
      });
    },
    // 展开行功能
    // 展开行
    expandChange(a, expanded) {
      if (expanded.includes(a)) {
        const params = {};
        this.expandCode.forEach((item1) => {
          params[item1] = a[item1];
        });
        // eslint-disable-next-line no-eval
        this.expandApi &&
          eval(`this.$scmp_api.${this.expandApi}`)(params)
            .then((res) => {
              if (res.data.flag) {
                if (this.expandHandleData) {
                  res.data.data = this.expandHandleData(res.data.data);
                }
                this.$set(a, 'expandData', res.data.data);
              } else {
                throw new Error(res.message);
              }
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
      }
    },
    // 某行自定义class名字
    tableRowClassName({ row, rowIndex }) {
      if (this.getTableRowClassName) {
        return this.getTableRowClassName(row);
      } else {
        return '';
      }
    },
    // 列表按钮是否显示
    btnStatus(item, btn) {
      if (this.btnShow) {
        return this.btnShow(item, btn);
      } else {
        return true;
      }
    },
    // 列表按钮点击
    handleClick(item, callBackName, index, scope) {
      this.$emit('handleClick', item, callBackName, index, scope);
    },
    // 分页大小变更
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getList();
    },
    // 翻页事件
    handleCurrentChange(val) {
      this.pager.pageNum = val;
      this.getList();
    },
    // 获取row的key值
    getRowKeys(row) {
      return row[this.rowKey];
    },
    // 全选勾选列表操作
    selectAll(selection) {
      if (selection.length > 0) {
        // 选中
        selection.forEach((item) => {
          if (!this.select.some((child) => child[this.rowKey] === item[this.rowKey])) {
            this.select.push(item);
          }
        });
      } else {
        this.select = this.select.filter(
          (item) => !this.listData.some((obj) => obj[this.rowKey] === item[this.rowKey])
        );
      }
    },
    /**
     * @description: 行数据勾选
     * @param {*} selection 选中数据
     * @param {*} row 当前行数据
     * @return {*}
     */
    selectRow(selection, row) {
      if (selection.some((item) => item[this.rowKey] === row[this.rowKey])) {
        // 选中添加
        if (!this.select.some((child) => child[this.rowKey] === row[this.rowKey])) {
          this.select.push(row);
        }
      } else {
        // 删除
        this.select = this.select.filter((item) => item[this.rowKey] !== row[this.rowKey]);
      }
    },
    /**
     * @description: 回显已勾选的数据
     * @return {*}
     */
    setCheckedRows() {
      this.listData.forEach((item) => {
        this.select.forEach((child) => {
          if (item[this.rowKey] === child[this.rowKey]) {
            this.$refs.table.toggleRowSelection(item, true);
          }
        });
      });
    },
    /**
     * @description: 行点击
     * @param {*} item 数据
     * @return {*}
     */
    rowClickFnc(item) {
      this.rowClick && this.rowClick(item);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .expanded + tr {
  > td {
    padding: 0 !important;
    border-bottom: none;
  }
}
</style>
