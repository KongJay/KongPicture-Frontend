<script setup lang="ts">
import { message } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController.ts'
import { ref } from 'vue'
interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()
const loading = ref<boolean>(false)
const fileUrl = ref<string>()

/**
 * 上传
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="url-picture-upload">
    <a-input-group  compact style="margin-bottom: 16px">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="请输入图片 URL" />
        <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 120px">提交</a-button>
      </div>
    </a-input-group>

  </div>
</template>

<style scoped>
.url-picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 480px;
  display: block;
  margin: 0 auto;
}

.url-picture-upload a-input-group {
  font-size: 32px;
  color: #999;
}

</style>
