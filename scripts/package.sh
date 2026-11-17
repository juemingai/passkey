#!/bin/sh
# 生成上传 Chrome 应用商店用的 zip：只包含 extension/ 目录内容，manifest.json 位于压缩包根目录。
# 用法：npm run package（会先运行测试）
set -eu
ROOT=$(cd "$(dirname "$0")/.." && pwd)
VERSION=$(node -p "require(process.argv[1]).version" "$ROOT/extension/manifest.json")
OUT="$ROOT/dist/yunuo-$VERSION.zip"

mkdir -p "$ROOT/dist"
rm -f "$OUT"
# -X 不写入系统扩展属性；排除隐藏文件（如 .DS_Store），避免带入与插件无关的内容。
(cd "$ROOT/extension" && zip -r -X -q "$OUT" . -x '.*' -x '*/.*')

unzip -Z1 "$OUT" | grep -qx 'manifest.json' || { echo "错误：压缩包根目录缺少 manifest.json" >&2; exit 1; }
echo "已生成 dist/yunuo-$VERSION.zip（$(unzip -Z1 "$OUT" | grep -cv '/$') 个文件，$(du -h "$OUT" | cut -f1 | tr -d ' ')）"
