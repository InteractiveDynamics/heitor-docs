# sources/

HTMLs originais que o Heitor anexa (dossiês e roadmaps) antes de serem portados
pra componentes React do site. Ficam aqui só como referência/arquivo — **não são
publicados** (estão fora de `docs/`, `src/` e `static/`).

| Arquivo | Virou |
| --- | --- |
| `dossie-dinamica-veicular-godot.html` | `docs/notas/dossie-godot.mdx` (componente `DossieGodot`) |
| `roadmap-preparacao-reuniao.html` | `docs/roadmaps/semana-2026-07-06.mdx` (componente `RoadmapReuniao`) |
| `roadmap-base-godot-semana.html` | `docs/roadmaps/semana-2026-07-13.mdx` (componente `RoadmapBaseGodot`) |

As imagens de evidência (screenshots) usadas por um componente ficam co-locadas
com ele — ex.: as do dossiê em `src/components/DossieGodot/img/`.

## Docs de fundamentos (sem HTML original)

As docs técnicas de **powertrain/torque** e **suspensão** não vêm de um HTML
pronto: o conteúdo foi destilado do estudo do livro **Gillespie —
_Fundamentals of Vehicle Dynamics_ (SAE)** feito via NotebookLM, e escrito
direto como componente React visual-first.

| Componente | Virou | Origem |
| --- | --- | --- |
| `DossiePowertrain` | `docs/powertrain/visao-geral.mdx` | estudo Gillespie (NotebookLM) |
| `DossieSuspensao` | `docs/suspensao/visao-geral.mdx` | estudo Gillespie (NotebookLM) |

Esses componentes renderizam sob `.dossie .tecnica` — reaproveitam a assinatura
do dossiê (`dossie.css`) e as peças de fluxo/régua/barras de `tecnica.css`.
