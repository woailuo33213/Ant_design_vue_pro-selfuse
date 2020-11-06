<template>
  <div>
    <a-button style="border: 0px;background-color: transparent;" icon="search" @click="showModal" />
    <a-modal
      v-model="visible"
      title="弹出框"
      :ok-button-props="{ props: { disabled: false } }"
      :cancel-button-props="{ props: { disabled: false } }"
      @ok="handleOk"
    >
      <span>
        <!-- //TODO: 获取选择的文本内容,动态数据遍历时应该可以拿到，暂且不加。 -->
        <a-radio-group v-model="value" @change="onChange">
          <a-radio :style="radioStyle" :value="1">Option A</a-radio>
          <a-radio :style="radioStyle" :value="2">Option B</a-radio>
          <a-radio :style="radioStyle" :value="3">Option C</a-radio>
        </a-radio-group>
      </span>
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
      console.log(this.content)
      return this.value
    },
    handleCancel (e) {
      console.log(e)
      this.visible = false
    },
    onChange (e) {
      console.log('radio checked', e.target.value)
    }
  }
}
</script>

<style>
</style>
