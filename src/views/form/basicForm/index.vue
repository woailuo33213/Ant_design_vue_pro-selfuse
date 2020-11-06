<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="输入框"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入内容' }]}
            ]"
            name="name"
            placeholder="输入框"
          >
            <!-- <a-button slot="suffix" style="border: 0px;background-color: transparent; margin-right: -10px;" icon="search" @click="console.log(1)"/> -->
            <btnQS
              slot="suffix"
              style="border: 0px;background-color: transparent; margin-right: -10px;"
            ></btnQS>
          </a-input>
          <a-input
            v-decorator="[
              'namedisabled',
              {rules: [{ required: false, message: '请输入内容' }]}
            ]"
            name="namedisabled"
            placeholder="输入框禁用"
            :disabled="true"
          ></a-input>
        </a-form-item>
        <a-form-item
          label="日期"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-date-picker
            name="buildTime"
            style="width: 100%"
            v-decorator="[
              'buildTime',
              {rules: [{ required: true, message: '请选择日期' }]}
            ]"
          />
          <a-date-picker name="buildTimedisabled" style="width: 100%" :disabled="true" />
        </a-form-item>
        <a-form-item
          label="时间"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-time-picker
            name="Time"
            style="width: 100%"
            v-decorator="['time-picker', {rules: [{ required: true, message: '请选择时间' }]}
            ]"
          />
          <a-time-picker name="Timedisabled" style="width: 100%" :disabled="true" />
        </a-form-item>
        <a-form-item
          label="文本域"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-textarea
            rows="4"
            placeholder="文本域"
            v-decorator="[
              'textarea',
              {rules: [{ required: true, message: '请输入点东西' }]}
            ]"
          />
          <a-textarea rows="2" placeholder="文本域禁用" :disabled="true" style="resize: none;" />
        </a-form-item>
        <a-form-item
          label="下拉菜单"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-select
            label-in-value
            :default-value="{ key: 'lucy' }"
            style="width: 100%"
            @change="selectionChange"
          >
            <a-select-option value="jack">Jack (100)</a-select-option>
            <a-select-option value="lucy">Lucy (101)</a-select-option>
          </a-select>
          <a-select
            label-in-value
            :default-value="{ key: 'mark' }"
            style="width: 100%"
            :disabled="true"
          >
            <a-select-option value="mark">mark (102)</a-select-option>
            <a-select-option value="javis">javis (53)</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="单选框"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <!-- help="客户、邀评人默认被分享" -->
          <!-- 单选框底部提示信息↑ -->
          <a-radio-group @change="radioChange">
            <a-radio :value="1">A</a-radio>
            <a-radio :value="2">B</a-radio>
            <a-radio :value="3">C</a-radio>
            <a-radio :value="4" :disabled="true">D</a-radio>
            <a-radio :value="5" :disabled="true">E</a-radio>
            <a-radio :value="6" :disabled="true">F</a-radio>
          </a-radio-group>
          <!-- <a-form-item v-show="form.getFieldValue('target') === 2">
            <a-select mode="multiple">
              <a-select-option value="4">同事一</a-select-option>
              <a-select-option value="5">同事二</a-select-option>
              <a-select-option value="6">同事三</a-select-option>
            </a-select>
          </a-form-item>-->
        </a-form-item>
        <a-form-item
          label="多选框"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-checkbox-group @change="onChange" style="width: 100%">
            <a-checkbox value="A">A</a-checkbox>
            <a-checkbox value="B">B</a-checkbox>
            <a-checkbox value="C">C</a-checkbox>
            <a-checkbox value="D">D</a-checkbox>
            <a-checkbox value="E" :disabled="true">E</a-checkbox>
            <a-checkbox value="F" :disabled="true">F</a-checkbox>
            <a-checkbox value="G" :disabled="true">G</a-checkbox>
            <a-checkbox value="H" :disabled="true">H</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item
          label="upload"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <div class="clearfix">
            <a-upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
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
        </a-form-item>
        <a-form-item
          label="richEditor"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <rich-Text :text="content" @editorChange="editorChange" />
        </a-form-item>
        <a-form-item
          label="开关"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-switch checked-children="开" un-checked-children="关" default-checked />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import richText from '../../../components/Editor/QuillEditor.vue'
import btnQS from '../../../components/ButtonQuickSelect/BtnQuickSelect.vue'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'BaseForm',
  components: { richText, btnQS },
  data () {
    return {
      form: this.$form.createForm(this),
      size: 'default',
      previewVisible: false,
      previewImage: '',
      value: '',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      content: ''
    }
  },
  methods: {
    // handler
    inputSelectionChange () {
      console.log('1')
    },
    selectionChange (value) {
      console.log(value) // { key: "lucy", label: "Lucy (101)" }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    onChange (checkedValues) {
      console.log('checked = ', checkedValues)
    },
    radioChange (selected) {
      console.log(selected.target.value)
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
    handleChange ({ fileList }) {
      this.fileList = fileList
    },
    editorChange: function (html) {
      this.content = html
    }
  }
}
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
