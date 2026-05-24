# env-doctor

Diagnose a project development environment with explicit commands, minimum versions, and fix hints.

用一份简单配置诊断项目开发环境，包含命令检查、最低版本和修复建议。

## English

### Install

```bash
npm install -g env-doctor
```

For local development:

```bash
npm install
npm link
env-doctor --help
```

### Usage

Create env-doctor.config.json with checks for your project toolchain.

```bash
env-doctor
env-doctor --json
env-doctor --config env-doctor.config.json
```

Example config:

```json
{
  "checks": [
    {
      "name": "Node.js",
      "command": "node -v",
      "minVersion": "18.0.0",
      "fix": "Install Node.js 18 or newer."
    }
  ]
}
```

### Status

This is an MVP designed to be useful immediately and easy to extend. It has no runtime dependencies and targets Node.js 18+.

### Test

```bash
npm test
```

## 中文

### 安装

```bash
npm install -g env-doctor
```

本地开发：

```bash
npm install
npm link
env-doctor --help
```

### 用法

创建 env-doctor.config.json，配置项目需要的工具链检查项。

```bash
env-doctor
env-doctor --json
env-doctor --config env-doctor.config.json
```

配置示例：

```json
{
  "checks": [
    {
      "name": "Node.js",
      "command": "node -v",
      "minVersion": "18.0.0",
      "fix": "Install Node.js 18 or newer."
    }
  ]
}
```

### 当前状态

这是一个可以直接使用的 MVP，重点是小、清晰、容易二次开发。运行时无第三方依赖，要求 Node.js 18+。

### 测试

```bash
npm test
```

## License

MIT
