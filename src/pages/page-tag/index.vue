<template>
  <d2-container type="card">
    <router-view :key="$route.path"/>
    <template slot="header">
      {{ name }}
      <el-button v-on:click="set4Tag">添加四级标签</el-button>
    </template>
    <div style="height: 400px; margin: -16px;">
      <!--      <SplitPane :min-percent='20' :default-percent='30' split="vertical">-->
      <SplitPane :default-percent='30' :min-percent='20' split="vertical">
        <template slot="paneL">
          <el-table
            :data="list"
            @row-click="clickRow">
            <el-table-column label="id" prop="id" align="center" v-if="false"/>
            <el-table-column label="四级标签名" prop="name" align="center"/>
            <!--            <el-table-column prop="rule" align="center" show-overflow-tooltip/>-->
            <!--            <el-table-column label="预览" width="120">-->
            <!--              <div-->
            <!--                slot-scope="scope"-->
            <!--                class="theme-preview"-->
            <!--                :style="{'backgroundImage': `url(${$baseUrl}${scope.row.preview})`}">-->
            <!--              </div>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column prop="address" align="center">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-button v-if="activeName === scope.row.name" type="success" icon="el-icon-check" round>已激活-->
            <!--                </el-button>-->
            <!--                <el-button v-else round @click="handleSelectTheme(scope.row.name)">使用</el-button>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
        </template>
        <template slot="paneR">
          <el-table
            :data="tagDetail">
            <el-table-column label="id" prop="id" align="center" v-if="false"/>
            <el-table-column label="五级标签名" prop="name" align="center"/>
            <el-table-column label="标签规则" prop="rule" align="center" show-overflow-tooltip/>
          </el-table>
        </template>
      </SplitPane>
    </div>
    <el-dialog :visible.sync="dialog4Visible" title='添加四级标签'>
      <el-row>标签名称
        <el-input id="tagName"></el-input>
      </el-row>
      <el-row>
        <el-select v-model="fourthTag.tag.parentId3" placeholder="一级标签">
          <el-option v-for="tag in this.temp.tag1" @change="this.temp.tag2=this.getChildren(self.value)" :label="tag.name" :value="tag.id" :key="tag.id"></el-option>
        </el-select>
        <el-select v-model="fourthTag.tag.parentId2" placeholder="二级标签">
          <el-option v-for="tag in this.temp.tag2" @change="this.temp.tag3=this.getChildren(self.value)" :label="tag.name" :value="tag.id" :key="tag.id"></el-option>
        </el-select>
        <el-select v-model="fourthTag.tag.pid" placeholder="三级标签">
          <el-option v-for="tag in this.temp.tag3" :label="tag.name" :value="tag.id"
                     :key="tag.id"></el-option>
        </el-select>
      </el-row>
      <span slot="footer" class="dialog-footer">
           <el-button @click="dialog4Visible = false">取消</el-button>
           <el-button type="primary" @click="dialog4Visible = false">确认</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { request } from '@/api/_service'

export default {
  name: 'page-tag',
  data () {
    return {
      name: null,
      id: null,
      list: [],
      tagDetail: [],
      dialog4Visible: false,
      temp: {
        tag1: null,
        tag2: null,
        tag3: null
      },
      fourthTag: {
        tag: {
          name: null,
          business: null,
          industry: null,
          rule: null,
          level: null,
          parentId3: null,
          parentId2: null,
          pid: null
        },
        model: {
          name: 'suanfa name',
          path: '',
          mainClass: 'program enter',
          args: 'model parameters',
          schedule: {
            dateRange: [
              '2022-04-16 00:00',
              '2022-04-23 00:00'
            ],
            startTime: '2022-04-16 00:00',
            endTime: '2022-04-23 00:00',
            frequency: '3'
          },
          state: 4
        }
      }
    }
  },

  async created () {
    this.id = this.$route.params.id
    const db = await this.$store.dispatch('d2admin/db/database')
    this.name = db.get('Self' + this.id).value().name
    // const menu = db.get('menu').value
    // console.log('menu', menu, [].concat(menu))
    // this.$store.commit('d2admin/menu/asideSet', [].concat(menu))
    this.addList()
  },
  methods: {
    getChildren: async function (pid) {
      const db = await this.$store.dispatch('d2admin/db/database')
      const tags = db.get('Prt' + pid).value()
      console.log('pid', pid)
      console.log('getChildren', tags)
      return tags
    },
    set4Tag: function () {
      // this.temp.tag1 = this.getChildren(-1)
      this.dialog4Visible = true
    },

    refreshFourthList: async function (pid) {
      var config = {
        url: '/tags/model2',
        method: 'get',
        transformResponse: [function (data) {
          return JSON.parse(data)
        }],
        params: {
          pid: pid
        }
      }
      const data = await request(config)
      // TODO: 刷新四级列表
    },
    async clickRow (row, column, event) {
      console.log('row', row)
      console.log('column', column)
      const tagId = row.id
      const db = await this.$store.dispatch('d2admin/db/database')
      var tags = db.get('Prt' + tagId).value()
      this.tagDetail = []
      // console.log('tags', tags)
      if (tags == null) return
      for (const tag of tags) {
        this.tagDetail.push({
          id: tag.id,
          name: tag.name,
          rule: tag.rule
        })
      }
    },
    async addList () {
      const db = await this.$store.dispatch('d2admin/db/database')
      const children = db.get('Prt' + this.id.toString()).value()
      if (children === null) return
      for (const child of children) {
        this.list.push({
          id: child.id,
          name: child.name,
          rule: child.rule
        })
      }
      console.log('list', this.list)
    }
  },
  beforeRouteUpdate: async (to, from, next) => {
    if (to.params.id) {
      console.log('from', from)
      console.log('to', to)
      to.meta.title = decodeURI(to.params.name)
    } else {
      to.meta.title = '详细信息'
    }
    next()
  },
  beforeRouteEnter: async (to, from, next) => {
    if (to.params.id) {
      console.log('from', from)
      console.log('to', to)
      to.meta.title = decodeURI(to.params.name)
    } else {
      to.meta.title = '详细信息'
    }
    next()
  }
}
</script>
