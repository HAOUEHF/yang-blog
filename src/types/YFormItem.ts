import { ComponentInternalInstance, VNode } from 'vue'

const CAPTURED_TYPE = [
  'ElInput',
  'ElInputNumber',
  'ElRadioGroup',
  'ElCheckboxGroup',
  'ElSelect',
  'ElCascader',
  'ElSwitch',
  'ElSlider',
  'ElTimeSelect',
  'ElTimePicker',
  'ElDatePicker',
  'ElRate',
  'ElColorPicker',
  'ElTransfer'
]

export const DEFAULT_FORMATS_TIME = 'HH:mm:ss'
export const DEFAULT_FORMATS_DATE = 'YYYY-MM-DD'
export const DEFAULT_FORMATS_DATEPICKER: { [key: string]: string } = {
  date: DEFAULT_FORMATS_DATE,
  dates: DEFAULT_FORMATS_DATE,
  week: 'gggg[w]ww',
  year: 'YYYY',
  month: 'YYYY-MM',
  datetime: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`,
  monthrange: 'YYYY-MM',
  daterange: DEFAULT_FORMATS_DATE,
  datetimerange: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`
}

// 判断一个数组是否是二维数组
export const isTwoDimensionalArray = (arr: any) =>
  Array.isArray(arr) && arr.every(item => Array.isArray(item))

/**
 * 获取ElForm实例
 * @param instance 组件实例
 * @returns
 */
export const getElFormVNode = (instance: ComponentInternalInstance): ComponentInternalInstance => {
  // 定义类型名称
  const TYPE_NAME = 'ElForm'
  // 如果实例的类型名称等于TYPE_NAME，则返回实例
  if (instance.type.name === TYPE_NAME) {
    return instance
  }

  // 否则，返回父实例的ElFormVNode实例
  return getElFormVNode(instance.parent!)
}

// 导出一个函数，用于获取表单组件的虚拟节点
export const getFormComponentVNode = (list?: VNode[]): any => {
  // 如果list不存在，则返回
  if (!list) {
    return
  }

  let vNode
  // 遍历list，查找类型为object，且name在CAPTURED_TYPE中的虚拟节点
  for (let index = 0; index < list.length; index++) {
    vNode = list[index]
    if (typeof vNode.type === 'object' && CAPTURED_TYPE.includes((vNode.type as any).name)) {
      return vNode
    }
    // 递归查找vNode的children
    vNode = getFormComponentVNode(vNode.children as VNode[])
    if (vNode) {
      return vNode
    }
  }
  return vNode
}
export type tale ={
  name:string
}
