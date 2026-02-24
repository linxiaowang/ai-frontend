/**
 * 环境变量管理
 * 统一管理应用的环境变量，提供类型安全
 */

function getEnv(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue
}

function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key]
  if (value === 'true')
    return true
  if (value === 'false')
    return false
  return defaultValue
}

export const env = {
  // 应用配置
  appTitle: getEnv('VITE_APP_TITLE', 'React Template'),
  mode: getEnv('VITE_MODE', 'development'),
  debug: getBooleanEnv('VITE_DEBUG', true),

  // API 配置
  apiBaseUrl: getEnv('VITE_API_BASE_URL', '/api'),

  // 判断是否为开发环境
  isDev: import.meta.env.DEV,
  // 判断是否为生产环境
  isProd: import.meta.env.PROD,
  // 判断是否为测试环境
  isTest: import.meta.env.MODE === 'test',
} as const

export type Env = typeof env
