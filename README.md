# desafio_teste_batalha_naval

Casos de teste para o desafio **Batalha Naval** da disciplina Projeto,
Implementação e Teste de Software — 2026.

**Colaborador:** Gabriel de Oliveira Gnoatto — RA 23298801-2 (individual).

## 1. Especificação do desafio

- **Jogo:** batalha naval para **02 jogadores**, com um tabuleiro **10 × 10**
  por jogador.
- **Frota (dada pelo enunciado):**
  - 1 porta-aviões — ocupa 5 casas;
  - 1 encouraçado — ocupa 4 casas;
  - 1 submarino — ocupa 3 casas;
  - 1 destroyer/hidroavião — ocupa 2 casas.
  
  Total: **14 cascos**.
- **Premissa explícita:** o enunciado em `desafios.md` define o tabuleiro e a
  frota, mas **não** define contrato JavaScript, coordenadas, turnos, tiros nem
  critério de vitória. Todas as regras abaixo são premissas assumidas,
  passíveis de revisão pelo professor.

### 1.1 Tabuleiro e coordenadas

- O tabuleiro é uma matriz `10 × 10`. As coordenadas são `[linha, coluna]`,
  começando em `0` e terminando em `9` em ambos os eixos.
- Cada casa contém:
  - `0` — água;
  - `5`, `4`, `3` ou `2` — casco do navio do respectivo tamanho.

Guardar o tamanho na casa (em vez de apenas `1`) permite identificar o
afundamento e a vitória sem transportar um objeto de frota separado.

### 1.2 Posicionamento

- Cada navio é descrito por `{ tamanho, linha, coluna, orientacao }`, em que
  `linha`/`coluna` são a casa inicial e `orientacao` é `'H'` (horizontal) ou
  `'V'` (vertical).
- A frota é um array com **exatamente quatro** navios, um de cada tamanho
  (`5`, `4`, `3`, `2`).
- Navios podem estar na horizontal ou na vertical, e **podem encostar** uns nos
  outros, inclusive na diagonal. Não podem **sobrepor-se** nem sair do
  tabuleiro.

### 1.3 Tiros, afundamento e vitória

- A grade de tiros é uma matriz `10 × 10` com `null` (ainda sem tiro),
  `'agua'`, `'acerto'` ou `'afundado'`.
- Um tiro em casa já marcada é recusado com `resultado: 'repeticiao'`; a grade
  e o jogador permanecem inalterados.
- Um tiro fora do tabuleiro, ou com grade/tabuleiro/jogador inválidos, resulta
  em `resultado: 'erro'`.
- Tiro em água marca `'agua'`; tiro em casco marca `'acerto'`.
- Quando **todas** as casas de um navio receberam tiro, o resultado é
  `'afundado'` e o campo `afundado` informa o tamanho do navio. A casa atirada
  passa a `'afundado'` na grade retornada.
- A vitória ocorre quando os **14 cascos** do tabuleiro adversário foram
  atingidos. Nesse caso `vencedor` é o índice do jogador que deu o último tiro
  e o campo `jogador` **permanece** com ele, pois a partida terminou.
- **Acerto e afundamento mantêm o jogador da vez**; somente um tiro na água
  alterna o turno. Em `repeticiao` e `erro` o jogador também permanece. Trata-se
  de premissa explícita, revisável pelo professor.

### 1.4 Contrato JavaScript

Funções CommonJS em `src/batalhaNaval.js` (camada pura) e `src/partida.js` (estado da partida):

```js
module.exports = { posicionarFrota, atirar };
```

**`posicionarFrota(frota)`** devolve:

```js
{
  valida: true | false,
  tabuleiro: number[][] | null, // 10x10 quando válido; null quando inválido
  motivo: string                // '' quando válido; uma das strings da tabela abaixo
}
```

**`atirar(tabuleiro, tiros, jogador, alvo)`** devolve:

```js
{
  tiros: (string|null)[][], // nova matriz 10x10
  resultado: 'agua' | 'acerto' | 'afundado' | 'repeticiao' | 'erro',
  afundado: 5 | 4 | 3 | 2 | null,
  vencedor: 0 | 1 | null,
  jogador: 0 | 1,           // próximo jogador, ou o vencedor quando houve fim
  motivo: string            // '' nos tiros válidos; uma das strings da tabela abaixo
}
```

As duas funções **não alteram** as entradas: devolvem estruturas novas. Em
`repeticiao` e `erro`, o jogador não avança e a grade recebida é devolvida
sem alteração.

### 1.5 Contrato da partida (`src/partida.js`)

```js
module.exports = { criarPartida, posicionar, atirar, visao };
```

**`criarPartida()`** devolve o estado inicial; `null` em `tabuleiros` e
`tiros` significa que a frota ainda não foi posicionada:

```js
{ tabuleiros: [null, null], tiros: [null, null], vez: 0, vencedor: null }
```

**`posicionar(estado, jogador, frota)`** devolve
`{ valida, estado, motivo }`. Valida a frota com as mesmas regras de
`posicionarFrota`, grava o tabuleiro e inicializa a grade do jogador, sem
alterar a vez. Se a frota for inválida, o estado recebido é devolvido.

**`atirar(estado, alvo, jogador = estado.vez)`** devolve
`{ estado, resultado, afundado, vencedor, motivo }`. Mira sempre no
tabuleiro adversário e grava na grade do atirador. Acerto e afundamento
mantêm a vez; água alterna; vitória congela `vez` e preenche `vencedor`.
O 3º argumento, quando diverge de `estado.vez`, produz `erro`. Tiro após o
fim também produz `erro`. Em ambos, o estado recebido é devolvido.

**`visao(estado, jogador)`** devolve `{ tabuleiro }`: uma matriz 10x10 com
`'afundado'` apenas nas casas dos navios já afundados do adversário; todo o
resto é `null`. Acerto isolado e água não são revelados.

Erros seguem o contrato já adotado na camada pura: `resultado: 'erro'` +
`motivo` exato, sem campo adicional de tipo. Quando uma chamada é recusada,
o identificador recebido é **preservado** no retorno: `atirar` devolve o
`jogador` recebido mesmo que ele seja `2` (CT-46), e `posicionar` devolve o
estado com a `vez` original quando o jogador é inválido (CT-63). Isso não
contradiz o tipo `0 | 1` dos retornos válidos — a preservação vale apenas
para recusas.

### 1.6 Vocabulário de `motivo`

Todas as recusas usam uma destas strings exatas; os testes comparam por valor,
não apenas por "string não vazia":

| Situação | `motivo` |
|---|---|
| frota nula, não-array, tamanho/contagem/orientação/coordenada inválidos | `frota invalida` |
| grade de tiros nula, dimensão errada ou marca inválida | `grade de tiros invalida` |
| tabuleiro nulo, dimensão errada ou casa fora de `0..5` | `tabuleiro invalido` |
| alvo nulo, sem linha/coluna, decimal, `NaN` ou booleano | `alvo invalido` |
| jogador diferente de `0`/`1` | `jogador invalido` |
| tiro em casa já marcada | `tiro repetido` |
| tiro antes das duas frotas | `frotas nao posicionadas` |
| tiro fora da vez | `fora da vez` |
| tiro depois do fim | `partida encerrada` |

Nos retornos válidos, `motivo` é `''`.

## 2. Funcionamento dos casos de teste

Os casos estão no arquivo
[`casos_de_teste_batalha_naval.docx`](casos_de_teste_batalha_naval.docx),
no padrão do template oficial da disciplina (`Caso de Teste.docx`). Cada caso
contém:

- **Descrição** — o que se quer verificar;
- **Pré-condições** — estado necessário antes da execução;
- **Passos** — ações realizadas;
- **Cenário 1** com **Dados de Teste** (frota, ou tabuleiro + tiros + jogador +
  alvo) e **Resultado Esperado** (campos retornados e justificativa);
- **Pós-condições** — efeito após a execução.

Cada caso tem um teste equivalente em `test/`, com o mesmo ID (CT-01 a CT-64),
distribuído por camada em `posicionamento.test.js`, `tiros.test.js`,
`partida.test.js` e `visao.test.js`. O helper `support/helper.js` concentra
carregamento, cópia e asserções (inclusive `testEach`, equivalente local ao
`test.each` que este Node não expõe); CT-01 a CT-33 foram copiados literalmente
da suíte original. Assim fica atendida a exigência do enunciado: **casos de
teste em Javascript para testar Javascript**. O `.docx` é a especificação
legível; os `.js` são a versão executável dos mesmos casos.

### Casos incluídos

Nas linhas abaixo, `erro` e `repeticiao` significam também o `motivo` exato
da [seção 1.6](#16-vocabulário-de-motivo). Os IDs marcados como "erro" não
alteram o identificador recebido.

| ID | Objetivo | Retorno esperado |
|---|---|---|
| CT-01 | Frota válida toda na horizontal | `valida: true` + tabuleiro |
| CT-02 | Frota válida toda na vertical | `valida: true` + tabuleiro |
| CT-03 | Frota mista horizontal/vertical | `valida: true` + tabuleiro |
| CT-04 | Navios encostados (toque permitido) | `valida: true` |
| CT-05 | Navio ultrapassa a coluna 9 | `valida: false` |
| CT-06 | Navio ultrapassa a linha 9 | `valida: false` |
| CT-07 | Navios sobrepostos | `valida: false` |
| CT-08 | Navio de tamanho 6 | `valida: false` |
| CT-09 | Tamanho duplicado | `valida: false` |
| CT-10 | Frota incompleta (3 navios) | `valida: false` |
| CT-11 | Orientação inválida (`X`) | `valida: false` |
| CT-12 | Linha negativa | `valida: false` |
| CT-13 | Coluna 10 | `valida: false` |
| CT-14 | Frota vazia | `valida: false` |
| CT-15 | Navio sem campo obrigatório | `valida: false` |
| CT-16 | Frota recebida não é alterada | `valida: true` |
| CT-17 | Tiro na água | `agua`, jogador 1 |
| CT-18 | Tiro em casco, sem afundar | `acerto`, jogador 0 |
| CT-19 | Afundar navio de 2 | `afundado`, `afundado: 2`, jogador 0 |
| CT-20 | Afundar porta-aviões de 5 | `afundado`, `afundado: 5`, jogador 0 |
| CT-21 | Navio de 3 ainda não afunda na 2ª casa | `acerto`, jogador 0 |
| CT-22 | Tiro repetido em água | `repeticiao`, jogador inalterado |
| CT-23 | Alvo com linha 10 | `erro` |
| CT-24 | Alvo com coluna negativa | `erro` |
| CT-25 | Último casco atingido | `afundado`, `vencedor: 0` |
| CT-26 | Ainda resta casco | `acerto`, `vencedor: null`, jogador 0 |
| CT-27 | Alternância 0 → 1 → 0 em dois turnos | jogador 1, depois 0 |
| CT-28 | Tabuleiro e tiros não alterados | `acerto`, jogador 0 |
| CT-29 | Afundar encouraçado de 4 | `afundado`, `afundado: 4`, jogador 0 |
| CT-30 | Afundar submarino de 3 | `afundado`, `afundado: 3`, jogador 0 |
| CT-31 | Tiro em casa já afundada | `repeticiao` |
| CT-32 | Tabuleiro 9×10 | `erro` |
| CT-33 | Acerto mantém o turno; água alterna | `acerto` (jogador 0), depois `agua` (jogador 1) |
| CT-34 | Frota nula e não-array | `valida: false` (2 linhas via `test.each`) |
| CT-35 | Frota com cinco navios | `valida: false` |
| CT-36 | Linha decimal `1.5` | `valida: false` |
| CT-37 | Orientação minúscula `'h'` | `valida: false` |
| CT-38 | Grade de tiros 9×10 | `erro` |
| CT-39 | Grade com marca inválida | `erro` |
| CT-40 | Tabuleiro com casa 6 | `erro` |
| CT-41 | Alvo nulo/sem coluna/NaN/booleano | `erro` (4 linhas via `test.each`) |
| CT-42 | Jogador 1 acerta e afunda | jogador 1 mantém a vez (2 linhas) |
| CT-43 | Vitória do jogador 1 | `vencedor: 1` |
| CT-44 | Contato diagonal entre navios | `valida: true` |
| CT-45 | Grade de tiros nula | `erro` |
| CT-46 | Jogador inválido (`2`) | `erro` |
| CT-47 | Estado inicial | `[null, null]`, `vez: 0` |
| CT-48 | Posicionar jogador 0 | estado com `tabuleiros[0]` |
| CT-49 | Posicionar jogador 1 | estado com os dois tabuleiros |
| CT-50 | Frota inválida na partida | `valida: false`, estado intacto |
| CT-51 | Tiro antes das frotas | `erro`, estado intacto |
| CT-52 | Água alterna 0 → 1 | `vez: 1` |
| CT-53 | Água alterna 1 → 0 | `vez: 0` |
| CT-54 | Acerto mantém jogador 0 | `vez: 0` |
| CT-55 | Acerto mantém jogador 1 | `vez: 1` |
| CT-56 | Afundamento mantém a vez | 4 tamanhos, jogador 1 em duas linhas |
| CT-57 | Vitória do jogador 0 | `vencedor: 0`, vez congelada |
| CT-58 | Vitória do jogador 1 | `vencedor: 1`, vez congelada |
| CT-59 | Tiro fora da vez | `erro`, estado intacto |
| CT-60 | Tiro depois do fim | `erro`, estado intacto |
| CT-61 | Visão: só navios afundados | `(6,0)` e `(6,1)` = `afundado` |
| CT-62 | Sequência completa de 14 tiros | `vencedor: 0`, 14 cascos marcados |
| CT-63 | Jogador inválido em `posicionar` (2 e -1) | `valida: false`, estado intacto |
| CT-64 | Visão com partida sem frotas | grades 10x10 só com `null` |

### Cobertura das regras

| Regra da especificação | Casos que a cobrem |
|---|---|
| Dimensão 10×10 e coordenadas 0..9 | CT-01 a CT-04, CT-05, CT-06, CT-12, CT-13, CT-23, CT-24, CT-32 |
| Frota exata (5, 4, 3, 2) | CT-01 a CT-04, CT-08, CT-09, CT-10 |
| Orientação H/V | CT-01 a CT-04, CT-11 |
| Sem sobreposição; toque permitido | CT-04, CT-07 |
| Não mutação das entradas | todos os casos (helper `verifica`), CT-16 e CT-28 |
| Tiro em água e em casco | CT-17, CT-18, CT-21, CT-26 |
| Afundamento dos 4 tamanhos | CT-19, CT-20, CT-29, CT-30 |
| Tiro repetido | CT-22, CT-31 |
| Validação de entradas | CT-05, CT-06, CT-08 a CT-15, CT-23, CT-24, CT-32 |
| Alternância de turnos (2 jogadores) | CT-17 (água alterna), CT-18 a CT-21, CT-26, CT-28 a CT-30 (acerto mantém), CT-27 e CT-33 |
| Vitória e não vitória | CT-25, CT-26, CT-43, CT-57, CT-58, CT-60, CT-62 |
| Partida: estado e posicionamento | CT-47 a CT-51, CT-63 |
| Partida: turnos e afundamento | CT-52 a CT-56 |
| Partida: fim e tiro fora da vez | CT-57 a CT-60, CT-62 |
| Visão do adversário (só afundados) | CT-61 |
| Visão com estado sem frotas | CT-64 |
| Validação de alvo, grade e jogador | CT-23, CT-24, CT-32, CT-38 a CT-41, CT-45, CT-46 |
| Contato diagonal permitido | CT-44 |

### Isolamento das regras

- CT-01 a CT-04 usam frotas diferentes para exercitar as duas orientações e o
  contato entre navios, sem violar nenhuma regra.
- CT-05 a CT-15 alteram **uma** condição por vez da frota válida do CT-01
  (limite, sobreposição, tamanho, quantidade, orientação ou estrutura).
- CT-19, CT-20, CT-29 e CT-30 cobrem individualmente os quatro tamanhos de
  navio. CT-25 e CT-26 separam "último casco" de "ainda resta casco".
- CT-33 encadeia três tiros (acerto, acerto, água) para fixar a regra de
  turno sem depender de um único retorno. CT-42 repete a prova com o
  jogador 1, e CT-54 a CT-56 fazem o mesmo na camada de partida.
- CT-34 a CT-46 fecham buracos do contrato atual com uma condição alterada
  por vez; `test.each` agrupa apenas variações da mesma regra.
- CT-62 encadeia criação, posicionamento dos dois jogadores e 14 tiros: é o
  caso que prova que o jogo todo fecha de ponta a ponta.

### Casos executáveis em JavaScript

- **Runner:** `node --test` (nativo do Node.js 18+). Não há dependências para
  instalar.
- **Executar:** `npm test` na raiz do repositório.
- **Situação atual:** os 64 casos viram 73 testes (cinco tabelas com
   `testEach` têm mais de uma linha) e falham: `# tests 73`, `# pass 0`,
   `# fail 73`. Esse é o estado **RED** esperado: a implementação do jogo não
   faz parte deste entregável. As mensagens indicam `src/batalhaNaval.js` e
   `src/partida.js` e trazem o `stack` real de carregamento.
- **Dados JavaScript usados nos testes:** frotas com navios
  `{ tamanho, linha, coluna, orientacao }`, matrizes 10×10 de `0`/`2`/`3`/`4`/`5`
  e de `null`/`'agua'`/`'acerto'`/`'afundado'`, índices `0`/`1`, alvos
  `{ linha, coluna }` e entradas inválidas (fora do tabuleiro, tamanho 6,
  tamanho duplicado, frota vazia, orientação `X`, campos ausentes, matriz 9×10,
   frota nula, linha decimal, orientação minúscula, grade nula, alvo `NaN`,
   jogador `2` e estado de partida com `vez`, `vencedor` e duas grades.

### Grade de referência

Tabuleiro resultante da frota do CT-01 (todas as casas ocupadas por um navio
recebem o tamanho dele):

```
5 5 5 5 5 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
4 4 4 4 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
3 3 3 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
2 2 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
```

Essa mesma grade é usada nos casos de tiro CT-17 a CT-46 e nas duas frotas da
partida (CT-47 a CT-62), sempre com grades de
tiros parcialmente preenchidas para isolar afundamento e vitória.

## 3. Estrutura do repositório

```
desafio_teste_batalha_naval/
├── README.md
├── package.json
├── casos_de_teste_batalha_naval.docx
├── support/
│   └── helper.js
└── test/
    ├── posicionamento.test.js
    ├── tiros.test.js
    ├── partida.test.js
    └── visao.test.js
```

Não há implementação do jogo neste repositório: o entregável é a especificação
dos casos (`.docx`) e sua versão executável em JavaScript (`test/`). Abra o
`.docx` com Microsoft Word ou LibreOffice Writer e rode `npm test` para executar
os 64 casos.

## 4. Colaboradores

- Gabriel de Oliveira Gnoatto — RA 23298801-2
