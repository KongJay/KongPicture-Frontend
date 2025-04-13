// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** health GET /jay/health */
export async function healthUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/jay/health', {
    method: 'GET',
    ...(options || {}),
  })
}
