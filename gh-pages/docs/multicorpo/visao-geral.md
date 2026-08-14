---
sidebar_position: 1
title: Visão geral
---

# Dinâmica multicorpo (C++)

O modelo multicorpo de verdade — cada roda e cada corpo como um nó rígido
próprio, ligado por articulações, com as forças resolvidas por **restrições** em
vez de raycast com mola. Esta frente é o passo além do sandbox do Godot.

:::tip Primeira entrada publicada
A quinzena de **27/jul a 10/ago** foi dedicada a entender o paradigma antes de
construir qualquer coisa: **[Constraints, juntas e o Jolt por
dentro](/docs/multicorpo/constraints-e-jolt)** — o que é um sistema multicorpo,
penalidade × constraint, os graus de liberdade de cada junta do Godot, o
experimento mínimo com `HingeJoint3D` e o que o Godot **não** expõe do Jolt.
:::

## Escopo previsto

- Cada roda e corpo como um **nó rígido próprio**, ligado por articulações.
- Forças resolvidas por **restrições**, não por raycast com mola.
- O salto conceitual do _arcade car_ (corpo rígido único) pro modelo rigoroso.
- Formulação, integrador numérico e estabilidade.

## O que vem a seguir

A segunda metade do roadmap da quinzena, ainda em aberto: comparativo
Jolt × Godot a partir de um `Sample`, replicar esse sample no Godot com nós
`Joint3D`, ler a documentação do **GDExtension** e espelhar o **GDChrono** do
professor pro Jolt. O plano completo está no roadmap
[27 jul–10 ago · Rumo ao multicorpo](/docs/roadmaps/semana-2026-07-27).

_Referência de partida: a [nota do sandbox no Godot](/docs/notas/dossie-godot),
que mostra por que o `VehicleBody3D` **não** é um multicorpo de verdade._
