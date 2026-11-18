/* Guia do Calouro CEUMA - lógica pura (estende o objeto definido em data.js). */
var CEUMA = (typeof window !== 'undefined'
  ? (window.CEUMA = window.CEUMA || {})
  : (typeof CEUMA !== 'undefined' ? CEUMA : {}));

(function (C) {
  'use strict';

  var STOPWORDS = ['de', 'do', 'da', 'dos', 'das', 'o', 'a', 'os', 'as', 'e', 'em', 'no', 'na', 'meu', 'minha',
    'um', 'uma', 'para', 'pra', 'com', 'preciso', 'quero', 'como', 'onde', 'eu', 'que', 'por', 'fica', 'ficam'];
  var DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var MAX_RESULTADOS = 12;

  /* ---------- texto e busca ---------- */

  function normalizar(texto) {
    if (texto === null || texto === undefined) return '';
    return String(texto)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function palavrasDe(texto) {
    return normalizar(texto).replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(Boolean);
  }

  function tokensDaBusca(query) {
    return palavrasDe(query).filter(function (t) {
      return t.length > 1 && STOPWORDS.indexOf(t) === -1;
    });
  }

  // 1 = palavra igual, 0.6 = prefixo (token com 4+ letras), 0 = nada
  function afinidade(token, palavras) {
    var melhor = 0;
    for (var i = 0; i < palavras.length; i++) {
      var p = palavras[i];
      if (p === token) return 1;
      if (token.length >= 4 && p.indexOf(token) === 0) melhor = Math.max(melhor, 0.6);
    }
    return melhor;
  }

  // soma o melhor casamento de cada token dentro de uma lista de textos
  function pontuarCampos(tokens, textos, peso, fraseBusca) {
    var palavras = [];
    var frases = [];
    (textos || []).forEach(function (t) {
      palavras = palavras.concat(palavrasDe(t));
      frases.push(normalizar(t));
    });
    var total = 0;
    tokens.forEach(function (tk) {
      total += afinidade(tk, palavras) * peso;
    });
    // bônus se a frase inteira da busca aparece num dos textos
    if (tokens.length > 1) {
      var q = fraseBusca || tokens.join(' ');
      frases.forEach(function (f) { if (f.indexOf(q) !== -1) total += peso; });
    }
    return total;
  }

  function buscar(query) {
    var tokens = tokensDaBusca(query);
    if (!tokens.length) return [];
    var frase = palavrasDe(query).join(' ');
    var resultados = [];

    (C.servicos || []).forEach(function (s) {
      var sc = pontuarCampos(tokens, [s.titulo], 10, frase) + pontuarCampos(tokens, s.palavras, 8, frase);
      if (sc > 0) resultados.push({ tipo: 'servico', id: s.id, titulo: s.titulo, setorId: s.setorId, score: sc });
    });

    (C.setores || []).forEach(function (s) {
      var sc = pontuarCampos(tokens, [s.nome, s.apelido], 12, frase) + pontuarCampos(tokens, s.palavras || [], 4, frase);
      // busca que é só o nome do setor ("onde fica a biblioteca"): a ficha do setor vem primeiro
      var nomePal = palavrasDe(s.nome + ' ' + s.apelido);
      var soNome = tokens.every(function (t) { return nomePal.indexOf(t) !== -1; });
      if (soNome) sc += 20;
      if (sc > 0) resultados.push({ tipo: 'setor', id: s.id, titulo: s.nome, setorId: s.id, score: sc });
    });

    (C.glossario || []).forEach(function (g) {
      var sc = pontuarCampos(tokens, [g.termo], 6, frase);
      if (sc > 0) resultados.push({ tipo: 'glossario', id: normalizar(g.termo), titulo: g.termo, setorId: g.setorId || null, score: sc });
    });

    var ordemTipo = { servico: 0, setor: 1, glossario: 2 };
    resultados.sort(function (a, b) {
      return (b.score - a.score) || (ordemTipo[a.tipo] - ordemTipo[b.tipo]);
    });
    return resultados.slice(0, MAX_RESULTADOS);
  }

  function getSetor(id) {
    var lista = C.setores || [];
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }

  /* ---------- datas ---------- */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function isoDe(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  // Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher)
  function pascoa(ano) {
    var a = ano % 19, b = Math.floor(ano / 100), c = ano % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31);
    var dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
  }

  function feriadosComNomes(ano) {
    var mapa = {};
    (C.feriadosFixos || []).forEach(function (mmdd) { mapa[ano + '-' + mmdd] = 'Feriado nacional'; });
    var p = pascoa(ano);
    [[-48, 'Carnaval'], [-47, 'Carnaval'], [-2, 'Sexta-feira Santa'], [60, 'Corpus Christi']].forEach(function (x) {
      mapa[isoDe(new Date(ano, p.getMonth(), p.getDate() + x[0]))] = x[1];
    });
    return mapa;
  }

  function feriados(ano) {
    return Object.keys(feriadosComNomes(ano)).sort();
  }

  function quintoDiaUtil(ano, mes) {
    var nomes = feriadosComNomes(ano);
    var ignorados = [];
    var uteis = 0;
    for (var dia = 1; dia <= 31; dia++) {
      var d = new Date(ano, mes - 1, dia);
      if (d.getMonth() !== mes - 1) break;
      var iso = isoDe(d);
      var dow = d.getDay();
      if (dow === 0 || dow === 6) {
        ignorados.push({ iso: iso, motivo: dow === 0 ? 'Domingo' : 'Sábado' });
      } else if (nomes[iso]) {
        ignorados.push({ iso: iso, motivo: nomes[iso] });
      } else {
        uteis++;
        if (uteis === 5) return { data: d, iso: iso, ignorados: ignorados };
      }
    }
    return null; // inalcançável: todo mês tem mais de 5 dias úteis
  }

  /* ---------- status de setor ---------- */

  function minutos(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function hora(hhmm) {
    var p = hhmm.split(':');
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10);
    return m ? h + 'h' + pad(m) : h + 'h';
  }

  function dataBr(d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); }

  // Sem horário confirmado: estado neutro (aberto: null), nunca "fechado".
  function statusSetor(setor, agora) {
    var aConfirmar = { aberto: null, texto: 'Horário a confirmar' };
    if (!setor) return aConfirmar;
    if (setor.id === 'portal') return { aberto: true, texto: 'Online 24h' };
    var horarios = setor.horarios || [];
    if (!horarios.length) return aConfirmar;

    var limite = setor.fechaPresencialAPartirDoDia;
    var sufixo = setor.diasAConfirmar ? ' (dias a confirmar)' : '';
    var nomes = feriadosComNomes(agora.getFullYear());

    if (limite && agora.getDate() >= limite) {
      return { aberto: false, texto: 'Presencial encerrado a partir do dia ' + limite + ' · volta dia 1º · use e-mail/WhatsApp' };
    }
    if (nomes[isoDe(agora)]) {
      return { aberto: false, texto: 'Feriado · confira o funcionamento' };
    }

    function turnosDoDia(dow) {
      return horarios
        .filter(function (h) { return h.dias.indexOf(dow) !== -1; })
        .sort(function (a, b) { return minutos(a.inicio) - minutos(b.inicio); });
    }

    var dow = agora.getDay();
    var min = agora.getHours() * 60 + agora.getMinutes();
    var hoje = turnosDoDia(dow);
    for (var i = 0; i < hoje.length; i++) {
      if (min >= minutos(hoje[i].inicio) && min < minutos(hoje[i].fim)) {
        return { aberto: true, texto: 'Aberto agora · fecha às ' + hora(hoje[i].fim) + sufixo };
      }
    }
    for (var j = 0; j < hoje.length; j++) {
      if (minutos(hoje[j].inicio) > min) {
        return { aberto: false, texto: 'Fechado · abre às ' + hora(hoje[j].inicio) + sufixo };
      }
    }
    // próximo dia aberto: avança a data de verdade, pulando feriados e dias sem presencial
    for (var n = 1; n <= 60; n++) {
      var d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + n);
      if ((feriadosComNomes(d.getFullYear()))[isoDe(d)]) continue;
      if (limite && d.getDate() >= limite) continue;
      var turnos = turnosDoDia(d.getDay());
      if (turnos.length) {
        var quando = DIAS[d.getDay()] + (n > 6 ? ' ' + dataBr(d) : '');
        return { aberto: false, texto: 'Fechado · abre ' + quando + ' às ' + hora(turnos[0].inicio) + sufixo };
      }
    }
    return aConfirmar;
  }

  /* ---------- checklist (localStorage opcional) ---------- */

  var CHAVE = 'ceuma.checklist';
  var emMemoria = {};

  function armazenamento() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) return localStorage;
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    } catch (e) { /* acesso bloqueado */ }
    return null;
  }

  function checklistEstado() {
    try {
      var st = armazenamento();
      if (!st) return copia(emMemoria);
      var bruto = st.getItem(CHAVE);
      if (!bruto) return {};
      var obj = JSON.parse(bruto);
      return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
    } catch (e) {
      return copia(emMemoria);
    }
  }

  function copia(o) {
    var r = {};
    Object.keys(o).forEach(function (k) { r[k] = o[k]; });
    return r;
  }

  function marcarChecklist(id, feito) {
    var estado = checklistEstado();
    if (feito) estado[id] = true; else delete estado[id];
    emMemoria = copia(estado); // reserva para quando o armazenamento falha
    try {
      var st = armazenamento();
      if (st) st.setItem(CHAVE, JSON.stringify(estado));
    } catch (e) { /* modo privado ou cota: segue só em memória */ }
    return estado;
  }

  function progressoChecklist() {
    var estado = checklistEstado();
    var itens = C.checklist || [];
    var feitos = itens.filter(function (it) { return estado[it.id] === true; }).length;
    var total = itens.length;
    return { feitos: feitos, total: total, pct: total ? Math.round((feitos / total) * 100) : 0 };
  }

  C.normalizar = normalizar;
  C.buscar = buscar;
  C.getSetor = getSetor;
  C.statusSetor = statusSetor;
  C.feriados = feriados;
  C.quintoDiaUtil = quintoDiaUtil;
  C.checklistEstado = checklistEstado;
  C.marcarChecklist = marcarChecklist;
  C.progressoChecklist = progressoChecklist;
})(CEUMA);

if (typeof module !== 'undefined') module.exports = CEUMA;
