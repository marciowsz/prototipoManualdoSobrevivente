/* Guia do Calouro CEUMA — interface (SPA por hash).
 * Usa somente a API pública window.CEUMA (js/data.js + js/logic.js).
 * Script clássico (sem módulos) para funcionar via file://.
 */
(function () {
  'use strict';

  var C = window.CEUMA || {};
  var app = document.getElementById('app');

  /* ---------- utilitários ---------- */

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function arr(v) { return Array.isArray(v) ? v : []; }

  function call(fnName, args, fallback) {
    try {
      if (typeof C[fnName] === 'function') return C[fnName].apply(C, args || []);
    } catch (e) {
      if (window.console) console.warn('[CEUMA] ' + fnName + ' falhou:', e);
    }
    return fallback;
  }

  function norm(t) {
    var n = call('normalizar', [String(t == null ? '' : t)], null);
    if (typeof n === 'string') return n;
    return String(t == null ? '' : t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  }

  function getSetor(id) { return id ? call('getSetor', [id], null) : null; }

  function statusDe(setor) {
    var s = call('statusSetor', [setor, new Date()], null);
    if (!s || typeof s !== 'object' || s.aberto === null || s.aberto === undefined) return { aberto: null, texto: String((s && s.texto) || 'Horário a confirmar') };
    return { aberto: !!s.aberto, texto: String(s.texto || (s.aberto ? 'Aberto agora' : 'Fechado')) };
  }

  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  function isoParaData(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function porExtenso(d) {
    if (!(d instanceof Date) || isNaN(d)) return '';
    return DIAS_SEMANA[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function curta(d) {
    if (!(d instanceof Date) || isNaN(d)) return '';
    return d.getDate() + ' de ' + MESES[d.getMonth()] + ' (' + DIAS_SEMANA[d.getDay()] + ')';
  }

  var CATS = {
    atendimento: { nome: 'Atendimento' },
    academico: { nome: 'Acadêmico' },
    apoio: { nome: 'Apoio ao estudante' },
    seguranca: { nome: 'Segurança e saúde' },
    digital: { nome: 'Online' }
  };
  function catNome(c) { return (CATS[c] && CATS[c].nome) || 'Outros'; }
  function catAttr(c) { return CATS[c] ? c : 'outros'; }

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms);
    };
  }

  function setHashSilently(hash) {
    try {
      history.replaceState(null, '', hash);
    } catch (e) {
      ignorarProximoHash = true;
      location.replace(hash);
    }
  }

  /* ---------- componentes ---------- */

  function statusPill(setor) {
    var s = statusDe(setor);
    return '<span class="status ' + (s.aberto === null ? 'status--confirmar' : s.aberto ? 'status--aberto' : 'status--fechado') + '">' +
      '<span class="status__dot" aria-hidden="true"></span>' + esc(s.texto) + '</span>';
  }

  function seloConfirmar(lista, uid) {
    lista = arr(lista);
    if (!lista.length) return '';
    var id = 'conf-' + uid;
    return '<div class="confirmar">' +
      '<button type="button" class="selo-confirmar" aria-expanded="false" aria-controls="' + id + '" data-action="toggle">' +
      '<span aria-hidden="true">⚠️</span> a confirmar <span class="selo-confirmar__n">(' + lista.length + ')</span></button>' +
      '<div class="confirmar__lista" id="' + id + '" hidden>' +
      '<p>Estas informações ainda não foram validadas pelo setor:</p>' +
      '<ul>' + lista.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div></div>';
  }

  function chips(lista, cls) {
    lista = arr(lista);
    if (!lista.length) return '';
    return '<ul class="chips ' + (cls || '') + '">' + lista.map(function (t) {
      return '<li class="chip">' + esc(t) + '</li>';
    }).join('') + '</ul>';
  }

  function setorLink(id, extraTexto) {
    var s = getSetor(id);
    if (!s) return '';
    return '<a class="setor-link" data-cat="' + esc(catAttr(s.categoria)) + '" href="#/setor/' + encodeURIComponent(s.id) + '">' +
      '<span class="setor-link__icone" aria-hidden="true">' + esc(s.icone) + '</span>' +
      '<span>' + (extraTexto ? esc(extraTexto) + ' ' : '') + '<strong>' + esc(s.apelido || s.nome) + '</strong></span>' +
      '<span class="seta" aria-hidden="true">→</span></a>';
  }

  var CONTATO = {
    telefone: { icone: '📞', rotulo: 'Ligar' },
    whatsapp: { icone: '💬', rotulo: 'WhatsApp' },
    email: { icone: '✉️', rotulo: 'E-mail' },
    link: { icone: '🔗', rotulo: 'Abrir' },
    presencial: { icone: '🚶', rotulo: 'Presencial' }
  };

  function contatoHref(c) {
    var href = c.href || null;
    var valor = String(c.valor || '').trim();
    var dig = valor.replace(/\D/g, '');
    if (!href) {
      if (c.tipo === 'telefone' && dig.length >= 3) href = 'tel:' + dig;
      else if (c.tipo === 'whatsapp' && dig.length >= 8) href = 'https://wa.me/' + (dig.indexOf('55') === 0 && dig.length > 11 ? dig : '55' + dig);
      else if (c.tipo === 'email' && /^[^\s@]+@[^\s@]+$/.test(valor)) href = 'mailto:' + valor;
      else if (/^https?:\/\//i.test(valor)) href = valor;
    }
    if (href && !/^(tel:|mailto:|https?:\/\/)/i.test(String(href))) href = null;
    return href;
  }

  function contatos(lista) {
    lista = arr(lista);
    if (!lista.length) return '<p class="muted">Nenhum contato direto informado nas entrevistas.</p>';
    return '<ul class="contatos">' + lista.map(function (c) {
      var info = CONTATO[c.tipo] || { icone: '•', rotulo: 'Contato' };
      var href = contatoHref(c);
      var corpo = '<span class="contato__icone" aria-hidden="true">' + info.icone + '</span>' +
        '<span class="contato__txt"><span class="contato__tipo">' + esc(info.rotulo) + '</span>' +
        '<span class="contato__valor">' + esc(c.valor) + '</span></span>';
      if (!href) return '<li><div class="contato contato--estatico">' + corpo + '</div></li>';
      var ext = /^https?:/i.test(href);
      return '<li><a class="contato" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + corpo +
        (ext ? '<span class="sr-only"> (abre em nova aba)</span>' : '') + '</a></li>';
    }).join('') + '</ul>';
  }

  /* ---------- mapa SVG ---------- */

  function setoresPorPonto() {
    var mapa = {};
    arr(C.setores).forEach(function (s) {
      var p = s && s.local && s.local.pontoMapa;
      if (!p || s.categoria === 'digital') return; // setor online não "mora" num ponto do mapa
      // local ainda não confirmado: a rota leva ao Apoio ao Aluno para perguntar, mas o setor não vira pino lá
      if (p === 'apoioPatio' && s.id !== 'apoio') return;
      (mapa[p] = mapa[p] || []).push(s);
    });
    return mapa;
  }

  // "Pátio Principal · Apoio ao Aluno (4 telas de TV)" -> "Pátio Principal" (nome completo fica no aria-label/painel)
  function rotuloCurto(nome) {
    var t = String(nome || '').split(' · ')[0].replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    return t || String(nome || '');
  }

  function naRota(p, caminho) {
    return caminho.some(function (c) { return Math.abs(c[0] - p.x) < 8 && Math.abs(c[1] - p.y) < 8; });
  }

  function mapaSvg(opts) {
    opts = opts || {};
    var M = C.mapa || {};
    var W = +M.largura || 1000, H = +M.altura || 700;
    var rota = opts.rotaId && M.rotas ? M.rotas[opts.rotaId] : null;
    var caminho = rota ? arr(rota.caminho).filter(function (p) { return Array.isArray(p) && p.length >= 2 && isFinite(p[0]) && isFinite(p[1]); }) : [];
    var porPonto = setoresPorPonto();
    var destinoPonto = opts.rotaId ? ((getSetor(opts.rotaId) || {}).local || {}).pontoMapa : null;

    var vb = [0, 0, W, H];
    if (opts.mini && caminho.length) {
      var xs = caminho.map(function (p) { return p[0]; }), ys = caminho.map(function (p) { return p[1]; });
      var x0 = Math.min.apply(null, xs) - 120, x1 = Math.max.apply(null, xs) + 120;
      var y0 = Math.min.apply(null, ys) - 100, y1 = Math.max.apply(null, ys) + 100;
      var w = Math.max(x1 - x0, 600), h = Math.max(y1 - y0, 380);
      var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      x0 = Math.max(0, Math.min(W - w, cx - w / 2)); y0 = Math.max(0, Math.min(H - h, cy - h / 2));
      vb = [x0, y0, Math.min(w, W), Math.min(h, H)];
    }

    var out = [];
    var label = opts.mini ? 'Mini-mapa ilustrativo com a rota até o setor' : 'Mapa ilustrativo do campus Renascença';
    out.push('<svg class="mapa-svg' + (opts.mini ? ' mapa-svg--mini' : '') + '" viewBox="' + vb.join(' ') + '" role="' + (opts.mini ? 'img' : 'group') + '" aria-label="' + esc(label) + '" preserveAspectRatio="xMidYMid meet">');
    out.push('<rect class="mapa-fundo" x="0" y="0" width="' + W + '" height="' + H + '" rx="24"/>');

    arr(M.areas).forEach(function (a) {
      if (!a) return;
      out.push('<g class="mapa-area"><rect x="' + (+a.x || 0) + '" y="' + (+a.y || 0) + '" width="' + (+a.w || 0) + '" height="' + (+a.h || 0) + '" rx="18"/>' +
        '<text x="' + ((+a.x || 0) + (+a.w || 0) / 2) + '" y="' + ((+a.y || 0) + 30) + '" text-anchor="middle">' + esc(a.nome) + '</text></g>');
    });

    if (caminho.length >= 2) {
      var pts = caminho.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
      out.push('<polyline class="rota-base" points="' + pts + '"/>');
      out.push('<polyline class="rota" points="' + pts + '"/>');
      var ini = caminho[0];
      out.push('<g class="rota-inicio"><circle cx="' + ini[0] + '" cy="' + ini[1] + '" r="16"/><text x="' + ini[0] + '" y="' + (ini[1] + 6) + '" text-anchor="middle">▶</text></g>');
    }

    arr(M.pontos).forEach(function (p) {
      if (!p) return;
      var x = +p.x || 0, y = +p.y || 0;
      var tipo = ['setor', 'entrada', 'referencia'].indexOf(p.tipo) >= 0 ? p.tipo : 'referencia';
      var sets = porPonto[p.id] || [];
      var destino = destinoPonto && p.id === destinoPonto;
      var icone = sets.length ? sets[0].icone : (tipo === 'entrada' ? '🚪' : '📍');
      var curto = rotuloCurto(p.nome);
      var rotulo = '';
      if (!opts.mini) {
        rotulo = '<text class="pin__rotulo" x="' + x + '" y="' + (y + 48) + '" text-anchor="middle">' + esc(curto) + '</text>';
      } else if (destino || tipo === 'entrada' || naRota(p, caminho)) {
        var direita = x <= vb[0] + vb[2] / 2;
        rotulo = '<text class="pin__rotulo" x="' + (direita ? x + 32 : x - 32) + '" y="' + (y + 8) + '" text-anchor="' + (direita ? 'start' : 'end') + '">' + esc(curto) + '</text>';
      }
      var pin = '<circle class="pin__hit" cx="' + x + '" cy="' + y + '" r="40"/>' +
        (destino ? '<circle class="pin__pulso" cx="' + x + '" cy="' + y + '" r="30"/>' : '') +
        '<circle class="pin__circ" cx="' + x + '" cy="' + y + '" r="' + (tipo === 'setor' ? 22 : 18) + '"/>' +
        '<text class="pin__icone" x="' + x + '" y="' + (y + 8) + '" text-anchor="middle" aria-hidden="true">' + esc(icone) + '</text>' + rotulo;
      var cls = 'pin pin--' + tipo + (destino ? ' pin--destino' : '');
      if (opts.mini) {
        out.push('<g class="' + cls + '">' + pin + '</g>');
      } else if (sets.length === 1) {
        out.push('<a class="' + cls + '" href="#/setor/' + encodeURIComponent(sets[0].id) + '" aria-label="' + esc(sets[0].nome + ' — abrir ficha') + '">' + pin + '</a>');
      } else {
        out.push('<g class="' + cls + '" role="button" tabindex="0" data-action="ponto" data-ponto="' + esc(p.id) + '" aria-label="' + esc(p.nome + (sets.length ? ' — ' + sets.length + ' setores aqui' : '')) + '">' + pin + '</g>');
      }
    });
    out.push('</svg>');
    return out.join('');
  }

  function infoPonto(pid) {
    var p = arr((C.mapa || {}).pontos).filter(function (x) { return x && x.id === pid; })[0];
    if (!p) return '';
    var sets = setoresPorPonto()[pid] || [];
    return '<h3>' + esc(p.nome) + '</h3>' +
      (sets.length ? '<p>Setores aqui:</p><div class="stack">' + sets.map(function (s) { return setorLink(s.id); }).join('') + '</div>'
        : '<p class="muted">Ponto de referência — use para se orientar.</p>');
  }

  /* ---------- telas ---------- */

  var SUGESTOES = [
    { q: 'boleto', rotulo: 'Boleto', icone: '💳' },
    { q: 'facial', rotulo: 'Facial / catraca', icone: '🙂' },
    { q: 'perdi', rotulo: 'Perdi algo', icone: '🔎' },
    { q: 'historico', rotulo: 'Histórico', icone: '📄' },
    { q: 'prouni fies', rotulo: 'ProUni / FIES', icone: '🎓' },
    { q: 'biblioteca', rotulo: 'Biblioteca', icone: '📚' }
  ];

  function sugestoesHtml() {
    return '<ul class="sugestoes" aria-label="Sugestões de busca">' + SUGESTOES.map(function (s) {
      return '<li><a class="sugestao" href="#/buscar?q=' + encodeURIComponent(s.q) + '"><span aria-hidden="true">' + s.icone + '</span> ' + esc(s.rotulo) + '</a></li>';
    }).join('') + '</ul>';
  }

  function campoBusca(valor, idSufixo) {
    return '<form class="busca" role="search" data-form="busca">' +
      '<label class="busca__label" for="busca-' + idSufixo + '">O que você precisa resolver?</label>' +
      '<div class="busca__campo"><span class="busca__lupa" aria-hidden="true">🔍</span>' +
      '<input id="busca-' + idSufixo + '" class="busca__input" type="search" name="q" autocomplete="off" enterkeyhint="search" ' +
      'placeholder="Ex.: boleto, catraca, histórico…" value="' + esc(valor || '') + '" data-busca="' + idSufixo + '">' +
      '</div></form>';
  }

  function progressoHtml(p) {
    p = p || { feitos: 0, total: 0, pct: 0 };
    var pct = Math.max(0, Math.min(100, Math.round(+p.pct || 0)));
    return '<div class="progresso" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progresso da primeira semana">' +
      '<div class="progresso__barra" style="width:' + pct + '%"></div></div>' +
      '<p class="progresso__txt"><strong>' + (+p.feitos || 0) + ' de ' + (+p.total || 0) + '</strong> tarefas concluídas (' + pct + '%)</p>';
  }

  function maisProcurados() {
    var termos = ['boleto', 'historico', 'facial', 'matricula', 'emprestimo', 'prova', 'perdi'];
    var vistos = {}, lista = [];
    termos.forEach(function (t) {
      if (lista.length >= 6) return;
      var r = arr(call('buscar', [t], [])).filter(function (x) { return x && x.tipo === 'servico' && !vistos[x.id]; })[0];
      if (r) { vistos[r.id] = 1; lista.push({ r: r, q: t }); }
    });
    arr(C.servicos).forEach(function (s) {
      if (lista.length < 6 && s && !vistos[s.id]) { vistos[s.id] = 1; lista.push({ r: { id: s.id, titulo: s.titulo, setorId: s.setorId }, q: s.titulo }); }
    });
    return lista;
  }

  function telaInicio() {
    var p = call('progressoChecklist', [], { feitos: 0, total: 0, pct: 0 });
    var mitos = arr(C.mitos);
    var hoje = new Date();
    var diaAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 864e5);
    var mito = mitos.length ? mitos[diaAno % mitos.length] : null;
    var atalhos = maisProcurados();

    return '<section class="hero">' +
      '<p class="hero__eyebrow">Guia do Calouro · Campus Renascença</p>' +
      '<h1 tabindex="-1">Primeira vez no CEUMA? <span class="hero__wave" aria-hidden="true">👋</span></h1>' +
      '<p class="hero__sub">A gente te diz <strong>onde fica</strong>, <strong>qual setor resolve</strong> e <strong>o que levar</strong> — sem fila à toa.</p>' +
      campoBusca('', 'inicio') + sugestoesHtml() + '</section>' +

      (atalhos.length ? '<section class="bloco"><h2>Mais procurados</h2><ul class="grade-atalhos">' + atalhos.map(function (a) {
        var s = getSetor(a.r.setorId);
        return '<li><a class="atalho" data-cat="' + esc(catAttr(s && s.categoria)) + '" href="#/buscar?q=' + encodeURIComponent(a.q) + '">' +
          '<span class="atalho__icone" aria-hidden="true">' + esc(s ? s.icone : '✨') + '</span>' +
          '<span class="atalho__titulo">' + esc(a.r.titulo) + '</span>' +
          (s ? '<span class="atalho__setor">' + esc(s.apelido || s.nome) + '</span>' : '') + '</a></li>';
      }).join('') + '</ul></section>' : '') +

      '<div class="duas-col">' +
      '<section class="card card--semana"><h2><span aria-hidden="true">✅</span> Minha 1ª semana</h2>' +
      '<p>O passo a passo para não se perder nos primeiros dias.</p>' + progressoHtml(p) +
      '<a class="btn btn--primario" href="#/semana">Abrir checklist</a></section>' +

      (mito ? '<section class="card card--mito"><h2><span aria-hidden="true">🤔</span> Mito do dia</h2>' +
        '<p class="mito__frase">“' + esc(mito.mito) + '”</p>' +
        '<button type="button" class="btn btn--secundario" aria-expanded="false" aria-controls="mito-dia" data-action="toggle">É verdade?</button>' +
        '<div id="mito-dia" class="mito__verdade" hidden><p><strong>Na real:</strong> ' + esc(mito.verdade) + '</p></div>' +
        '<a class="link-mais" href="#/regras">Ver todos os mitos →</a></section>' : '') +
      '</div>' +

      '<section class="card card--dica"><h2><span aria-hidden="true">🧭</span> Perdido no campus?</h2>' +
      '<p>Veja o mapa ilustrativo com os pontos de referência (Praça da Gratidão, Pátio das 4 TVs, Café CB…) e a rota até cada setor.</p>' +
      '<div class="acoes"><a class="btn btn--primario" href="#/mapa">Abrir mapa</a><a class="btn btn--secundario" href="#/setores">Ver setores</a></div></section>';
  }

  function servicoPorId(id) { return arr(C.servicos).filter(function (s) { return s && s.id === id; })[0] || null; }

  function glossarioDe(r) {
    var g = arr(C.glossario);
    return g.filter(function (x) { return x && (x.id === r.id || x.termo === r.id || x.termo === r.titulo); })[0] ||
      g.filter(function (x) {
        if (!x) return false;
        var n = norm(x.termo), id = norm(r.id);
        return n === id || n.replace(/[^a-z0-9]+/g, '-') === id || n.replace(/[^a-z0-9]+/g, '') === id.replace(/[^a-z0-9]+/g, '');
      })[0] || null;
  }

  function cardServico(s, r) {
    var setor = getSetor(s ? s.setorId : r.setorId);
    var titulo = s ? s.titulo : r.titulo;
    return '<article class="card resultado resultado--servico" data-cat="' + esc(catAttr(setor && setor.categoria)) + '">' +
      '<div class="resultado__topo"><h3>' + esc(titulo) + '</h3>' +
      (s && s.online ? '<span class="selo selo--online"><span aria-hidden="true">📱</span> Dá para fazer online</span>' : '') + '</div>' +
      (s && arr(s.comoFazer).length ? '<h4>Como fazer</h4><ol class="passos">' + arr(s.comoFazer).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' : '') +
      (s && arr(s.levar).length ? '<h4>O que levar</h4>' + chips(s.levar) : '') +
      (s && s.alerta ? '<p class="alerta"><span aria-hidden="true">⚠️</span> ' + esc(s.alerta) + '</p>' : '') +
      (setor ? '<div class="resultado__setor">' + setorLink(setor.id, 'Onde:') + '</div>' : '') +
      '</article>';
  }

  function resultadosHtml(q) {
    var termo = String(q || '').trim();
    if (!termo) {
      return '<p class="muted">Digite o que você precisa — por exemplo “boleto”, “catraca” ou “histórico”.</p>';
    }
    var res = arr(call('buscar', [termo], []));
    if (!res.length) {
      return '<div class="vazio" role="status"><p class="vazio__emoji" aria-hidden="true">🤷</p>' +
        '<h2>Não achamos nada para “' + esc(termo) + '”</h2>' +
        '<p>Tente outra palavra (ex.: “boleto”, “prova”, “crachá”) ou peça ajuda a quem conhece o campus:</p>' +
        '<div class="stack">' + setorLink('apoio', 'Pergunte no') + '<a class="btn btn--secundario" href="#/setores">Ver todos os setores</a></div></div>';
    }
    var html = ['<p class="muted" role="status">' + res.length + (res.length === 1 ? ' resultado' : ' resultados') + ' para “' + esc(termo) + '”</p><div class="resultados">'];
    res.forEach(function (r) {
      if (!r) return;
      if (r.tipo === 'servico') {
        html.push(cardServico(servicoPorId(r.id), r));
      } else if (r.tipo === 'setor') {
        var s = getSetor(r.id) || getSetor(r.setorId);
        if (!s) return;
        html.push('<a class="card resultado resultado--setor card-link" data-cat="' + esc(catAttr(s.categoria)) + '" href="#/setor/' + encodeURIComponent(s.id) + '">' +
          '<span class="card-link__icone" aria-hidden="true">' + esc(s.icone) + '</span><span class="card-link__corpo">' +
          '<span class="tag">Setor</span><strong class="card-link__titulo">' + esc(s.nome) + '</strong>' +
          '<span class="card-link__desc">' + esc(s.resumo) + '</span>' + statusPill(s) + '</span><span class="seta" aria-hidden="true">→</span></a>');
      } else if (r.tipo === 'glossario') {
        var g = glossarioDe(r);
        html.push('<article class="card resultado resultado--glossario"><span class="tag">Glossário</span><h3>' + esc(g ? g.termo : r.titulo) + '</h3>' +
          (g ? '<p>' + esc(g.definicao) + '</p>' : '') + '</article>');
      }
    });
    html.push('</div>');
    return html.join('');
  }

  function telaBuscar(params) {
    var q = params.q || '';
    return '<h1 tabindex="-1">Buscar</h1>' + campoBusca(q, 'pagina') + sugestoesHtml() +
      '<div id="resultados" aria-live="polite">' + resultadosHtml(q) + '</div>';
  }

  var filtroSetores = { cat: 'todas', abertos: false };

  function listaSetoresHtml() {
    var lista = arr(C.setores).filter(function (s) {
      if (!s) return false;
      if (filtroSetores.cat !== 'todas' && s.categoria !== filtroSetores.cat) return false;
      if (filtroSetores.abertos && statusDe(s).aberto === false) return false; // 'a confirmar' (null) continua na lista
      return true;
    });
    if (!lista.length) return '<p class="vazio">Nenhum setor com esse filtro agora. <button type="button" class="btn-link" data-action="limpar-filtro">Limpar filtros</button></p>';
    return '<ul class="lista-setores">' + lista.map(function (s) {
      return '<li><a class="card card-link" data-cat="' + esc(catAttr(s.categoria)) + '" href="#/setor/' + encodeURIComponent(s.id) + '">' +
        '<span class="card-link__icone" aria-hidden="true">' + esc(s.icone) + '</span><span class="card-link__corpo">' +
        '<span class="tag tag--cat">' + esc(catNome(s.categoria)) + '</span>' +
        '<strong class="card-link__titulo">' + esc(s.nome) + '</strong>' +
        '<span class="card-link__desc">' + esc(s.resumo) + '</span>' +
        (s.local && s.local.descricao ? '<span class="card-link__local"><span aria-hidden="true">📍</span> ' + esc(s.local.descricao) + '</span>' : '') +
        statusPill(s) + (arr(s.aConfirmar).length ? ' <span class="selo selo--mini">a confirmar</span>' : '') +
        '</span><span class="seta" aria-hidden="true">→</span></a></li>';
    }).join('') + '</ul>';
  }

  function telaSetores() {
    var cats = [];
    arr(C.setores).forEach(function (s) { if (s && cats.indexOf(s.categoria) < 0) cats.push(s.categoria); });
    if (filtroSetores.cat !== 'todas' && cats.indexOf(filtroSetores.cat) < 0) filtroSetores.cat = 'todas';
    return '<h1 tabindex="-1">Setores</h1><p class="lead">Quem resolve o quê — e se está aberto agora.</p>' +
      '<div class="filtros" role="group" aria-label="Filtrar por categoria">' +
      ['todas'].concat(cats).map(function (c) {
        var ativo = filtroSetores.cat === c;
        return '<button type="button" class="filtro" data-cat="' + esc(c === 'todas' ? 'todas' : catAttr(c)) + '" data-action="filtro-cat" data-valor="' + esc(c) + '" aria-pressed="' + ativo + '">' +
          esc(c === 'todas' ? 'Todos' : catNome(c)) + '</button>';
      }).join('') + '</div>' +
      '<label class="toggle"><input type="checkbox" data-action="filtro-abertos"' + (filtroSetores.abertos ? ' checked' : '') + '> Só os abertos agora <span class="muted">(mantém os de horário a confirmar)</span></label>' +
      '<div id="lista-setores" aria-live="polite">' + listaSetoresHtml() + '</div>';
  }

  function telaSetor(id) {
    var s = getSetor(id);
    if (!s) {
      return '<h1 tabindex="-1">Setor não encontrado</h1><div class="vazio"><p>Não encontramos esse setor.</p>' +
        '<div class="stack"><a class="btn btn--primario" href="#/setores">Ver todos os setores</a>' + setorLink('apoio', 'Ou pergunte no') + '</div></div>';
    }
    var local = s.local || {};
    var rota = C.mapa && C.mapa.rotas ? C.mapa.rotas[s.id] : null;
    var passos = rota ? arr(rota.passos) : [];
    var dia = new Date().getDate();
    var limite = +s.fechaPresencialAPartirDoDia;
    var avisoPresencial = '';
    if (limite > 0) {
      avisoPresencial = '<p class="alerta' + (dia >= limite ? ' alerta--forte' : '') + '"><span aria-hidden="true">📅</span> ' +
        'Atendimento presencial só até o dia ' + (limite - 1) + ' de cada mês — a partir do dia ' + limite + ', só pelos canais remotos.' +
        (dia >= limite ? ' <strong>Hoje (dia ' + dia + ') já não há atendimento presencial.</strong>' : '') + '</p>';
    }

    return '<a class="voltar" href="#/setores"><span aria-hidden="true">←</span> Todos os setores</a>' +
      '<header class="ficha__topo" data-cat="' + esc(catAttr(s.categoria)) + '">' +
      '<span class="ficha__icone" aria-hidden="true">' + esc(s.icone) + '</span><div>' +
      '<span class="tag tag--cat">' + esc(catNome(s.categoria)) + '</span>' +
      '<h1 tabindex="-1">' + esc(s.nome) + '</h1>' +
      (s.resumo ? '<p class="ficha__resumo">' + esc(s.resumo) + '</p>' : '') +
      '<div class="ficha__status">' + statusPill(s) + seloConfirmar(s.aConfirmar, 'setor-' + s.id) + '</div></div></header>' +

      '<div class="ficha__grade"><div class="ficha__col">' +
      '<section class="card onde"><h2><span aria-hidden="true">📍</span> Onde fica</h2>' +
      '<p class="onde__local">' + esc(local.descricao || 'Local a confirmar') + '</p>' +
      (local.referencia ? '<p class="onde__ref"><span class="onde__ref-rotulo">Ponto de referência</span>' + esc(local.referencia) + '</p>' : '') +
      '</section>' +

      '<section class="card"><h2><span aria-hidden="true">🕒</span> Horário</h2><p>' + esc(s.horarioTexto || 'A confirmar') + '</p>' + avisoPresencial + '</section>' +

      (arr(s.requisitos).length ? '<section class="card"><h2><span aria-hidden="true">🎒</span> O que levar</h2>' + chips(s.requisitos, 'chips--levar') + '</section>' : '') +

      (arr(s.resolve).length ? '<section class="card"><h2><span aria-hidden="true">✅</span> Resolve aqui</h2><ul class="lista-check">' +
        arr(s.resolve).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>' : '') +

      (arr(s.naoResolve).length ? '<section class="card card--nao"><h2><span aria-hidden="true">🚫</span> Não é aqui</h2><ul class="nao-lista">' +
        arr(s.naoResolve).map(function (n) {
          var outro = n && getSetor(n.setorId);
          return '<li><span class="nao-lista__oque">' + esc(n && n.oque) + '</span>' +
            (outro ? setorLink(outro.id, 'Vá para') : '') + '</li>';
        }).join('') + '</ul></section>' : '') +
      '</div><div class="ficha__col">' +

      '<section class="card"><h2><span aria-hidden="true">🧭</span> Como chegar</h2>' +
      (passos.length ? '<ol class="passos passos--rota">' + passos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' : '<p class="muted">' + (s.categoria === 'digital' ? 'É online — não precisa ir a lugar nenhum.' : 'Rota ainda não mapeada. Peça orientação no Apoio ao Aluno (Pátio Principal, ao lado das 4 telas de TV).') + '</p>') +
      (rota && arr(rota.caminho).length >= 2 ? '<div class="mapa-mini">' + mapaSvg({ rotaId: s.id, mini: true }) + '</div>' +
        '<p class="mapa-aviso">Mapa ilustrativo — posições aproximadas. <a href="#/mapa?rota=' + encodeURIComponent(s.id) + '">Ver no mapa completo</a></p>' : '') +
      '</section>' +

      '<section class="card"><h2><span aria-hidden="true">☎️</span> Contatos</h2>' + contatos(s.contatos) + '</section>' +

      (arr(s.dicas).length ? '<section class="card card--dicas"><h2><span aria-hidden="true">💡</span> Dicas de quem já passou por isso</h2><ul>' +
        arr(s.dicas).map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></section>' : '') +
      '</div></div>';
  }

  function legendaMapa() {
    return '<ul class="legenda" aria-label="Legenda">' +
      '<li><span class="legenda__sw legenda__sw--entrada" aria-hidden="true"></span>Entrada</li>' +
      '<li><span class="legenda__sw legenda__sw--setor" aria-hidden="true"></span>Setor (toque para abrir)</li>' +
      '<li><span class="legenda__sw legenda__sw--referencia" aria-hidden="true"></span>Ponto de referência</li>' +
      '<li><span class="legenda__sw legenda__sw--rota" aria-hidden="true"></span>Rota</li>' +
      '<li><span class="legenda__sw legenda__sw--area" aria-hidden="true"></span>Área / prédio</li></ul>';
  }

  function telaMapa(params) {
    var rotas = (C.mapa && C.mapa.rotas) || {};
    var rotaId = params.rota && rotas[params.rota] ? params.rota : '';
    var comRota = arr(C.setores).filter(function (s) { return s && rotas[s.id]; });
    var pontos = arr((C.mapa || {}).pontos);
    var porPonto = setoresPorPonto();
    return '<h1 tabindex="-1">Mapa do campus</h1>' +
      '<p class="aviso-ilustrativo"><span aria-hidden="true">ℹ️</span> Mapa ilustrativo — posições aproximadas.</p>' +
      (comRota.length ? '<div class="campo"><label for="sel-rota">Traçar rota da entrada até…</label>' +
        '<select id="sel-rota" data-action="rota"><option value="">— escolha um setor —</option>' +
        comRota.map(function (s) { return '<option value="' + esc(s.id) + '"' + (s.id === rotaId ? ' selected' : '') + '>' + esc(s.icone + ' ' + s.nome) + '</option>'; }).join('') +
        '</select></div>' : '') +
      '<div class="mapa-wrap" id="mapa-wrap">' + mapaSvg({ rotaId: rotaId }) + '</div>' +
      legendaMapa() +
      '<div id="mapa-rota">' + rotaPassosHtml(rotaId) + '</div>' +
      '<div id="mapa-info" class="mapa-info" aria-live="polite"></div>' +
      (pontos.length ? '<section class="bloco"><h2>Locais no mapa</h2><ul class="lista-pontos">' + pontos.map(function (p) {
        if (!p) return '';
        var sets = porPonto[p.id] || [];
        if (sets.length === 1) return '<li>' + setorLink(sets[0].id, p.nome + ' ·') + '</li>';
        return '<li><button type="button" class="ponto-btn" data-action="ponto" data-ponto="' + esc(p.id) + '"><span aria-hidden="true">' +
          (sets.length ? esc(sets[0].icone) : (p.tipo === 'entrada' ? '🚪' : '📍')) + '</span> ' + esc(p.nome) +
          (sets.length ? ' <span class="muted">(' + sets.length + ' setores)</span>' : '') + '</button></li>';
      }).join('') + '</ul></section>' : '');
  }

  function rotaPassosHtml(rotaId) {
    var rota = rotaId && C.mapa && C.mapa.rotas ? C.mapa.rotas[rotaId] : null;
    if (!rota) return '';
    var s = getSetor(rotaId);
    return '<section class="card"><h2>Como chegar: ' + esc(s ? s.nome : rotaId) + '</h2><ol class="passos passos--rota">' +
      arr(rota.passos).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' +
      (s ? setorLink(s.id, 'Abrir ficha:') : '') + '</section>';
  }

  function telaSemana() {
    var estado = call('checklistEstado', [], {}) || {};
    var itens = arr(C.checklist);
    var p = call('progressoChecklist', [], { feitos: 0, total: itens.length, pct: 0 });
    return '<h1 tabindex="-1">Minha 1ª semana</h1><p class="lead">Marque conforme for resolvendo. Fica salvo neste aparelho.</p>' +
      '<div class="card" id="progresso-semana">' + progressoHtml(p) + celebracao(p) + '</div>' +
      (itens.length ? '<ul class="checklist">' + itens.map(function (it, i) {
        if (!it) return '';
        var feito = !!estado[it.id];
        var cid = 'chk-' + i;
        return '<li class="check' + (feito ? ' check--feito' : '') + '">' +
          '<input type="checkbox" id="' + cid + '" data-action="check" data-id="' + esc(it.id) + '"' + (feito ? ' checked' : '') + '>' +
          '<label for="' + cid + '"><span class="check__titulo">' + esc(it.titulo) + '</span>' +
          (it.detalhe ? '<span class="check__detalhe">' + esc(it.detalhe) + '</span>' : '') + '</label>' +
          (it.setorId && getSetor(it.setorId) ? '<div class="check__setor">' + setorLink(it.setorId, 'Onde:') + '</div>' : '') + '</li>';
      }).join('') + '</ul>' : '<p class="muted">Checklist indisponível no momento.</p>');
  }

  function celebracao(p) {
    return p && p.total > 0 && p.feitos >= p.total ? '<p class="celebra" role="status"><span aria-hidden="true">🎉</span> Semana concluída! Você já se vira melhor que muito veterano.</p>' : '';
  }

  function telaRegras() {
    var mitos = arr(C.mitos);
    var hoje = new Date();
    var anos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1, hoje.getFullYear() + 2];
    return '<h1 tabindex="-1">Regras e mitos</h1><p class="lead">O que ninguém te explica — e o que é só boato de corredor.</p>' +
      '<nav class="sub-nav" aria-label="Seções desta página"><a href="#mitos" data-action="ancora">Mitos × Verdades</a><a href="#calc" data-action="ancora">Vencimento</a><a href="#glossario" data-action="ancora">Glossário</a></nav>' +

      '<section class="bloco" id="mitos" tabindex="-1"><h2>Mitos × Verdades</h2><p class="muted">Toque no card para ver a verdade.</p>' +
      (mitos.length ? '<ul class="mitos">' + mitos.map(function (m, i) {
        if (!m) return '';
        return '<li><button type="button" class="flip" aria-expanded="false" data-action="flip" aria-controls="verdade-' + i + '">' +
          '<span class="flip__frente"><span class="flip__rotulo flip__rotulo--mito">Mito</span><span class="flip__texto">“' + esc(m.mito) + '”</span>' +
          '<span class="flip__dica" aria-hidden="true">Toque para ver ↻</span></span></button>' +
          '<div class="flip__verso" id="verdade-' + i + '" hidden><span class="flip__rotulo flip__rotulo--verdade">Verdade</span><p>' + esc(m.verdade) + '</p>' +
          (m.fonte ? '<p class="flip__fonte">Fonte: ' + esc(m.fonte) + '</p>' : '') + '</div></li>';
      }).join('') + '</ul>' : '<p class="muted">Nenhum mito cadastrado.</p>') + '</section>' +

      '<section class="bloco card" id="calc" tabindex="-1"><h2><span aria-hidden="true">📆</span> Quando vence minha mensalidade?</h2>' +
      '<p>A mensalidade vence no <strong>5º dia útil</strong> do mês — não num dia fixo. Fins de semana, feriados nacionais e Carnaval/Corpus Christi não contam; feriados locais podem mudar a data (a confirmar).</p>' +
      '<div class="calc__campos"><div class="campo"><label for="calc-mes">Mês</label><select id="calc-mes" data-action="calc">' +
      MESES.map(function (m, i) { return '<option value="' + (i + 1) + '"' + (i === hoje.getMonth() ? ' selected' : '') + '>' + m.charAt(0).toUpperCase() + m.slice(1) + '</option>'; }).join('') +
      '</select></div><div class="campo"><label for="calc-ano">Ano</label><select id="calc-ano" data-action="calc">' +
      anos.map(function (a) { return '<option' + (a === hoje.getFullYear() ? ' selected' : '') + '>' + a + '</option>'; }).join('') +
      '</select></div></div><div id="calc-resultado" aria-live="polite">' + calcHtml(hoje.getFullYear(), hoje.getMonth() + 1) + '</div></section>' +

      '<section class="bloco" id="glossario" tabindex="-1"><h2>Glossário do calouro</h2>' +
      '<div class="campo"><label for="glos-filtro">Filtrar termos</label><input id="glos-filtro" type="search" autocomplete="off" placeholder="Ex.: RA, AVA, FIES…" data-action="glos"></div>' +
      '<div id="glos-lista">' + glossarioHtml('') + '</div></section>';
  }

  function glossarioHtml(filtro) {
    var f = norm(filtro);
    var itens = arr(C.glossario).filter(function (g) {
      return g && (!f || norm(g.termo + ' ' + g.definicao).indexOf(f) >= 0);
    }).sort(function (a, b) { return norm(a.termo) < norm(b.termo) ? -1 : 1; });
    if (!itens.length) return '<p class="vazio">Nenhum termo encontrado' + (filtro ? ' para “' + esc(filtro) + '”' : '') + '.</p>';
    return '<dl class="glossario">' + itens.map(function (g) {
      return '<div class="glossario__item"><dt>' + esc(g.termo) + '</dt><dd>' + esc(g.definicao) + '</dd></div>';
    }).join('') + '</dl>';
  }

  function calcHtml(ano, mes) {
    var r = call('quintoDiaUtil', [ano, mes], null);
    if (!r || !(r.data instanceof Date) || isNaN(r.data)) {
      var d2 = r && isoParaData(r.iso);
      if (!d2) return '<p class="muted">Não foi possível calcular agora.</p>';
      r = { data: d2, iso: r.iso, ignorados: r.ignorados };
    }
    var venc = r.data;
    var ign = arr(r.ignorados);
    var ignMap = {};
    ign.forEach(function (x) { if (x && x.iso) ignMap[x.iso] = x.motivo || 'não é dia útil'; });

    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var diff = Math.round((new Date(venc.getFullYear(), venc.getMonth(), venc.getDate()) - hoje) / 864e5);
    var rel = diff === 0 ? 'É hoje!' : diff > 0 ? (diff === 1 ? 'Falta 1 dia.' : 'Faltam ' + diff + ' dias.') : 'Essa data já passou.';

    var html = '<div class="calc__res"><p class="calc__rotulo">Vence em</p><p class="calc__data">' + esc(porExtenso(venc)) + '</p><p class="calc__rel">' + rel + '</p></div>';
    if (ign.length) {
      html += '<h3>Dias que não contaram</h3><ul class="pulados">' + ign.map(function (x) {
        var d = isoParaData(x && x.iso);
        return '<li><strong>' + esc(d ? curta(d) : (x && x.iso)) + '</strong> — ' + esc(x && x.motivo) + '</li>';
      }).join('') + '</ul>';
    }

    // mini-calendário
    var primeiro = new Date(venc.getFullYear(), venc.getMonth(), 1);
    var nDias = new Date(venc.getFullYear(), venc.getMonth() + 1, 0).getDate();
    var cel = [];
    for (var b = 0; b < primeiro.getDay(); b++) cel.push('<span class="cal__dia cal__dia--vazio" aria-hidden="true"></span>');
    var util = 0;
    for (var d = 1; d <= nDias; d++) {
      var iso = venc.getFullYear() + '-' + String(venc.getMonth() + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var cls = 'cal__dia', extra = '', titulo = '';
      if (d <= venc.getDate()) {
        if (ignMap[iso]) { cls += ' cal__dia--pulado'; titulo = ignMap[iso]; }
        else { util++; cls += ' cal__dia--util'; extra = '<span class="cal__n" aria-hidden="true">' + util + 'º</span>'; titulo = util + 'º dia útil'; }
      }
      if (d === venc.getDate()) { cls += ' cal__dia--venc'; titulo = 'Vencimento (' + util + 'º dia útil)'; }
      cel.push('<span class="' + cls + '"' + (titulo ? ' title="' + esc(titulo) + '"' : '') + '>' + d + extra +
        (titulo ? '<span class="sr-only"> — ' + esc(titulo) + '</span>' : '') + '</span>');
    }
    html += '<div class="cal" role="group" aria-label="Calendário de ' + MESES[venc.getMonth()] + ' de ' + venc.getFullYear() + '">' +
      '<p class="cal__titulo">' + MESES[venc.getMonth()] + ' ' + venc.getFullYear() + '</p><div class="cal__grade">' +
      ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(function (x, i) { return '<span class="cal__cab" aria-hidden="true" title="' + DIAS_SEMANA[i] + '">' + x + '</span>'; }).join('') +
      cel.join('') + '</div><ul class="cal__leg"><li><span class="cal__sw cal__sw--util" aria-hidden="true"></span>Dia útil contado</li>' +
      '<li><span class="cal__sw cal__sw--pulado" aria-hidden="true"></span>Não conta</li><li><span class="cal__sw cal__sw--venc" aria-hidden="true"></span>Vencimento</li></ul></div>' +
      '<p class="alerta"><span aria-hidden="true">💡</span> Pagou depois dessa data? Você perde o desconto de pontualidade — mas boleto atrasado <strong>não</strong> te impede de fazer prova.</p>';
    return html;
  }

  function telaEmergencia() {
    function bloco(id) {
      var s = getSetor(id);
      if (!s) return '';
      var local = s.local || {};
      return '<section class="card emerg__setor" data-cat="' + esc(catAttr(s.categoria)) + '">' +
        '<h2><span aria-hidden="true">' + esc(s.icone) + '</span> ' + esc(s.nome) + '</h2>' +
        (s.resumo ? '<p>' + esc(s.resumo) + '</p>' : '') +
        '<div class="ficha__status">' + statusPill(s) + seloConfirmar(s.aConfirmar, 'emerg-' + s.id) + '</div>' +
        '<p class="onde__local"><span aria-hidden="true">📍</span> ' + esc(local.descricao || 'Local a confirmar') + '</p>' +
        (local.referencia ? '<p class="onde__ref"><span class="onde__ref-rotulo">Ponto de referência</span>' + esc(local.referencia) + '</p>' : '') +
        (s.horarioTexto ? '<p><strong>Horário:</strong> ' + esc(s.horarioTexto) + '</p>' : '') +
        contatos(s.contatos) +
        '<a class="btn btn--secundario" href="#/setor/' + encodeURIComponent(s.id) + '">Ver ficha e como chegar</a></section>';
    }
    return '<h1 tabindex="-1"><span aria-hidden="true">🚑</span> Emergência</h1>' +
      '<p class="lead">Mantenha a calma. Se houver risco à vida, ligue agora:</p>' +
      '<div class="emerg__ligar">' +
      '<a class="btn-emerg" href="tel:192"><span class="btn-emerg__n">192</span><span>SAMU</span></a>' +
      '<a class="btn-emerg btn-emerg--bombeiro" href="tel:193"><span class="btn-emerg__n">193</span><span>Bombeiros</span></a></div>' +
      '<p class="muted">192 e 193 são números nacionais (não vêm das entrevistas do campus). No campus, procure também:</p>' +
      '<div class="ficha__grade">' + bloco('pronto') + bloco('seguranca') + '</div>' +
      '<section class="card card--dica"><h2><span aria-hidden="true">🔎</span> Perdeu algo?</h2>' +
      '<p>Se quer investigar (câmeras), registre primeiro a ocorrência na Segurança Patrimonial. Para ver se alguém entregou, vá ao Achados e Perdidos.</p>' +
      '<div class="stack">' + setorLink('seguranca', 'Registrar:') + setorLink('achados', 'Procurar:') + '</div></section>';
  }

  function telaErroDados() {
    return '<h1 tabindex="-1">Ops! Os dados não carregaram</h1><div class="vazio"><p>Não conseguimos carregar as informações do guia. ' +
      'Verifique se os arquivos <code>js/data.js</code> e <code>js/logic.js</code> estão na pasta e recarregue a página.</p></div>';
  }

  /* ---------- roteador ---------- */

  var ROTAS = {
    inicio: { titulo: 'Início', nav: 'inicio', render: telaInicio },
    buscar: { titulo: 'Buscar', nav: 'inicio', render: telaBuscar },
    setores: { titulo: 'Setores', nav: 'setores', render: telaSetores },
    setor: { titulo: 'Setor', nav: 'setores', render: null },
    mapa: { titulo: 'Mapa', nav: 'mapa', render: telaMapa },
    semana: { titulo: '1ª semana', nav: 'semana', render: telaSemana },
    regras: { titulo: 'Regras e mitos', nav: 'regras', render: telaRegras },
    emergencia: { titulo: 'Emergência', nav: 'emergencia', render: telaEmergencia }
  };

  var ignorarProximoHash = false;
  var focarBusca = false;

  function parseHash() {
    var h = String(location.hash || '').replace(/^#\/?/, '');
    var partes = h.split('?');
    var segs = partes[0].split('/').filter(Boolean).map(function (s) {
      try { return decodeURIComponent(s); } catch (e) { return s; }
    });
    var params = {};
    (partes[1] || '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      var k = i < 0 ? kv : kv.slice(0, i), v = i < 0 ? '' : kv.slice(i + 1);
      try { params[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { params[k] = v; }
    });
    return { nome: segs[0] || 'inicio', id: segs[1] || '', params: params };
  }

  function render() {
    if (ignorarProximoHash) { ignorarProximoHash = false; return; }
    var r = parseHash();
    var rota = ROTAS[r.nome];
    if (!rota || (r.nome === 'setor' && !r.id)) {
      if (location.hash && location.hash !== '#/inicio') { setHashSilently('#/inicio'); }
      r = { nome: 'inicio', id: '', params: {} };
      rota = ROTAS.inicio;
    }

    var html, titulo = rota.titulo;
    if (!C.setores && !C.buscar) {
      html = telaErroDados();
    } else {
      try {
        if (r.nome === 'setor') {
          html = telaSetor(r.id);
          var s = getSetor(r.id);
          if (s) titulo = s.apelido || s.nome;
        } else {
          html = rota.render(r.params);
        }
      } catch (e) {
        if (window.console) console.error(e);
        html = '<h1 tabindex="-1">Algo deu errado</h1><div class="vazio"><p>Não foi possível mostrar esta tela.</p><a class="btn btn--primario" href="#/inicio">Voltar ao início</a></div>';
      }
    }
    app.innerHTML = html;
    app.setAttribute('data-rota', r.nome);
    document.title = titulo + ' · Guia do Calouro CEUMA';

    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === rota.nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    if (focarBusca && r.nome === 'buscar') {
      var inp = document.getElementById('busca-pagina');
      if (inp) {
        inp.focus();
        try { var n = inp.value.length; inp.setSelectionRange(n, n); } catch (e) { /* type=search em alguns navegadores */ }
      }
    } else {
      window.scrollTo(0, 0);
      var h1 = app.querySelector('h1');
      if (h1) h1.focus({ preventScroll: true });
    }
    focarBusca = false;
  }

  /* ---------- eventos ---------- */

  var atualizarBusca = debounce(function (valor) {
    var alvo = document.getElementById('resultados');
    if (alvo) alvo.innerHTML = resultadosHtml(valor);
    setHashSilently('#/buscar' + (valor ? '?q=' + encodeURIComponent(valor) : ''));
  }, 150);

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var busca = t.getAttribute('data-busca');
    if (busca === 'inicio') {
      if (t.value.trim()) { focarBusca = true; location.hash = '#/buscar?q=' + encodeURIComponent(t.value); }
    } else if (busca === 'pagina') {
      atualizarBusca(t.value);
    } else if (t.getAttribute('data-action') === 'glos') {
      var gl = document.getElementById('glos-lista');
      if (gl) gl.innerHTML = glossarioHtml(t.value);
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.getAttribute('data-form') !== 'busca') return;
    e.preventDefault();
    var inp = f.querySelector('input[name="q"]');
    var v = inp ? inp.value : '';
    if (inp && inp.getAttribute('data-busca') === 'pagina') {
      var alvo = document.getElementById('resultados');
      if (alvo) alvo.innerHTML = resultadosHtml(v);
      setHashSilently('#/buscar' + (v ? '?q=' + encodeURIComponent(v) : ''));
      if (inp.blur) inp.blur();
    } else {
      location.hash = '#/buscar?q=' + encodeURIComponent(v);
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var acao = t.getAttribute('data-action');
    if (acao === 'check') {
      call('marcarChecklist', [t.getAttribute('data-id'), !!t.checked], null);
      var li = t.closest('.check');
      if (li) li.classList.toggle('check--feito', !!t.checked);
      var p = call('progressoChecklist', [], { feitos: 0, total: 0, pct: 0 });
      var box = document.getElementById('progresso-semana');
      if (box) box.innerHTML = progressoHtml(p) + celebracao(p);
    } else if (acao === 'filtro-abertos') {
      filtroSetores.abertos = !!t.checked;
      var ls = document.getElementById('lista-setores');
      if (ls) ls.innerHTML = listaSetoresHtml();
    } else if (acao === 'calc') {
      var mes = +document.getElementById('calc-mes').value, ano = +document.getElementById('calc-ano').value;
      var res = document.getElementById('calc-resultado');
      if (res) res.innerHTML = calcHtml(ano, mes);
    } else if (acao === 'rota') {
      var id = t.value;
      var wrap = document.getElementById('mapa-wrap');
      if (wrap) wrap.innerHTML = mapaSvg({ rotaId: id });
      var mr = document.getElementById('mapa-rota');
      if (mr) mr.innerHTML = rotaPassosHtml(id);
      setHashSilently('#/mapa' + (id ? '?rota=' + encodeURIComponent(id) : ''));
    }
  });

  function acionar(el, e) {
    var acao = el.getAttribute('data-action');
    if (acao === 'toggle' || acao === 'flip') {
      var alvo = document.getElementById(el.getAttribute('aria-controls'));
      var aberto = el.getAttribute('aria-expanded') === 'true';
      el.setAttribute('aria-expanded', String(!aberto));
      if (alvo) alvo.hidden = aberto;
      if (acao === 'flip') el.closest('li').classList.toggle('virado', !aberto);
    } else if (acao === 'filtro-cat') {
      filtroSetores.cat = el.getAttribute('data-valor');
      document.querySelectorAll('[data-action="filtro-cat"]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === el));
      });
      var ls = document.getElementById('lista-setores');
      if (ls) ls.innerHTML = listaSetoresHtml();
    } else if (acao === 'limpar-filtro') {
      filtroSetores = { cat: 'todas', abertos: false };
      render();
    } else if (acao === 'ponto') {
      var info = document.getElementById('mapa-info');
      if (info) {
        info.innerHTML = infoPonto(el.getAttribute('data-ponto'));
        info.classList.add('mapa-info--ativo');
        if (el.tagName.toLowerCase() === 'button' && info.scrollIntoView) info.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    } else if (acao === 'ancora') {
      e.preventDefault();
      var dest = document.getElementById((el.getAttribute('href') || '').replace('#', ''));
      if (dest) { dest.scrollIntoView({ behavior: 'smooth', block: 'start' }); dest.focus({ preventScroll: true }); }
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-action]');
    if (!el) return;
    var acao = el.getAttribute('data-action');
    if (['toggle', 'flip', 'filtro-cat', 'limpar-filtro', 'ponto', 'ancora'].indexOf(acao) < 0) return;
    acionar(el, e);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target;
    if (el && el.getAttribute && el.getAttribute('role') === 'button' && el.getAttribute('data-action')) {
      e.preventDefault();
      acionar(el, e);
    }
  });

  window.addEventListener('hashchange', render);
  if (!location.hash) setHashSilently('#/inicio');
  render();
})();
