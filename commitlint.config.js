export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档更新
        'style', // 代码格式调整
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试相关
        'build', // 构建系统或依赖项
        'ci', // CI 配置
        'chore', // 其他不修改 src 或测试文件的更改
        'revert', // 回退提交
      ],
    ],
    'subject-case': [0], // 不限制主题大小写
  },
}
