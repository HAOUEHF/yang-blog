<template>
  <div class="pro-table">
    <!-- 搜索区域 -->
    <YSearchForm ref="searchFormRef" v-if="isShowSearch" :columns="searchColumn" :searchParam="searchParam"
      :handleSearch="handleSearch" :handleReset="handleReset"></YSearchForm>
    <!-- 表格区域 -->
    <el-table ref="tableRef" v-bind="$attrs" :border="isBorder" :data="processTableData" v-loading="loadingValue"
      :row-key="rowKey" @selection-change="handleSelectionChange">
      <template v-for="item in tableColumns" :key="item">
        <!-- 这是提供：多选 单选 排序 筛选 等功能的表格组件 -->
        <el-table-column v-if="item.type && columnTypes.includes(item.type)" :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'" v-bind="{ ...item }" :style="{ width: item.width ?? '' }">
          <template #default="scope">
            <!-- 展开 -->
            <template v-if="item.type == 'expand'">
              <component :is="item.render" v-bind="scope" v-if="item.render" />
              <slot v-else :name="item.type" v-bind="scope" />
            </template>
            <!-- 拖拽排序 -->
            <el-tag v-if="item.type == 'sort'" class="move">
              <el-icon>
                <DCaret />
              </el-icon>
            </el-tag>
            <el-radio v-if="item.type == 'radio'" v-model="radio" :label="scope.row[rowKey!]">
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <TableColumn v-if="!item.type && item.prop && !item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
      </template>
    </el-table>
    <div class="pagination" v-if="isPagination">
      <TablePagination ref="paginationRef" :page-table="pageTable" :handle-current-change="handleCurrentChange"
        :handle-size-change="handleSizeChange"></TablePagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColumnProps, TypeProps } from '../../interface/table'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useTable } from '../../hooks/useTable'
import TableColumn from './components/TableColumn.vue'
import TablePagination from './components/TablePagination.vue'
import Sortable from 'sortablejs'
import { useTableSelected } from '../../hooks/useTableSelected';
import YSearchForm from '../YSearchForm/index.vue'
import { DCaret } from '@element-plus/icons-vue'
interface ProTableProps {
  columns: ColumnProps[] // 表格列
  data: any[] // 表格数据
  isShowSearch?: boolean // 是否显示搜索区域
  isPagination?: boolean // 是否显示分页
  isBorder?: boolean // 是否显示边框
  requestApi?: (params: any) => Promise<any> // 请求接口
  requestAuto?: boolean // 是否自动请求接口
  initParam?: any // 初始化参数
  dataCallBack?: (data: any) => any // 数据处理回调
  requestError?: (error: any) => void
  isLoading?: boolean // 是否需要loading
  loading?: boolean
  rowKey?: string
}
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  data: () => [],
  isShowSearch: true,
  isPagination: false,
  initParam: () => ({}),
  isLoading: true,
  requestAuto: true
})
const tableRef = ref(null)
const searchFormRef = ref(null)
const paginationRef = ref(null)
const {
  tableData,
  getTableList,
  loading,
  pageTable,
  search,
  reset,
  searchParam,
  handleCurrentChange,
  handleSizeChange
} = useTable({
  api: props.requestApi,
  initParam: props.initParam,
  isPageTable: props.isPagination,
  requestError: props.requestError,
  dataCallBack: props.dataCallBack
})
console.log(tableData)

// 处理table表格数据
const processTableData = computed(() => {
  // 没有data
  if (props.data.length === 0) return tableData.value
  // 没有分页
  if (!props.isPagination) return props.data
  // 默认，这是自己分页
  return props.data.slice(
    (pageTable.value.pageNum - 1) * pageTable.value.pageSize,
    pageTable.value.pageSize * pageTable.value.pageNum
  )
})
// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns)
const columnTypes: TypeProps[] = ['index', 'selection', 'expand', 'radio', 'sort']
// 搜索栏
const searchColumn = computed(() => {
  return tableColumns.filter(item => item.search?.el || item.search?.render)
})

const emits = defineEmits(['handleSearch', 'handleReset', 'dargSort'])
// 处理搜索
const handleSearch = () => {
  search()
  console.log(searchParam)
  emits('handleSearch', searchParam.value)
}
// 处理重置
const handleReset = () => {
  reset()
  emits('handleReset')
}
// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true })
watch(
  () => props.data,
  () => {
    props.data.length > 0 && (pageTable.value.total = props.data.length)
  }
)
// loading的值
const loadingValue = computed(() => {
  if (props.isLoading) {
    if (props.requestAuto) {
      return loading.value
    } else {
      return props.loading
    }
  } else {
    return false
  }
})
// 拖拽排序
const dragSort = () => {
  const tbody = document.querySelector('.el-table__body-wrapper tbody') as HTMLElement
  Sortable.create(tbody, {
    handle: '.move',
    animation: 300,
    onEnd({ newIndex, oldIndex }: { newIndex: number; oldIndex: number }) {
      const [removedItem] = processTableData.value.splice(oldIndex!, 1)
      processTableData.value.splice(newIndex!, 0, removedItem)
      emits('dargSort', { newIndex, oldIndex })
    }
  })
}
// 多选
const { handleSelectionChange, selectedRowKey, selectedList } = useTableSelected(props.rowKey!)

// 单选
const radio = ref(null)
onMounted(() => {
  dragSort()
  props.requestAuto && getTableList()
})

defineExpose({
  element: tableRef,
  tableData: processTableData,
  searchParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  searchFormRef,
  paginationRef,
  selectedRowKey,
  selectedList
})
</script>

<style lang="scss" scoped>
.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
