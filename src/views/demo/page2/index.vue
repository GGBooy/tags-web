<template>
  <d2-container type="card">
    <template slot="header">
      <el-form>
        <el-row  :gutter="20">
          <el-col :span="200">
            <el-form-item>
              表名<el-input type="text" v-model="tableName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="200">
            <el-form-item>
              列名<el-input type="text" v-model="columnName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="200">
            <el-form-item>
              查询值<el-input type="text" v-model="matchValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button @click="searchTag">
<!--        <d2-icon name="download"/>-->
        查询
      </el-button>
    </template>
<!--    <div class="d2-mb">-->
<!--      <el-upload :before-upload="handleUpload" action="default">-->
<!--        <el-button type="success">-->
<!--          <d2-icon name="file-o"/>-->
<!--          选择要导入的 .csv 表格-->
<!--        </el-button>-->
<!--      </el-upload>-->
<!--    </div>-->
    <el-table v-bind="table">
      <el-table-column
        v-for="(item, index) in table.columns"
        :key="index"
        :prop="item.prop"
        :label="item.label">
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import pluginImport from '@d2-projects/vue-table-import'
import { request } from '@/api/_service'
import axios from 'axios'

Vue.use(pluginImport)

export default {
  data () {
    return {
      table: {
        columns: [],
        data: [],
        size: 'mini',
        stripe: true,
        border: true
      },
      tableName: 'tbl_profile',
      columnName: 'currentRatio',
      matchValue: '较小'
    }
  },
  methods: {
    handleUpload (file) {
      console.log(file)
      this.$import.csv(file)
        .then(res => {
          this.table.columns = Object.keys(res.data[0]).map(e => ({
            label: e,
            prop: e
          }))
          this.table.data = res.data
        })
      return false
    },
    handleTable (file) {
      this.table.columns = file.split('\n')[0].split(',')
    },
    download () {
      this.$open('https://cdn.d2.pub/files/d2-admin/demo-csv.csv')
    },
    loadFile: function (name) { // name为文件所在位置
      const xhr = new XMLHttpRequest()
      const okStatus = document.location.protocol === 'file:' ? 0 : 200
      xhr.open('GET', name, false)
      xhr.overrideMimeType('text/html;charset=utf-8') // 默认为utf-8
      xhr.send(null)
      return xhr.status === okStatus ? xhr.responseText : null
    },
    searchTag: async function () {
      var config = {
        // `url` 是用于请求的服务器 URL
        url: '/tags/search',
        // `method` 是创建请求时使用的方法
        method: 'get', // 默认是 get
        // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
        transformResponse: [function (data) {
          // 对 data 进行任意转换处理
          return JSON.parse(data)
        }],
        timeout: 600000,
        // `params` 是即将与请求一起发送的 URL 参数
        // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
        params: {
          tableName: this.tableName,
          columnName: this.columnName,
          matchValue: this.matchValue
        }
      }
      const filename = await request(config)
      if (filename != null) {
        // const file = await axios.get('http://localhost:8081/static/' + filename)
        // console.log(file)
        // this.handleUpload(file)
        const d3 = require('d3-dsv')
        axios.get('http://localhost:8081/static/' + filename).then(res => {
          this.handleUpload(res.data)
        })
        // console.log(file)
      }
    }
  }
}
</script>
