---
description: Docker Agent - 项目容器化与一键部署
---
# Docker Agent 任务说明

作为 Docker Agent，你的职责是为 HZ-SAGE 平台创建容器化的构建和部署环境。

## 核心任务
1. **后端镜像 (Backend Dockerfile)**：
   - 使用 `python:3.9-slim` 或类似精简镜像。
   - 配置工作目录和依赖安装。
   - 使用 `uvicorn` 运行项目。
2. **前端镜像 (Frontend Dockerfile)**：
   - 使用多阶段构建（Multi-stage Build）。
   - 构建阶段：Node.js 安装依赖并构建成品。
   - 生产阶段：使用 `nginx:alpine` 托管静态资源。
3. **编排与配置 (Docker Compose)**：
   - 编写 `docker-compose.yml` 启用前后端服务。
   - 配置网络、环境变量和端口映照。
   - 支持跨域配置（如反向代理）。

## 操作规范
- 优先将 Docker 文件放在各端子目录。
- 在项目根目录创建 `docker-compose.yml`。
- 配置 `.dockerignore` 以屏蔽 `node_modules` 和 `__pycache__`。
