<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="输入框">
          <a-input
            placeholder="输入框"
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入内容', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="日期">
          <a-date-picker
            name="buildTime"
            style="width: 100%"
            v-decorator="[
              'buildTime',
              {rules: [{ required: true, message: '请选择日期' }]}
            ]"
            showTime
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="upload">
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
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="审批人">
          <a-select
            placeholder="请选择审批员"
            v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]"
          >
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="单选框">
          <a-radio-group
            @change="radioChange"
            v-decorator="[ 'radioselect', {rules: [{ required: true, message: '请选择一项'}]} ]"
          >
            <a-radio :value="1">A test</a-radio>
            <a-radio :value="2">B</a-radio>
            <a-radio :value="3">C</a-radio>
            <a-radio :value="4" :disabled="true">D</a-radio>
            <a-radio :value="5" :disabled="true">E</a-radio>
            <a-radio :value="6" :disabled="true">F</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="多选框">
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
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :xl="{span: 24}" :lg="{span: 24}" :md="{span: 24}" :sm="24">
        <a-form-item label="richEditor">
          <rich-Text :text="content" @editorChange="editorChange" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import richText from '../../../components/Editor/QuillEditor'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  components: { richText },
  data () {
    return {
      form: this.$form.createForm(this),
      previewVisible: false,
      previewImage: '',
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
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate (rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback(new Error('需要以 user- 开头'))
      }
      callback()
    },
    radioChange (selected) {
      console.log(selected.target.value)
    },
    onChange (checkedValues) {
      console.log('checked = ', checkedValues)
    },
    editorChange: function (html) {
      this.content = html
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
    }
  }
}
</script>

<style scoped>
</style>
