---
title: 如何用podman部署mysql用于开发
createTime: 2025/11/04 00:51:34
permalink: /article/tmr2sixm/
---

## 概述

使用 Podman 部署 MySQL 容器，并通过 `podman exec` 执行 SQL 命令创建用户

避免Mysql版本问题造成困扰,可以实现多开，还避免了暴毙的可能性，忘了密码直接 `podman exec` 重置，因为环境变量里有root密码，假设不做修改，开发的时候这么干很方便

## 步骤 1: 拉取 MySQL 镜像

```bash
podman pull mysql:latest
```

## 步骤 2: 准备环境变量和目录

### 创建数据目录(纯开发可以省略此步骤)

```bash
mkdir -p ~/mysql/data
mkdir -p ~/mysql/conf
```

### 设置 SELinux 策略（重要）

使用 `:Z` 标志让 Podman 自动管理 SELinux 标签：

```bash
# 在卷挂载时使用 :Z 标志
-v ~/mysql/data:/var/lib/mysql:Z
```

## 步骤 3: 运行 MySQL 容器

```bash
podman run -d \
  --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=MYSQL_ROOT_PASSWORD \
  -p 3306:3306 \
  -v ~/mysql/data:/var/lib/mysql:Z \
  -v ~/mysql/conf:/etc/mysql/conf.d:Z \
  mysql:latest
```

**参数说明：**

- `-d`: 后台运行
- `--name mysql-server`: 容器名称
- `-e MYSQL_ROOT_PASSWORD`: 设置 root 用户密码
- `-p 3306:3306`: 端口映射（主机端口:容器端口）
- `-v ~/mysql/data:/var/lib/mysql:Z`: 数据目录映射，`:Z` 用于 SELinux
- `-v ~/mysql/conf:/etc/mysql/conf.d:Z`: 配置文件目录映射

## 步骤 4: 等待 MySQL 启动

```bash
# 检查容器状态
podman ps

# 查看日志确认 MySQL 已启动
podman logs mysql-server
```

等待在日志中看到 "MySQL init process done. Ready for start up" 或类似消息。

## 步骤 5: 执行 SQL 命令创建用户(默认root无法远程登录)

### 方法 1: 使用 podman exec 直接执行

```bash
podman exec -i mysql-server mysql -u root -pMYSQL_ROOT_PASSWORD << EOF
CREATE USER 'user_galen'@'%' IDENTIFIED BY 'MYSQL_ROOT_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'user_galen'@'%';
FLUSH PRIVILEGES;
EOF
```

### 方法 2: 进入容器交互式执行

```bash
# 进入容器
podman exec -it mysql-server mysql -u root -p

# 在 MySQL 提示符下执行：
CREATE USER 'user_galen'@'%' IDENTIFIED BY 'MYSQL_ROOT_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'user_galen'@'%';
 
FLUSH PRIVILEGES;

exit;
```

## 步骤 6: 验证用户创建

重复步骤5登录，登录用户换成`user_galen`

## 重要提醒

### 1. SELinux 策略

- 使用 `:Z` 或 `:z` 标志来正确处理 SELinux 上下文
- `:Z`: 私有非共享标签
- `:z`: 共享标签

## 碎碎念部分

Podman 在此架构中，本质上是一个系统调用拦截与命名空间管理中间件。它通过 `runC` 之类的底层工具，在宿主机内核上为你申请的 MySQL 进程套上了一层进程沙箱。

成也沙箱，败也沙箱，当 MySQL 在容器内执行一个看似简单的 `write()` 系统调用将数据刷盘时，这个调用会先被 Podman 虚拟化的文件系统命名空间和存储驱动（如 overlayfs）处理一次，再映射到宿主机的实际存储路径。这层转换带来了便利，但也引入了额外的调用链和复杂性。数据库进程不再直接与内核对话，进程依赖关系也因此变得**脆弱且不透明**。在传统部署中，MySQL 以 systemd 服务运行时，其依赖关系是清晰、声明式的。

而在 容器 模式下，数据库进程成了 Podman 子进程的一个“孙进程”。这种隐含的依赖关系非常致命：任何 Podman 自身的问题、其依赖的 `conmon` 监控进程的异常、甚至只是终端会话的意外信号，都可能瞬间切断整个调用链，导致数据库进程被牵连而暴毙。此时数据库服务直接翘辫子了

> 简单地用联合概率可以看出来

在传统部署中，两者近乎独立$$ P(B|A) \approx P(B) $$，即系统服务管理器（如 systemd）的异常几乎不影响 MySQL。

容器化部署下，MySQL 作为 Podman 的子孙进程，存在强依赖：$$ P(B|A) \approx 1 $$。因此，服务不可用的联合概率 $$ P(A \cap B) = P(A) \cdot P(B|A) \approx P(A) $$

~~结论非常明确：开发环境图个方便绰绰有余，podman进程任意挂掉一个数据库跟着倒霉，不适用于生产环境~~
