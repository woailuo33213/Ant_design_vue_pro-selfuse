<template>
  <page-header-wrapper :title="false">
    <a-card class="card" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <label>
                姓名:
                <a-form-item>
                  <a-input v-model="queryParam.name" placeholder="请输入姓名" />
                </a-form-item>
              </label>
            </a-col>
            <a-col :md="8" :sm="24">
              <label>
                国籍:
                <a-form-item>
                  <a-select @change="countryChange" placeholder="请选择">
                    <a-select-option value="1">China</a-select-option>
                    <a-select-option value="0">U.S.A</a-select-option>
                  </a-select>
                </a-form-item>
              </label>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <label>
                  性别:
                  <a-form-item>
                    <a-radio-group @change="radioChange">
                      <a-radio :value="1">男</a-radio>
                      <a-radio :value="0">女</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </label>
              </a-col>
              <a-col :md="8" :sm="24">
                <label>
                  更新日期:
                  <a-form-item>
                    <a-date-picker
                      v-model="queryParam.date"
                      style="width: 100%"
                      placeholder="请输入更新日期"
                      showTime
                    />
                  </a-form-item>
                </label>
              </a-col>
              <a-col :md="8" :sm="24">
                <label>
                  使用状态:
                  <a-form-item>
                    <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                      <a-select-option value="0">全部</a-select-option>
                      <a-select-option value="1">关闭</a-select-option>
                      <a-select-option value="2">运行中</a-select-option>
                    </a-select>
                  </a-form-item>
                </label>
              </a-col>
              <a-col :md="8" :sm="24">
                <label>
                  标签选择:
                  <a-form-item>
                    <a-checkbox-group @change="onChange" style="width: 100%">
                      <a-checkbox value="A">A</a-checkbox>
                      <a-checkbox value="B">B</a-checkbox>
                      <a-checkbox value="C">C</a-checkbox>
                      <a-checkbox value="D">D</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </label>
              </a-col>
            </template>
            <div style="margin-top:20px">
              <a-col :md="!advanced && 8 || 24" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
                >
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </div>
          </a-row>
        </a-form>
      </div>
      <!-- 此处selectedRowKeys.legth不生效。v-action:edit 原因是action没检测到权限，不渲染 -->
      <!-- <a-dropdown v-action:edit v-show="selectedRowKeys.length > 0"> -->
      <!-- 详见src/core/directives/action.js -->
    </a-card>
    <a-card class="card">
      <div class="table-operator">
        <!-- <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button> -->
        <a-button type="primary" icon="plus">
          <!-- //TODO: 跳转的动画没实现 -->
          <router-link class="default" to="/form/base-form">新建</router-link>
        </a-button>
        <div style="display:inline-block;" v-show="selectedRowKeys.length > 0">
          <a-button @click="deleteSelection">
            <a-icon type="delete" />删除
          </a-button>
          <a-button>
            <a-icon type="lock" />锁定
          </a-button>
          <a-button>
            <a-icon type="edit" />修改
          </a-button>
        </div>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="rowSelection"
        :customRow="customRow"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">订阅报警</a>
          </template>
        </span>-->
      </s-table>
      <!-- <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk" />-->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '规则编号',
    dataIndex: 'no'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    needTotal: true,
    customRender: (text) => text + ' 次'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: '150px',
  //   scopedSlots: { customRender: 'action' }
  // }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters)
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: []

    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: 'radio'
      }
    }

  },
  methods: {
    customRow (record, index) {
      index++
      return {
        on: {
          click: (e) => {
            console.log(record, index)
            this.selectedRowKeys = [index]
            this.selectedRows = [record]
          }
        }
      }
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.log('selectChanged，selectedRowKeys:' + this.selectedRowKeys + '||' + selectedRowKeys + 'selectedRows:' + this.selectedRows + '||' + selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log(selectedRows[0].key)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    radioChange (selected) {
      // console.log(selected.target.value)
      if (selected.target.value) {
        this.queryParam.sex = '男'
      } else {
        this.queryParam.sex = '女'
      }
    },
    countryChange (selected) {
      // console.log(selected) 0/1
      this.queryParam.countryCode = selected
      if (selected) {
        this.queryParam.countryName = 'China'
      } else {
        this.queryParam.countryName = 'U.S.A'
      }
    },
    onChange (checkedValues) {
      // console.log('checked = ', checkedValues)
      this.queryParam.checkedValues = checkedValues
    },
    deleteSelection (checkedValues) {
      // TODO:待数据格式改为json时把mock数据删掉，再写删除、新增、锁定的逻辑。
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
.default {
  color: #fff;
}
</style>
