---
title: "Dia 2 — Graus de liberdade e as juntas do Godot"
data: 2026-07-28
projeto: ExoTerra — PIBIC / UnB / LASE
frente: "Tema 1 — Dinâmica Veicular"
semana: "Estratégia de multicorpo e constraints"
---

# Dia 2 — Graus de liberdade e as juntas do Godot

## Contexto

O primeiro dia estabeleceu que uma junta restringe o movimento relativo entre dois corpos, mas
deixou em aberto uma pergunta: restringir *como*, exatamente? O segundo dia responde essa
pergunta formalizando o conceito de **grau de liberdade (GDL)** — a régua que mede quanto
movimento uma junta permite ou proíbe — e traduzindo cada um dos cinco tipos de junta
disponíveis no Godot em termos dessa régua. O dia se encerra com um esclarecimento conceitual
sobre a própria natureza dessas juntas dentro da engine: o que elas são, tecnicamente, dentro do
Godot.

---

## 1. O que é um grau de liberdade

Um grau de liberdade é **um jeito independente que um corpo tem de se mover**. A pergunta que
essa métrica responde é sempre a mesma: de quantas maneiras separadas um corpo pode se mexer,
sem que uma dependa da outra?

Um corpo rígido solto no espaço 3D tem exatamente **seis** graus de liberdade: três de
**translação** (deslizar ao longo dos eixos X, Y e Z) e três de **rotação** (girar em torno dos
eixos X, Y e Z). Não existe um sétimo modo de movimento — qualquer deslocamento complexo que o
corpo faça é uma combinação desses seis movimentos independentes. Essa divisão limpa, 3 + 3 = 6,
já havia sido mencionada no primeiro dia e é a base de tudo o que segue.

## 2. Constraint como remoção de graus de liberdade relativos

Com essa métrica em mãos, a definição operacional de junta fica precisa:

> Uma junta pega os 6 graus de liberdade **relativos** entre dois corpos e trava alguns deles. Os
> graus de liberdade que sobram são exatamente o que a junta permite.

A palavra "relativos" é o ponto central dessa definição. A junta não atua sobre o movimento
absoluto de cada corpo isoladamente — ela atua sobre o movimento de um corpo **em relação ao
outro**. Uma dobradiça de porta não impede a casa inteira de se mover; ela impede apenas que a
porta se mova em relação ao batente, exceto pela única rotação que permite.

Essa reformulação também responde, de forma direta, à pergunta original de "como limitar o
movimento de um corpo em relação a outro": escolher **como** limitar esse movimento e escolher
**qual junta usar** são a mesma decisão. Não se trata de configurar forças — trata-se de decidir
quantos, e quais, dos seis graus de liberdade relativos permanecem livres.

## 3. As juntas do Godot como assinaturas de GDL

Cada tipo de junta disponível no Godot corresponde a um padrão fixo de quais graus de liberdade
relativos ficam travados e quais ficam livres. A tabela a seguir resume essas assinaturas e sua
tradução para o contexto do rover:

| Junta (Godot) | Análogo mecânico | GDL que sobram | Uso no rover |
|---|---|---|---|
| `PinJoint3D` | rótula / junta esférica | 3 rotações livres | ponto de articulação sem nenhuma restrição de giro |
| `HingeJoint3D` | dobradiça / revoluta | 1 rotação | eixo da roda girando; braço de suspensão pivotando |
| `SliderJoint3D` | prismática | 1 translação | curso vertical da suspensão |
| `ConeTwistJoint3D` | ombro / esférica limitada | rotação limitada (cone + torção) | juntas com batente angular |
| `Generic6DOFJoint3D` | configurável | escolhido eixo a eixo | casos gerais; combinações; motores |

Detalhando cada uma:

**`PinJoint3D`** trava as três translações e deixa as três rotações completamente livres. É a
rótula pura: os dois corpos ficam presos por um ponto comum, mas podem girar livremente em torno
dele em qualquer direção.

**`HingeJoint3D`** deixa apenas **uma** rotação livre — em torno de um único eixo definido. É a
dobradiça propriamente dita, e a junta mais diretamente aplicável ao eixo de uma roda ou a um
braço de suspensão que pivota.

**`SliderJoint3D`** deixa apenas **uma** translação livre, ao longo de um eixo definido. É a
junta prismática, e corresponde ao curso vertical de uma suspensão. Vale registrar, como detalhe
de precisão, que o `SliderJoint3D` pode opcionalmente liberar também a torção ao longo desse
mesmo eixo; para o caso de suspensão, o uso pretendido é como translação pura.

**`ConeTwistJoint3D`** trava as três translações e permite rotação, mas dentro de **limites**: um
cone de inclinação somado a uma torção em torno do eixo principal — o mesmo modelo usado para
representar um ombro humano. Diferente das duas anteriores, essa junta não deixa um GDL
totalmente livre; ela o restringe a uma faixa.

**`Generic6DOFJoint3D`** é a junta configurável por excelência: cada um dos seis graus de
liberdade pode ser individualmente travado, deixado livre, ou limitado a uma faixa — com a opção
adicional de acoplar motores a qualquer eixo. Qualquer uma das quatro juntas anteriores pode, em
princípio, ser reconstruída com uma `Generic6DOFJoint3D` configurada adequadamente; ela é o
recurso a usar quando o comportamento desejado combina translação e rotação de formas que as
juntas especializadas não cobrem isoladamente.

Um ponto estrutural comum a todas: toda junta em Godot liga **exatamente dois corpos**, indicados
pelos campos `node_a` e `node_b` no Inspector — é a implementação literal, dentro da engine, do
"linkar dois corpos rígidos" mencionado na orientação da semana.

Por fim, vale registrar a ligação com o restante da semana: no Godot 4.6, essas cinco juntas são
resolvidas, por baixo dos panos, pelo motor **Jolt** — de modo que escolher a junta correta,
nesta etapa, é escolher qual constraint do Jolt será efetivamente acionada.

## 4. Esclarecimento: o que são, tecnicamente, essas juntas

Uma dúvida legítima que surge ao ver nomes como `PinJoint3D` ou `HingeJoint3D` pela primeira vez
é se eles são funções da linguagem GDScript. A resposta é não: são **nós** (*nodes*) — mais
precisamente, classes oferecidas pela engine que se adicionam à árvore de uma cena, na mesma
categoria de nós já usados no protótipo raycast, como `RigidBody3D` e `RayCast3D`.

O modelo mental do Godot é o de uma **árvore de nós**. Cada nó é um objeto presente na cena, com
propriedades editáveis no Inspector e um comportamento executado pela engine a cada quadro. O
`RayCast3D`, por exemplo, é um nó cujo comportamento é disparar um raio e informar o que ele
atingiu. Um `HingeJoint3D` segue exatamente a mesma lógica — é um nó cujo comportamento é "tomar
os dois corpos indicados e permitir apenas o giro relativo entre eles em torno de um eixo".

Estruturalmente, `Joint3D` é a classe-base — a família — e `PinJoint3D`, `HingeJoint3D`,
`SliderJoint3D`, `ConeTwistJoint3D` e `Generic6DOFJoint3D` são seus subtipos. Cada subtipo herda
o comportamento básico de "ligar dois corpos" e adiciona seu próprio padrão específico de
travamento de graus de liberdade, listado na tabela da Seção 3.

Na prática, uma junta é usada de duas formas, nenhuma delas correspondendo a uma chamada de
função isolada:

- **No editor**, adiciona-se o nó correspondente à árvore da cena e preenchem-se, no Inspector,
  os campos `node_a` e `node_b`, apontando para os dois `RigidBody3D` a serem conectados.
- **Em GDScript**, o nome da junta aparece como um **tipo/classe**, instanciado da forma usual —
  por exemplo, `var junta = HingeJoint3D.new()`. Aqui, `HingeJoint3D` é a classe sendo
  instanciada; `.new()` é o construtor. A distinção correta, portanto, é que GDScript é a
  linguagem, e `HingeJoint3D` é um tipo que a engine disponibiliza para uso a partir dela — não
  uma função embutida da linguagem em si.

O cálculo físico propriamente dito — resolver a restrição a cada passo de simulação — acontece
dentro do motor, implementado em C++. No Godot 4.6, esse cálculo é executado pelo Jolt, tema que
é aprofundado no quarto dia da semana, quando a teoria da restrição de GDL é observada
funcionando numa cena real.

---

## Síntese para registro

- Corpo rígido livre no espaço 3D tem 6 graus de liberdade: 3 de translação, 3 de rotação.
- Constraint = travar parte dos 6 GDL **relativos** entre dois corpos; os GDL restantes são o que
  a junta permite. Escolher a junta é escolher como restringir o movimento.
- Tabela de juntas do Godot e seus GDL remanescentes: `PinJoint3D` (3 rotações),
  `HingeJoint3D` (1 rotação), `SliderJoint3D` (1 translação), `ConeTwistJoint3D` (rotação
  limitada), `Generic6DOFJoint3D` (configurável eixo a eixo).
- Toda junta liga exatamente dois corpos (`node_a` / `node_b`).
- As juntas do Godot não são funções da linguagem: são **nós/classes**, da mesma família de
  `RigidBody3D` e `RayCast3D`, usadas no editor via Inspector ou instanciadas em GDScript como
  qualquer outra classe (`HingeJoint3D.new()`). O cálculo físico ocorre dentro da engine, em
  C++, executado pelo Jolt no Godot 4.6.

## Próximo dia

O terceiro dia sai da teoria e constrói uma cena mínima e isolada no Godot: dois `RigidBody3D`
ligados por um `HingeJoint3D`, para observar diretamente a restrição de GDL em funcionamento,
sem qualquer força aplicada manualmente.
