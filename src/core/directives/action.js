import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/vueComponent/ant-design-vue-pro/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg // action权限名称
    const roles = store.getters.roles // 当前角色配置
    const elVal = vnode.context.$route.meta.permission // 当前路由的permission配置
    // 主操作：
    const permissionId = elVal instanceof String && [elVal] || elVal
    // 遍历当前用户的permission配置。
    roles.permissions.forEach(p => {
      // 如果用户没有当前路由权限，直接跳出。
      if (!permissionId.includes(p.permissionId)) {
        return
      }
      // 继续比对用户当前路由权限，如果不存在action权限，则尝试移除或隐藏目标元素。
      if (p.actionList && !p.actionList.includes(actionName)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

export default action
