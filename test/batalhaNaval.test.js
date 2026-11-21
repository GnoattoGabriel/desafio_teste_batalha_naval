'use strict';

// Casos de teste executaveis correspondentes a casos_de_teste_batalha_naval.docx.
// A implementacao de src/batalhaNaval.js deve ser produzida a partir da
// especificacao em .docx. Enquanto ela nao existe, os testes falham com
// mensagem clara (estado RED esperado do desafio).

const test = require('node:test');
const assert = require('node:assert/strict');

let batalhaNaval;
try {
  batalhaNaval = require('../src/batalhaNaval');
} catch (erro) {
  const detalhe = (erro && (erro.stack || erro.message)) || String(erro);
  batalhaNaval = {};
  var erroCarregamento = detalhe;
}
const posicionarFrota = batalhaNaval.posicionarFrota || (() => {
  throw new Error('Crie src/batalhaNaval.js exportando posicionarFrota. ' +
    (typeof erroCarregamento === 'undefined' ? '' : erroCarregamento));
});
const atirar = batalhaNaval.atirar || (() => {
  throw new Error('Crie src/batalhaNaval.js exportando atirar. ' +
    (typeof erroCarregamento === 'undefined' ? '' : erroCarregamento));
});

// Copia generica: preserva todas as entradas, inclusive null e arrays 10x10.
const clonar = (v) => {
  if (Array.isArray(v)) return v.map(clonar);
  if (v && typeof v === 'object') {
    const out = {};
    for (const chave of Object.keys(v)) out[chave] = clonar(v[chave]);
    return out;
  }
  return v;
};

const verifica = (id, descricao, entradas, chamada, esperado) => {
  test(`${id} — ${descricao}`, () => {
    const copias = entradas.map(clonar);
    const saida = chamada(...copias);
    for (const [campo, valor] of Object.entries(esperado)) {
      if (campo === 'motivo' && (esperado.valida === false ||
                                 ['erro', 'repeticiao'].includes(esperado.resultado))) {
        assert.equal(typeof saida.motivo, 'string', `${id}: motivo deve ser string`);
        assert.ok(saida.motivo.length > 0, `${id}: motivo nao pode ser vazio`);
      } else {
        assert.deepEqual(saida[campo], valor, `${id}: campo ${campo}`);
      }
    }
    entradas.forEach((original, i) =>
      assert.deepEqual(original, copias[i], `${id}: entrada ${i} nao pode ser alterada`));
  });
};

verifica('CT-01', 'posicionar a frota inteira na horizontal', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: true,
  tabuleiro: [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  motivo: ''
});

verifica('CT-02', 'posicionar a frota inteira na vertical', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'V'
    },
    {
      tamanho: 4,
      linha: 0,
      coluna: 2,
      orientacao: 'V'
    },
    {
      tamanho: 3,
      linha: 0,
      coluna: 4,
      orientacao: 'V'
    },
    {
      tamanho: 2,
      linha: 0,
      coluna: 6,
      orientacao: 'V'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: true,
  tabuleiro: [
    [5, 0, 4, 0, 3, 0, 2, 0, 0, 0],
    [5, 0, 4, 0, 3, 0, 2, 0, 0, 0],
    [5, 0, 4, 0, 3, 0, 0, 0, 0, 0],
    [5, 0, 4, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  motivo: ''
});

verifica('CT-03', 'posicionar frota mista (horizontal e vertical)', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 0,
      coluna: 5,
      orientacao: 'V'
    },
    {
      tamanho: 3,
      linha: 5,
      coluna: 2,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 7,
      coluna: 9,
      orientacao: 'V'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: true,
  tabuleiro: [
    [5, 5, 5, 5, 5, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 3, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  motivo: ''
});

verifica('CT-04', 'aceitar navios encostados', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 1,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 3,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: true,
  tabuleiro: [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  motivo: ''
});

verifica('CT-05', 'rejeitar navio que ultrapassa a coluna 9', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 6,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-06', 'rejeitar navio que ultrapassa a linha 9', [
  [
    {
      tamanho: 5,
      linha: 6,
      coluna: 0,
      orientacao: 'V'
    },
    {
      tamanho: 4,
      linha: 0,
      coluna: 2,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 0,
      coluna: 4,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 0,
      coluna: 6,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-07', 'rejeitar navios sobrepostos', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 0,
      coluna: 3,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-08', 'rejeitar navio de tamanho 6', [
  [
    {
      tamanho: 6,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-09', 'rejeitar tamanho duplicado', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 5,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-10', 'rejeitar frota incompleta', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-11', 'rejeitar orientacao inválida', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'X'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-12', 'rejeitar linha negativa', [
  [
    {
      tamanho: 5,
      linha: -1,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-13', 'rejeitar coluna 10', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 10,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-14', 'rejeitar frota vazia', [
  []
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-15', 'rejeitar navio sem campo obrigatorio', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null
});

verifica('CT-16', 'nao alterar a frota recebida', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 4,
      linha: 2,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 4,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 6,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: true,
  tabuleiro: [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  motivo: ''
});

verifica('CT-17', 'tiro na água', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 9,
    coluna: 9
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'agua'
    ]
  ],
  resultado: 'agua',
  afundado: null,
  vencedor: null,
  jogador: 1,
  motivo: ''
});

verifica('CT-18', 'tiro em casco sem afundar', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 0,
    coluna: 0
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'acerto',
  afundado: null,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-19', 'afundar o navio de 2', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 6,
    coluna: 1
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'afundado',
  afundado: 2,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-20', 'afundar o porta-aviões de 5', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 0,
    coluna: 4
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'afundado',
  afundado: 5,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-21', 'navio de 3 ainda nao afunda na segunda casa', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 4,
    coluna: 1
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'acerto',
  afundado: null,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-22', 'rejeitar tiro repetido em casa de água', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'agua'
    ]
  ],
  0,
  {
    linha: 9,
    coluna: 9
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'agua'
    ]
  ],
  resultado: 'repeticiao',
  afundado: null,
  vencedor: null,
  jogador: 0
});

verifica('CT-23', 'rejeitar alvo com linha 10', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 10,
    coluna: 0
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'erro',
  afundado: null,
  vencedor: null,
  jogador: 0
});

verifica('CT-24', 'rejeitar alvo com coluna negativa', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 0,
    coluna: -1
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'erro',
  afundado: null,
  vencedor: null,
  jogador: 0
});

verifica('CT-25', 'vencer ao atingir o ultimo casco', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 6,
    coluna: 1
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'afundado',
  afundado: 2,
  vencedor: 0,
  jogador: 0,
  motivo: ''
});

verifica('CT-26', 'nao declarar vitoria antes do ultimo casco', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 6,
    coluna: 0
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'acerto',
  afundado: null,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-28', 'nao alterar tabuleiro nem grade de tiros', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 0,
    coluna: 0
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'acerto',
  afundado: null,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-29', 'afundar o encouracado de 4', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 2,
    coluna: 3
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'afundado',
  afundado: 4,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-30', 'afundar o submarino de 3', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 4,
    coluna: 2
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'afundado',
  afundado: 3,
  vencedor: null,
  jogador: 0,
  motivo: ''
});

verifica('CT-31', 'rejeitar tiro em casa já afundada', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 6,
    coluna: 1
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      'acerto',
      'afundado',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'repeticiao',
  afundado: null,
  vencedor: null,
  jogador: 0
});

verifica('CT-32', 'rejeitar tabuleiro com dimensao errada', [
  [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  0,
  {
    linha: 0,
    coluna: 0
  }
], (tabuleiro, tiros, jogador, alvo) => atirar(tabuleiro, tiros, jogador, alvo), {
  tiros: [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  ],
  resultado: 'erro',
  afundado: null,
  vencedor: null,
  jogador: 0
});

test('CT-27 — o ciclo de dois turnos alterna entre jogador 0 e 1', () => {
  const tabuleiro = [
  [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
  const vazio = () => Array.from({ length: 10 }, () => Array(10).fill(null));
  const tiros1 = vazio();
  const tiros2 = vazio();
  const copiaTabuleiro = clonar(tabuleiro);
  const copiaTiros = clonar(tiros1);
  const r1 = atirar(tabuleiro, tiros1, 0, { linha: 9, coluna: 9 });
  assert.equal(r1.resultado, 'agua', 'CT-27: primeiro tiro');
  assert.equal(r1.jogador, 1, 'CT-27: apos o jogador 0, a vez e do 1');
  const r2 = atirar(tabuleiro, tiros2, r1.jogador, { linha: 8, coluna: 8 });
  assert.equal(r2.resultado, 'agua', 'CT-27: segundo tiro');
  assert.equal(r2.jogador, 0, 'CT-27: apos o jogador 1, a vez volta ao 0');
  assert.deepEqual(tabuleiro, copiaTabuleiro, 'CT-27: tabuleiro nao pode ser alterado');
  assert.deepEqual(tiros1, copiaTiros, 'CT-27: tiros nao podem ser alterados');
});

// CT-33 — regra de turno: acerto mantem a vez, apenas agua alterna.
test('CT-33 — tiro acertado nao altera o turno', () => {
  const tabuleiro = [
  [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
  const vazio = () => Array.from({ length: 10 }, () => Array(10).fill(null));
  const copiaTabuleiro = clonar(tabuleiro);
  const r1 = atirar(tabuleiro, vazio(), 0, { linha: 0, coluna: 0 });
  assert.equal(r1.resultado, 'acerto', 'CT-33: primeiro tiro acerta casco');
  assert.equal(r1.jogador, 0, 'CT-33: apos acerto, o jogador 0 continua');
  const r2 = atirar(tabuleiro, r1.tiros, 0, { linha: 0, coluna: 1 });
  assert.equal(r2.resultado, 'acerto', 'CT-33: segundo tiro acerta casco');
  assert.equal(r2.jogador, 0, 'CT-33: apos outro acerto, o jogador 0 continua');
  const r3 = atirar(tabuleiro, r2.tiros, 0, { linha: 9, coluna: 9 });
  assert.equal(r3.resultado, 'agua', 'CT-33: terceiro tiro cai na agua');
  assert.equal(r3.jogador, 1, 'CT-33: somente a agua passa a vez');
  assert.deepEqual(tabuleiro, copiaTabuleiro, 'CT-33: tabuleiro nao pode ser alterado');
});
