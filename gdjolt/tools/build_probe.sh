#!/usr/bin/env bash
# Compila o vehicle_probe (etapa 2) espelhando os flags do build da libJolt.
#
# Os flags NÃO são digitados aqui: saem do compile_commands.json que o CMake
# gerou ao compilar a lib. Se a lib for reconfigurada, este script acompanha.
# Inclui NDEBUG, que decide se os asserts do Jolt existem — omiti-lo quebra o
# link com "undefined reference to JPH::AssertFailed".
set -euo pipefail

cd "$(dirname "$0")/.."

JOLT_ROOT="${JOLT_ROOT:-$HOME/Projects/JoltPhysics}"
JOLT_BUILD="${JOLT_BUILD:-build/jolt}"

FLAGS=$(python3 - "$JOLT_BUILD/compile_commands.json" <<'PY'
import json, re, shlex, sys

with open(sys.argv[1]) as f:
    entries = json.load(f)

entry = next(e for e in entries if "/Jolt/" in e["file"])
args = shlex.split(entry.get("command") or " ".join(entry["arguments"]))

keep = [
    a for a in args
    if re.match(r"-D(JPH_|NDEBUG)", a)
    or re.match(r"-m(sse|avx|lzcnt|tzcnt|bmi|f16c|fma|popcnt)", a)
]
print(" ".join(keep))
PY
)

echo "[build_probe] flags espelhados da lib:"
echo "[build_probe]   $FLAGS"

mkdir -p build/tools
g++ -std=c++17 -O2 -fno-rtti -fno-exceptions \
    $FLAGS \
    -I"$JOLT_ROOT" \
    -o build/tools/vehicle_probe \
    tools/vehicle_probe.cpp \
    "$JOLT_BUILD/libJolt.a" \
    -lpthread

echo "[build_probe] pronto: build/tools/vehicle_probe"
