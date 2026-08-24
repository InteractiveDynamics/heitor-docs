# Anotações — ExoTerra, Tema 1 (Dinâmica Veicular)
### Ponto 1 e Ponto 2 da reunião de 10/08 — "do conceito ao sample rodando"

---

## Contexto

Objetivo da semana: pegar um sample real do Jolt, mapear feature a feature o que ele tem e o Godot não expõe (comparativo formal), e depois tentar replicar esse cenário no Godot com `Joint3D` pra ver onde a coisa bate no limite.

**Sample-âncora escolhido:** Tank Controller Demo (`vehicle_tank.html`, JoltPhysics.js) — um tanque com esteiras, controlado por `VehicleConstraint` + `TrackedVehicleController`.

**Repositório:** `jrouwe/JoltPhysics` clonado localmente pra verificação em código-fonte (não documentação).

---

## Dia 1 — Rodar o sample do Jolt

### O que fiz
- Abri a demo web do JoltPhysics.js (zero setup, roda via WebAssembly)
- Explorei a categoria **Constraints** (tipos de junta "puros")
- Rodei o **Tank Controller Demo** e dirigi manualmente

### O que observei
O tanque gira em torno do próprio eixo, com uma física visivelmente estável.

### Dúvida: por que ele gira no próprio eixo?
**Esclarecido:** é **direção diferencial (skid-steering)** — cada esteira recebe uma velocidade diferente (uma pra frente, outra pra trás/mais devagar) e o torque resultante nos dois lados faz o corpo pivotar. Não é um comportamento "mágico" hardcoded, é física de forças distribuídas normal, só que com um controlador específico por trás.

### Dúvida: por que a física parece tão mais estável que meu protótipo?
**Esclarecido:** o solver do Jolt resolve todas as constraints e contatos **simultaneamente, de forma implícita**, a cada passo. O meu `ground_contact.gd` aplica força **explícita** por raycast a cada frame — foi exatamente essa diferença de arquitetura (não a matemática em si) que causou o bug de ejeção que resolvi com o clamp do círculo de atrito.

> **Anotação-chave do dia:** "Tanque usa VehicleConstraint com direção diferencial — Godot não expõe isso."

---

## Dia 2 — Comparativo formal Jolt × Godot

### Fonte usada
Fui direto nos headers reais do Jolt (não documentação), dentro de `Jolt/Physics/Vehicle/`:
`VehicleConstraint.h`, `Wheel.h`, `TrackedVehicleController.h`, `VehicleTrack.h`, `VehicleDifferential.h`.

### Features reais do Tank (confirmadas em código)

| Feature | O que faz |
|---|---|
| `VehicleConstraint` | Constraint composta — containeriza tudo abaixo |
| Raycast/shape-cast por roda | Mesmo princípio do meu `RayCast3D`, embutido na constraint |
| Suspensão por roda | Mola com `mSuspensionMinLength`/`mSuspensionMaxLength` |
| `TrackedVehicleController` | Dono do **motor** (`VehicleEngine`, curva de torque × RPM) e da **transmissão** (`VehicleTransmission`) — únicos, **compartilhados pelas duas esteiras** |
| `VehicleTrack` (uma por lado) | Tem sua própria razão de engrenagem (`mDifferentialRatio`) + um multiplicador `mLeftRatio`/`mRightRatio` — é esse multiplicador que causa o skid-steer |
| Atrito por roda | Coeficientes fixos (`mLongitudinalFriction`, `mLateralFriction`) — mais simples que o modelo de carro (que usa curva de slip) |

> **Correção registrada:** não é "cada esteira tem seu próprio motor" — é **um motor + uma transmissão únicos**, e o que diferencia esquerda/direita é só o multiplicador de razão por esteira (`VehicleTrack`).

### Dúvida grande do dia: `VehicleBody3D` do Godot é a mesma coisa que `VehicleConstraint` do Jolt?

**Não.** São duas implementações completamente separadas com nome parecido.

- `VehicleBody3D` é uma abstração **do próprio Godot**, no nível do `PhysicsServer3D`, baseada no sistema clássico de veículo por raycast — existe desde antes do Jolt ser opção no engine. Cada backend de física (GodotPhysics, Jolt) precisa **implementar essa lógica por conta própria**.
- O guia de migração do Godot 4.6 confirma: o comportamento do `VehicleBody3D` diverge entre GodotPhysics e Jolt — suspensão, atrito do pneu e trem de força produzem resultados diferentes. Ou seja, o backend Jolt tem sua **própria reimplementação**, não chama o `VehicleConstraint` C++ real por baixo.
- Prova mais forte: existe uma proposal aberta e recente nos `godot-proposals` pedindo exatamente **a exposição das vehicle constraints reais do Jolt** — o que só faz sentido se elas ainda não estiverem expostas.

**Analogia que fixou o conceito:** `VehicleBody3D` é um controle remoto universal — os botões (acelerar, frear, virar) são sempre os mesmos, mas cada "TV" (motor de física) reage do seu próprio jeito por trás. `VehicleConstraint` é o controle de fábrica, feito sob medida pras peças internas do Jolt.

**Implicação prática pro rover:** `VehicleWheel3D.steering` só cobre esquema Ackermann (roda que gira, tipo carro) — não achei suporte nativo a direção diferencial/skid-steer no `VehicleBody3D`. Pra ter isso de verdade, o caminho é GDExtension, não o nó pronto.

### Dúvida: o que é exatamente o "Controller"?

É a camada que traduz input do jogador em força nas rodas — plugável em cima do `VehicleConstraint`, que resolve só a parte genérica (contato, suspensão, atrito).

Peças típicas de um Controller: **Motor** (curva de torque × RPM), **Câmbio** (relações de marcha) e **Diferencial** (como o torque se divide entre rodas).

- `WheeledVehicleController` (carro): diferencial real + direção por ângulo de roda (Ackermann)
- `TrackedVehicleController` (tanque): sem diferencial nem roda que gira — velocidade de cada esteira vem direto do input L/R

**Por que isso importa pro projeto:** essa separação (contato genérico vs. lógica de acionamento) é o modelo de referência pro **Mês 4 do cronograma** (motores/atuadores e modelos de roda) — o Jolt já resolveu essa arquitetura, e o rover provavelmente vai usar skid-steer, como o tanque.

### Tabela comparativa consolidada (entregável-âncora)

| Feature | Jolt (nativo) | Godot expõe? | Observação |
|---|---|---|---|
| `VehicleConstraint` (a constraint composta) | Sim | **Não** | Só existe como API C++ |
| `VehicleBody3D` (nó do Godot) | — | Sim, mas... | Reimplementação própria do Godot, não usa o `VehicleConstraint` por baixo — diverge no comportamento mesmo rodando sobre Jolt |
| Raycast de contato por roda | Sim (embutido) | Parcial | `RayCast3D` genérico existe, solto, não integrado a um sistema de veículo |
| Suspensão spring-damper por roda | Sim (curso mín/máx dedicado) | Parcial | Via `VehicleWheel3D`, mas com física própria do backend |
| `TrackedVehicleController` (motor+câmbio compartilhados) | Sim | **Não** | — |
| `VehicleTrack` (razão + multiplicador esq/dir → skid-steer) | Sim | **Não** | `VehicleWheel3D.steering` só cobre Ackermann |
| Atrito da roda (friction circle embutido) | Sim | **Não** | Reimplementei isso manualmente (bug da ejeção) |

---

## Dia 3 — Replicar no Godot com `Joint3D`

### Ajuste de escopo (antes de começar)
`VehicleConstraint` não tem **nenhum** equivalente em `Joint3D` — é uma peça composta própria. Replicar o Tank literalmente exigiria simular uma corrente de corpos rígidos (as esteiras) — projeto próprio, não tarefa de um dia.

**Decisão:** em vez do Tank, testar o limite com o veículo de rodas físico mais simples possível — reaproveitando a arquitetura já projetada semana passada: **1 chassi + 4 `SliderJoint3D` (suspensão) + 4 `HingeJoint3D` (rodas)**. Hoje só montamos o chassi + 1 roda (frente-esquerda), o suficiente pra encontrar os limites.

### Achado 1 — `SliderJoint3D` no Jolt não tem mola de verdade

Fonte: issue `godot-jolt/godot-jolt#109` (status: **"Done — as much as it can be"**, ou seja, não é algo que vá mudar).

| Parâmetro | Funciona no Jolt? |
|---|---|
| Limite superior/inferior (curso) | ✅ Sim |
| Softness/Restitution/Damping do limite | 🛑 Não — incompatível com a `SliderConstraint` |
| Softness/Restitution/Damping do movimento livre | 🛑 Não |
| Limites/motor angular | 🛑 Não (a própria issue recomenda `Generic6DOFJoint3D`) |

**Traduzindo:** no backend Jolt, `SliderJoint3D` só dá um **batente rígido**. Todos os parâmetros que dariam efeito de mola são ignorados silenciosamente, sem erro.

### Achado 2 — bug prático: `RigidBody3D` não pode ser filho de outro `RigidBody3D` em movimento

**Sintoma:** ao montar `RodaSuporte_FE` como filho do `Chassi` (ambos `RigidBody3D`), o conjunto tomba sozinho durante a queda livre, mesmo sem tocar o chão — sempre pro lado onde está o corpo aninhado.

**Diagnóstico:** isolei tirando o chão da equação (testei só a queda livre) — confirmou que o problema era estrutural, não de contato.

**Causa confirmada:** issue `godotengine/godot#120067` (testada em Godot 4.6.3 com Jolt, reportada em 2026) — `RigidBody3D` não segue de forma confiável um `RigidBody3D` pai em movimento. É um comportamento de longa data no engine, não específico do meu setup.

**Correção:** corpos conectados por junta devem ser **irmãos** na árvore de nós, nunca um dentro do outro — a junta já faz a ligação física, a hierarquia de nós não precisa (e não deve) refletir isso.

### Resultado do teste final
Com a estrutura corrigida (chassi + suporte de roda como irmãos, conectados via `Susp_FE`) e o chão de volta: o contato aconteceu, mas **bateu seco, sem nenhum efeito de suspensão visível**.

Isso é a confirmação empírica, na prática, do Achado 1 (a issue #109) — e fecha o ciclo do Ponto 2 da reunião: "medir até onde o Godot chega e onde bate no limite."

> **Anotação-chave do dia:** "Tentativa de suspensão via SliderJoint3D no Godot/Jolt: bate seco, sem mola. Confirma empiricamente a limitação documentada no godot-jolt#109 — a VehicleConstraint nativa do Jolt resolve isso internamente; a via Joint3D não tem substituto."

---

## Síntese da semana

Três achados sustentam a decisão arquitetural, todos verificados em fonte primária (código-fonte ou issues oficiais, não documentação secundária):

1. **Lacuna de API:** `VehicleConstraint` (Jolt) não tem equivalente em `Joint3D`, e `VehicleBody3D` (Godot) não é uma exposição dele — é uma reimplementação própria e paralela.
2. **Lacuna de suporte no backend Jolt:** mesmo as juntas primitivas que existem (`SliderJoint3D`) perdem funcionalidade de mola quando rodando sobre Jolt — documentado, não vai mudar.
3. **Gotcha de implementação:** `RigidBody3D` aninhado em outro `RigidBody3D` móvel é estruturalmente não confiável no Godot — regra de ouro pra qualquer rig multicorpos daqui pra frente: **juntas conectam irmãos, nunca pai-filho**.

### Em aberto / pendente
- **Esquema de direção do rover** (skid-steer como o tanque, ou Ackermann como o carro) — decisão do professor, não foi definida ainda.
- Montar as outras 3 rodas do veículo físico é opcional a partir daqui — o achado central já está confirmado e documentado.

### Próximos passos da semana
- **Ponto 3:** ler a doc do GDExtension (conceito, não construir extensão de produção)
- **Ponto 4:** espelhar o GDChrono do professor pro Jolt
