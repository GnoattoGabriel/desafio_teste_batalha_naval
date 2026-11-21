'use strict';

// Casos de posicionamento: CT-01..16 e CT-34..37, CT-44.
// CT-01..33 foram copiados literalmente da suíte original.
const { assert, test, testEach, clonar, verifica, posicionarFrota } = require('../support/helper');

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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
});

verifica('CT-14', 'rejeitar frota vazia', [
  []
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null,
  motivo: 'frota invalida'
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
  tabuleiro: null,
  motivo: 'frota invalida'
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

testEach([
  [
    'frota nula',
    null
  ],
  [
    'frota nao-array',
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], 'CT-34 — frota invalida: %s', (rotulo, frota) => {
  const copia = clonar(frota);
  const saida = posicionarFrota(copia);
  assert.equal(saida.valida, false, `${rotulo}: valida`);
  assert.equal(saida.tabuleiro, null, `${rotulo}: tabuleiro`);
  assert.equal(saida.motivo, 'frota invalida',
    `${rotulo}: motivo deve ser 'frota invalida'`);
  assert.deepEqual(frota, copia, `${rotulo}: entrada nao alterada`);
});

verifica('CT-35', 'rejeitar frota com cinco navios', [
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
    },
    {
      tamanho: 2,
      linha: 8,
      coluna: 0,
      orientacao: 'H'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: false,
  tabuleiro: null,
  motivo: 'frota invalida'
});

verifica('CT-36', 'rejeitar linha decimal', [
  [
    {
      tamanho: 5,
      linha: 1.5,
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
  tabuleiro: null,
  motivo: 'frota invalida'
});

verifica('CT-37', 'rejeitar orientacao minuscula', [
  [
    {
      tamanho: 5,
      linha: 0,
      coluna: 0,
      orientacao: 'h'
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
  tabuleiro: null,
  motivo: 'frota invalida'
});

verifica('CT-44', 'aceitar contato diagonal entre navios', [
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
      coluna: 5,
      orientacao: 'H'
    },
    {
      tamanho: 3,
      linha: 3,
      coluna: 0,
      orientacao: 'H'
    },
    {
      tamanho: 2,
      linha: 5,
      coluna: 9,
      orientacao: 'V'
    }
  ]
], (frota) => posicionarFrota(frota), {
  valida: true,
  tabuleiro: [
    [5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 4, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  motivo: ''
});
