---
sidebar_position: 1
title: Índice de frentes
slug: /intro
---

# Documentação do PIBIC

Este é o índice das **frentes de trabalho** da minha Iniciação Científica em
dinâmica veicular. A ideia é que cada frente vire uma seção de documentação que
cresce com o tempo — desde as explorações iniciais pra ganhar intuição até a
documentação técnica densa do modelo de verdade.

:::info Estado do projeto
Começou com uma **nota de aprendizado** — o
[dossiê do sandbox no Godot](/docs/notas/dossie-godot), um _arcade car_ pra
pegar intuição — e já avançou pros **fundamentos**:
[powertrain e torque](/docs/powertrain/visao-geral) e
[suspensão](/docs/suspensao/visao-geral). As demais frentes abaixo já estão com
a estrutura preparada e vão sendo preenchidas.
:::

:::tip Planejamento semanal
Além das frentes, há a seção **[Sprints semanais](/docs/roadmaps)** — roadmaps
de cada semana com o que produzir e estudar. É o lugar pra acompanhar o plano de
curto prazo.
:::

## As frentes

| Frente | Do que trata | Estado |
| --- | --- | --- |
| **[Estudos & notas](/docs/notas/dossie-godot)** | Explorações e notas de aprendizado avulsas (como o dossiê do Godot). | 🟢 Ativa |
| **Dinâmica multicorpo (C++)** | Corpos rígidos, articulações, o salto do arcade car pro modelo rigoroso. | 🟡 Planejada |
| **[Powertrain e tração](/docs/powertrain/visao-geral)** | Motor → transmissão → roda → força de tração via torque. | 🟢 Ativa |
| **[Suspensão](/docs/suspensao/visao-geral)** | Modelo mola-amortecedor; rocker-bogie pra rovers. | 🟢 Ativa |
| **Contrato de API** | Interface entre o modelo veicular e a camada ExoPhysics/plataforma. | 🟡 Planejada |
| **Integração roda–solo** | Simulação acoplada veículo–solo deformável. | 🟡 Planejada |
| **Validação comparativa** | Comparação com Chrono, SCM e métricas. | 🟡 Planejada |

## Como este site cresce

Cada frente é uma pasta em `docs/`. Para adicionar uma página nova, basta criar
um arquivo Markdown na pasta da frente correspondente — a barra lateral e este
índice acompanham. Os componentes visuais do dossiê (medidores de parâmetro,
árvore de nós, log de bugs, callouts) ficam disponíveis pra qualquer doc, então
o padrão visual se mantém sem esforço.
