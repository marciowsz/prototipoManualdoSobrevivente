const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function fakeStorage() {
  const m = {};
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; },
  };
}

function carregar(storage) {
  const ctx = { window: {}, localStorage: storage || fakeStorage(), console };
  vm.createContext(ctx);
  for (const f of ['js/data.js', 'js/logic.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window.CEUMA;
}

// objetos criados no contexto vm têm protótipos de outro realm: comparar via cópia simples
const plain = (x) => JSON.parse(JSON.stringify(x));

const C = carregar();

test('normalizar', () => {
  assert.strictEqual(C.normalizar('  MATRÍCULA  '), 'matricula');
  assert.strictEqual(C.normalizar('Passando   mal'), 'passando mal');
  assert.strictEqual(C.normalizar(null), '');
});

test('buscar: casos do contrato', () => {
  assert.ok(['portal', 'caa'].includes(C.buscar('boleto')[0].setorId));
  assert.ok(C.buscar('matricula').some((r) => r.setorId === 'matricula'));
  assert.ok(C.buscar('MATRÍCULA').some((r) => r.setorId === 'matricula'));
  assert.deepStrictEqual(plain(C.buscar('matricula')), plain(C.buscar('MATRÍCULA')));
  assert.strictEqual(C.buscar('facial')[0].setorId, 'apoio');
  assert.ok(C.buscar('perdi meu celular').some((r) => ['achados', 'seguranca'].includes(r.setorId)));
  assert.deepStrictEqual(plain(C.buscar('')), []);
  assert.deepStrictEqual(plain(C.buscar('   ')), []);
  assert.deepStrictEqual(plain(C.buscar('xyzqwe')), []);
});

test('buscar: sinonimos, ordem e limite', () => {
  const alvo = {
    'histórico': 'portal', 'declaração': 'portal', 'imposto': 'portal',
    'crachá': 'matricula', 'prouni': 'matricula', 'fies': 'matricula',
    'prova': 'caa', 'catraca': 'apoio', 'entrar': 'apoio',
    'emergência': 'pronto', 'passando mal': 'pronto', 'ansiedade': 'pronto',
    'carteira': 'achados',
  };
  for (const [q, setorId] of Object.entries(alvo)) {
    const r = C.buscar(q);
    assert.ok(r.some((x) => x.setorId === setorId), `"${q}" deveria achar ${setorId}`);
  }
  const r = C.buscar('boleto mensalidade pagar');
  assert.ok(r.length <= 12);
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].score >= r[i].score);
  for (const x of r) {
    assert.ok(['servico', 'setor', 'glossario'].includes(x.tipo));
    assert.ok(x.id && x.titulo && typeof x.score === 'number');
  }
});

test('quintoDiaUtil', () => {
  assert.strictEqual(C.quintoDiaUtil(2026, 4).iso, '2026-04-08');
  assert.strictEqual(C.quintoDiaUtil(2026, 11).iso, '2026-11-09');
  assert.strictEqual(C.quintoDiaUtil(2026, 2).iso, '2026-02-06');
  const abr = C.quintoDiaUtil(2026, 4);
  assert.ok(abr.ignorados.some((i) => i.iso === '2026-04-03'));
  assert.ok(Object.prototype.toString.call(abr.data) === '[object Date]' && abr.data.getDate() === 8);
  assert.ok(C.quintoDiaUtil(2026, 11).ignorados.some((i) => i.iso === '2026-11-02'));
});

test('feriados', () => {
  const f = C.feriados(2026);
  for (const d of ['2026-04-03', '2026-02-16', '2026-02-17', '2026-06-04', '2026-04-21', '2026-12-25']) {
    assert.ok(f.includes(d), d);
  }
});

test('statusSetor', () => {
  const caa = C.getSetor('caa');
  const quarta10h = new Date(2026, 10, 18, 10, 0);
  const s = C.statusSetor(caa, quarta10h);
  assert.strictEqual(s.aberto, true);
  assert.match(s.texto, /Aberto agora · fecha às 17h/);
  const dom = C.statusSetor(caa, new Date(2026, 10, 22, 10, 0));
  assert.strictEqual(dom.aberto, false);
  assert.match(dom.texto, /abre seg às 8h/);
  const sab = C.statusSetor(caa, new Date(2026, 10, 21, 10, 0));
  assert.strictEqual(sab.aberto, false);
  assert.strictEqual(C.statusSetor(caa, new Date(2026, 10, 18, 7, 0)).texto, 'Fechado · abre às 8h');
  assert.match(C.statusSetor(caa, new Date(2026, 10, 18, 18, 0)).texto, /abre qui às 8h/);

  const achados = C.getSetor('achados');
  const meioDia = C.statusSetor(achados, new Date(2026, 10, 18, 12, 30));
  assert.strictEqual(meioDia.aberto, false);
  assert.ok(meioDia.texto.includes('13h'));
  assert.strictEqual(C.statusSetor(achados, new Date(2026, 10, 18, 14, 0)).aberto, true);
  assert.match(C.statusSetor(achados, new Date(2026, 10, 18, 14, 0)).texto, /21h30/);

  const bib = C.getSetor('biblioteca');
  assert.strictEqual(C.statusSetor(bib, new Date(2026, 10, 21, 9, 0)).aberto, true);
  assert.strictEqual(C.statusSetor(bib, new Date(2026, 10, 21, 13, 0)).aberto, false);

  const mat = C.getSetor('matricula');
  assert.strictEqual(C.statusSetor(mat, new Date(2026, 10, 10, 10, 0)).aberto, true);
  const m15 = C.statusSetor(mat, new Date(2026, 10, 18, 10, 0));
  assert.strictEqual(m15.aberto, false);
  assert.match(m15.texto, /a partir do dia 15/);

  assert.deepStrictEqual(plain(C.statusSetor(C.getSetor('portal'), dom0())), { aberto: true, texto: 'Online 24h' });
  assert.deepStrictEqual(plain(C.statusSetor(C.getSetor('pronto'), quarta10h)), { aberto: null, texto: 'Horário a confirmar' });
});
function dom0() { return new Date(2026, 10, 22, 3, 0); }

test('statusSetor: feriados', () => {
  const caa = C.getSetor('caa');
  const f = C.statusSetor(caa, new Date(2026, 10, 20, 10, 0));
  assert.strictEqual(f.aberto, false);
  assert.match(f.texto, /feriado/i);
  assert.strictEqual(C.statusSetor(caa, new Date(2026, 3, 3, 10, 0)).aberto, false); // Sexta-feira Santa
  assert.strictEqual(C.statusSetor(C.getSetor('portal'), new Date(2026, 10, 20, 10, 0)).aberto, true);
  // o próximo dia aberto pula o feriado e o fim de semana
  assert.match(C.statusSetor(caa, new Date(2026, 10, 19, 18, 0)).texto, /abre seg às 8h/);
  // segunda 02/11 é feriado
  assert.match(C.statusSetor(caa, new Date(2026, 9, 30, 18, 0)).texto, /abre ter às 8h/);
});

test('statusSetor: Central de Matrícula depois do dia 15', () => {
  const mat = C.getSetor('matricula');
  const sab = C.statusSetor(mat, new Date(2026, 10, 14, 21, 0));
  assert.strictEqual(sab.aberto, false);
  assert.doesNotMatch(sab.texto, /abre seg/);
  assert.match(sab.texto, /01\/12/);
  const seg = C.statusSetor(mat, new Date(2026, 10, 16, 10, 0));
  assert.strictEqual(seg.aberto, false);
  assert.match(seg.texto, /a partir do dia 15/);
  assert.match(seg.texto, /1º/);
  assert.strictEqual(C.statusSetor(mat, new Date(2026, 11, 1, 10, 0)).aberto, true);
});

test('statusSetor: setor sem horário confirmado fica "a confirmar", nunca "fechado"', () => {
  for (const id of ['pronto', 'seguranca', 'coordenacao', 'nadd', 'estagio']) {
    const s = C.statusSetor(C.getSetor(id), new Date(2026, 10, 18, 10, 0));
    assert.strictEqual(s.aberto, null, id);
    assert.match(s.texto, /confirmar/);
  }
  assert.strictEqual(C.statusSetor(null, new Date()).aberto, null);
});

test('buscar: ranking e encaminhamentos corrigidos', () => {
  const r = C.buscar('onde fica a biblioteca')[0];
  assert.strictEqual(r.tipo, 'setor');
  assert.strictEqual(r.id, 'biblioteca');
  assert.strictEqual(C.buscar('achados e perdidos')[0].id, 'achados');
  assert.ok(C.buscar('wifi').some((x) => x.setorId === 'biblioteca'));
  assert.strictEqual(C.buscar('imposto de renda')[0].id, 'informe-ir');
  assert.ok(!C.buscar('ava').some((x) => x.id === 'prova'));
  assert.strictEqual(C.buscar('senha do portal')[0].setorId, 'matricula');
  assert.strictEqual(C.buscar('esqueci minha senha')[0].setorId, 'matricula');
  assert.strictEqual(C.buscar('prouni renovacao')[0].setorId, 'caa');
  assert.strictEqual(C.buscar('baixa parcial')[0].setorId, 'caa');
});

test('encaminhamentos dos dados', () => {
  const serv = (id) => C.servicos.find((s) => s.id === id);
  assert.strictEqual(serv('cobrafix').setorId, null);
  assert.ok(!C.glossario.find((g) => g.termo === 'Cobrafix').setorId);
  assert.strictEqual(serv('senha-portal').setorId, 'matricula');
  assert.strictEqual(serv('prouni-renovacao').setorId, 'caa');
  assert.ok(!C.getSetor('caa').naoResolve.some((n) => /^ProUni|^FIES/.test(n.oque)));
  assert.ok(C.getSetor('caa').resolve.some((t) => /ProUni/.test(t)));
  assert.ok(!C.getSetor('caa').palavras.includes('senha'));
  assert.ok(C.getSetor('biblioteca').aConfirmar.some((t) => /segunda a sexta/.test(t)));
  assert.ok(!C.mapa.rotas.portal);
});

test('getSetor', () => {
  assert.strictEqual(C.getSetor('nao-existe'), null);
  assert.strictEqual(C.getSetor('caa').apelido, 'CAA');
});

test('checklist com localStorage normal', () => {
  const c = carregar();
  assert.deepStrictEqual(plain(c.checklistEstado()), {});
  const id = c.checklist[0].id;
  c.marcarChecklist(id, true);
  assert.strictEqual(c.checklistEstado()[id], true);
  const p = c.progressoChecklist();
  assert.strictEqual(p.feitos, 1);
  assert.strictEqual(p.total, c.checklist.length);
  assert.strictEqual(p.pct, Math.round(100 / c.checklist.length));
  c.marcarChecklist(id, false);
  assert.strictEqual(c.progressoChecklist().feitos, 0);
});

test('checklist com localStorage que lança erro', () => {
  const ruim = {
    getItem() { throw new Error('bloqueado'); },
    setItem() { throw new Error('bloqueado'); },
  };
  const c = carregar(ruim);
  assert.doesNotThrow(() => c.marcarChecklist('ra', true));
  assert.doesNotThrow(() => c.checklistEstado());
  assert.doesNotThrow(() => c.progressoChecklist());
  assert.strictEqual(typeof c.progressoChecklist().pct, 'number');
});

test('checklist com JSON corrompido', () => {
  const st = fakeStorage();
  st.setItem('ceuma.checklist', '{nao e json');
  const c = carregar(st);
  assert.deepStrictEqual(plain(c.checklistEstado()), {});
});

test('integridade dos dados', () => {
  const ids = new Set(C.setores.map((s) => s.id));
  for (const id of ['caa', 'matricula', 'apoio', 'coordenacao', 'nadd', 'biblioteca', 'achados', 'seguranca', 'pronto', 'estagio', 'portal']) {
    assert.ok(ids.has(id), id);
  }
  assert.ok(C.servicos.length >= 25);
  assert.ok(C.mitos.length >= 8);
  assert.ok(C.glossario.length >= 20);
  assert.ok(C.checklist.length >= 9);
  for (const s of C.servicos) {
    if (s.setorId !== null) assert.ok(ids.has(s.setorId), `servico ${s.id}`);
    assert.ok(Array.isArray(s.palavras) && s.palavras.length > 0);
    assert.ok(Array.isArray(s.comoFazer) && s.comoFazer.length > 0);
  }
  assert.strictEqual(new Set(C.servicos.map((s) => s.id)).size, C.servicos.length);
  for (const s of C.setores) {
    for (const n of s.naoResolve) if (n.setorId) assert.ok(ids.has(n.setorId), `naoResolve ${s.id}`);
    assert.ok(Array.isArray(s.aConfirmar));
    assert.ok(Array.isArray(s.horarios));
  }
  for (const c of C.checklist) if (c.setorId) assert.ok(ids.has(c.setorId), `checklist ${c.id}`);
  const pontos = new Set(C.mapa.pontos.map((p) => p.id));
  for (const s of C.setores) assert.ok(pontos.has(s.local.pontoMapa), `pontoMapa ${s.id}`);
  for (const id of ids) {
    if (id === 'portal') continue; // digital: sem rota física
    const r = C.mapa.rotas[id];
    assert.ok(r, `rota ${id}`);
    assert.strictEqual(r.de, 'entrada');
    assert.ok(r.passos.length >= 2, `passos ${id}`);
    assert.ok(r.caminho.length >= 2);
    for (const [x, y] of r.caminho) assert.ok(x >= 0 && x <= 1000 && y >= 0 && y <= 700, `caminho ${id}`);
  }
  for (const p of C.mapa.pontos) assert.ok(p.x >= 0 && p.x <= 1000 && p.y >= 0 && p.y <= 700);
  assert.ok(pontos.has('entrada'));
  assert.strictEqual(C.mapa.largura, 1000);
  assert.strictEqual(C.mapa.altura, 700);
  assert.strictEqual(C.getSetor('matricula').fechaPresencialAPartirDoDia, 15);
  assert.deepStrictEqual(plain(C.feriadosFixos), ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '11-20', '12-25']);
});
