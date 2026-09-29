# sources/

HTMLs originais que o Heitor anexa (dossiês e roadmaps) antes de serem portados
pra componentes React do site. Ficam aqui só como referência/arquivo — **não são
publicados** (estão fora de `docs/`, `src/` e `static/`).

| Arquivo | Virou |
| --- | --- |
| `dossie-dinamica-veicular-godot.html` | `docs/notas/dossie-godot.mdx` (componente `DossieGodot`) |
| `roadmap-preparacao-reuniao.html` | `docs/roadmaps/semana-2026-07-06.mdx` (componente `RoadmapReuniao`) |
| `roadmap-base-godot-semana.html` | `docs/roadmaps/semana-2026-07-13.mdx` (componente `RoadmapBaseGodot`) |
| `roadmap-rover-raycast-semana.html` | `docs/roadmaps/semana-2026-07-20.mdx` (componente `RoadmapRoverRaycast`) |
| `roadmap-multicorpo-semana.html` | `docs/roadmaps/semana-2026-07-27.mdx` (componente `RoadmapMulticorpo`) |
| `roadmap-jolt-sample-semana.html` | `docs/roadmaps/semana-2026-08-10.mdx` (componente `RoadmapJoltSample`) |

As imagens de evidência (screenshots) usadas por um componente ficam co-locadas
com ele — ex.: as do dossiê em `src/components/DossieGodot/img/`.

## Docs de aprendizado em Markdown

Nem toda fonte é HTML: as sessões de estudo da quinzena de multicorpo foram
escritas direto em Markdown (um arquivo por sessão) e depois consolidadas num
único componente.

| Pasta / arquivos | Virou |
| --- | --- |
| `quinzena-multicorpo/dia-01..dia-04.md` | `docs/multicorpo/constraints-e-jolt.mdx` (componente `DossieMulticorpo`) |
| `semana-jolt-sample/anotacoes-dias-1-3.md` | `docs/multicorpo/jolt-vs-godot.mdx` (componente `DossieJoltGodot`) |

> As datas no frontmatter desses `.md` são as do plano original (um dia por
> arquivo). Na doc publicada elas foram redistribuídas nos intervalos reais da
> quinzena de 27/jul a 10/ago.

> As anotações da semana do sample do Jolt (`semana-jolt-sample/`) cobrem só os
> **três primeiros dias** (10 a 12/ago, pontos 1 e 2 da reunião). A faixa B do
> roadmap — GDExtension e o paralelo com o GDChrono — foi executada em 5/set e
> está em `docs/multicorpo/ponte-gdextension.mdx`.

## Docs de fundamentos (sem HTML original)

As docs técnicas de **powertrain/torque** e **suspensão** não vêm de um HTML
pronto: o conteúdo foi destilado do estudo do livro **Gillespie —
_Fundamentals of Vehicle Dynamics_ (SAE)** feito via NotebookLM, e escrito
direto como componente React visual-first.

| Componente | Virou | Origem |
| --- | --- | --- |
| `DossiePowertrain` | `docs/powertrain/visao-geral.mdx` | estudo Gillespie (NotebookLM) |
| `DossieSuspensao` | `docs/suspensao/visao-geral.mdx` | estudo Gillespie (NotebookLM) |
| `DossieVehicleConstraint` | `docs/multicorpo/vehicleconstraint-por-dentro.mdx` | leitura do código-fonte do Jolt (`jrouwe/JoltPhysics`, commit `2e28006e`, pasta `Jolt/Physics/Vehicle/`) |
| `DossiePonteGDExtension` | `docs/multicorpo/ponte-gdextension.mdx` | o código em `gdjolt/` (raiz do repositório) e os números medidos nas verificações headless |
| `DossieGdChrono` | `docs/multicorpo/gdchrono-comparado.mdx` | leitura do repositório `InteractiveDynamics/GdChrono` (commit `fde5589`) |
| `DossieRockerArticulado` | `docs/multicorpo/rocker-articulado.mdx` | execuções do banco de ensaio em `gdjolt/tools/vehicle_probe.cpp` |
| `DossieRockerBogie` | `docs/multicorpo/rocker-bogie.mdx` | varredura do banco de ensaio (`vehicle_probe --sweep`) e a cena `gdjolt/demo/comparativo.tscn` |

Esses componentes renderizam sob `.dossie .tecnica` — reaproveitam a assinatura
do dossiê (`dossie.css`) e as peças de fluxo/régua/barras de `tecnica.css`.

O `DossieVehicleConstraint` também não tem fonte em arquivo: nasceu de uma sessão
de leitura direta do código do Jolt clonado em `~/Projects/JoltPhysics`. As
citações de `arquivo:linha` na doc valem para o commit registrado na tabela — ao
atualizar o clone, reconferir antes de editar o texto.

O `DossiePonteGDExtension` também não tem fonte em arquivo: a origem é o código
que está versionado em `gdjolt/` na raiz do repositório, e **todos os números da
doc vieram de execução real** — o `vehicle_probe` no terminal e os dois scripts
de verificação headless (`gdjolt/demo/verify.gd` e `verify_vehicle.gd`). Ao
mexer no `gdjolt/`, rodar os dois de novo antes de editar as tabelas.

Essa mesma entrada tem três fontes externas ao repositório:

- **vídeo** — `youtu.be/s3Q-pGynNzY`, o veículo sendo dirigido na cena de demo
  (gravado pelo Heitor, embutido por iframe no bloco 05).
- **print** — `static/img/gdjolt-demo-tree.png`, a árvore de nós do projeto de
  demo no editor. É a confirmação visual do que os testes headless só conseguiam
  afirmar por `ClassDB`.
- **GdChrono** — `github.com/InteractiveDynamics/GdChrono`, a GDExtension do
  professor. O bloco 07 compara arquitetura com ela; as afirmações vêm da leitura
  de `Chrono/ChWorld.{h,cpp}`, `Godot/ChManager.{h,cpp}`, `Godot/ChVisualNode.h`
  e do `CMakeLists.txt` no commit `fde5589`.

O `DossieGdChrono` nasceu de uma sessão de leitura do repositório do professor,
clonado num diretório temporário — **não** há cópia dele neste repositório. As
citações de arquivo valem para o commit `fde5589`; ao reler uma versão mais nova,
reconferir antes de editar as afirmações, em especial o passo de `DoStepDynamics`
e os parâmetros do `SCMTerrain`.

O `DossieRockerArticulado` é a primeira entrada da frente cujas tabelas são
**medição e não leitura**. Todos os números vieram de rodar
`gdjolt/build/tools/vehicle_probe` — a comparação de inclinação, a varredura de
altura de degrau e a curva de convergência do solver. Para reproduzir:

```bash
cd gdjolt
./tools/build_probe.sh
./build/tools/vehicle_probe --quiet --substeps=4          # a comparação
./build/tools/vehicle_probe --rig=lumped --step-height=0.50   # a batota do raycast
for c in "--vsteps=10 --psteps=2" "--substeps=4" "--substeps=8"; do \
  ./build/tools/vehicle_probe --rig=rocker --quiet $c | tail -1; done
```

Ao mexer em `src/rocker_rig.h`, rodar de novo antes de editar as tabelas da doc —
a montagem é compartilhada com o nó do Godot, então mudanças ali mexem nos dois.

O `DossieRockerBogie` segue o mesmo regime. A varredura de degrau das três
montagens e o custo por quadro saem de:

```bash
cd gdjolt
./build/tools/vehicle_probe --sweep --substeps=4      # a tabela principal
./build/tools/vehicle_probe --sweep --substeps=8      # a checagem de que não é o solver
./build/tools/vehicle_probe --rig=all --substeps=4 --quiet   # custo por quadro
```

Os vídeos saem de `gdjolt/demo/comparativo.tscn` com `--record=DIR` (ver o
cabeçalho de `comparativo.gd`).
