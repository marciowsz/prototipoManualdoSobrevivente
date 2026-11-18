# Task 2 (FRONT) — Relatório

**Status:** DONE_WITH_CONCERNS (preocupações abaixo; nenhuma impede o uso)

**Arquivos criados:** `index.html`, `css/styles.css`, `js/app.js`. Não toquei em `js/data.js`, `js/logic.js` nem `tests/`. Nenhum stub ficou no projeto.

## Telas (roteamento por hash; rota desconhecida → `#/inicio`)
- `#/inicio`: hero "Primeira vez no CEUMA?", busca grande ("O que você precisa resolver?") com 6 sugestões rápidas (boleto, facial/catraca, perdi algo, histórico, ProUni/FIES, biblioteca), "Mais procurados" (6 serviços tirados de `CEUMA.buscar` + `CEUMA.servicos`), card "Minha 1ª semana" com progresso, "Mito do dia" (escolhido pelo dia do ano, com botão para revelar a verdade) e card que leva ao mapa.
- `#/buscar?q=`: os resultados mudam enquanto você digita (debounce de 150 ms) e o `?q=` é mantido via `history.replaceState`. Ao digitar na busca do início, o app vai para `#/buscar` e o foco continua no campo. Serviço: título, selo "Dá para fazer online", `comoFazer` numerado, `levar` em chips, `alerta` e link para o setor. Setor: card com link para a ficha. Glossário: termo + definição. Sem resultado: mensagem + Apoio ao Aluno + `#/setores`.
- `#/setores`: filtro por categoria (botões com `aria-pressed`, cada um na cor da categoria) + "Só os abertos agora", status de cada setor e mini-selo "a confirmar".
- `#/setor/:id`: categoria, status (`statusSetor(setor, new Date())`), selo "a confirmar" tocável (`aria-expanded` mostra a lista `aConfirmar`), destaque grande para "Onde fica" + ponto de referência, horário + aviso `fechaPresencialAPartirDoDia` (fica mais forte quando o dia atual já passou do limite), "O que levar" em chips, "Resolve aqui", "Não é aqui → Vá para X" (link para o outro setor), "Como chegar" (passos numerados + mini-mapa SVG recortado na rota + "Ver no mapa completo"), contatos clicáveis e dicas. Para id inexistente aparece "Setor não encontrado" com saídas.
- `#/mapa` (aceita `?rota=id`): SVG com viewBox `0 0 largura altura`, áreas como retângulos arredondados com rótulo, pontos tocáveis (ponto com 1 setor → link para a ficha; ponto com vários setores ou de referência → painel com os setores), seletor "Traçar rota da entrada até…", rota como polyline animada (stroke-dasharray), destino pulsando, legenda, aviso "Mapa ilustrativo — posições aproximadas" e a lista "Locais no mapa" (alternativa acessível com alvos ≥ 44 px).
- `#/semana`: checklist com `checklistEstado/marcarChecklist/progressoChecklist`, barra de progresso (`role=progressbar`), link para o setor de cada item e mensagem de comemoração quando chega a 100%.
- `#/regras`: Mitos × Verdades como cards que viram ao toque (botão com `aria-expanded`, animação de virar), calculadora do 5º dia útil (mês/ano, padrão = mês atual; data por extenso, "faltam N dias", dias pulados com motivo e mini-calendário que numera os dias úteis e destaca o vencimento) e glossário com filtro sem acento.
- `#/emergencia`: botões 192 SAMU / 193 Bombeiros (`tel:`), cards de `getSetor('pronto')` e `getSetor('seguranca')` (local, referência, horário, contatos, a confirmar, link para a ficha) e o bloco "Perdeu algo?" (Segurança → Achados).

Também: barra inferior fixa no mobile (Início, Setores, Mapa, 1ª semana, Regras) que vira menu no topo em ≥ 900 px; botão vermelho 🚑 flutuante sempre visível; rodapé com o texto pedido.

## Decisões
- `esc()` em todo texto vindo dos dados. `href` de contato só passa se for `tel:`, `mailto:` ou `http(s)://`. Se `href` vier nulo, o app deriva do `valor` (`tel:`, `wa.me/55…`, `mailto:`). Links externos abrem com `target=_blank rel=noopener`.
- Todas as chamadas à API passam por `call()` com try/catch e `arr()` para arrays. Setor de categoria `digital` (portal) não é preso a um ponto do mapa, para que a "Entrada principal" não vire link para o Portal.
- Rótulos no mapa usam o nome curto ("Pátio Principal · Apoio ao Aluno (4 telas de TV)" → "Pátio Principal"). O nome completo fica no `aria-label` e no painel. No mini-mapa só aparecem os rótulos dos pontos da rota, do destino e da entrada.
- Tokens de cor em `:root`, com modo escuro via `prefers-color-scheme`. Cor por categoria (`data-cat`). Fonte do sistema. `prefers-reduced-motion` desliga as animações.
- `.topo` sem `backdrop-filter`: ele prendia a `.nav` fixa ao cabeçalho no mobile (bug encontrado e corrigido no teste).
- A11y: link "Pular para o conteúdo", `aria-current="page"` na navegação, foco no `h1` a cada troca de rota, `aria-live` nos resultados, foco visível e `aria-label` no botão só com ícone.

## Como testei
- `node --check js/app.js` OK.
- Com os arquivos reais de data.js e logic.js, servidos por `python -m http.server` (só durante o teste), no painel do navegador:
  - Todas as rotas em 375 px, 320 px e 1280 px: `scrollWidth == innerWidth` em 320 px em todas as telas.
  - Foco no h1 a cada troca de rota, título da aba e rota desconhecida → início.
  - Busca digitada no início (vai para `#/buscar?q=matricula` com o foco mantido).
  - "MATRÍCULA" e sem resultado ("xyzqwe"), filtros de setores, painel de ponto do mapa e flip de mito.
  - Calculadora: abril/2026 → quarta, 8 de abril (Sexta-feira Santa pulada); nov/2026 → segunda, 9 de novembro.
  - Filtro do glossário e checklist, inclusive com `localStorage` lançando erro (não quebra).
  - Modo claro e escuro. Console sem erros.
- Robustez: com `setores/servicos/mitos/glossario/checklist` vazios **e** `undefined` e `mapa` vazio/undefined, todas as rotas renderizaram sem erro.
- `file://`: Edge headless (`--dump-dom`) renderizou `#/setor/matricula`, `#/mapa`, `#/regras`, `#/semana`, `#/emergencia` e a busca. Uma busca por `<img onerror>` saiu escapada.

## Dúvidas / preocupações
1. **Mapa x locais "a confirmar":** em data.js, coordenacao, nadd, seguranca, pronto e estagio têm `pontoMapa: 'apoioPatio'`. O mapa mostra então "Setores aqui: Coordenação, NADD, Segurança, Pronto Atendimento, Estágio" no Pátio, embora o local deles não esteja confirmado. Sugestão para a lógica/controlador: usar um ponto próprio, ou o front marcar esses casos como "pergunte aqui". Hoje o selo "a confirmar" só aparece na ficha.
2. `node --test tests/` estava falhando quando olhei. A lógica estava sendo escrita em paralelo, então isso não é do front, mas vale conferir na Task 3.
3. No mapa completo em celular os rótulos ficam pequenos (o mapa de 1000 px é reduzido para ~340 px). A lista "Locais no mapa" e a pinça para zoom compensam, mas um mapa com zoom/arrasto seria melhor numa próxima versão.
4. O selo "a confirmar" dos setores lista os itens de `aConfirmar`. Serviços, mitos e checklist não têm esse campo no contrato, então não mostram selo.
