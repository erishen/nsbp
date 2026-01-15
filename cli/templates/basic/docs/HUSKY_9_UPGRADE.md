# Husky 9.x 升级说明

## ℹ️ 关于 "husky install command is DEPRECATED" 警告

这是正常的！Husky 9.x 版本已经改变了安装方式。

### 变化说明

**Husky 8.x (旧版本)**:
- 需要手动运行 `husky install` 命令
- `prepare` 脚本：`"prepare": "husky install"`

**Husky 9.x (新版本)**:
- ✅ Hooks 在 `pnpm install` 时自动创建
- ✅ 不需要手动运行 `husky install`
- ✅ `prepare` 脚本：`"prepare": "husky"`（仅注册命令）

### 如何工作

运行 `pnpm install` 时：
1. Husky 自动创建 `.husky` 目录
2. 自动生成 Git hooks（pre-commit, pre-push, commit-msg）
3. 设置 Git hooks 路径：`git config core.hooksPath .husky`

### 当前配置

```json
{
  "prepare": "husky"  // 正确！注册 Husky 命令
}
```

### 验证安装

```bash
# 检查 hooks 是否存在
ls .husky
# 应该看到: pre-commit, pre-push, commit-msg

# 检查 hooks 是否有执行权限
ls -la .husky/
# 应该看到: -rwxr-xr-x

# 测试提交
git commit -m "test: verify hooks"
# 应该自动运行 lint-staged
```

### 无需操作

这个警告可以安全忽略！🎉 你的项目已经正确配置了 Husky 9.x。

---

## 🔄 升级步骤（如需）

如果你之前使用的是 Husky 8.x，需要：

1. **更新 package.json**:
   ```json
   {
     "prepare": "husky"  // 从 "husky install" 改为 "husky"
   }
   ```

2. **重新安装依赖**:
   ```bash
   pnpm install
   ```

3. **验证 hooks**:
   ```bash
   ls .husky
   ```

完成！Husky 9.x 现在可以正常工作。
