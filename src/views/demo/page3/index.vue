<template>
  <d2-container>
    <template slot="header">Page 3 header</template>
    Hello World
    <b>{{ ID }}</b>
  </d2-container>
</template>

<script>
export default {
  name: 'page3',
  data () {
    return { ID: this.$route.params.id }
  },

  beforeRouteUpdate: (to, from, next) => {
    if (to.params.id) {
      console.log('from', from)
      console.log('to', to)
      // to.key = to.params.id + to.params.name;
      to.meta.title = to.params.id
    } else {
      to.meta.title = '详细信息'
    }
    next()
  }
}
// // 设置组件
// var User = {
//   template: `
//     <div>
//     这是用户 {{ $route.params.id }} 的功能
//     <input type="text">
//     </div>`,
//   // 由于组件没有重新创建，所以生命周期钩子只能执行一次
//   // created() {
//   //   console.log('创建实例');
//   // }
//   watch: {
//     $route(route) {
//       // console.log(route);
//       console.log(route.params.id);
//     }
//   }
// };
// // 设置路由规则
// var routes = [
//   {
//     path: '/user/:id', component: User
//   }
// ];
// var router = new VueRouter({routes});
// var vm = new Vue({
//   el: '#app',
//   router
// });
</script>
