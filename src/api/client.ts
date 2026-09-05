import type { AxiosRequestConfig } from 'axios'
import instance from './instance'
import type { ApiResponse } from '../types/type'

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.get<ApiResponse<T>>(url, config)
  return res.data.result
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await instance.post<ApiResponse<T>>(url, body, config)
  return res.data.result
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await instance.put<ApiResponse<T>>(url, body, config)
  return res.data.result
}

export async function patch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await instance.patch<ApiResponse<T>>(url, body, config)
  return res.data.result
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.delete<ApiResponse<T>>(url, config)
  return res.data.result
}
