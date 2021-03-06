<template>
  <div class="editable-cell">
    <div v-if="editable" :class="['editable-cell-input-wrapper',singleEdit ? 'single-edit' : '']">
      <a-form :form="form">
        <a-form-item :colon="false" class="no-validate">
          <a-input
            v-if="showFormItem('input')"
            v-decorator="decorator"
            :placeholder="placeholder"
            @change="handleChange"
            autocomplete="off"
          />
          <a-input
            v-if="showFormItem('inputSearch')"
            v-decorator="decorator"
            :placeholder="placeholder"
            @change="handleChange"
            autocomplete="off"
          >
            <!-- <div slot="prefix">
              <a-button icon="edit"></a-button>
            </div>-->
            <btnQS
              slot="suffix"
              style="border: 0px;background-color: transparent; margin-right: -10px;"
            />
          </a-input>
          <a-input-number
            :min="min"
            :max="max"
            v-if="showFormItem('number')"
            v-decorator="decorator"
            :placeholder="placeholder"
            style="width:100%"
          />
          <a-switch
            v-if="showFormItem('switch')"
            v-decorator="decorator"
            :placeholder="placeholder"
            @change="handleChange"
            :value="value"
          />
          <a-date-picker
            :showTime="showTime"
            :format="format"
            v-if="showFormItem('datePicker')"
            v-decorator="decorator"
            :placeholder="placeholder"
          />
          <a-range-picker
            :showTime="showTime"
            :format="format"
            v-if="showFormItem('rangePicker')"
            v-decorator="decorator"
            :placeholder="placeholder"
          />
          <a-month-picker
            :showTime="showTime"
            :format="format"
            v-if="showFormItem('monthPicker')"
            v-decorator="decorator"
            :placeholder="placeholder"
          />
          <a-select
            v-if="showFormItem('select')"
            v-decorator="decorator"
            :placeholder="placeholder"
            @change="handleChange"
            :mode="selectMode"
            :labelInValue="selectLabelInValue"
          >
            <slot />
          </a-select>

          <!-- 单选框组件 -->
          <a-radio-group v-if="showFormItem('radioGroup')" v-decorator="decorator">
            <slot />
          </a-radio-group>
          <a-checkbox-group v-if="showFormItem('checkboxGroup')" v-decorator="decorator">
            <slot />
          </a-checkbox-group>

          <a-auto-complete
            v-if="showFormItem('autoComplete')"
            v-decorator="decorator"
            :placeholder="placeholder"
            @search="handleSearch"
            optionLabelProp="text"
            :disabled="notEdit"
            style="z-index:0"
          >
            <template slot="dataSource">
              <slot />
            </template>
          </a-auto-complete>
          <!-- upload组件插入 -->
          <template v-if="showFormItem('upload')" v-decorator="decorator">
            <div class="clearfix">
              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="uploadHandleChange"
              >
                <div v-if="fileList.length < 8">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </template>
        </a-form-item>
      </a-form>
      <a-icon v-if="singleEdit" type="check" class="editable-cell-icon-check" @click="check(true)" />
    </div>
    <div v-else :class="['editable-cell-text-wrapper',singleEdit ? 'single-edit' : '']">
      {{ getText || ' ' }}
      <a-icon v-if="singleEdit" type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
import btnQS from '../ButtonQuickSelect/BtnQuickSelect'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'logo.png',
          status: 'done',
          url: '../../assets/logo.png'
        }
      ],
      form: this.$form.createForm(this),
      editable: this.defaultEditable
    }
  },
  components: {
    btnQS
  },
  props: {
    // 非编辑模式下，显示文本
    text: {
      type: [Number, String, Array, Object]
    },
    // 编辑模式下组件值
    value: {
      type: [Number, String, Array, Object, Boolean],
      message: { type: [Number, String, Array, Object], default: '' }
    },
    // 表单组件类型
    formType: {
      validator (value) {
        return ['input', 'inputSearch', 'number', 'switch', 'datePicker', 'rangePicker', 'select', 'radioGroup', 'checkboxGroup', 'upload', 'monthPicker', 'autoComplete'].indexOf(value) !== -1
      },
      default: 'input'
    },
    // 表单校验
    decoratorOptions: {
      type: [Array, Object]
    },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    // 表单默认提示
    placeholder: { type: String, default: '请输入' },
    // 支持单元格单个编辑
    singleEdit: { type: Boolean, default: false },
    // 默认编辑模式
    defaultEditable: { type: Boolean, default: false },
    // 是否自动保存
    autoSave: { type: Boolean, default: false },
    // 日期组件设置
    format: { type: String, default: 'YYYY-MM-DD hh:mm:ss' },
    showTime: { type: [Boolean, Object], default: true },
    // 是否可编辑
    notEdit: { type: Boolean, default: false },
    // 选择框是否多选
    selectMode: { type: String, default: undefined },
    // 多选选择框属性
    selectLabelInValue: { type: Boolean, default: false },
    // 多选选择框默认值
    selectDefaultValue: { type: Array }
    // 单选框未选择的提示,无法实现
    // radioChecked: { type: String, default: '请选择' }
  },
  computed: {
    // 格式化文本
    getText () {
      if (typeof this.text === 'function') {
        return this.text()
      }
      return this.text
    },
    // 根据属性，合成表单验证装饰器
    decorator: {
      get () {
        // console.log('decorator')
        // console.log(this.decoratorOptions)
        if (this.decoratorOptions) {
          const itemDecorator = ['formName', {
            initialValue: this.value,
            ...this.decoratorOptions
          }]
          return itemDecorator
        }
        // console.log(this.value.type)
        const itemDecorator = ['formName', {
          initialValue: this.value
        }]
        // console.log('itemDecorator')
        // console.log(itemDecorator)
        return itemDecorator
      },
      set (value) {
        this.decorator[1].initialValue = value // 最后修改了msg
      }
    }
  },
  watch: {
    // 监视父页面是否可编辑属性，及时响应控件内切换
    defaultEditable (value) {
      this.editable = value
    }
  },
  methods: {
    // 判断表单是否
    showFormItem (formType) {
      return this.formType === formType
    },
    // 表单change事件
    handleChange (value) {
      // console.log(value)
      if (this.autoSave) {
        if (this.formType === 'input') {
          // console.log(value.target.value)
          this.$emit('valueChange', value.target.value)
        } else if (this.formType === 'select') {
          this.$emit('valueChange', value)
        }
        // else if (this.formType === 'radioGroup') {
        //   this.$emit('valueChange', value.target.value)
        //   // console.log(value.target.value)
        // }
      }
      // this.check(false);
    },
    // auto-complete 搜索
    handleSearch (value) {
      this.$emit('autoCompleteSearch', value)
    },
    // 表单校验
    validate () {
      const result = {
        success: false,
        value: ''
      }
      // console.log(this)
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.editable) {
            result.value = this.getText
          } else {
            // console.log('cell:values:')
            // console.log(values)
            result.value = values.formName
          }
          result.success = true
        }
      })
      return result
    },
    // 表单赋值
    setValue (value) {
      this.form.setFieldsValue({
        formName: value
      })
    },
    // 点击"对号"图标，校验通过后触发通知父组件
    check (flag) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (flag) {
            // 切换到只读模式
            this.editable = false
          }
          this.$emit('valueChange', values.formName)
        }
      })
    },
    // 切换到编辑模式
    edit () {
      this.editable = true
      this.decorator = this.value
    },
    radioChange (selected) {
      // console.log(selected.target.value)
      // console.log(this.record)
      // this.value = selected.target.value 错误用法
      console.log('radiochanged:' + this.value)
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    uploadHandleChange ({ fileList }) {
      this.fileList = fileList
    }
  },
  created () {
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
  margin-top: -9px;
  margin-bottom: -9px;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.editable-cell-input-wrapper.single-edit,
.editable-cell-text-wrapper.single-edit {
  padding-right: 24px;
}
.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
.editable-cell-icon {
  top: 3px;
  line-height: 18px;
  display: none;
}
.editable-cell-icon-check {
  top: 12px;
}
.no-validate {
  margin-bottom: 0;
}
</style>
