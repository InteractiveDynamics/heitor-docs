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
> roadmap — GDExtension e GDChrono — ainda não foi documentada.

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

Esses componentes renderizam sob `.dossie .tecnica` — reaproveitam a assinatura
do dossiê (`dossie.css`) e as peças de fluxo/régua/barras de `tecnica.css`.

O `DossieVehicleConstraint` também não tem fonte em arquivo: nasceu de uma sessão
de leitura direta do código do Jolt clonado em `~/Projects/JoltPhysics`. As
citações de `arquivo:linha` na doc valem para o commit registrado na tabela — ao
atualizar o clone, reconferir antes de editar o texto.
