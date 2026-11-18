# Task 1 (LÓGICA) - relatório

Status: DONE_WITH_CONCERNS

## Entregues
- js/data.js: 11 setores, 41 serviços, 10 mitos, 25 termos de glossário, 10 itens de checklist, mapa (12 pontos, 5 áreas, rotas para os 11 setores), feriadosFixos.
- js/logic.js: normalizar, buscar, getSetor, statusSetor, feriados, quintoDiaUtil, checklistEstado, marcarChecklist, progressoChecklist. Final: module.exports.
- tests/logic.test.js: 11 testes (node:test) carregando data.js + logic.js via vm com window={} e localStorage falso.

## Testes
`node --test`: 11 pass, 0 fail. Datas: 2026-04-08, 2026-11-09, 2026-02-06 OK.

## Decisões
- Campos extras: `setor.palavras` (sinônimos de busca no nível do setor), `setor.fechaPresencialAPartirDoDia` (só matricula), `glossario[].setorId` (opcional, pode ser null), `naoResolve[].setorId` pode ser null (Cobrafix, pós-graduação).
- Busca: peso título do serviço 10, palavras do serviço 8, nome/apelido do setor 12, palavras do setor 4, termo do glossário 6; prefixo (3+ letras) vale 0,6; bônus de frase; stopwords ignoradas (incl. 'fica'). Glossário retorna id = termo normalizado.
- statusSetor: portal = 'Online 24h'; horarios [] = 'Horário a confirmar'; dia >= 15 na matrícula = texto exato pedido. Próxima abertura usa sempre o nome do dia ('Fechado · abre seg às 8h'), nunca 'amanhã'. Feriados NÃO fecham setores (fontes não dizem nada).
- Checklist: localStorage resolvido a cada chamada (try/catch); JSON corrompido -> {}. Se o armazenamento falha, há reserva em memória na sessão (checklistEstado devolve o estado em memória nesse caso, em vez de {}), para a UI continuar funcionando no modo privado.
- Mapa: ilustrativo. Setores sem local (coordenacao, nadd, seguranca, pronto, estagio) usam pontoMapa 'apoioPatio' + rota "Pergunte no Apoio ao Aluno (4 telas de TV)" + aConfirmar de local. Portal usa pontoMapa 'entrada' e rota de 2 passos curta (digital).
- Links derivados de números das fontes: wa.me/556140425125 e wa.me/5598991781978 (formato padrão do WhatsApp) e tel:40207525. Nenhum número/e-mail/URL novo.

## Preocupações
- `node --test tests/` (com barra) falha no Node 24 ("Cannot find module .../tests"): argumentos são globs. Use `node --test` ou `node --test tests/*.test.js`. A falha inicial "red" foi verificada também depois, com `node --test`, via erros reais.
- Objetos criados dentro do vm têm protótipos de outro realm: `assert.deepStrictEqual(C.buscar(''), [])` falha; os testes comparam via cópia JSON (helper `plain`). Quem escrever mais testes precisa saber disso.
- Valores de taxas (R$ 15/20) aparecem só como "a confirmar" em alertas de serviço e em portal.aConfirmar.
- Ordem de scripts no HTML: data.js antes de logic.js.
