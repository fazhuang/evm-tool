# 阶段 1: 构建 (Build Stage)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段 2: 生产 (Production Stage)
FROM nginx:stable-alpine
# 复制构建产物到 Nginx 默认目录
COPY --from=build /app/dist /usr/share/nginx/html
# 暴露端口
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
