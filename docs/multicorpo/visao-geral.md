---
sidebar_position: 1
title: Visão geral
---

# Dinâmica multicorpo (C++)

:::note Frente planejada
Esta seção ainda vai ser escrita. Aqui vou documentar o modelo multicorpo de
verdade — o passo além do sandbox do Godot.
:::

## Escopo previsto

- Cada roda e corpo como um **nó rígido próprio**, ligado por articulações.
- Forças resolvidas por **restrições**, não por raycast com mola.
- O salto conceitual do _arcade car_ (corpo rígido único) pro modelo rigoroso.
- Formulação, integrador numérico e estabilidade.

_Referência de partida: a [nota do sandbox no Godot](/docs/notas/dossie-godot),
que mostra por que o `VehicleBody3D` **não** é um multicorpo de verdade._
