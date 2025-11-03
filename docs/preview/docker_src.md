---
title: 如何不依赖特殊方法访问docker ?
createTime: 2025/11/04 00:32:32
permalink: /article/yxmrnj3n/
---

## 概述

**问题**：国内访问 Docker Hub (docker.io) 不稳定，影响开发环境镜像构建，每个拉取行为都是真实消耗流量，此行为旨在避免钱包被攻击

**白嫖方法**：利用阿里云海外机器作为中转站，构建常用开发镜像（MySQL、Nginx 等）

## 思路

```txt
Docker Hub (docker.io) ←→ 阿里云海外机器 ←→ 国内开发环境
    源站                   中转构建站           最终使用
```

## 解决方法

### 代理构建

编写 Dockerfile 使用阿里云海外机器构建

```dockerfile
# 直接使用官方源
FROM docker.io/mysql:8.0
# 后续自定义配置...
# 纯拷贝可以无视
```

::: center
![ ](/public/comic_icon/common/i_have_a_plan.jpg)
:::

**优势**：

- 保持官方镜像完整性
- 利用阿里云海外带宽快速拉取
- 构建缓存完全在阿里云
