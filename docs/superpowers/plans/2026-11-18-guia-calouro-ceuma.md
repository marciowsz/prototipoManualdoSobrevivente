# Guia do Calouro CEUMA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Web app estático, mobile-first, que orienta o calouro do CEUMA Renascença: onde fica, qual setor resolve, o que levar, regras e mitos.

**Architecture:** SPA sem build. `js/data.js` (dados) + `js/logic.js` (funções puras) expõem `window.CEUMA`; `js/app.js` renderiza telas por hash route usando só essa API. Lógica também exportável via `module.exports` para testes em Node.

**Tech Stack:** HTML5, CSS3, JavaScript ES2020 puro. Testes: `node --test tests/`.

**Spec:** `docs/superpowers/specs/2026-11-18-guia-calouro-ceuma-design.md`. Fontes: `docs/fontes/*.txt`.

## Global Constraints
- Idioma: português do Brasil, tom acolhedor e direto ("você").
- Zero dependências externas e zero build; deve abrir com duplo clique em `index.html` (file://) — portanto **sem `fetch` de JSON e sem ES modules**; scripts clássicos na ordem `data.js`, `logic.js`, `app.js`.
- Todo dado sem confirmação nas fontes leva `aConfirmar: true` (ou texto com nota) e a UI mostra o selo "a confirmar".
- Nunca inventar telefone, e-mail, link ou valor que não esteja nas fontes.
- Largura mínima 320px sem scroll horizontal; alvos de toque ≥ 44px.

## Review Focus
1. Busca com acento/maiúscula/sem acento ("matricula", "MATRÍCULA") deve achar o mesmo resultado.
2. Busca sem resultado deve oferecer caminho (Apoio ao Aluno / ver todos os setores), nunca tela vazia.
3. 5º dia útil quando dia 1 cai em fim de semana ou há feriado nacional (ex.: abril/2026 com Sexta-feira Santa 03/04 e Tiradentes 21/04).
4. Status "aberto agora" em sábado, domingo e fora do horário; setores com dois turnos (Achados e Perdidos 07–12 e 13–21:30).
5. localStorage indisponível (modo privado) não pode quebrar o checklist.

---

## Contrato `window.CEUMA` (fonte única de nomes)

### Dados (`js/data.js`)
```js
CEUMA.setores = [{
  id: 'caa',                      // ids: caa, matricula, apoio, coordenacao, nadd, biblioteca, achados, seguranca, pronto, estagio, portal
  nome: 'Central de Atendimento ao Aluno (CAA)',
  apelido: 'CAA',
  categoria: 'atendimento'|'academico'|'apoio'|'seguranca'|'digital',
  icone: '🏛️',                    // emoji
  resumo: 'string curta',
  local: { descricao: 'string', referencia: 'string', pontoMapa: 'pracaGratidao' },  // pontoMapa = id em CEUMA.mapa.pontos
  horarios: [{ dias: [1,2,3,4,5], inicio: '08:00', fim: '17:00' }],  // 0=domingo
  horarioTexto: 'Seg a sex, 8h às 17h; sábados específicos 8h às 13h com agendamento',
  requisitos: ['RA'],             // strings
  resolve: ['...'], naoResolve: [{ oque: 'Matrícula/rematrícula', setorId: 'matricula' }],
  contatos: [{ tipo: 'telefone'|'whatsapp'|'email'|'link'|'presencial', valor: 'string', href: 'string|null' }],
  dicas: ['...'],
  aConfirmar: ['texto do que falta confirmar']   // [] se nada
}]
CEUMA.servicos = [{ id, titulo: 'Pagar/emitir boleto', palavras: ['boleto','mensalidade','pagar'], setorId: 'portal',
  online: true|false, comoFazer: ['passo 1', ...], levar: ['RA'], alerta: 'string|null' }]   // >= 25 serviços
CEUMA.mitos = [{ id, mito: 'string', verdade: 'string', fonte: 'string' }]   // >= 6
CEUMA.glossario = [{ termo, definicao }]                                       // >= 12
CEUMA.checklist = [{ id, titulo, detalhe, setorId|null, semana: 1 }]          // >= 8
CEUMA.mapa = { largura: 1000, altura: 700,
  pontos: [{ id, nome, x, y, tipo: 'referencia'|'setor'|'entrada' }],
  areas:  [{ id, nome, x, y, w, h }],
  rotas:  { [setorId]: { de: 'entrada', passos: ['Entre pela ...', ...], caminho: [[x,y],...] } } }
CEUMA.feriadosFixos = ['01-01','04-21','05-01','09-07','10-12','11-02','11-15','11-20','12-25']
```

### Lógica (`js/logic.js`)
```js
CEUMA.normalizar(texto: string): string              // minúsculas, sem acento, trim, espaços colapsados
CEUMA.buscar(query: string): Array<{ tipo: 'servico'|'setor'|'glossario', id: string, titulo: string, setorId: string|null, score: number }>
                                                     // ordenado por score desc; query vazia → []; max 12
CEUMA.getSetor(id: string): Setor|null
CEUMA.statusSetor(setor: Setor, agora: Date): { aberto: boolean, texto: string }
       // texto ex.: 'Aberto agora · fecha às 17h', 'Fechado · abre seg às 8h', 'Fechado · abre às 13h'
CEUMA.feriados(ano: number): string[]                // 'YYYY-MM-DD' — fixos + Carnaval(seg/ter), Sexta Santa, Corpus Christi (via Páscoa)
CEUMA.quintoDiaUtil(ano: number, mes1a12: number): { data: Date, iso: string, ignorados: Array<{iso, motivo}> }
CEUMA.checklistEstado(): { [id]: boolean }           // lê localStorage 'ceuma.checklist'; erro → {}
CEUMA.marcarChecklist(id: string, feito: boolean): { [id]: boolean }   // persiste com try/catch
CEUMA.progressoChecklist(): { feitos: number, total: number, pct: number }
```

---

### Task 1 (LÓGICA): dados + lógica + testes

**Files:** Create `js/data.js`, `js/logic.js`, `tests/logic.test.js`.

- [ ] Escrever `tests/logic.test.js` (node:test + assert) carregando data.js e logic.js via `vm` num contexto com `window = {}` e localStorage falso. Asserções:
  - `normalizar('  MATRÍCULA  ') === 'matricula'`
  - `buscar('boleto')[0].setorId` ∈ {'portal','caa'}; `buscar('matricula')` contém setorId 'matricula'; `buscar('facial')[0].setorId === 'apoio'`; `buscar('perdi meu celular')` contém setorId 'achados' ou 'seguranca'; `buscar('')` → `[]`; `buscar('xyzqwe')` → `[]`
  - `quintoDiaUtil(2026,4).iso === '2026-04-08'` (03/04 Sexta Santa); `quintoDiaUtil(2026,11).iso === '2026-11-09'` (01/11 domingo, 02/11 feriado); `quintoDiaUtil(2026,2).iso === '2026-02-06'` (Carnaval 16–17/02 não afeta)
  - `feriados(2026)` inclui '2026-04-03', '2026-02-16', '2026-02-17', '2026-06-04'
  - `statusSetor(caa, new Date(2026,10,18,10,0)).aberto === true`; domingo → false; `achados` às 12:30 de dia útil → false e texto contém '13h'
  - `marcarChecklist` com localStorage que lança erro não lança
  - Integridade: todo `setorId` em servicos/naoResolve/checklist existe em setores; todo `pontoMapa` existe em mapa.pontos; toda rota tem ≥ 2 passos.
- [ ] Rodar `node --test tests/` → FAIL.
- [ ] Implementar `js/data.js` com conteúdo extraído de `docs/fontes/*.txt` (ver resumo de fatos no prompt do subagent).
- [ ] Implementar `js/logic.js` (Páscoa por algoritmo de Meeus/Butcher; Carnaval = Páscoa−48/−47; Sexta Santa = −2; Corpus Christi = +60). Final do arquivo: `if (typeof module !== 'undefined') module.exports = CEUMA;`
- [ ] `node --test tests/` → PASS.

### Task 2 (FRONT): interface

**Files:** Create `index.html`, `css/styles.css`, `js/app.js`.
**Consumes:** contrato acima (somente essa API).

Telas (hash routes): `#/inicio` (hero "Primeira vez no CEUMA?", busca grande, atalhos dos 6 serviços mais comuns, card "Minha 1ª semana" com progresso, card mito do dia), `#/buscar?q=`, `#/setores` (lista com filtro por categoria e status aberto/fechado), `#/setor/:id` (ficha + "Como chegar" com mini-mapa destacando rota), `#/mapa` (SVG completo; tocar ponto → ficha), `#/semana` (checklist), `#/regras` (mitos × verdades + calculadora 5º dia útil + glossário com filtro), `#/emergencia` (Pronto Atendimento + Segurança).
- [ ] Barra inferior fixa (Início, Setores, Mapa, 1ª semana, Regras) + botão flutuante 🚑 Emergência.
- [ ] Selo "a confirmar" renderizado sempre que `setor.aConfirmar.length > 0` (lista ao tocar).
- [ ] Busca sem resultado → mensagem + links para Apoio ao Aluno e `#/setores`.
- [ ] Verificação: abrir `index.html` no navegador, navegar todas as rotas em 375px e 1280px, console sem erros.

### Task 3: integração e verificação (controlador)
- [ ] `node --test tests/` PASS; navegador em mobile e desktop; console limpo; corrigir divergências de contrato.
