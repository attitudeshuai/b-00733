# Animal Management System

## � 项目结构
```
project-733/
├── docker-compose.yml   # Docker编排文件
├── Dockerfile           # 容器构建文件
├── nginx.conf           # Nginx配置
├── frontend/            # 前端项目目录
│   ├── src/
│   │   ├── api/         # API接口封装
│   │   ├── components/  # 公共组件
│   │   ├── router/      # 路由配置
│   │   ├── stores/      # Pinia状态管理
│   │   ├── views/       # 页面组件
│   │   ├── App.vue      # 根组件
│   │   └── main.js      # 入口文件
│   └── package.json     # 依赖配置
└── README.md            # 项目文档
```

## �🛠 技术栈
- **Frontend Framework**: Vue 3 + Vite
- **UI Library**: Ant Design Vue 4
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Charts**: ECharts
- **HTTP Client**: Axios
- **CSS Preprocessor**: Sass
- **Containerization**: Docker + Nginx
- **Code Quality**: ESLint

## 🚀 启动指南 (How to Run)

### 方式一：Docker 启动 (推荐)
1. 确保 Docker Desktop 已启动。
2. 在根目录执行：`docker-compose up --build`
3. 等待容器启动完成...

### 方式二：npm 启动 (本地开发)
1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动服务：`npm run dev`


## 🔗 服务地址 (Services)
- Frontend: http://localhost:3000

## 🧪 测试账号
- Admin: admin / 123456
