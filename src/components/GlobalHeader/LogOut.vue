<template v-slot:overlay>
  <a-button ghost @click="handleLogout" style="border:0">
    <a-icon type="logout" />
  </a-button>
</template>

<script>
import { Modal } from 'ant-design-vue'
export default {
  name: 'LogOut',
  methods: {
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () { }
      })
    }
  }
}
</script>

<style>
</style>
