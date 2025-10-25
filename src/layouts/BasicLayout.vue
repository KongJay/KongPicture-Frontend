<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout>
      <a-layout-sider v-if="loginUserStore.loginUser.id" 
  class="sider"
  width="200" 
  breakpoint="lg"
  collapsed-width="0"
>
          <GlobalSider />
        </a-layout-sider>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>

      <a-layout-footer class="footer">
        <a href="https://www.github/Kongjay" target="_blank"> 红模仿 by 周杰伦 </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue';
import { useLoginUserStore } from '@/stores/user';
const loginUserStore = useLoginUserStore()

</script>
<style scoped>
#basicLayout .header {
  margin-bottom: 1px;
  background: #fff;
}

#basicLayout .content {
  padding: 28px;
}

#basicLayout .sider {
  background: #fff;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

</style>
