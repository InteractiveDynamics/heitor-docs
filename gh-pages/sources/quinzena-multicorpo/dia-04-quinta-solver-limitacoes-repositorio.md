---
title: "Dia 4 — Como o Jolt resolve constraints, o que o Godot esconde, e o que o repositório revela"
data: 2026-07-30
projeto: ExoTerra — PIBIC / UnB / LASE
frente: "Tema 1 — Dinâmica Veicular"
semana: "Estratégia de multicorpo e constraints"
---

# Dia 4 — Como o Jolt resolve constraints, o que o Godot esconde, e o que o repositório revela

## Contexto

O terceiro dia produziu uma restrição de GDL funcionando de fato, numa cena mínima, sem que
nenhuma força tivesse sido calculada ou aplicada manualmente. O quarto dia investiga o que
acontece "por dentro" desse resultado, em três etapas: primeiro, o mecanismo pelo qual o Jolt
resolve uma constraint a cada passo de simulação; em seguida, até que ponto o Godot expõe esse
mecanismo — e onde ele não expõe; por fim, uma exploração direta do repositório oficial do Jolt,
para reconhecer visualmente os recursos que a biblioteca oferece além do que chega ao Godot.

---

## Bloco 1 — Como o Jolt resolve um constraint

### Impulso, não força

O motor de física não mantém uma junta rígida aplicando uma força contínua, como o protótipo
raycast faz. O mecanismo é distinto e tem nome técnico próprio: **impulso**. Uma força age
continuamente ao longo de um intervalo de tempo — é o que o raycast faz a cada quadro, calculando
uma força que atua durante aquele intervalo. Um impulso é uma **mudança instantânea na
velocidade**: o solver não empurra o corpo aos poucos, ele corrige a velocidade imediatamente,
de modo que ela já respeite a restrição a partir do instante seguinte.

Concretamente, dentro de um sistema de duas rígidas conectadas por uma junta, o solver
pergunta, a cada micro-instante de simulação, se algum dos corpos está tentando se mover de um
jeito que a junta proíbe. Em caso afirmativo, ele calcula exatamente quanta velocidade, na
direção proibida, precisa ser removida, e a remove de uma só vez. Não há, nesse processo, um
parâmetro de "intensidade" a ser ajustado pelo desenvolvedor: a pergunta tem uma resposta
matemática única, e o impulso aplicado é sempre exatamente essa resposta.

### O loop iterativo e o motivo de ser sequencial

Dentro de um único passo de física, o solver realiza esse cálculo repetidas vezes — tipicamente
entre quatro e dez iterações — antes de avançar para o próximo passo de simulação. Essa
repetição só se torna necessária quando um corpo participa de **mais de uma constraint
simultaneamente**: corrigir a junta 1 pode perturbar levemente a relação já corrigida pela junta
2, de modo que o sistema precisa de várias rodadas sucessivas de ajuste até que todas as
restrições fiquem simultaneamente satisfeitas, ou próximas disso. Essa técnica é conhecida como
**solver de impulsos sequenciais**, empregada pela maioria dos motores de física usados em jogos
— Jolt, Bullet, PhysX, entre outros.

No experimento do terceiro dia, com apenas uma junta conectando dois corpos, essa característica
praticamente não se manifesta — o resultado já converge de imediato. Ela se torna relevante em
sistemas onde múltiplas juntas compartilham um mesmo corpo, como um chassi de rover conectado
simultaneamente a quatro rodas por quatro `HingeJoint3D` distintas: corrigir a restrição de uma
roda afeta ligeiramente a velocidade do chassi, o que por sua vez afeta as restrições das outras
três, exigindo sucessivas rodadas de ajuste até a estabilização conjunta.

### Por que esse mecanismo não diverge

O contraste com a instabilidade encontrada na implementação do atrito, no protótipo raycast, é
direto. Naquele caso, a força corretiva cancelava velocidade ao longo de um quadro inteiro sem
limite matemático embutido — quando superestimada, o erro se tornava maior no quadro seguinte,
amplificando-se progressivamente, o que exigiu a introdução manual do *clamp* do círculo de
atrito para conter a divergência. No solver de impulsos, a correção não é uma força escolhida e
ajustada externamente: ela é derivada diretamente da formulação matemática da própria restrição,
sendo sempre exatamente a necessária. Não existe, portanto, um parâmetro equivalente ao
coeficiente de atrito para ajustar manualmente — a estabilidade decorre da própria formulação do
problema.

Como referência concreta desse mecanismo em produção: a documentação de migração do Godot 4.6
para o Jolt como motor padrão registra que o número de iterações do solver (`Solver Iterations`)
vem configurado, por padrão, como **4**, sendo ajustável — valores mais altos aumentam a
estabilidade ao custo de desempenho.

---

## Bloco 2 — O que o Godot esconde do Jolt

### Duas versões de Jolt disponíveis para o Godot

Existem, na prática, dois caminhos para usar o Jolt dentro do Godot. Um é o **módulo embutido**
(*core*), incorporado ao próprio motor a partir da versão 4.4 e tornado padrão na versão 4.6 —
é o que está em uso nesta semana. O outro é o **`godot-jolt`**, uma extensão (GDExtension)
desenvolvida pela comunidade, anterior à incorporação do Jolt ao núcleo do Godot, hoje mantida
apenas para correção de bugs.

O ponto relevante é que mesmo essa extensão comunitária, hoje em modo de manutenção, é
reconhecida como mais completa do que o módulo embutido. O próprio repositório da extensão
afirma que o módulo do motor Godot ainda não possui paridade total de recursos em relação a ela,
faltando itens como as interfaces de junta específicas do Jolt (`JoltHingeJoint3D` e
equivalentes) que a extensão expõe. Ou seja: mesmo a versão mais completa de Jolt disponível
para o Godot já é mais limitada que o Jolt original; e a versão embutida por padrão na 4.6 é,
atualmente, a mais limitada das duas.

### A raiz técnica: uma API genérica que antecede o Jolt

Os cinco nós de junta estudados no segundo dia (`PinJoint3D`, `HingeJoint3D`, `SliderJoint3D`,
`ConeTwistJoint3D`, `Generic6DOFJoint3D`) fazem parte de uma API genérica de `Joint3D`, criada
pelo Godot para funcionar com qualquer motor de física por trás — originalmente o
`GodotPhysics3D`, e hoje também o Jolt. O Jolt precisa encaixar seu próprio sistema de
constraints, mais rico, dentro desse molde que não foi originalmente desenhado para ele.

Uma discussão recente da própria equipe de desenvolvimento do Godot expõe essa limitação sem
rodeios: muitos parâmetros da API genérica de `Joint3D` não funcionam corretamente quando o
motor por trás é o Jolt, porque a equipe responsável pela integração não conseguiu mapear o
significado de todos eles para o modelo do Jolt. Um exemplo citado nessa mesma discussão: o
Jolt não implementa limites suaves para juntas do tipo `PinJoint3D` (por serem, no design da
biblioteca, uma junta propositalmente barata computacionalmente), de modo que o módulo Jolt
precisa recorrer, silenciosamente, a uma junta 6DOF internamente sempre que esses limites são
configurados pelo usuário.

### Lacunas concretas identificadas

Três lacunas específicas, documentadas em fontes primárias da comunidade e da equipe do Godot,
merecem registro:

**Ausência de junta fixa nativa.** Não existe, na API atual, uma forma direta de criar uma junta
fixa (*fixed constraint*) — um usuário relatou explicitamente essa ausência em fórum oficial, e
a solução de contorno documentada é montar uma `Generic6DOFJoint3D` com todos os seis eixos
travados manualmente. Existe uma *pull request* em aberto no repositório do Godot propondo
adicionar suporte nativo a essa constraint.

**Impossibilidade de juntas quebráveis.** Não há, na API exposta, forma de ler a força ou o
torque que uma junta está sofrendo em determinado instante — o que impede a implementação de
juntas que se rompem ao ultrapassar um limiar de esforço. Uma proposta em aberto no repositório
de propostas do Godot registra que essas funções existem no Jolt em C++, mas não são expostas
nem ao GDScript nem ao `PhysicsServer3D`.

**Ausência da `VehicleConstraint`.** O modelo de veículo pronto do Jolt — reconhecido pela
própria comunidade do Godot como substancialmente superior ao `VehicleBody3D` nativo do motor —
não está disponível como nó. Uma discussão aberta no repositório de propostas do Godot, cujo
autor relata ter implementado essa funcionalidade por conta própria, propõe formalmente sua
incorporação futura ao motor. Até o momento, não há como simplesmente adicionar uma
`VehicleConstraint` à cena.

### Implicação para o projeto

Essa lacuna específica é relevante para a decisão arquitetural do rover: mesmo optando
integralmente pelo caminho multicorpo — juntas de tipo *hinge* para as rodas, *slider* para a
suspensão — não haveria, no Godot atual, um modelo de veículo pronto do Jolt disponível para
apoiar essa construção. A estrutura de juntas continuaria sendo montada manualmente, e o próprio
contato entre pneu e solo permaneceria um problema em aberto a ser resolvido separadamente,
dentro ou fora do paradigma de constraint.

---

## Bloco 3 — Exploração do repositório oficial do Jolt

### Estrutura de pastas

O repositório `jrouwe/JoltPhysics` documenta, na própria seção "Folder structure" do README,
sua organização de alto nível:

| Pasta | Conteúdo |
|---|---|
| `Jolt/` | todo o código-fonte da biblioteca |
| `Docs/` | documentação, incluindo o catálogo de demonstrações |
| `Samples/` | aplicativo de demonstração, com um teste por funcionalidade |
| `HelloWorld/` | exemplo mínimo de integração da biblioteca |
| `UnitTests/` | testes de validação do comportamento físico |
| `Assets`, `Build`, `JoltViewer`, `PerformanceTest`, `TestFramework` | infraestrutura de apoio |

### O que a lista de recursos revela

A seção "Features" do README lista, de forma explícita, o conjunto de constraints suportadas
pelo Jolt: *Fixed*, *Point*, *Distance* (incluindo molas), *Hinge*, *Slider*, *Cone*, *Rack and
pinion*, *Gear*, *Pulley*, *trajetórias suaves* e *Swing-twist*, além da *6 DOF* — acompanhadas
de motores para acionar qualquer uma delas. A mesma seção lista, separadamente, suporte a
veículos com rodas, veículos rastreados e motocicletas.

Comparada aos cinco nós expostos pelo Godot, essa lista evidencia numericamente a lacuna descrita
no Bloco 2: faltam, entre outras, as constraints fixa, de distância/mola, engrenagem,
cremalheira-e-pinhão, polia e trajetória suave — todas presentes na biblioteca, nenhuma acessível
diretamente a partir de um nó do Godot.

### O catálogo de demonstrações (`Docs/Samples.md`)

O documento que descreve o aplicativo de demonstrações do Jolt organiza os testes disponíveis em
categorias, cada uma com vídeos de referência. Duas categorias são particularmente relevantes
para esta semana de estudo.

A categoria **Constraints** reúne demonstrações em vídeo de constraints não expostas pelo Godot —
*Path*, *Swing-Twist*, *Gear*, *Rack and pinion* e *Pulley* — servindo como confirmação visual
direta da lacuna identificada no Bloco 2.

A categoria **Vehicles** contém a informação mais relevante da exploração. A própria descrição
oficial do Jolt afirma que os veículos dessa categoria são criados por meio da
`VehicleConstraint`, e que esses veículos utilizam *raycasts* ou *shapecasts* para detectar
colisão com o solo, simulando um veículo completo com motor, câmbio, diferenciais e suspensão.
Essa frase confirma, com fonte primária, uma conclusão levantada ao longo da semana: o próprio
modelo de veículo do Jolt combina raycast — para o contato entre pneu e solo — com o solver de
constraints — para a estrutura do chassi, suspensão e transmissão. Raycast e multicorpo não são,
portanto, paradigmas concorrentes; eles coexistem dentro do motor que fundamenta toda a
investigação desta semana.

A categoria **Rig (Ragdolls)**, de caráter opcional, demonstra estruturas articuladas construídas
com `HingeJoint3D` e `Swing-Twist Constraint`, revisitando em vídeo a mesma analogia do esqueleto
usada na definição de sistema multicorpo, no primeiro dia da semana.

---

## Síntese para registro

- O Jolt resolve constraints por meio de um **solver de impulsos sequenciais**: a cada passo de
  física, itera algumas vezes (padrão: 4 iterações) sobre todas as restrições, corrigindo
  velocidades diretamente — não aplicando força ao longo do tempo — até o sistema convergir.
  A correção é matematicamente exata, o que elimina o tipo de divergência resolvido manualmente
  no protótipo raycast por meio do *clamp* de atrito.
- O Godot expõe o Jolt por meio de uma API de `Joint3D` genérica e anterior ao próprio Jolt.
  Essa API tanto implementa incorretamente vários parâmetros do Jolt (ex.: limites suaves em
  `PinJoint3D`) quanto deixa de expor recursos inteiros: junta fixa nativa, juntas quebráveis, e
  principalmente a `VehicleConstraint`.
- O repositório oficial do Jolt documenta onze tipos de constraint e suporte nativo a veículos
  com rodas, rastreados e motocicletas — um conjunto de recursos consideravelmente mais amplo do
  que o exposto pelo Godot.
- O próprio modelo de veículo do Jolt combina raycast (contato pneu-solo) com constraints
  (estrutura do veículo) — confirmando que a escolha entre raycast e multicorpo não é binária.

## Fontes

**Bloco 1 — solver de impulsos**
- StraySpark, *Godot 4.6 Jolt Physics: Complete Migration Guide and Performance Benchmarks* —
  <https://www.strayspark.studio/blog/godot-46-jolt-physics-migration-guide>

**Bloco 2 — limitações do Godot em relação ao Jolt**
- Repositório `godot-jolt/godot-jolt` — <https://github.com/godot-jolt/godot-jolt>
- *Unify Joint3D spring parameters and make them understandable*, godot-proposals #14845 —
  <https://github.com/godotengine/godot-proposals/issues/14845>
- *Add Jolt Vehicle constraints*, godot-proposals discussion #15037 —
  <https://github.com/godotengine/godot-proposals/discussions/15037>
- *Expose Jolt Joint3D get_applied_force and get_applied_torque*, godot-proposals #13422 —
  <https://github.com/godotengine/godot-proposals/issues/13422>
- *Various issues with Jolt fixed joint*, fórum oficial do Godot —
  <https://forum.godotengine.org/t/various-issues-with-jolt-fixed-joint/132455>
- *Add support for Jolt's FixedConstraint joint*, PR #101575 —
  <https://github.com/godotengine/godot/pull/101575>
- Documentação oficial, *Using Jolt Physics* —
  <https://docs.godotengine.org/en/latest/tutorials/physics/using_jolt_physics.html>

**Bloco 3 — repositório do Jolt**
- Repositório `jrouwe/JoltPhysics` — <https://github.com/jrouwe/JoltPhysics>
- `Docs/Samples.md` — <https://github.com/jrouwe/JoltPhysics/blob/master/Docs/Samples.md>

## Próximo dia

O quinto e último dia da semana consolida o aprendizado ao mapear, apenas no papel — sem
qualquer implementação —, qual junta corresponderia a cada parte do rover, e reúne o conteúdo
dos cinco dias numa entrada única de documentação, acompanhada de uma posição fundamentada sobre
a decisão entre raycast e multicorpo para os próximos meses do projeto.
