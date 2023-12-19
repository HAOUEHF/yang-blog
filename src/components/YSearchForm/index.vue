<template>
  <div>
    <el-form :model="searchParam" ref="formRef">
      <div class="flex-box">
        <el-form-item v-for="(item, index) in columns" :key="index">
          <YSearchFormItem :column="item" :search-param="searchParam"></YSearchFormItem>
        </el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ColumnProps } from '../../interface/table'
import YSearchFormItem from './components/YSearchFormItem.vue'
interface Props {
  columns: ColumnProps[]
  searchParam: { [key: string]: any }
  handleSearch: (params: any) => void
  handleReset: (params: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  searchParam: () => ({})
})
console.log(props)

// const emits = defineEmits(['search'])
// const handleSearch = () => {
//   emits('search', props.searchParam)
// }
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
}
</style>
