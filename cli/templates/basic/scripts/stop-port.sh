#!/bin/bash

# 停止指定端口的服务进程
# 用法: ./stop-port.sh [端口1 端口2 ...]，默认 3009 3001 3010

DEFAULT_PORTS=(3009 3000 3001 3010)
PORTS=("${@:-${DEFAULT_PORTS[@]}}")

for PORT in "${PORTS[@]}"; do
  echo "🔍 查找占用端口 $PORT 的进程..."
  PID=$(lsof -ti:$PORT)

  if [ -z "$PID" ]; then
    echo "✅ 端口 $PORT 未被占用"
    continue
  fi

  echo "🎯 找到进程 PID: $PID，准备终止..."
  kill -9 $PID
  echo "✅ 已终止占用端口 $PORT 的进程 $PID"
done
