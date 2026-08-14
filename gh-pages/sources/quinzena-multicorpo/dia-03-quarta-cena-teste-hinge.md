---
title: "Dia 3 — Experimento mínimo: dois corpos ligados por um HingeJoint3D"
data: 2026-07-29
projeto: ExoTerra — PIBIC / UnB / LASE
frente: "Tema 1 — Dinâmica Veicular"
semana: "Estratégia de multicorpo e constraints"
---

# Dia 3 — Experimento mínimo: dois corpos ligados por um HingeJoint3D

## Contexto

Os dois primeiros dias trataram o tema de forma inteiramente conceitual: o que é um sistema
multicorpo, o contraste entre penalidade e constraint, e a tradução de cada junta do Godot em
termos de graus de liberdade. O terceiro dia sai da teoria: o objetivo é construir, numa cena
isolada do projeto, uma restrição de GDL funcionando de verdade — dois corpos rígidos ligados
por um `HingeJoint3D` — e observar o comportamento resultante, sem escrever código e sem aplicar
qualquer força manualmente. A cena não tem qualquer relação com o rover; o isolamento é
deliberado, no mesmo espírito da separação já praticada com o arquivo `ground_contact.gd`.

## 1. A cena construída

A cena foi montada com a raiz `Node3D`, renomeada para `TesteJunta`, salva isoladamente em
`res://sandbox/`. A estrutura final da árvore de nós é a seguinte:

```
TesteJunta (Node3D, raiz)
├── Camera3D
├── DirectionalLight3D
├── Ancora (RigidBody3D, Freeze = on, posição -1,3,0)
│   ├── CollisionShape3D (BoxShape3D)
│   └── MeshInstance3D (BoxMesh)
├── Pendulo (RigidBody3D, sem freeze, posição 1,3,0)
│   ├── CollisionShape3D (BoxShape3D)
│   └── MeshInstance3D (BoxMesh)
└── HingeJoint3D (posição 0,3,0 — ponto de pivô)
    Node A = Ancora
    Node B = Pendulo
```

A câmera e a luz direcional foram adicionadas apenas como infraestrutura de observação — sem
elas, a cena rodaria normalmente, mas a tela permaneceria vazia ou escura ao pressionar F6.

A **Âncora** foi implementada como um `RigidBody3D` com a propriedade **Freeze** ligada. Um
`RigidBody3D` congelado deixa de ser afetado pela simulação (não cai, não se move), mas
permanece um corpo físico válido, apto a servir de ponto fixo para uma junta — o equivalente
funcional de um "prego na parede", sem que o Godot precise de um tipo de nó dedicado a essa
finalidade. Como todo `RigidBody3D`, ela recebeu dois filhos: um `CollisionShape3D` com uma
`BoxShape3D` (a forma que a física reconhece) e um `MeshInstance3D` com uma `BoxMesh` (a forma
que é desenhada na tela) — a física e o visual de um corpo físico são, em Godot, dois nós
distintos.

O **Pêndulo** foi construído de forma idêntica — mesmo par de filhos, posição espelhada no eixo
X, à mesma altura da Âncora — com a única diferença relevante de que a propriedade Freeze **não**
foi ativada, permitindo que o corpo permaneça livre e sujeito à gravidade.

O **`HingeJoint3D`**, diferentemente dos dois corpos, não pertence à hierarquia de nenhum deles:
foi criado como filho direto da raiz e posicionado exatamente no ponto médio entre a Âncora e o
Pêndulo — o ponto físico em torno do qual a rotação relativa deve ocorrer. Sua função inteira é
apontar para os dois corpos a conectar, o que foi feito preenchendo os campos **Node A** e
**Node B** no Inspector com `Ancora` e `Pendulo`, respectivamente — a implementação literal do
"linkar dois corpos rígidos" discutido nos dias anteriores.

## 2. Confirmação do motor de física

Antes de executar a cena, foi conferido em *Project Settings → Advanced Settings → Physics → 3D
→ Physics Engine* que o motor configurado era o **Jolt** — comportamento padrão no Godot 4.6.
Essa confirmação garante que o solver responsável por resolver a restrição do `HingeJoint3D` é,
de fato, o motor estudado ao longo da semana.

## 3. Execução e observação

Ao rodar a cena (F6), o comportamento observado foi o seguinte: o Pêndulo caiu por um breve
instante, foi contido pela junta e passou a oscilar em torno do ponto de pivô, como um pêndulo
físico real — sem que nenhum código tivesse sido escrito e sem que nenhuma força tivesse sido
aplicada manualmente pelo desenvolvedor.

Esse resultado é a confirmação prática, e não apenas teórica, do contraste estabelecido no
primeiro dia da semana: no paradigma de constraint, quem resolve a restrição e produz o
movimento resultante é o motor de física, não o código escrito pelo desenvolvedor.

## 4. Achado do dia: exclusão de colisão entre corpos ligados por uma junta

Durante a observação, notou-se que o Pêndulo **atravessa** a Âncora ao longo do movimento,
em vez de colidir fisicamente com ela. Esse comportamento não é uma falha — é um padrão
intencional do Godot.

Toda junta derivada de `Joint3D` possui a propriedade **Exclude Nodes From Collision**, que vem
**ligada por padrão**. Seu efeito é que os dois corpos conectados por aquela junta deixam de
colidir entre si, mesmo quando suas formas de colisão se sobrepõem espacialmente.

A justificativa é mecânica: numa junta real — uma dobradiça, por exemplo — as partes conectadas
se tocam fisicamente no próprio pivô, por definição. Caso a colisão entre elas permanecesse
ativa, dois sistemas de resolução distintos entrariam em conflito no mesmo ponto: a junta
tentando manter o pivô fixo, e o solver de colisão tentando afastar os corpos por considerá-los
sobrepostos. O resultado observável desse conflito é travamento e vibração exatamente onde o
sistema deveria ser mais estável. A exclusão de colisão evita esse conflito ao garantir que
apenas a junta — não a colisão — governe a relação entre os dois corpos ligados.

Esse comportamento foi verificado experimentalmente: ao desativar manualmente a opção Exclude
Nodes From Collision e executar a cena novamente, observou-se o comportamento alternativo
esperado — travamento e vibração do Pêndulo próximo ao pivô, causados pela disputa entre a
colisão e a junta.

Esse achado tem relevância direta para o desenvolvimento futuro do rover: o chassi e cada roda,
conectados por um `HingeJoint3D` no eixo, muito provavelmente terão formas de colisão
sobrepostas próximas ao eixo de rotação. O comportamento desejável nesse caso é exatamente o
padrão do Godot — excluir a colisão mútua entre os dois corpos ligados, deixando que apenas a
junta defina a relação entre eles.

## 5. Pendência

O escopo original do dia previa ainda dois testes adicionais, não realizados nesta sessão:
girar o eixo do `HingeJoint3D` no editor, observando a mudança de plano da oscilação, e ativar a
propriedade **Angular Limit** (parâmetros `lower` e `upper`), restringindo ainda mais o único
grau de liberdade rotacional que a junta permite. Ambos os testes ficam registrados como
pendência para uma sessão futura, e não devem ser considerados concluídos nesta documentação.

## Nota de organização do repositório

Ficou definido que a cena `.tscn` permanece isolada dentro do projeto Godot, em
`sandbox/joints/`, enquanto o registro visual do experimento (print ou GIF) é versionado no
repositório de documentação, em `docs/multicorpo/assets/`. Optou-se deliberadamente por não
criar uma página isolada apenas para o conteúdo de quarta-feira: o texto correspondente a este
experimento é incorporado como subseção da entrada consolidada da semana, planejada para
sexta-feira.

---

## Síntese para registro

- Cena isolada `TesteJunta`, com dois `RigidBody3D` (Âncora, congelada; Pêndulo, livre) ligados
  por um `HingeJoint3D` com `Node A`/`Node B` apontando para os dois corpos.
- Motor de física confirmado como Jolt antes da execução.
- Ao rodar, o Pêndulo oscilou como um pêndulo real, sem código ou força aplicada manualmente —
  confirmação prática de que o solver é o autor do movimento no paradigma de constraint.
- Achado: `Exclude Nodes From Collision`, ligada por padrão em toda `Joint3D`, faz os corpos
  ligados por uma junta ignorarem colisão mútua — evita conflito entre o solver de colisão e o
  solver da junta no ponto de pivô. Relevante diretamente para a futura junta chassi-roda do
  rover.
- Pendente: teste de rotação do eixo do hinge e de `Angular Limit`.

## Próximo dia

O quarto dia aprofunda o funcionamento interno do solver do Jolt (resolução por impulsos
sequenciais), levanta as limitações documentadas do módulo Jolt embutido no Godot em relação à
interface completa do Jolt, e explora o repositório oficial do Jolt para reconhecer, de forma
concreta, os recursos de constraint e de veículo disponíveis na biblioteca mas não expostos pela
engine.
