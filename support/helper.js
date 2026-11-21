'use strict';

// Helper compartilhado: nao e implementacao do jogo. Concentra o carregamento
// dos modulos esperados, a copia das entradas e as assercoes de cada caso.
const test = require('node:test');
const assert = require('node:assert/strict');

const carregar = (modulo, funcoes) => {
  let carregado;
  try {
    carregado = require(modulo);
  } catch (erro) {
    const detalhe = (erro && (erro.stack || erro.message)) || String(erro);
    const falso = {};
    for (const nome of funcoes) {
      falso[nome] = () => {
        throw new Error('Crie ' + modulo + ' exportando ' + nome + '. ' + detalhe);
      };
    }
    return falso;
  }
  for (const nome of funcoes) {
    if (typeof carregado[nome] !== 'function') {
      const anterior = carregado[nome];
      carregado[nome] = () => {
        throw new Error('Crie ' + modulo + ' exportando ' + nome +
          '. (exportado: ' + String(anterior) + ')');
      };
    }
  }
  return carregado;
};

const batalhaNaval = carregar('../src/batalhaNaval', ['posicionarFrota', 'atirar']);
const partida = carregar('../src/partida', ['criarPartida', 'posicionar', 'atirar', 'visao']);

// Copia generica: preserva null, NaN e matrizes 10x10.
const vazio = () => Array.from({ length: 10 }, () => Array(10).fill(null));

const clonar = (v) => {
  if (Array.isArray(v)) return v.map(clonar);
  if (v && typeof v === 'object') {
    const out = {};
    for (const chave of Object.keys(v)) out[chave] = clonar(v[chave]);
    return out;
  }
  return v;
};

// Equivalente local a test.each: este Node nao expoe test.each nativamente.
// Cada linha vira um teste com o mesmo ID, mantendo 1 caso por ID no .docx.
const testEach = (linhas, titulo, fn) => {
  for (const linha of linhas) {
    let nome = titulo;
    for (const valor of linha) nome = nome.replace('%s', String(valor));
    test(nome, () => fn(...linha));
  }
};

const verifica = (id, descricao, entradas, chamada, esperado) => {
  test(`${id} — ${descricao}`, () => {
    const copias = entradas.map(clonar);
    const saida = chamada(...copias);
    if (Object.prototype.hasOwnProperty.call(esperado, '__retorno')) {
      assert.deepEqual(saida, esperado.__retorno, `${id}: retorno completo`);
    }
    for (const [campo, valor] of Object.entries(esperado)) {
      if (campo === '__retorno') continue;
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

module.exports = { assert, test, testEach, clonar, vazio, verifica, partida,
  posicionarFrota: batalhaNaval.posicionarFrota,
  atirar: batalhaNaval.atirar };
