---
title: "Dia 1 — O que é um sistema multicorpo?"
data: 2026-07-27
projeto: ExoTerra — PIBIC / UnB / LASE
frente: "Tema 1 — Dinâmica Veicular"
semana: "Estratégia de multicorpo e constraints"
---

# Dia 1 — O que é um sistema multicorpo?

## Contexto

Esta semana nasceu de uma direção dada pelo orientador em reunião: explorar a **estratégia de
multicorpo** como alternativa (ou complemento) ao protótipo raycast já implementado, entendendo
como o motor de física do Godot — o Jolt — liga corpos rígidos por meio de juntas (*joints*) e
restringe o movimento entre eles. A instrução explícita foi avançar devagar: entender o
paradigma antes de qualquer tentativa de reconstruir o rover.

O objetivo do primeiro dia é puramente conceitual: definir o que é um sistema multicorpo,
entender a diferença fundamental entre a abordagem já implementada (raycast, por penalidade) e
a abordagem que está sendo estudada agora (constraints), e situar o próprio trabalho já feito
dentro desse quadro maior.

---

## 1. Os dois tijolos: corpo rígido e junta

Antes de definir "multicorpo", é preciso fixar dois conceitos que o sustentam.

Um **corpo rígido** é um objeto que não se deforma — a distância entre quaisquer dois pontos
dele nunca muda. Para descrevê-lo completamente no espaço, bastam duas informações: **onde ele
está** (posição) e **como está orientado** (rotação). Cada uma dessas informações se decompõe em
três eixos, o que dá ao corpo livre no espaço 3D exatamente **6 graus de liberdade (GDL)** — três
de translação e três de rotação. Esse número é a base de todo o raciocínio sobre juntas que será
formalizado no dia seguinte.

Uma **junta** (*joint*, ou *constraint*) é uma conexão entre dois corpos que **proíbe** parte
desse movimento relativo entre eles. O exemplo mais direto é uma dobradiça de porta: ela liga a
porta ao batente e permite exatamente **um** tipo de movimento — girar em torno de um eixo. Todo
o restante do movimento relativo entre porta e batente foi eliminado pela própria construção da
dobradiça.

## 2. Definição de sistema multicorpo

Com esses dois tijolos, a definição fica direta:

> **Sistema multicorpo** é um conjunto de corpos rígidos conectados por juntas, em que cada
> junta restringe o movimento relativo entre os corpos que ela liga.

A analogia mais útil para fixar essa ideia é a de um **esqueleto** (ou uma marionete). Os ossos
correspondem aos corpos rígidos; as articulações, às juntas. O joelho funciona quase como uma
dobradiça pura — só permite giro num eixo; o ombro é mais livre, permitindo rotação em várias
direções dentro de um cone. Em nenhum dos dois casos alguém precisa "empurrar" o antebraço para
que ele permaneça preso ao braço: a articulação garante essa relação por construção, não por
uma força aplicada continuamente.

Aplicando essa definição — ainda em nível conceitual, sem qualquer implementação — a um rover:
o chassi seria um corpo, cada roda outro corpo, cada braço de suspensão outro corpo, todos
conectados por juntas apropriadas (a roda gira em torno de um eixo fixo ao chassi; a suspensão
desliza verticalmente). Essa imagem formal de "rover como sistema multicorpo" é o pano de fundo
de toda a semana, embora sua construção esteja fora de escopo por enquanto.

## 3. O contraste central: penalidade versus constraint

Este é o núcleo conceitual do dia, e o ponto que separa o protótipo raycast já existente do
paradigma que está sendo estudado agora. As duas abordagens buscam o mesmo resultado — manter
uma relação física válida entre partes de um sistema — mas chegam a ele por caminhos opostos.

### Método de penalidade (o que já foi implementado)

No protótipo raycast, a relação física é mantida por **penalidade**, isto é, por força. A cada
quadro de simulação, mede-se o quanto a situação atual está "errada" em relação ao que deveria
ser (por exemplo, o quanto uma mola de suspensão está comprimida além do repouso, ou o quanto
uma roda está deslizando em vez de rolar), e calcula-se uma força corretiva que é aplicada ao
corpo. Nesse esquema, **quem calcula e aplica a força é o desenvolvedor** — a força é escrita
explicitamente no código, e a relação entre os corpos é mantida de forma aproximada, na medida
em que a força escolhida esteja bem dimensionada.

Essa característica tem uma consequência prática já vivida no desenvolvimento do protótipo: a
instabilidade numérica encontrada durante a implementação do atrito lateral, em que o rover era
ejetado violentamente da cena. O mecanismo era clássico de um integrador explícito divergindo —
a força corretiva de um quadro cancelava mais velocidade do que a que realmente existia,
invertendo o erro e amplificando-o no quadro seguinte. A solução foi ancorar a força num limite
físico real: o *clamp* do círculo de atrito (`coeficiente_de_atrito × carga_normal`), que
elimina a divergência por construção, ao impedir que a força corretiva jamais ultrapasse o que é
fisicamente possível. Esse episódio é a manifestação prática do risco inerente ao método de
penalidade: como a força é escolhida e tunada por quem programa, um erro de dimensionamento se
traduz diretamente em instabilidade.

### Método de constraint (o que está sendo estudado)

No paradigma de multicorpo, a lógica se inverte. Em vez de calcular uma força, declara-se
diretamente a **relação geométrica** que deve valer entre dois corpos — por exemplo, "estes dois
corpos só podem girar um em relação ao outro em torno deste eixo". A partir dessa declaração, é
o **solver do motor de física** (no caso do Godot 4.6, o Jolt) que calcula, a cada passo de
simulação, o impulso exato necessário para que a relação declarada permaneça verdadeira. A junta
é rígida por construção: ela não tenta manter os corpos ligados por meio de uma força ajustável,
simplesmente não permite fisicamente o movimento que violaria a relação.

### A analogia e a distinção de autoria

A imagem que resume esse contraste é a diferença entre um **elástico** e uma **dobradiça de
metal**. Um elástico prendendo uma porta fechada funciona, mas de forma aproximada — ele é mole,
pode oscilar, e sua eficácia depende de quão bem esticado ele está. Uma dobradiça de metal de
verdade, por outro lado, torna fisicamente impossível o movimento que ela não permite; não há
"tentativa", há impedimento estrutural.

A distinção mais importante, e que atravessa toda a semana, é sobre **quem é o autor da força**
em cada paradigma. No método de penalidade, o autor é quem programa — por isso a instabilidade
do atrito foi um problema a ser resolvido com um ajuste manual (o *clamp*). No método de
constraint, o autor é o motor de física — a relação é resolvida matematicamente, sem que haja um
parâmetro de "intensidade da força" para calibrar.

| | Penalidade (raycast) | Constraint (multicorpo) |
|---|---|---|
| Quem calcula a força | O desenvolvedor, a cada quadro | O solver do motor de física |
| Natureza da relação | Aproximada, depende do ajuste da força | Exata, por construção |
| Risco característico | Divergência se a força corretiva for mal dimensionada | Não há força a calibrar — a violação é matematicamente impedida |
| Analogia | Elástico segurando a porta | Dobradiça de metal |

## 4. O raycast como modelo multicorpo "achatado"

Um ponto de correção conceitual importante, que evita um erro comum: o protótipo raycast **não
contém juntas escondidas**. A relação correta é a oposta — ele **substitui** as juntas por
forças calculadas manualmente.

O modelo multicorpo formal de um rover, como descrito na Seção 2, envolveria cinco corpos ou
mais (chassi e cada roda, no mínimo), conectados por juntas específicas. O protótipo raycast
**colapsa** todo esse sistema num único `RigidBody3D`, e no lugar de cada junta que existiria no
modelo formal, calcula uma força equivalente:

- A força de **mola-amortecedor** (suspensão) desempenha, de forma aproximada, o papel que um
  *slider joint* de suspensão desempenharia no modelo formal — restringir o movimento relativo
  entre chassi e roda a um único eixo de translação.
- As forças de **tração longitudinal** e **grip lateral** desempenham, de forma aproximada, o
  papel que um *hinge joint* no eixo da roda, somado a um modelo de contato pneu-solo,
  desempenhariam no modelo formal.

Ou seja: cada tripla de forças calculada por roda no arquivo `ground_contact.gd` é uma
aproximação, feita à mão, do que as juntas produziriam automaticamente num sistema multicorpo
propriamente dito.

Vale registrar também que o `VehicleBody3D`, testado e descartado antes da implementação do
raycast atual, pertence à mesma família paradigmática. Ele também é, por baixo da abstração, um
veículo raycast — um corpo único com raios nas rodas e um modelo de pneu embutido como
caixa-preta. A diferença em relação ao raycast explícito atual é apenas o nível de exposição:
o `VehicleBody3D` esconde a física dentro do nó, enquanto o `ground_contact.gd` a expõe.

### Conclusão do dia

A frase que resume e fecha o raciocínio de segunda-feira é a seguinte:

> Raycast e multicorpo não são paradigmas opostos ou competidores — o raycast é uma
> **aproximação concentrada (*lumped*)** do multicorpo.

Essa conclusão tem uma implicação prática direta: migrar, no futuro, para um sistema de juntas
não descarta o trabalho já realizado no protótipo raycast. Pelo contrário, o processo de
implementar as forças manualmente — incluindo o episódio de instabilidade e sua correção —
construiu, na prática, a intuição física que o solver de constraints vai passar a executar de
forma automática.

---

## Síntese para registro

- Corpo rígido livre no espaço 3D tem 6 graus de liberdade (3 translação + 3 rotação).
- Junta = conexão que restringe o movimento relativo entre dois corpos.
- Sistema multicorpo = corpos rígidos conectados por juntas (analogia: esqueleto/marionete).
- Penalidade (raycast): o desenvolvedor calcula e aplica a força; relação aproximada; risco de
  divergência (caso concreto: a ejeção por atrito, resolvida com o *clamp* do círculo de
  atrito).
- Constraint (multicorpo): declara-se a relação; o solver do motor calcula o impulso exato;
  relação exata por construção.
- O raycast já implementado é uma versão achatada (*lumped*) do modelo multicorpo formal — as
  forças por roda substituem o que juntas fariam automaticamente. `VehicleBody3D` pertence à
  mesma família, apenas mais encapsulado.
- Migrar para juntas no futuro não invalida o trabalho já feito no raycast.

## Próximo dia

O dia seguinte formaliza o conceito de grau de liberdade (GDL) e traduz cada tipo de junta
disponível no Godot (`PinJoint3D`, `HingeJoint3D`, `SliderJoint3D`, `ConeTwistJoint3D`,
`Generic6DOFJoint3D`) em termos de quantos e quais GDL cada uma permite.
