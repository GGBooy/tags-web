<template>
  <d2-container>
    <template slot="header">添加主标签</template>
    <el-row>
      一级标签：
      <el-input v-model="firstLevel"></el-input>
    </el-row>
    <br>
    <br>
    <el-row>
      二级标签：
      <el-input v-model="secondLevel"></el-input>
    </el-row>
    <br>
    <br>
    <el-row>
      三级标签：
      <el-input v-model="thirdLevel"></el-input>
    </el-row>
    <br>
    <br>
    <el-button id="confirm" v-on:click="submitTag">确认</el-button>
    <template slot="footer">footer</template>
  </d2-container>
</template>

<script>
import { request } from '@/api/_service'
import qs from 'qs'

export default {
  data () {
    return {
      firstLevel: null,
      secondLevel: null,
      thirdLevel: null
    }
  },
  methods: {
    async submitTag () {
      const tags = [
        {
          id: null,
          pid: -1,
          level: 1,
          name: this.firstLevel,
          rule: ''
        },
        {
          id: null,
          pid: null,
          level: 2,
          name: this.secondLevel,
          rule: ''
        },
        {
          id: null,
          pid: null,
          level: 3,
          name: this.thirdLevel,
          rule: ''
        }
      ]
      console.log('tags', tags)
      const config = {
        // `url` 是用于请求的服务器 URL
        url: '/tags/relation',
        // `method` 是创建请求时使用的方法
        method: 'put', // 默认是 get
        // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
        transformResponse: [function (data) {
          // 对 data 进行任意转换处理
          return JSON.parse(data)
        }],
        // `params` 是即将与请求一起发送的 URL 参数
        // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
        data: tags
      }
      const data = await request(config)
      console.log('config', config)
      console.log('stringify tags', qs.stringify(tags))
      console.log('data', data)
    }
  }
}
</script>
