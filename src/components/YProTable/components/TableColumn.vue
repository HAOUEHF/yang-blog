<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx">
import { ColumnProps, RenderScope, HeaderRenderScope } from '../../../interface/table'
import { useSlots } from 'vue'

defineProps<{ column: ColumnProps }>()

const slots = useSlots()

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {!item.isShow && (
        <el-table-column {...item} align={item.align ?? 'center'}>
          {{
            default: (scope: RenderScope<any>) => {
              if (item.headerChildren)
                return item.headerChildren.map(child => RenderTableColumn(child))
              if (item.render) return item.render(scope)
              if (slots[item.prop]) return slots[item.prop]?.(scope)
              return scope.row[item.prop]
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender) return item.headerRender(scope)
              if (slots.hasOwnProperty(item.prop + 'Header')) return slots[item.prop + 'Header']?.(scope)
              return item.label
            }
          }}
        </el-table-column>
      )}
    </>
  )
}
</script>
