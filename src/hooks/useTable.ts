import { reactive, toRefs, computed, ref } from 'vue'
import { Table } from '../interface/table'
/**
 * @description table 页面操作方法封装
 * @param {Function} api - 请求接口函数，接受任意参数并返回一个Promise对象
 * @param {Object} initParam - 初始化参数对象
 * @param {Boolean} isPageTable - 是否支持分页
 * @param {Function} dataCallBack - 数据回调函数，接受一个参数，返回任意值。可选参数。
 * @param {Function} requestError - 请求回调函数，接受一个参数，返回任意值。可选参数。
 */
export const useTable = ({
  api,
  initParam = {},
  isPageTable = false,
  dataCallBack,
  requestError,
  isPageTableAuto = true
}: {
  api?: (params: any) => Promise<any>
  initParam: object
  isPageTable: boolean
  isPageTableAuto: boolean // 是否前端分页
  dataCallBack?: (data: any) => any
  requestError?: (error: any) => void
}) => {
  const state = reactive<Table.TableState>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageTable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {}
  })
  /**
   * @description 分页参数
   */
  // 缓存分页参数
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageTable.pageNum, // 当前页码
        pageSize: state.pageTable.pageSize // 每页数量
      }
    },
    set: newVal => {
      console.log('newVal', newVal) // 打印新值
    }
  })
  const loading = ref(false)
  // 获取表格列表
  const getTableList = async () => {
    if (!api) return // 如果没有api，则返回
    loading.value = true
    try {
      Object.assign(
        state.totalParam,
        initParam,
        state.searchParam,
        isPageTable && !isPageTableAuto ? pageParam.value : {}
      ) // 将initParam和分页参数值合并到state.totalParam中
      console.log(state.totalParam)

      let { data } = await api({ ...state.searchInitParam, ...state.totalParam }) // 调用api获取数据

      dataCallBack && (data = dataCallBack(data)) // 如果存在dataCallBack回调函数，则执行回调函数处理数据
      // if (!data.success || data.status === 0) {
      //   return new Error(data.message) // 如果数据不成功，返回错误信息
      // }

      state.tableData = isPageTable ? data : data // 将数据赋值给tableData
      loading.value = false
      // 有分页
      if (isPageTable) {
        // data中有total代表接口有分页数据
        if (data.total) {
          const { pageNum, pageSize, total } = data // 解构数据中的pageNum, pageSize, totalF
          updatedPageTable({ pageNum, pageSize, total }) // 调用updatePageTable函数更新分页
        } else {
          // 没有分页数据，前端分页
          updatedPageTable({
            pageNum: state.pageTable.pageNum,
            pageSize: state.pageTable.pageSize,
            total: data.length
          })
          state.tableData = state.tableData.slice(
            (state.pageTable.pageNum - 1) * state.pageTable.pageSize,
            state.pageTable.pageSize * state.pageTable.pageNum
          )
        }
      }
    } catch (err) {
      loading.value = false
      requestError && requestError(err) // 如果存在requestError回调函数，则执行回调函数处理错误
    }
  }

  /**
   * 更新页表
   * @param pageTable 页表对象
   */
  const updatedPageTable = (pageTable: Table.TablePage) => {
    state.pageTable = Object.assign(state.pageTable, pageTable)
  }

  /**
   * @description 更新查询参数
   */
  const updatedTotalParam = () => {
    state.totalParam = {} // 初始化 totalParam 空对象
    let nowSearchParam: Table.TableState['searchParam'] = {} // 初始化 nowSearchParam 为一个空对象，类型为 TableState 的 searchParam 字段的类型
    for (let key in state.searchParam) {
      if (
        state.searchParam[key] ||
        state.searchParam[key] === 0 ||
        state.searchParam[key] === false
      ) {
        nowSearchParam[key] = state.searchParam[key] // 将 searchParam 中满足条件的键值对添加到 nowSearchParam 中
        console.log(nowSearchParam[key])
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageTable ? pageParam.value : {}) // 如果 isPageTable 为真，则将 pageParam 的值添加到 totalParam 中，否则将 pageParam 的值置为空对象
  }

  /**
   * @description 搜索
   */
  const search = () => {
    // 搜索函数，将页码重置为1页
    state.pageTable.pageNum = 1
    // 更新总参数
    updatedTotalParam()
    // 获取表格列表
    getTableList()
  }
  /**
   * @description 重置
   */
  const reset = () => {
    // 重置页码为1
    state.pageTable.pageNum = 1
    // 重置搜索参数为初始搜索参数
    state.searchParam = { ...state.searchInitParam }
    // 更新总参数
    updatedTotalParam()
    // 执行搜索函数
    search()
  }

  /**
   * 每页显示条数改变
   * @param {number} val 每页显示条数
   */
  const handleSizeChange = (val: number) => {
    state.pageTable.pageNum = 1
    state.pageTable.pageSize = val
    getTableList()
  }

  /**
   * 页码改变
   * @param {number} val 页码
   */
  const handleCurrentChange = (val: number) => {
    state.pageTable.pageNum = val
    getTableList()
  }
  return {
    ...toRefs(state),
    pageParam,
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    loading
  }
}
