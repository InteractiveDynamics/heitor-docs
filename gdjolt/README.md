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
| `src/jolt_vehicle.{h,cpp}` | `VehicleConstraint` de quatro rodas — **um corpo só**, modelo *lumped*. Degrau e tração nas quatro opcionais, para a cena comparativa |
| `src/jolt_rocker.{h,cpp}` | A plataforma **articulada**: rocker de 4 rodas (7 corpos, 6 juntas) ou, com `bogie = true`, rocker-bogie de 6 (11 corpos, 10 juntas) |
| `src/rocker_rig.h` | As duas montagens articuladas, compartilhadas entre o nó do Godot e o banco de ensaio |
| `src/jolt_layers.h` | Camadas de colisão e filtros |
| `src/jolt_runtime.h` | Contagem de uso do `RegisterTypes` do Jolt, que é global do processo |
| `tools/vehicle_probe.cpp` | Banco de ensaio **sem o Godot no caminho**: monta as três plataformas e submete todas à mesma manobra |
| `demo/` | Projeto Godot: `main.tscn` (veículo), `rocker.tscn` (plataforma articulada) e `comparativo.tscn` (as três lado a lado, com placar e gravação de vídeo) |

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
$GODOT --headless --path demo --script verify_vehicle.gd  # a física lumped
$GODOT --headless --path demo --script verify_rocker.gd   # a plataforma articulada
```

## O banco de ensaio

```bash
./build/tools/vehicle_probe                    # as duas plataformas, degrau de 0,20 m
./build/tools/vehicle_probe --rig=rocker       # só a articulada, com detalhe
./build/tools/vehicle_probe --substeps=4       # sub-passos por quadro
./build/tools/vehicle_probe --vsteps=30 --psteps=6   # iterações do solver
./build/tools/vehicle_probe --step-height=0.30 --quiet
./build/tools/vehicle_probe --rig=bogie        # o rocker-bogie de seis rodas
./build/tools/vehicle_probe --rig=all          # as três: lumped, rocker e bogie
./build/tools/vehicle_probe --sweep --substeps=4   # degrau de 0,10 a 0,50 m nas três
```

"Subiu" quer dizer que a **roda traseira** passou da face do degrau. A varredura
dá 12 s de manobra e imprime o tempo de travessia: o que passar dos ~5,1 s de
andar livre é tempo brigando com a face.

**Use `--substeps=4`.** Com o padrão do Jolt (1 sub-passo, 10 iterações de
velocidade), a razão de massa da plataforma articulada — chassi de 1200 kg
pendurado em braços de 50 kg — deixa o solver **12 cm abaixo** da altura
geométrica correta. Não é física: é o solver não convergindo. A partir de 4
sub-passos o resultado para de mudar.

| configuração | altura final | incl. máx | µs/quadro (mediana) |
| --- | --- | --- | --- |
| 10 vel / 2 pos (padrão) | 0,727 | 1,09° | 103 |
| 30 vel / 6 pos | 0,828 | 0,12° | 132 |
| 60 vel / 12 pos | 0,843 | 0,49° | 172 |
| **4 sub-passos** | **0,850** | **0,10°** | **335** |
| 8 sub-passos | 0,850 | 0,24° | 673 |

A altura geometricamente correta é 0,850. Todas as configurações cabem
folgadamente nos 16 700 µs de um quadro a 60 Hz.

## A cena comparativa e os vídeos

`demo/comparativo.tscn` põe as três montagens lado a lado, cada uma no seu
próprio `PhysicsSystem`, com piloto automático e a manobra do banco de ensaio.
As opções e as teclas estão no cabeçalho de `demo/comparativo.gd`.

```bash
$GODOT --path demo comparativo.tscn -- --step=0.40              # interativa
$GODOT --headless --path demo comparativo.tscn -- --step=0.40 --auto   # só o placar
$GODOT --path demo --fixed-fps 60 comparativo.tscn -- --step=0.40 --cam=0 --secs=13 --record=/tmp/q
ffmpeg -framerate 60 -i /tmp/q/%05d.png -c:v libx264 -crf 20 -pix_fmt yuv420p video.mp4
```

O `--record` grava de um `SubViewport` de 1280×720, e não da janela. Com o
Hyprland a janela nasce do tamanho que o mosaico quiser, e o `--write-movie` do
Godot perdia o HUD.

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
