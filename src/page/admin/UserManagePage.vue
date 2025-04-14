<template>
  <a-form layout="inline" :model="searchParams" @finish="doSearch">
    <a-form-item label="账号">
      <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" />
    </a-form-item>
    <a-form-item label="用户名">
      <a-input v-model:value="searchParams.userName" placeholder="输入用户名" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>

  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="pagination"
    @change="doTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">

      <template v-if="column.dataIndex === 'userAvatar'">
        <a-image :src="record.userAvatar" :width="120" />
      </template>
      <!-- 用户名 -->
      <template v-else-if="column.dataIndex === 'userName'">
        <template v-if="editableData[record.id]">
          <a-input v-model:value="editableData[record.id].userName" />
        </template>
        <template v-else>
          {{ record.userName }}
        </template>
      </template>
      <!-- 简介 -->
      <template v-else-if="column.dataIndex === 'userProfile'">
        <template v-if="editableData[record.id]">
          <a-input v-model:value="editableData[record.id].userProfile" />
        </template>
        <template v-else>
          {{ record.userProfile }}
        </template>
      </template>
      <template v-else-if="column.dataIndex === 'userRole'">
        <template v-if="editableData[record.id]">
          <a-select v-model:value="editableData[record.id].userRole" style="width: 120px">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </template>
        <template v-else>
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'operation'">
        <div class="editable-row-operations">
          <span v-if="editableData[record.id]">
            <a-typography-link @click="save(record.id)">保存</a-typography-link>
            <a-popconfirm title="确认取消修改？" @confirm="cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="edit(record)">编辑</a>
          </span>
        </div>
      </template>

      <template v-else-if="column.key === 'action'">
        <a-button danger @click="doDelete(record.id)">删除</a-button>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref, type UnwrapRef } from 'vue'
import {
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
  updateUserUsingPost,
} from '@/api/userController.ts'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'

// 数据
const dataList = ref([])
const total = ref(0)

// 可编辑的数据暂存
const editableData: UnwrapRef<Record<string, API.UserVO>> = reactive({})
// 编辑操作：将当前行数据拷贝进 editableData
const edit = (record: API.UserVO) => {
  editableData[record.id] = cloneDeep(record)
}
// 保存操作：提交后端、刷新数据
const save = async (id: string) => {
  const user = editableData[id]
  if (!user) return
  const res = await updateUserUsingPost({
    id: user.id,
    userName: user.userName,
    userProfile: user.userProfile,
    userRole: user.userRole,
  })
  if (res.data.code === 0) {
    message.success('更新成功')
    delete editableData[id]
    fetchData()
  } else {
    message.error('更新失败：' + res.data.message)
  }
}

// 取消编辑
const cancel = (id: string) => {
  delete editableData[id]
}
// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 1,
})

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}
// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '修改',
    key: 'operation',
  },
  {
    title: '操作',
    key: 'action',
  },
]
</script>

<style scoped></style>
