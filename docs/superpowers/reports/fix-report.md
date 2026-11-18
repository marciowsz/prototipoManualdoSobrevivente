# Relatório de correções (a partir de final-review.md)

Verificação: `node --test` 16/16 passando (5 testes novos, escritos antes da implementação e vistos falhando); `node --check js/app.js` sem erro. Não testado no navegador.

## Importante
- **I-1 corrigido.** Renovação ProUni (livro) e baixa parcial do FIES agora vão para a CAA (novos serviços `prouni-renovacao` e `fies-financeiro`). `prouni` e `fies` ficaram só com inscrição e dúvidas iniciais (Matrícula). CAA, Matrícula (resolve, naoResolve, dicas), mito m10 e glossário ProUni/FIES ajustados.
- **I-2 corrigido.** Cobrafix: `setorId: null`, passo "fale diretamente com a Cobrafix (contato a confirmar); não vá à CAA". Glossário sem `setorId`. Teste de integridade passou a aceitar `setorId` nulo em serviços (o app já tratava).
- **I-3 corrigido.** Divergência "8 a 9:30" agora aponta para segunda a sexta (`aConfirmar`, `horarioTexto`) e em `fatos-chave.md`.
- **I-4 corrigido.** "Nada consta" = certidão de débitos com a instituição, emitida na Biblioteca, procedimento a confirmar (glossário, serviço, resolve, aConfirmar). Título do serviço agora "Nada consta".
- **I-5 corrigido.** Novo serviço `senha-portal` (Matrícula, conforme matriz da Coordenação). `'senha'` da CAA virou `'senha de atendimento'`. Buscas "senha do portal" e "esqueci minha senha" retornam Matrícula primeiro (testado).
- **I-6 corrigido (com TDD).** `statusSetor` detecta feriados ("Feriado · confira o funcionamento"; portal exceto) e o próximo dia aberto pula feriados.
- **I-7 corrigido (com TDD).** Próximo dia aberto avança a data real e pula dias >= 15 na Matrícula (sáb 14/11 21h: "abre ter 01/12 às 8h"). Texto: "Presencial encerrado a partir do dia 15 · volta dia 1º · use e-mail/WhatsApp".
- **I-8 corrigido (com TDD).** Setores sem horário: `aberto: null`, "Horário a confirmar". `app.js`: selo neutro `status--confirmar` (CSS novo), o filtro "só abertos" só esconde `aberto === false`, Emergência não mostra mais "fechado".
- **I-9 corrigido (com TDD).** Bônus +20 ao setor quando a busca é só o nome dele; `buscar('onde fica a biblioteca')[0]` é o setor biblioteca.

## Menor
- M-1 corrigido. M-2 corrigido (serviço `carteira-estudantil` → Portal, taxa a confirmar; `carteirinha` saiu do crachá). M-3 corrigido (valores removidos, "valores a confirmar na CAA"; também em `fatos-chave.md`). M-4 corrigido (ementas via requerimento no Portal).
- M-5 parcialmente corrigido: RA virou "sugestão: leve por garantia" nos serviços (exceto facial e objeto perdido, definidos em fonte); removidos RA da CAA, dados de ingresso da Matrícula, "Matrícula ativa" do Estágio, "Documentos de ingresso" e o passo inventado do Estágio. Mantive "Matrícula ativa" na Coordenação (consta em `fatos-chave.md` como da fonte) e "Documentos pessoais" no Kit Formando (não apontado).
- M-6 corrigido. M-7 corrigido. M-8 corrigido (serviço e glossário descrevem retenção). M-9 corrigido (sem trancar/trancamento; definição e Prova de Reingresso). M-10 corrigido. M-11 corrigido (também em `fatos-chave.md`). M-12 corrigido (rótulos de fonte trocados).
- M-13 corrigido: nota "números nacionais" na tela Emergência.
- M-14 corrigido (texto da calculadora). Lista de feriados não alterada.
- M-15 corrigido: `portal` saiu de `mapa.rotas` (some do seletor e do mini-mapa); teste de integridade ajustado.
- M-16 corrigido: `diasAConfirmar` em Achados, e `statusSetor` acrescenta "(dias a confirmar)".
- M-17 corrigido: prefixo exige 4+ letras, "wifi/internet/computador" na biblioteca, frase do bônus montada da busca original ("imposto de renda").

## Sem corrigir / observações
- Nada do "Importante" ficou sem corrigir.
- Observação do revisor sobre foco do teclado no iOS (busca inicial): não verificada, sem aparelho.
- Inconsistência notada, fora da lista: `pronto_atendimento.txt` diz que alunos geralmente acham o local com facilidade, enquanto data.js diz que novatos têm dificuldade. Não alterei.
- A atribuição "carteira estudantil → Portal" e "aditamento → CAA" segue o revisor e o texto embaralhado da fonte; ambas com ressalva de confirmação no texto.
