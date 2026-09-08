---
sidebar_position: 1
title: Visão geral
---

# Dinâmica multicorpo (C++)

O modelo multicorpo de verdade — cada roda e cada corpo como um nó rígido
próprio, ligado por articulações, com as forças resolvidas por **restrições** em
vez de raycast com mola. Esta frente é o passo além do sandbox do Godot.

:::tip Entradas publicadas
**1 · [Constraints, juntas e o Jolt por
dentro](/docs/multicorpo/constraints-e-jolt)** — a quinzena de **27/jul a
10/ago**, dedicada a entender o paradigma antes de construir qualquer coisa: o
que é um sistema multicorpo, penalidade × constraint, os graus de liberdade de
cada junta do Godot, o experimento mínimo com `HingeJoint3D` e o que o Godot
**não** expõe do Jolt.

**2 · [O tanque do Jolt e o teto do
Godot](/docs/multicorpo/jolt-vs-godot)** — a parte empírica, de **10 a 12/ago**:
o Tank Controller Demo rodando, as peças do `VehicleConstraint` lidas direto nos
headers em C++, a prova de que o `VehicleBody3D` do Godot **não** é uma exposição
dele, e o teste que bate no limite ao tentar suspensão com `SliderJoint3D`.

**3 · [Um corpo só, quatro
bengalas](/docs/multicorpo/vehicleconstraint-por-dentro)** — a mecânica interna,
lida no código-fonte: o veículo do Jolt tem **um único corpo rígido**, a
constraint é entre o veículo e **o chão**, e é o raycast que descobre esse
segundo corpo a cada passo. Fecha com o `clamp` μ·N do Jolt, que é o mesmo do
protótipo raycast.

**4 · [Dois mundos, uma cena](/docs/multicorpo/ponte-gdextension)** — a primeira
entrada que produz binário em vez de leitura: uma **GDExtension** em C++ com um
`PhysicsSystem` do Jolt próprio rodando dentro do Godot, com **vídeo do veículo
sendo dirigido**. Traz a decisão de arquitetura, a armadilha de paridade de ABI,
a medição que fecha com a teoria em 0,1 % e a **comparação com o GDChrono** do
professor — que confirmou a escolha e mostrou três coisas a copiar.
:::

## Escopo previsto

- Cada roda e corpo como um **nó rígido próprio**, ligado por articulações.
- Forças resolvidas por **restrições**, não por raycast com mola.
- O salto conceitual do _arcade car_ (corpo rígido único) pro modelo rigoroso.
- Formulação, integrador numérico e estabilidade.

## O que vem a seguir

O comparativo Jolt × Godot a partir de um `Sample` e a tentativa de replicá-lo
com nós `Joint3D` já foram feitos e estão documentados em [O tanque do Jolt e o
teto do Godot](/docs/multicorpo/jolt-vs-godot), e a mecânica interna da
`VehicleConstraint` está destrinchada em [Um corpo só, quatro
bengalas](/docs/multicorpo/vehicleconstraint-por-dentro).

A segunda faixa do roadmap — usar C++ e o **GDExtension** para testar o Jolt de
verdade — está **executada** e documentada em [Dois mundos, uma
cena](/docs/multicorpo/ponte-gdextension): o ambiente do `godot-cpp`, a extensão
compilando, o Jolt rodando isolado e o nó `JoltVehicle` dentro do Godot. O código
fica em `gdjolt/` na raiz do repositório.

A comparação com o **GDChrono** do professor já foi feita e está na mesma
entrada: a decisão de arquitetura bate com a dele, e ficaram três pontos a
copiar — construir a cena a partir da física, unificar o build em CMake e tratar
o passo de simulação como decisão explícita.

Seguem **em aberto**: fazer a geometria da cena virar geometria do Jolt — hoje o
chão é construído dentro da extensão — e, só então, o **rover articulado**, que a
`VehicleConstraint` não resolve por ser um modelo de um corpo só. O GDChrono já
roda o rover **Viper** sobre terreno **SCM** deformável, o que dá um alvo
concreto para as frentes de [integração roda–solo](/docs/roda-solo/visao-geral) e
validação comparativa. O plano completo está no roadmap [10 ago – 7 set · Do
sample rodando à ponte em C++](/docs/roadmaps/semana-2026-08-10).

_Referência de partida: a [nota do sandbox no Godot](/docs/notas/dossie-godot),
que mostra por que o `VehicleBody3D` **não** é um multicorpo de verdade._
