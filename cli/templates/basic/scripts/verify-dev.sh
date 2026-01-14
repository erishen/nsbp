#!/bin/bash

# 开发环境验证脚本

echo "========================================="
echo "Docker 开发环境验证"
echo "========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 检查容器状态
echo "1. 检查容器状态..."
if docker ps | grep -q "nsbp-app-dev"; then
    echo -e "${GREEN}✅ 容器正在运行${NC}"
else
    echo -e "${RED}❌ 容器未运行${NC}"
    echo ""
    echo "启动命令："
    echo "  make dev"
    echo "  docker-compose -f docker/docker-compose.dev.yml up -d --build"
    exit 1
fi

echo ""
echo "2. 检查服务是否可访问..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ 服务可访问 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ 服务不可访问 (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "3. 检查权限错误..."
if docker-compose -f docker/docker-compose.dev.yml logs 2>&1 | grep -q "EACCES"; then
    echo -e "${RED}❌ 发现权限错误${NC}"
    echo ""
    echo "最近的权限错误："
    docker-compose -f docker-compose.dev.yml logs | grep "EACCES" | tail -3
else
    echo -e "${GREEN}✅ 未发现权限错误${NC}"
fi

echo ""
echo "4. 检查构建状态..."
if docker-compose -f docker/docker-compose.dev.yml logs 2>&1 | grep -q "compiled successfully"; then
    echo -e "${GREEN}✅ 构建完成${NC}"
else
    echo -e "${YELLOW}⚠️  构建中或未开始${NC}"
fi

echo ""
echo "5. 检查服务器监听..."
if docker-compose -f docker/docker-compose.dev.yml logs 2>&1 | grep -q "listening"; then
    echo -e "${GREEN}✅ 服务器正在监听${NC}"
else
    echo -e "${YELLOW}⚠️  服务器尚未启动监听${NC}"
fi

echo ""
echo "========================================="
echo -e "${GREEN}验证完成！${NC}"
echo "========================================="
echo ""
echo "访问应用："
echo "  http://localhost:3001"
echo ""
echo "查看日志："
echo "  docker-compose -f docker/docker-compose.dev.yml logs -f"
echo ""
echo "停止服务："
echo "  make down"
echo "  docker-compose -f docker/docker-compose.dev.yml down"
echo ""
