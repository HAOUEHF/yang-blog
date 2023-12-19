---
layout: page
---

:::demo

```vue
<template>
  <YProTable :columns="columns" :isBorder="true" :requestApi="getList" :initParam="{ type: 'baiduRD' }"
    :requestAuto="true" :isPagination="true" rowKey="index" height="80vh" ref="table">
    <template #operation="scope">
      <div>
        <el-button type="primary" @click="ElMessage.success('编辑成功')">编辑</el-button>
        <el-button type="danger" @click="ElMessage.success('删除成功')">删除</el-button>
      </div>
    </template>
    <template #tag="scope">
      <div>
        <el-tag @click="ElMessage.success('我是通过作用域插槽渲染的内容')">{{ scope.row.title }}</el-tag>
      </div>
    </template>
    <template #expand="scope">
      <div>
        <a :href="scope.row.url" target="_blank">跳转</a>
      </div>
    </template>
    <template #inputHeader>
      <div>
        <el-button type="danger" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">头部</el-button>
      </div>
    </template>
    <template #input>
      <div>
        测试数据
      </div>
    </template>
  </YProTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getList } from '../../service/api/home'
const columns = ref([
  {
    label: '多选',
    type: 'selection',
    fixed: 'left'
  },
  {
    label: '单选',
    type: 'radio'
  },
  {
    label: '序号',
    type: 'index',
    width: '80px'
  },

  {
    label: '排序',
    type: 'sort'
  },
  {
    label: '展开',
    type: 'expand',
    width: '100px'
  },
  {
    label: '热点',
    prop: 'hot'
  },
  {
    label: '标题',
    prop: 'title',
    width: '300px'
  },
  {
    label: '热点',
    isShow: false,
    search: {
      el: 'select',
      key: 'type',
      props: {
        options: [
          {
            label: '虎扑',
            value: 'huPu'
          },
          {
            label: '知乎',
            value: 'zhihuHot'
          },
          {
            label: '微博',
            value: 'wbHot'
          }
        ]
      }
    }
  },
  {
    label: '时间',
    isShow: false,
    search: {
      el: "date-picker",
      key: "date",
      props: { type: "daterange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  {
    label: '提示',
    prop: 'desc',
    width: '300px'
  },
  {
    label: '标签',
    prop: 'tag',
    width: '300px'
  },
  {
    label: 'text',
    prop: 'input',
  },
  {
    label: '操作',
    prop: 'operation',
    width: '200px',
    fixed: 'right'
  }
])
</script>

<style>
.demoblock-source{
  padding:0 20px;
}
</style>

```

:::
