<template>
  <el-pagination
    :background="true"
    :current-page="pageTable.pageNum"
    :page-size="pageTable.pageSize"
    :page-sizes="[10, 25, 50, 100]"
    :total="pageTable.total"
    ::hide-on-single-page="false"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts">
interface PageTable {
  pageNum: number
  pageSize: number
  total: number
}

interface PaginationProps {
  pageTable: PageTable
  handleSizeChange: (size: number) => void
  handleCurrentChange: (currentPage: number) => void
}

defineProps<PaginationProps>()
</script>

<style scoped></style>
