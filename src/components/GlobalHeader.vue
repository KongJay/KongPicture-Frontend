<template>
  <a-row :wrap="false">
    <a-col flex="200px">
      <RouterLink to="/">
        <div class="title-bar">
          <img class="logo" src="../assets/logo.svg" alt="logo" />
          <div class="title">红模仿云图库</div>
        </div>
      </RouterLink>
    </a-col>
    <a-col flex="auto">
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        :items="items"
        @click="doMenuClick"
      />
    </a-col>
    <a-col flex="120px">
      <div class="user-login-status">
        <div v-if="loginUserStore.loginUser.id">
          <a-dropdown>
            <ASpace>
              <a-avatar :src="loginUserStore.loginUser.userAvatar" />
              {{ loginUserStore.loginUser.userName ?? '无名' }}
            </ASpace>
            <template #overlay>
              <a-menu>
                <!-- 个人信息 -->
                <a-menu-item @click="viewProfile()">
                  <UserOutlined />
                  个人信息
                </a-menu-item>
                <a-menu-item @click="doLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 弹出模态框 -->
          <a-modal
            class="a-modal"
            v-model:open="isModalVisible"
            title="编辑个人信息"
            @ok="saveProfile"
            @cancel="cancelEdit"
          >
            <a-form :model="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
              <a-form-item label="用户名">
                <a-input v-model:value="editForm.userName" placeholder="请输入用户名" />
              </a-form-item>
              <a-form-item label="个人简介">
                <a-input
                  v-model:value="editForm.userProfile"
                  placeholder="请输入个人简介"
                  type="textarea"
                />
              </a-form-item>
            </a-form>
          </a-modal>
        </div>
        <div v-else>
          <a-space>
            <a-button type="primary" href="/user/login">登录</a-button>
            <a-button type="primary" href="/user/register">注册</a-button>
          </a-space>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined,UserOutlined,LogoutOutlined } from '@ant-design/icons-vue'
import { type MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user.ts'
import { updateUserUsingPost, userLogoutUsingPost } from '@/api/userController.ts'
import checkAccess from '@/access/checkAccess.ts'
import ACCESS_ENUM from '@/access/accessEnum.ts'

const router = useRouter()

const loginUserStore = useLoginUserStore()

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 控制模态框是否显示
const isModalVisible = ref(false)
// 表单模型，初始为用户的当前信息
const editForm = ref({
  userName: loginUserStore.loginUser.userName ?? '',
  userProfile: loginUserStore.loginUser.userProfile ?? '',
})
// 查看个人信息（打开编辑表单的模态框）


const viewProfile = () => {

  isModalVisible.value = true;
};
// 取消编辑
const cancelEdit = () => {
  isModalVisible.value = false
  // 重置表单
  editForm.value = {
    userName: loginUserStore.loginUser.userName ?? '',
    userProfile: loginUserStore.loginUser.userProfile ?? '',
  }
}
// 保存编辑后的信息
const saveProfile = async () => {
  const { userName, userProfile } = editForm.value
  const res = await updateUserUsingPost({
    id:loginUserStore.loginUser.id,
    userName,
    userProfile,
  })
  if (res.data.code === 0) {
    message.success('个人信息更新成功')
    // 更新用户信息
    loginUserStore.loginUser.userName = userName
    loginUserStore.loginUser.userProfile = userProfile
    // 关闭模态框
    isModalVisible.value = false
  } else {
    message.error('更新失败: ' + res.data.message)
  }
}
// 用户注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  console.log(res)
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 菜单列表
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
]
interface RouteItem {
  path: string
  meta?: {
    access?: string
    hideInMenu?: boolean
  }
}

// 菜单项转为路由项
const menuToRouteItem = (menu: typeof originItems[number]): RouteItem => {
  return {
    path: menu.key,
    meta: {
      access: menu.key.startsWith('/admin') ? ACCESS_ENUM.ADMIN : ACCESS_ENUM.USER,
      hideInMenu: false,
    }
  }
}
// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    const item = menuToRouteItem(menu);
    if (item.meta?.hideInMenu) {
        return false
    }
    return checkAccess(loginUserStore.loginUser,item.meta?.access as string)
  })
}

// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems))

</script>
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}
.a-modal {
  z-index: 9999;
}
.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
