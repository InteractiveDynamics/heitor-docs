# gdjolt — a ponte C++ entre o Godot e o Jolt

Faixa B do roadmap [10 ago – 7 set](../gh-pages/docs/roadmaps/semana-2026-08-10.mdx).

A frente de dinâmica multicorpo chegou a uma conclusão documentada: o
`VehicleBody3D` do Godot **não** é a `VehicleConstraint` do Jolt, e o módulo Jolt
embutido no motor não expõe nem ela, nem os `VehicleCollisionTester`, nem os
controllers. Este diretório é o caminho que contorna isso — uma **GDExtension**
que roda um `PhysicsSystem` do Jolt **próprio**, compilado aqui, em vez de tentar
alcançar o do motor.

O Godot vira renderizador e input. Quem simula é o Jolt.

## O que tem aqui

| Caminho | O que é |
| --- | --- |
| `src/jolt_probe.{h,cpp}` | Nó sem física nenhuma. Prova que a ponte carrega e que o Godot chama o nosso C++ a cada passo |
| `src/jolt_vehicle.{h,cpp}` | O nó de verdade: mundo do Jolt, `VehicleConstraint` de quatro rodas, transforms escritas na cena |
| `src/jolt_layers.h` | Camadas de colisão e filtros — compartilhados pelo nó e pelo programa de teste |
| `tools/vehicle_probe.cpp` | O mesmo veículo **sem o Godot no caminho**, imprimindo telemetria no terminal |
| `demo/` | Projeto Godot mínimo que carrega a extensão |

## Como compilar

Pré-requisitos: `scons`, `cmake`, `g++`. Os dois primeiros podem vir do `pipx`
(`pipx install scons cmake`) — não precisa de root.

```bash
# 1 · a biblioteca do Jolt (estática, com PIC porque vai entrar num .so)
cmake -S ~/Projects/JoltPhysics/Build -B build/jolt \
      -DCMAKE_BUILD_TYPE=Distribution \
      -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
      -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
      -DINTERPROCEDURAL_OPTIMIZATION=OFF \
      -DENABLE_ALL_WARNINGS=OFF -DENABLE_INSTALL=OFF
cmake --build build/jolt --target Jolt -j"$(nproc)"

# 2 · o programa de teste, sem Godot
./tools/build_probe.sh && ./build/tools/vehicle_probe

# 3 · os bindings do Godot
git clone --depth 1 https://github.com/godotengine/godot-cpp.git
(cd godot-cpp && scons platform=linux target=template_debug api_version=4.7 -j"$(nproc)")

# 4 · a extensão
scons platform=linux target=template_debug -j"$(nproc)"
```

## Verificação sem interface gráfica

```bash
GODOT=~/Downloads/Godot_v4.7-stable_linux.x86_64
$GODOT --headless --path demo --script verify.gd          # a ponte
$GODOT --headless --path demo --script verify_vehicle.gd  # a física
```

## A armadilha que custou caro: paridade de ABI

O Jolt muda o **layout das structs** conforme os defines com que foi compilado
(`JPH_OBJECT_STREAM`, `JPH_DOUBLE_PRECISION`, `JPH_PROFILE_ENABLED`, e `NDEBUG`,
que decide se os asserts existem) e conforme as instruções SIMD habilitadas
(`-mavx2`, `-mfma`, ...). Se a `libJolt.a` e o código que a inclui divergirem,
**o link passa e o programa quebra em runtime**, sem mensagem útil — ou, no caso
mais gentil, dá `undefined reference to JPH::AssertFailed`.

Por isso nem o `SConstruct` nem o `tools/build_probe.sh` digitam esses flags:
os dois **leem** o `build/jolt/compile_commands.json` gerado pelo próprio CMake
ao compilar a lib. Se o build do Jolt for reconfigurado, os dois acompanham
sozinhos.

## Nota sobre a versão

O `godot-cpp` **não tem branch `4.7`** — as branches vão até `4.5`, mais
`master`. O que resolve é que o `master` já embute `extension_api-4-7.json`, e
`api_version=4.7` seleciona esse arquivo. Foi conferido que ele bate exatamente
com o `--dump-extension-api` do binário 4.7 instalado nesta máquina (mesmo
`version_full_name`, mesmo conjunto de classes).
