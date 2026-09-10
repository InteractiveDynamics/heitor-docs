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
a medição que fecha com a teoria em 0,1 %.

**5 · [Duas pontes, um desenho](/docs/multicorpo/gdchrono-comparado)** — a
conferência cega: o professor já tinha ligado o Godot ao **Project Chrono** e
chegou ao **mesmo desenho de arquitetura**, sem a gente combinar. Traz o código
lado a lado, as três diferenças em que ele está à frente, e o achado de que o
`GdChrono` já roda um **rover Viper** sobre **terreno SCM deformável**.

**6 · [Sete corpos, seis juntas](/docs/multicorpo/rocker-articulado)** — a
primeira entrada que **mede** em vez de descrever. Monta a plataforma articulada
de verdade — corpos ligados por `HingeConstraint`, motor no eixo de cada roda — e
a compara com a `VehicleConstraint` na mesma manobra: **0,00° contra 4,34°** de
inclinação do chassi ao passar um degrau. Descobre, de quebra, que o modelo de um
corpo só **sobe degraus maiores que a própria roda** porque ignora a face do
obstáculo.
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

A leitura do **GDChrono** deixou três pontos a adotar, em ordem de importância:
**construir a cena a partir da física** (pré-requisito do rover — enquanto o
número de rodas estiver escrito no código, não há rover), **unificar o build em
CMake** e **tratar o passo de simulação como decisão explícita**.

Esses pontos viraram o roadmap [14–21 set · O rover cabe no
Jolt?](/docs/roadmaps/semana-2026-09-14) — e a resposta chegou **antes da sprint
começar**, em [Sete corpos, seis juntas](/docs/multicorpo/rocker-articulado): a
plataforma articulada existe, roda no Godot, mantém o chassi nivelado onde o
modelo de um corpo só inclina 4,34°, e custa **4 % do orçamento de um quadro**.

Fica registrado o preço dessa troca: ao transformar a roda num corpo que colide,
ganha-se articulação e **perde-se o modelo de pneu**, porque o contato passa a
ser atrito comum de corpo rígido. E fica registrado o custo escondido: a razão de
massa entre chassi e braços exige **4 sub-passos** por quadro — com o padrão do
Jolt, o solver para 12 cm abaixo da altura correta.

Segue **em aberto**, agora com alvo numérico: o **bogie** de seis rodas, que é o
mecanismo que vence o limite encontrado — uma roda rígida não sobe degrau maior
que o próprio raio, e o rocker de quatro rodas para em `0,30 m`. Depois dele, o
**terreno** e a refatoração que faz a cena nascer da física.

O `GdChrono` já roda o **Viper** sobre terreno **SCM**, o que dá alvo concreto
para as frentes de [integração roda–solo](/docs/roda-solo/visao-geral) e
validação comparativa.

_Referência de partida: a [nota do sandbox no Godot](/docs/notas/dossie-godot),
que mostra por que o `VehicleBody3D` **não** é um multicorpo de verdade._
