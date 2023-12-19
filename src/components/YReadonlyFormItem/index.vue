<template>
  <el-form-item v-bind="formItemProps">
    <template v-for="(_, name) in otherSlots" #[name]>
      <slot :name="name" />
    </template>
    <span v-if="isReadonly" :style="contentStyle">{{ contentValue }}</span>
    <slot v-else />
  </el-form-item>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  ref,
  useAttrs,
  useSlots,
  inject,
  nextTick,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import type { StyleValue } from 'vue'
import {
  getElFormVNode,
  getFormComponentVNode,
  isTwoDimensionalArray,
  DEFAULT_FORMATS_TIME,
  DEFAULT_FORMATS_DATEPICKER
} from '../../types/YFormItem'
import { formContextKey, formItemContextKey } from 'element-plus/es/components/form/src/constants'
import dayjs from 'dayjs'
defineOptions({
  // 定义组件的名称
  name: 'ReadonlyFormItem'
})
// 定义组件的属性
const props = withDefaults(
  defineProps<{
    // 值
    value?: string
    // 是否只读
    readonly?: boolean
    // 空文本
    emptyText?: string
    // 分隔符
    separator?: string
    // 范围分隔符
    rangeSeparator?: string
    // 日期格式
    dateFormat?: string
  }>(),
  {
    // 默认只读为undefined
    readonly: undefined
  }
)

// 获取当前组件实例
const instance = getCurrentInstance()

// 获取当前组件的属性
const attrs = useAttrs()
// 获取当前组件的插槽
const slots = useSlots()

/**
 * 设置item样式
 */
const formItemProps = computed(() => ({
  // 合并传入的属性
  ...attrs,
  // 标签宽度，如果没有传入，则使用elForm的labelWidth属性
  labelWidth: attrs.label ? attrs.labelWidth || elForm.props.labelWidth : 'auto',
  // 样式，如果是表格，则底部边距为0
  style: {
    ...attrs.style!,
    marginBottom: isTable.value && '0'
  }
}))

// 注入表单上下文
const elFormContext = inject<any>(formContextKey)
console.log(elFormContext)

// 插槽
const otherSlots = computed(() => {
  const { default: _, ...rest } = slots
  return rest
})

// 获取el-Form的实例
const elForm = getElFormVNode(instance!)
// 判断是否只读
const isReadonly = computed<boolean>(() =>
  props.readonly !== undefined ? props.readonly : (elForm.proxy as any).$attrs.readonly
)
// 判断是否是表格行或表格体
const isTable = computed<boolean>(() =>
  ['ElTableRow', 'ElTableBody'].includes(instance?.parent?.type.name!)
)

const elFormModel = ref((elForm.proxy as any).model)
// 内容值
const contentValue = ref('')
// 获取全局配置
const getGlobalConfig = computed(
  () => instance?.appContext.config.globalProperties.$ReadonlyFormItem || {}
)
console.log(getGlobalConfig)

// 内容的样式
const contentStyle = computed<StyleValue>(() =>
  isTable.value
    ? {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      width: '100%',
      verticalAlign: 'bottom'
    }
    : { wordBreak: 'break-all' }
)

// 获取组件虚拟节点
const componentVNode = () => getFormComponentVNode(slots.default!())

// 获取组件的类型
const componentType = (vNode: any) => vNode?.type.name

// 获取组件的子节点
const componentChildrenVNode = (vNode: any) => vNode?.children.default()?.[0]

// 获取日期组件的类型
const dateComponentType = (vNode: any) => vNode?.props.type ?? 'date'

/**
 * 获取日期组件的格式
 * @param vNode
 * @return string
 */
const getDateFormat = (vNode: any) => {
  // 定义一个格式映射表，用于存储时间选择器和日期选择器的格式
  const FORMAT_MAP: { [key: string]: string } = {
    ElTimePicker: DEFAULT_FORMATS_TIME,
    ElDatePicker: DEFAULT_FORMATS_DATEPICKER[dateComponentType(vNode)]
  }
  // 返回传入的格式或者全局配置的格式或者组件的格式
  return (
    props.dateFormat ||
    getGlobalConfig.value.dateFormat ||
    vNode?.props?.format ||
    FORMAT_MAP[componentType(vNode)]
  )
}

/**
 * 获取组件的值
 * @param vNode 组件实例
 * @return Array[{ label: string; value: string }]
 */
const getOptions = (vNode: any): { label: string; value: string }[] =>
  // 获取vNode的子节点
  componentChildrenVNode(vNode)?.children?.map((_vNode: any) => ({
    // 获取子节点的label
    label: componentChildrenVNode(_vNode).children,
    // 获取子节点的props.label
    value: _vNode.props.label
  }))

// 文字展位符
const getEmptyText = () => props.emptyText || getGlobalConfig.value.emptyText || '-'

// 获取分隔符
const getSeparator = () => props.separator || getGlobalConfig.value.separator || ','

// 获取范围分隔符
const getRangeSeparator = () => props.rangeSeparator || getGlobalConfig.value.rangeSeparator || '~'

// 获取值
const getValue = () =>
  (attrs.prop as string)?.split('.')?.reduce((pre, cur) => pre?.[cur], elFormModel.value)

// 获取组件类型并返回值
const getContentValue = () => {
  // 如果props.value存在，则返回props.value
  if (props.value) {
    return props.value
  }

  // 获取当前组件的值
  const value = getValue()

  // 获取当前组件的虚拟节点
  const vNode = componentVNode()

  // 根据组件类型，返回不同的值
  switch (componentType(vNode)) {
    case 'ElSelect': {
      // 获取当前组件的子节点，并获取子节点的props
      const options = componentChildrenVNode(vNode).children?.map((_vNode: any) => _vNode.props)
      // 如果value是数组，则根据value中的值，返回对应的label
      return Array.isArray(value)
        ? options
          ?.filter((item: any) => value.includes(item.value))
          ?.map((item: any) => item.label)
          ?.join(getSeparator())
        : options?.find((item: any) => item.value === value)?.label
    }
    case 'ElRadioGroup':
      return getOptions(vNode)?.find(item => item.value === value)?.label
    case 'ElCheckboxGroup':
      return getOptions(vNode)
        ?.filter(item => value.includes(item.value))
        ?.map(item => item.label)
        ?.join(getSeparator())
    case 'ElCascader': {
      // 获取当前组件的props，以及分隔符
      const {
        options,
        separator = '/',
        props: {
          label: labelKey = 'label',
          value: valueKey = 'value',
          children: childrenKey = 'children'
        } = {}
      } = vNode?.props

      // 递归查找子节点
      const reduceCallback = (pre: any[], cur: any) => {
        pre.push(cur)

        cur[childrenKey] && cur[childrenKey].length && cur[childrenKey].reduce(reduceCallback, pre)

        return pre
      }

      // 根据value中的值，返回对应的label
      const findLabel = (val: any) =>
        options?.reduce(reduceCallback, []).find((option: any) => option[valueKey] === val)?.[
        labelKey
        ]

      // 如果value是二维数组，则根据value中的值，返回对应的label
      return isTwoDimensionalArray(value)
        ? value.map((val: any) => val.map(findLabel)?.join(separator))?.join(getSeparator())
        : value.map(findLabel).join(separator)
    }
    case 'ElTransfer': {
      // 获取当前组件的props，以及分隔符
      const { data, props: { key = 'key', label = 'label' } = {} } = vNode?.props
      return value
        .map((val: any) => data.find((item: any) => item[key] === val)?.[label])
        ?.join(getSeparator())
    }
    case 'ElTimePicker':
      return Array.isArray(value) && value.length
        ? value.map(date => dayjs(date).format(getDateFormat(vNode))).join(getRangeSeparator())
        : value
    case 'ElDatePicker': {
      // 如果value不存在，则返回value
      if (!value) {
        return value
      }
      // 获取当前组件的日期格式
      const dateFormat = getDateFormat(vNode)
      // 根据日期组件类型，设置分隔符
      const separator = ['monthrange', 'daterange', 'datetimerange'].includes(
        dateComponentType(vNode)
      )
        ? getRangeSeparator()
        : getSeparator()

      return Array.isArray(value)
        ? value.map(date => dayjs(date).format(dateFormat)).join(separator)
        : dayjs(value).format(dateFormat)
    }
    case 'ElSwitch': {
      // 获取当前组件的props，以及分隔符
      const { activeText, inactiveText } = vNode?.props

      return value
        ? activeText || vNode?.props['active-text'] || '开'
        : inactiveText || vNode?.props['inactive-text'] || '关'
    }
    case 'ElSlider':
      // 如果value是数组，则根据value中的值，返回对应的label
      return Array.isArray(value) ? value.join(getRangeSeparator()) : value
    default:
      return value
  }
}

// 更新内容值
const updateContentValue = () => {
  try {
    // 获取内容值
    const value = getContentValue()
    // 设置内容值
    contentValue.value = typeof value === 'number' ? value : value || getEmptyText()
    console.log(value)
  } catch (_) { }
}

// 调度
const dispatch = (bool: boolean) => {
  nextTick(() => {
    // 获取当前实例的上下文
    const context = instance?.proxy?.$el?.__vnode.ctx.provides[formItemContextKey]
    // 如果bool为true，则从表单上下文中移除该上下文，否则添加该上下文
    bool ? elFormContext?.removeField(context) : elFormContext?.addField(context)
  })
}

// 监听model变化，更新内容值
watch(
  () => (elForm.proxy as any).model,
  // 监听表单模型变化，更新内容值
  val => {
    elFormModel.value = val
    updateContentValue()
  },
  // 设置监听选项，深度监听，立即执行
  { deep: true, immediate: true }
)

// 监听属性变化，更新内容值
watch(() => attrs, updateContentValue, { deep: true })

// 监听只读状态变化，调度
watch(isReadonly, dispatch)

// 挂载时，只读状态为true时，调度
onMounted(() => {
  isReadonly.value && dispatch(true)
})

// 卸载时，只读状态为true时，删除实例的vnode的props的prop
onBeforeUnmount(() => {
  isReadonly.value && delete instance?.vnode?.props?.prop
})
</script>

<style scoped></style>
