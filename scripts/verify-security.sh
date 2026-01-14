#!/bin/bash

echo "========================================="
echo "NSBP 安全功能验证"
echo "========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查依赖
echo "1. 检查安全依赖安装..."
if grep -q '"helmet"' package.json && grep -q '"express-rate-limit"' package.json; then
    echo -e "${GREEN}✅ helmet 和 express-rate-limit 已安装${NC}"
else
    echo -e "${RED}❌ 缺少安全依赖${NC}"
    exit 1
fi

echo ""

# 检查服务器代码
echo "2. 检查服务器代码安全配置..."
if grep -q "helmet(" src/server/index.ts; then
    echo -e "${GREEN}✅ Helmet 已启用${NC}"
else
    echo -e "${RED}❌ Helmet 未配置${NC}"
fi

if grep -q "rateLimit" src/server/index.ts; then
    echo -e "${GREEN}✅ 速率限制已配置（可选）${NC}"
else
    echo -e "${RED}❌ 速率限制未配置${NC}"
fi

if grep -q "dotfiles: 'ignore'" src/server/index.ts; then
    echo -e "${GREEN}✅ dotfiles 访问已禁用${NC}"
else
    echo -e "${RED}⚠️  dotfiles 配置需要检查${NC}"
fi

if grep -q "disable('x-powered-by')" src/server/index.ts; then
    echo -e "${GREEN}✅ X-Powered-By 已隐藏${NC}"
else
    echo -e "${RED}❌ X-Powered-By 未隐藏${NC}"
fi

if grep -q "express.json.*limit" src/server/index.ts && grep -q "express.urlencoded.*limit" src/server/index.ts; then
    echo -e "${GREEN}✅ 请求体大小限制已配置${NC}"
else
    echo -e "${RED}❌ 请求体大小限制未配置${NC}"
fi

echo ""

# 检查 CSP 配置
echo "3. 检查 Content Security Policy..."
if grep -q "contentSecurityPolicy" src/server/index.ts; then
    echo -e "${GREEN}✅ CSP 已配置${NC}"
    if grep -q "defaultSrc.*'self'" src/server/index.ts; then
        echo -e "${GREEN}   - default-src: 'self'${NC}"
    fi
    if grep -q "scriptSrc" src/server/index.ts; then
        echo -e "${GREEN}   - script-src 已配置${NC}"
    fi
    if grep -q "styleSrc" src/server/index.ts; then
        echo -e "${GREEN}   - style-src 已配置${NC}"
    fi
    if grep -q "imgSrc.*https:" src/server/index.ts; then
        echo -e "${GREEN}   - img-src 允许 HTTPS${NC}"
    fi
else
    echo -e "${RED}❌ CSP 未配置${NC}"
fi

echo ""

# 检查文档
echo "4. 检查安全文档..."
if grep -q "## 安全特性" README.md; then
    echo -e "${GREEN}✅ 安全章节已添加到 README${NC}"
else
    echo -e "${YELLOW}⚠️  建议添加安全章节到 README${NC}"
fi

echo ""

# 统计
echo "========================================="
echo "安全配置统计"
echo "========================================="

TOTAL_CHECKS=7
PASSED_CHECKS=0

# 统计通过项
grep -q '"helmet"' package.json && grep -q '"express-rate-limit"' package.json && ((PASSED_CHECKS++))
grep -q "helmet(" src/server/index.ts && ((PASSED_CHECKS++))
grep -q "dotfiles: 'ignore'" src/server/index.ts && ((PASSED_CHECKS++))
grep -q "disable('x-powered-by')" src/server/index.ts && ((PASSED_CHECKS++))
grep -q "express.json.*limit" src/server/index.ts && ((PASSED_CHECKS++))
grep -q "contentSecurityPolicy" src/server/index.ts && ((PASSED_CHECKS++))
grep -q "## 安全特性" README.md && ((PASSED_CHECKS++))

SCORE=$(( PASSED_CHECKS * 100 / TOTAL_CHECKS ))

echo -e "通过率: ${PASSED_CHECKS}/${TOTAL_CHECKS} (${YELLOW}${SCORE}%${NC})"
echo ""

if [ $SCORE -eq 100 ]; then
    echo -e "${GREEN}🎉 所有安全检查通过！${NC}"
    echo "项目已达到生产级安全标准。"
elif [ $SCORE -ge 70 ]; then
    echo -e "${YELLOW}✅ 安全配置良好${NC}"
    echo "建议检查未通过的项目。"
else
    echo -e "${RED}⚠️  安全配置需要改进${NC}"
    echo "请检查上述未通过的项目。"
fi

echo ""
echo "========================================="
