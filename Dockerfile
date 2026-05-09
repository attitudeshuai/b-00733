# Build stage
FROM public.ecr.aws/docker/library/node:20-alpine as build-stage
WORKDIR /app
# Copy package files from frontend directory
COPY frontend/package*.json ./
# Use Tencent mirror for faster installation
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN npm install
# Copy frontend source code
COPY frontend/ .
RUN npm run build

# Production stage
FROM public.ecr.aws/docker/library/nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
