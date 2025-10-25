import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/page/HomePage.vue'
import UserLoginPage from '@/page/user/UserLoginPage.vue'
import UserRegisterPage from '@/page/user/UserRegisterPage.vue'
import UserManagePage from '@/page/admin/UserManagePage.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import AddPicturePage from '@/page/picture/AddPicturePage.vue'
import PictureManagerPage from '@/page/picture/PictureManagerPage.vue'
import PictureDetailPage from '@/page/picture/PictureDetailPage.vue'
import AddPictureBatchPage from '@/page/picture/AddPictureBatchPage.vue'
import SpaceManagePage from '@/page/space/SpaceManagePage.vue'
import AddSpacePage from '@/page/space/AddSpacePage.vue'
import MySpacePage from '@/page/space/MySpacePage.vue'
import SpaceDetailPage from '@/page/space/SpaceDetailPage.vue'
import SearchPicturePage from '@/page/picture/SearchPicturePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },

    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagerPage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpacePage,
    },
    {
  path: '/my_space',
  name: '我的空间',
  component: MySpacePage,
},
  {
  path: '/space/:id',
  name: '空间详情',
  component: SpaceDetailPage,
  props: true,
},
{
  path: '/search_picture',
  name: '图片搜索',
  component: SearchPicturePage,
}



  ],
})

export default router
