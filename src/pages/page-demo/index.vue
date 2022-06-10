<template>
  <d2-container>
    <template slot="header">header</template>
    Hello World
    <el-button id="btnid" name="btn" v-on:click="getTag(-1); setMenu()">按钮</el-button>
    <el-button v-on:click="addRoleHandle">弹出对话框</el-button>
    <template slot="footer">footer</template>

    <el-dialog :visible.sync="dialogVisible" title='New Role'>
      <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取消</el-button>
           <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        </span>
    </el-dialog>

  </d2-container>
</template>

<script>
import { request } from '@/api/_service'
// import { deteleObject } from '@/libs/util.repeatDelete'
// import {menuHeader menuAside} from '@/menu'
import { uniqueId } from 'lodash'
// import Dialog from '@/pages/addtag-fourth'

export default {
  data () {
    return {
      dialogVisible: false
    }
  },
  // components: { Dialog },
  methods: {
    addRoleHandle () {
      this.dialogVisible = true
    },
    getTag: async function (pid) {
      console.log('function : getTag')
      var config = {
        // `url` 是用于请求的服务器 URL
        url: '/tags',
        // `method` 是创建请求时使用的方法
        method: 'get', // 默认是 get
        // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
        transformResponse: [function (data) {
          // 对 data 进行任意转换处理
          return JSON.parse(data)
        }],
        // `params` 是即将与请求一起发送的 URL 参数
        // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
        params: {
          pid: pid
        }
      }
      const data = await request(config)
      // 最后一层的节点
      if (data.length === 0) {
        return
      }

      const db = await this.$store.dispatch('d2admin/db/database')
      // 可以根据父节点id，找到子节点。所有子节点的parentid都是一样的，取第一个即可
      db.set('Prt' + data[0].pid, data).write()
      // console.log('Prt----------------' + data[0]['pid'])
      // 可以根据id找到节点，所有子节点加入
      data.forEach((tagItem) => {
        db.set('Self' + tagItem.id, tagItem).write()
        // console.log('pid:' + pid + '\tid:' + tagItem['id'])
        this.getTag(tagItem.id)
      })
    },
    //
    // saveMenu: async function () {
    //   const db = await this.$store.dispatch('d2admin/db/database')
    //   var header = this.$store.state.d2admin.menu.header
    //
    // },

    getMenu: async function (pid) {
      var menu = []
      const db = await this.$store.dispatch('d2admin/db/database')
      var children = db.get('Prt' + pid.toString()).value()
      if (children == null || children[0].level >= 4) {
        return []
      }
      for (const child of children) {
        var selfMenu = {
          path: (child.level === 3) ? '/page-tag/' + child.id + '/' + encodeURI(child.name) : uniqueId('d2-menu-empty-'),
          // path: (child.level === 3) ? '/page-tag/' + child.id : uniqueId('d2-menu-empty-'),
          title: child.name
        }
        // if (child.level === 3) {
        //   Object.assign(selfMenu, { path: '/page-tag/' + child.id + '/' + child.name })
        // }
        const childrenMenu = await this.getMenu(child.id)
        if (childrenMenu.length > 0) {
          menu.push(Object.assign(selfMenu, { children: childrenMenu }))
        } else {
          menu.push(selfMenu)
        }
      }
      return menu
    },

    setMenu: async function () {
      const menu = await this.getMenu(-1)
      console.log('menu-set', menu)
      const db = await this.$store.dispatch('d2admin/db/database')
      db.set('menu', menu).write()
      const temp = db.get('menu').value()
      console.log('menu-get', temp)
      console.log('---------------')
      menu.forEach((key, value) => console.log(key, value))
      console.log('---------------')
      var header = this.$store.state.d2admin.menu.header
      header.forEach((key, value) => console.log(key, value))
      var aside = this.$store.state.d2admin.menu.aside
      aside.forEach((key, value) => console.log(key, value))
      this.$store.commit('d2admin/menu/headerSet', header.concat(menu))
      this.$store.commit('d2admin/menu/asideSet', aside.concat(menu))
    }

    // funclick: function (event) {
    //   var menu = menuHeader
    //   alert(menuHeader.toString())
    //   for(var i=0; i<menu.length; i++){
    //     alert(typeof this.$store.state.d2admin.menu.header)
    //     // (new Map(Object.entries(menu[i])).forEach((key, value) => alert(key.toString() + value.toString())))
    //     if(menu[i]["title"] == "目录"){
    //       menu[i]["children"].push(
    //         {
    //           path: '/demo/plugins',
    //           title: '插件',
    //           icon: 'plug'
    //         }
    //       )
    //     }
    //   }
    //   this.$store.commit('d2admin/menu/headerSet', menu)
    // }
  }
}

</script>
