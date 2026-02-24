# React Template

一个现代化的 React 19 应用模板，使用最新的前端技术栈构建。

## 技术栈

- **框架**: [React 19](https://react.dev/) - 最新版本的 React
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全
- **构建工具**: [Vite](https://vite.dev/) + [Rolldown](https://rolldown.rs/) - 快速的构建体验
- **路由**: [React Router 7](https://reactrouter.com/) - 基于 Remix 的路由系统
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/) - 原子化 CSS 框架
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/) - 轻量级状态管理
- **Hooks**: [ahooks](https://ahooks.js.org/) - React Hooks 工具库
- **代码规范**: [ESLint](https://eslint.org/) + [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- **提交规范**: [Commitlint](https://commitlint.js.org/) + [Simple Git Hooks](https://github.com/toplenboren/simple-git-hooks)

## 目录结构

```
src/
├── App.tsx              # 根组件
├── main.tsx             # 应用入口
├── router/              # 路由配置
│   └── index.tsx
├── pages/               # 页面组件
│   ├── home/
│   ├── about/
│   └── 404/
├── store/               # 状态管理
└── styles/              # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm lint:fix` | 自动修复 ESLint 问题 |

## 代码规范

### Git 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

例如：
feat(auth): add login functionality
fix: resolve memory leak
docs: update README
```

**支持的提交类型：**

- `feat` - 新功能
- `fix` - 修复 bug
- `docs` - 文档更新
- `style` - 代码格式调整
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试相关
- `build` - 构建系统或依赖项
- `ci` - CI 配置
- `chore` - 其他不修改 src 或测试文件的更改
- `revert` - 回退提交

### 代码检查

项目配置了 Git Hooks，会在提交前自动运行：

- **pre-commit**: 运行 ESLint 自动修复代码问题
- **commit-msg**: 检查提交信息是否符合规范

## 项目特性

- ⚡️ **极速构建** - 使用 Rolldown 替代传统打包工具
- 🎨 **样式开发体验** - Tailwind CSS v4 + Vite 插件
- 🚦 **类型安全** - 完整的 TypeScript 配置
- 📦 **路由管理** - React Router 7 提供完整的路由功能
- 🎯 **状态管理** - Zustand 轻量级且强大的状态管理
- 🔧 **代码规范** - ESLint + Commitlint 保证代码质量
- 🚫 **404 处理** - 内置友好的 404 页面
- 📂 **清晰架构** - 根组件 App.tsx 便于扩展

## License

MIT
