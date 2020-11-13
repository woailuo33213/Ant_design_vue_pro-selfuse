<template>
  <page-header-wrapper :title="false">
    <a-card class="card" title="仓库管理" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" />
    </a-card>
    <a-card class="card">
      <div>
        <a-table
          bordered
          :dataSource="dataSource"
          :columns="columns"
          :scroll="{ x:1300 }"
          :pagination="false"
        >
          <template slot="name" slot-scope="text, record">
            <editable-cell
              :ref="`name_${record.key}`"
              :defaultEditable="record.editable"
              :autoSave="true"
              :required="true"
              formType="inputSearch"
              :decoratorOptions="rules.name"
              placeholder="请输入"
              :value="text"
              :text="text"
              @valueChange="onCellChange(record.key, 'name', $event)"
            />
          </template>

          <template slot="age" slot-scope="text, record">
            <editable-cell
              :ref="`age_${record.key}`"
              decoratorType="integer"
              formType="number"
              :defaultEditable="record.editable"
              :decoratorOptions="rules.age"
              :required="true"
              :min="10"
              :max="34"
              :value="text"
              :text="text"
              placeholder="请输入"
            />
          </template>

          <template slot="date" slot-scope="text, record">
            <editable-cell
              :ref="`date_${record.key}`"
              formType="datePicker"
              :defaultEditable="record.editable"
              :required="true"
              placeholder="请输入日期"
              :value="record.date!==''?moment(record.date, dateFormat):''"
              :text="text"
            />
          </template>
          <template slot="country" slot-scope="text, record">
            <editable-cell
              :ref="`countryCode_${record.key}`"
              formType="select"
              :defaultEditable="record.editable"
              :required="true"
              message="请选择国籍"
              :value="record.countryCode"
              :text="record.countryName"
            >
              <a-select-option value="01">China</a-select-option>
              <a-select-option value="02">U.S.A</a-select-option>
            </editable-cell>
          </template>

          <template slot="hasCar" slot-scope="text, record">
            <editable-cell
              :ref="`hasCar_${record.key}`"
              formType="switch"
              :defaultEditable="record.editable"
              :decoratorOptions="rules.hasCar"
              :required="true"
              message="请选择是否有car"
              :value="text"
              :text="text?'有':'没有'"
            />
          </template>

          <template slot="sex" slot-scope="text, record">
            <editable-cell
              :ref="`sex_${record.key}`"
              formType="radioGroup"
              :defaultEditable="record.editable"
              :required="true"
              :value="record.sexCode"
              :text="record.sexName"
            >
              <!-- TODO:// validate undefined 于 advancedForm -->
              <a-radio value="1">男</a-radio>
              <a-radio value="0">女</a-radio>
            </editable-cell>
          </template>
          <!-- <template slot="email" slot-scope="text, record">
            <editable-cell
              :ref="`email_${record.key}`"
              :defaultEditable="record.editable"
              :required="true"
              formType="autoComplete"
              :decoratorOptions="rules.email"
              placeholder="请输入"
              :value="text"
              :text="text"
              @autoCompleteSearch="handleSearch($event,record.key)"
            >
              <a-select-option
                v-for="email in emailList"
                :key="email"
                :text="email"
                :value="email"
              >{{ email }}</a-select-option>
            </editable-cell>
          </template>-->

          <template slot="address" slot-scope="text, record">
            <editable-cell
              :text="text"
              :decoratorOptions="rules.address"
              :singleEdit="true"
              :value="text"
              :defaultEditable="record.editable"
              @valueChange="onCellChange(record.key, 'address', $event)"
            />
          </template>

          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable && !record.isNew">
                <a @click="() => save(record.key)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
                <a-divider type="vertical" />
              </span>
              <span v-else-if="record.editable && record.isNew">
                <a @click="() => save(record.key)">保存</a>
                <a-divider type="vertical" />
                <a v-if="dataSource.length" @click="onDelete(record.key)">取消</a>
              </span>
              <span v-else>
                <a @click="() => edit(record.key)">编辑</a>
                <a-divider type="vertical" />
              </span>
              <span>
                <a v-if="dataSource.length && !record.isNew" @click="onDelete(record.key)">删除</a>
              </span>
            </div>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="handleAdd"
        >新增成员</a-button>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button type="primary" @click="handleSub">提交</a-button>
        </a-form-item>
      </div>
    </a-card>
    <!-- <a-layout-footer class="footer">

    </a-layout-footer>-->
  </page-header-wrapper>
</template>

<script>
import RepositoryForm from './RepositoryForm'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import EditableCell from '@/components/EditableCell/cell'

import moment from 'moment'
export default {
  name: 'AdvancedForm',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm,
    EditableCell
  },
  data () {
    return {
      signData: [],
      mulData: [],
      dateFormat: 'YYYY-MM-DD hh:mm:ss',
      dataSource: [
        {
          key: '0',
          name: '张三',
          age: 16,
          hasCar: true,
          countryCode: '01',
          countryName: 'China',
          date: '2016-06-18 18:02:20',
          address: '山东省烟台市芝罘区 祥和中学',
          sexName: '男',
          sexCode: 1
        },
        {
          key: '1',
          name: 'Edward King',
          age: 33,
          hasCar: false,
          countryCode: '02',
          countryName: 'U.S.A',
          date: '2008-12-05 14:55:21',
          address: 'London, Park Lane no. 1',
          sexName: '女',
          sexCode: 0
        }
      ],
      count: 2,
      columns: [
        // {
        //   title: 'key',
        //   dataIndex: 'key',
        //   width: '40px',
        //   scopedSlots: { customRender: 'key' }
        // },
        {
          title: 'name',
          dataIndex: 'name',
          width: '180px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'age',
          dataIndex: 'age',
          width: '95px',
          scopedSlots: { customRender: 'age' }
        },
        {
          title: '日期',
          dataIndex: 'date',
          width: '200px',
          scopedSlots: { customRender: 'date' }
        },
        // {
        //   title: '月份',
        //   dataIndex: 'month',
        //   width: '150',
        //   scopedSlots: { customRender: 'month' }
        // },
        {
          title: '国籍',
          dataIndex: 'country',
          width: '100px',
          scopedSlots: { customRender: 'country' }
        },
        {
          title: '汽车',
          dataIndex: 'hasCar',
          width: '100px',
          scopedSlots: { customRender: 'hasCar' }
        },
        {
          title: 'address',
          dataIndex: 'address',
          width: '150px',
          scopedSlots: { customRender: 'address' }
        },
        {
          title: 'sex',
          dataIndex: 'sex',
          width: '150px',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          // fixed: 'right',
          width: '190px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      fields: ['name', 'age', 'date', 'hasCar', 'countryCode', 'countryName', 'sexCode', 'sexName'],
      rules: {
        name: {
          rules: [{
            required: true,
            message: '请输入姓名'
          }]
        },
        age: {
          rules: [{
            required: true,
            message: '请选择年龄'
          }]
        },
        hasCar: {
          valuePropName: 'checked'
        },
        address: {
          rules: [{
            message: '最长支持30位',
            max: 30
          }]
        }
      }
    }
  },
  methods: {
    moment,
    // 模糊搜索
    // handleSearch (value) {
    //   let result
    //   if (!value || value.indexOf('@') >= 0) {
    //     result = []
    //   } else {
    //     result = ['gmail.com', '163.com', 'qq.com', 'outlook.com'].map(domain => `${value}@${domain}`)
    //   }
    //   this.emailList = result
    // },
    // input Change事件
    onCellChange (key, dataIndex, value) {
      console.log(`${dataIndex}：${value} `)
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    // 删除
    onDelete (key) {
      // 拷贝数组数据
      const dataSource = [...this.dataSource]
      // 过滤移除当前项目
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    // 点击编辑
    edit (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.dataSource = newData
      }
    },
    // 点击保存
    save (key) {
      this.validateRow(key, this.fields, (err, values) => {
        if (!err) {
          values.isNew = false
          values.date = values.date.format('YYYY-MM-DD hh:mm:ss')
          // values.month = values.month.format('YYYY-MM')
          if (values.countryCode === '01') {
            values.countryName = 'China'
          } else if (values.countryCode === '02') {
            values.countryName = 'U.S.A'
          }
          console.log(values)
          if (values.sexCode === '1') {
            values.sexName = '男'
          } else if (values.sexCode === '0') {
            values.sexName = '女'
          }
          const newData = [...this.dataSource]
          const row = newData.find(item => key === item.key)
          if (row) {
            // 用户数据合并到原对象上
            Object.assign(row, values)
            delete row.editable
            this.signData = row
            console.log('单行保存row', row)
            // target 保存了最新行数据，可以提价到后台
            this.dataSource = newData
          }
        }
      })
    },
    // 点击取消
    cancel (key) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.dataSource = newData
      }
    },
    // validateRow可以提取为公共函数
    validateRow (key, fields, callback) {
      // 查找验证是否通过
      const row = {}
      let err = false
      // forEach 对每一个验证，可以更改为some满足一个就提醒
      fields.forEach(filed => {
        const refName = `${filed}_${key}`
        const result = this.$refs[refName].validate()
        row[filed] = result.value
        if (!result.success) {
          err = true
        }
      })
      callback(err, row)
    },
    handleSub () {
      const Data = [...this.dataSource]
      console.log(Data)
    },
    // 批量保存正在修改的数据,并不会改变文本框和按钮的状态，废弃。
    handleSave () {
      const newData = [...this.dataSource]
      // 找出处于可编辑行
      const rows = newData.filter(row => {
        return row.editable
      })
      let count = 0
      // 一个个校验行
      rows.forEach(row => {
        this.validateRow(row.key, this.fields, (err, values) => {
          if (!err) {
            values.date = values.date.format('YYYY-MM-DD hh:mm:ss')
            // values.month = values.month.format('YYYY-MM-DD')
            // 行记录数据合并到row中
            Object.assign(row, values)
            count++
          }
        })
      })
      // 最终数据在rows中;
      if (rows.length === count) {
        // 数据在rows,提交数据
        this.mulData = rows
        console.log('批量多行rows', rows)
      }
    },
    // 点击提交
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: '',
        age: '',
        hasCar: false,
        birthday: moment().format('YYYY-MM-DD hh:mm:ss'),
        // month: moment().format('YYYY-MM'),
        address: '',
        email: '',
        countryCode: '01',
        editable: true,
        isNew: true
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
.editable-row-operations a {
  margin-right: 8px;
}
li {
  text-align: left;
}
pre {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.65);
  color: #ccc;
}
.footer {
  position: fixed;
  bottom: 0px;
  background-color: #fff;
  // border-top: 1px solid #ccc;
  width: 120%;
  height: 2em;
}
</style>
