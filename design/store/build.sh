#!/bin/sh
# 重新导出 Chrome 商店截图（1280×800）与宣传小图（440×280）。
# 依赖：macOS、Google Chrome、Python 3。用法：sh design/store/build.sh
set -eu
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
OUT="$ROOT/design/store"
SRC="$OUT/src"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8765}"
WORK=$(mktemp -d)
SERVER=
cleanup() {
  if [ -n "$SERVER" ]; then kill "$SERVER" 2>/dev/null; wait "$SERVER" 2>/dev/null || true; fi
  rm -rf "$WORK"
}
trap cleanup EXIT

# 复制插件并注入接口模拟脚本，使弹窗能在普通网页中渲染；不修改仓库里的插件文件。
cp -R "$ROOT/extension" "$WORK/ext"
cp "$SRC/shim.js" "$WORK/ext/shim.js"
perl -pi -e 's#<link rel="stylesheet" href="popup.css">#<script src="shim.js"></script><link rel="stylesheet" href="popup.css">#' "$WORK/ext/popup.html"
cp "$SRC/shot.html" "$SRC/promo.html" "$WORK/"
cp "$ROOT/design/icons/icon128.svg" "$WORK/icon.svg"

python3 -I -m http.server "$PORT" --bind 127.0.0.1 --directory "$WORK" >/dev/null 2>&1 &
SERVER=$!
sleep 1

shot() {
  "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=4000 --window-size="$1" --screenshot="$2" "http://127.0.0.1:$PORT/$3" 2>/dev/null
}
for lang in en zh_CN; do
  for mode in password api; do
    shot 1280,800 "$OUT/screenshot-$lang-$mode.png" "shot.html?lang=$lang&mode=$mode"
  done
  shot 440,280 "$OUT/promo-small-$lang.png" "promo.html?lang=$lang"
done
echo "已导出到 $OUT"
