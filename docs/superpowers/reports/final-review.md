# Revisão final: Guia do Calouro CEUMA

Data: 2026-11-18. Escopo: `js/data.js` comparado com `docs/fontes/*.txt`, e bugs de lógica e interface em `js/logic.js` e `js/app.js`.
Nenhum arquivo do projeto foi editado. `node --test`: 11/11 passando. As buscas, o 5º dia útil e o status foram testados com um script à parte, carregando `data.js` e `logic.js` em `vm`, do mesmo jeito que os testes fazem.

**Contagem:** Crítico 0 · Importante 9 · Menor 17

Os telefones, e-mails, links e WhatsApps conferem com as fontes: CAA 4020-7525, (61) 4042-5125 e Calendly; Central de Matrícula matricula.vestibular@ceuma.br e (98) 99178-1978. Os horários de CAA, Apoio, Achados e Matrícula e os prazos (10/50 dias, 1 ano, ≥7 dias, >5 reprovações, 80h/160h, dia 15) também conferem. Os problemas estão em **encaminhamentos** e em dados **incertos exibidos como certos**.

---

## 1. Fidelidade dos dados

### I-1 · Importante: renovação ProUni (livro) e baixa parcial do FIES mandadas para a Central de Matrícula, mas são da CAA
- **Onde:** `js/data.js:34` (CAA "não resolve" ProUni/FIES), `:73` (Matrícula resolve "Assinatura semestral do ProUni (livro físico)"), `:451-457` (serviço `prouni`: "Assine o livro… na Central de Matrícula"), `:459-465` (serviço `fies` com palavra "baixa parcial" → Matrícula), `:796` (mito m10), `:813-814` (glossário).
- **O que a fonte diz:**
  - `Relatorio_Consolidado_Ceuma.txt` (mapeamento **da Central de Atendimento**) diz: "A Central de Atendimento do Renascença centraliza as renovações de bolsa ProUni", com a assinatura em livro físico por curso, e que a "baixa parcial" do FIES obriga "o assistente da Central" a recalcular.
  - `Áudio de GB.txt` é a entrevista na CAA e descreve o livro e a baixa parcial ali.
  - `Coordenação de Curso__Equipe_M25.txt`, na matriz de encaminhamento, manda "Boletos, taxas…, FIES e ProUni → Central de Atendimento ao Aluno (CAA)".
  - Já `Central de Matrícula-atualizado.txt` só fala do atendimento PROUNI/FIES em sala anexa, no ingresso.
- **Correção:** dividir. Inscrição e dúvidas iniciais de ProUni/FIES (sala anexa) ficam na **Central de Matrícula**. A **renovação semestral do ProUni (livro)** e as questões financeiras do FIES (aditamento e baixa parcial) vão para a **CAA**. Remover "ProUni, FIES" do `naoResolve` da CAA. Ajustar o serviço `prouni` (ou criar `prouni-renovacao` com `setorId: 'caa'`), as palavras do `fies`, o mito m10 e o glossário.

### I-2 · Importante: o serviço Cobrafix manda o aluno à CAA, que é exatamente a ida inútil que a fonte descreve
- **Onde:** `js/data.js:427-432` (`setorId: 'caa'`, "Peça orientação na CAA sobre como falar com eles") e `:816` (glossário Cobrafix → `caa`).
- **Fonte:** `Relatorio_Consolidado_Ceuma.txt` §6 diz que o setor "não realiza negociações de parcelas antigas", que a cobrança é "integralmente terceirizada para a empresa Cobrafix" e que alunos "perdem tempo comparecendo à Central". O contato da Cobrafix não aparece em nenhuma fonte.
- **Correção:** `setorId: null` (ou `portal`, para abrir chamado). Trocar o passo por "Fale diretamente com a Cobrafix (contato a confirmar); não vá à CAA para isso". Tirar o `setorId: 'caa'` do glossário.

### I-3 · Importante: horário da biblioteca durante a semana exibido como certo, e o "a confirmar" aponta para o dia errado
- **Onde:** `js/data.js:208, 211` (seg–sex 8h–21h30 como certo) e `:232` ("Horário de sábado (há uma anotação divergente "8 a 9:30")").
- **Fonte:** `Relatorio_entrevista_biblioteca.txt` §3: "as anotações também mencionam '8 a 9:30, **segunda a sexta**', enquanto o documento informa atendimento de 8h a 21h30 durante a semana". A síntese repete que falta validar "o horário correto de segunda a sexta". O sábado não tem divergência. O erro já vem de `docs/fatos-chave.md:11`.
- **Correção:** `aConfirmar: ['Horário de segunda a sexta (há uma anotação divergente "8 a 9:30, segunda a sexta")', …]`. Acrescentar uma nota no `horarioTexto`. Corrigir também o `fatos-chave.md`.

### I-4 · Importante: o glossário e o serviço tratam "nada consta" como algo só da biblioteca
- **Onde:** `js/data.js:807` ("Declaração de que você não tem pendências com a biblioteca") e `:683` ("Nada consta da biblioteca").
- **Fonte:** `Relatorio_entrevista_biblioteca.txt` §1 o descreve como "uma certidão relacionada a débitos **com a instituição**", emitida pela biblioteca. O procedimento exato não foi detalhado (§9).
- **Correção:** definir como "Certidão sobre débitos com a instituição, emitida no balcão da Biblioteca (procedimento a confirmar)" e mudar o título do serviço para "Nada consta".

### I-5 · Importante: senha do portal e atualização cadastral sem encaminhamento, e a busca cai em CAA ou Biblioteca
- **Onde:** não existe serviço para isso. `js/data.js:15` (CAA tem a palavra `'senha'`, no sentido de senha da fila) e `:580` (`primeiro-acesso` com `senha`/`login` → Coordenação). Resultado testado: "senha do portal" retorna primeiro-acesso, senha-biblioteca, portal e CAA. "esqueci minha senha" retorna senha-biblioteca, **objeto-perdido** (pela palavra "esqueci") e CAA.
- **Fonte:** `Coordenação de Curso__Equipe_M25.txt`, matriz §6: "Atualização cadastral, troca de e-mail/telefone e senhas do portal → **Central de Matrícula**". O mesmo relatório cita redefinição de senha como demanda alheia que sobrecarrega a coordenação.
- **Correção:** criar o serviço `senha-portal` / `atualizacao-cadastral` com `setorId: 'matricula'` e palavras `senha portal`, `esqueci senha`, `email`, `telefone`, `cadastro`. Trocar `'senha'` por `'senha de atendimento'` nas palavras da CAA.

### M-1 · Menor: horário da Central de Matrícula rotulado como "canais remotos"
- **Onde:** `js/data.js:65`.
- **Fonte:** `Central de Matrícula-atualizado.txt` §4. A tabela tem as colunas "Atendimento Presencial | E-mail | WhatsApp | Restrição", e "Segunda a Sexta-feira, das 08h às 20h" está na coluna presencial. O próprio `statusSetor` usa esse horário como presencial.
- **Correção:** "Seg a sex, 8h às 20h (presencial até o dia 14). E-mail e WhatsApp nos demais dias".

### M-2 · Menor: "carteirinha" mandada para o crachá da Central de Matrícula
- **Onde:** `js/data.js:468`.
- **Fonte:** `Central de atendimento Ceuma.txt` §3 lista "Emissão de 2ª via da Carteira Estudantil" entre os serviços **migrados para o Portal**.
- **Correção:** tirar `carteirinha` do `cracha` e criar o serviço "2ª via da carteira estudantil" → `portal`, com valor a confirmar.

### M-3 · Menor: valores de taxas presos a documentos sem base clara
- **Onde:** `js/data.js:504` (Histórico R$ 15,00), `:520` (quitação anual com "Declarações financeiras R$ 20,00") e `:536` (Ementas R$ 20,00).
- **Fonte:** em `Central de atendimento Ceuma.txt` a tabela está embaralhada ("1R5$,00 R20$,00 R48$,00 8R9$,00 2R0$0,00…") e lista mais serviços que valores, então não dá para ligar cada valor a um serviço. Já `Relatorio_Consolidado_Ceuma.txt` diz que histórico e quitação saem "para download imediato" na aba Relatórios, sem citar taxa. Os valores R$ 89,00, R$ 200,00 e "3R4$3,00" (R$ 343,00?) foram ignorados, e `fatos-chave.md:17` atribui R$ 0,00 ao Registro de Diploma 2ª via sem base.
- **Correção:** tirar os valores dos alertas dos serviços da aba Relatórios, ou trocar por "pode haver taxa para a via oficial; valores a confirmar na CAA".

### M-4 · Menor: "Ementas" mandadas para a aba Relatórios
- **Onde:** `js/data.js:534`.
- **Fonte:** nenhuma fonte diz que as ementas ficam em Relatórios. Elas só aparecem na tabela de serviços do Portal (`Central de atendimento Ceuma.txt`).
- **Correção:** "Solicite pelo Portal (requerimento)".

### M-5 · Menor: requisitos e itens para levar inventados
- **Onde:**
  - `js/data.js:23`: RA como requisito da CAA.
  - `:67`: "RA ou dados de ingresso" na Matrícula.
  - `:345`: "Matrícula ativa" no Estágio.
  - `:447`: "Documentos de ingresso".
  - `:734`: "Apresente os dados da empresa e do curso".
  - `levar: ['RA']` na maioria dos serviços da CAA, Coordenação e Estágio.
- **Fonte:** só o Apoio ao Aluno (`Relatorioentrevistaapoioaoaluno.txt`), os Achados (`guia_achados…txt`: nome, RA e CPF) e a Biblioteca (documento com foto) definem requisitos.
- **Correção:** remover, ou marcar como sugestão ("leve o RA por garantia").

### M-6 · Menor: "Negociar parcela corrente ou **atrasada recente**"
- **Onde:** `js/data.js:419`.
- **Fonte:** `Central de atendimento Ceuma.txt` e o `Áudio de GB.txt` falam de negociação de parcela na CAA. O Consolidado tira apenas as "parcelas antigas em atraso". Nenhuma fonte define o limite entre "recente" e "antiga".
- **Correção:** "Negociar parcelas (as antigas em atraso são com a Cobrafix; o limite é confirmado na CAA)".

### M-7 · Menor: colação de grau misturada com a regra da ata de prova
- **Onde:** `js/data.js:614` ("Confirme que está matriculado… e sem erro de enturmação") e a palavra `'ata'` em `:612`.
- **Fonte:** a regra de matrícula e enturmação vale para a **ata de prova** (`Relatorio_Consolidado_Ceuma.txt` §5). Para a colação, `Coordenação…M25.txt` §5.2 exige a **entrega completa e digitalizada do Kit Formando**.
- **Correção:** "Entregue o Kit Formando completo no Portal; a coordenação orienta sobre a colação".

### M-8 · Menor: regime especial apresentado como algo que o aluno pede
- **Onde:** `js/data.js:646-648` e `:820`.
- **Fonte:** `Coordenação…M25.txt` §5.3 diz que o aluno reprovado em mais de 5 disciplinas "permanece retido no semestre ('período fatorial')… até… reduzir suas pendências".
- **Correção:** explicar que é uma retenção: "Com mais de 5 reprovações você fica retido no semestre até reduzir as pendências".

### M-9 · Menor: reingresso definido de forma imprecisa, e "trancar" leva a ele
- **Onde:** `js/data.js:818` ("depois de um afastamento") e as palavras `trancamento`/`trancar` em `:628`.
- **Fonte:** `Coordenação…M25.txt` §5.3 fala de "estudantes em situação de abandono (sem rematrícula no semestre anterior)" e de uma "Prova de Reingresso". Trancamento não aparece em nenhuma fonte.
- **Correção:** ajustar a definição, citar a prova de reingresso e remover `trancar`/`trancamento`.

### M-10 · Menor: "segunda chamada" ligada à retirada de prova na CAA
- **Onde:** `js/data.js:556`.
- **Fonte:** nenhuma. A CAA só entrega e retira provas (`Central de atendimento Ceuma.txt` §2).
- **Correção:** remover a palavra.

### M-11 · Menor: Pronto Atendimento faz "combate a incêndio"
- **Onde:** `js/data.js:305, 318`.
- **Fonte:** `pronto_atendimento.txt` §2 fala em "Proteção e prevenção contra incêndio".
- **Correção:** usar "Proteção e prevenção contra incêndio".

### M-12 · Menor: fonte errada em mitos
- **Onde:** `js/data.js:777` (m6, "Central de Matrícula") e `:797` (m10, "Relatório Consolidado").
- **Fonte:** a matrícula online desde 2021 vem de `Relatorio_Consolidado_Ceuma.txt` §4 e do `Áudio de GB.txt`. A confusão CAA × Matrícula vem de `Central de Matrícula-atualizado.txt` §3.
- **Correção:** trocar os rótulos de `fonte` entre os dois mitos.

### M-13 · Menor: SAMU 192 e Bombeiros 193 não estão nas fontes
- **Onde:** `js/app.js:694-695` e o aria-label em `index.html:38`.
- **Fonte:** nenhuma. São números públicos nacionais e estão corretos.
- **Correção:** opcional. Manter, com a nota "números nacionais" para deixar claro que não vêm das entrevistas.

---

## 2. Bugs de lógica e interface

### I-6 · Importante: o status "Aberto agora" ignora feriados
- **Onde:** `js/logic.js:166-204`.
- **Teste:** `statusSetor(caa, 20/11/2026 10h)` retorna `Aberto agora · fecha às 17h`, mas 20/11 (Consciência Negra) está em `feriadosFixos`. Isso acontece daqui a 2 dias. O mesmo ocorre em Carnaval, Sexta-feira Santa etc., em todos os setores com horário.
- **Correção:** em `statusSetor`, testar se `isoDe(agora)` está em `feriadosComNomes(ano)` e devolver `{ aberto:false, texto:'Feriado · confira o funcionamento' }`. A busca do "próximo dia aberto" também deve pular feriados.

### I-7 · Importante: Central de Matrícula anuncia "abre seg às 8h" para um dia em que o presencial já encerrou
- **Onde:** `js/logic.js:172-174, 195-201`.
- **Teste:** sábado 14/11/2026 às 21h retorna `Fechado · abre seg às 8h`, mas segunda é dia 16, sem presencial. Do dia 15 em diante, o texto diz "encerrado **após** o dia 15", enquanto a fonte diz "a partir do dia 15", com o dia 15 incluído.
- **Correção:**
  - Ao calcular o próximo dia aberto, avançar a data de verdade (e não só o dia da semana) e pular os dias ≥ `fechaPresencialAPartirDoDia`, o que leva ao dia 1º do mês seguinte.
  - Trocar o texto por "Presencial encerrado a partir do dia 15 · volta dia 1º · use e-mail/WhatsApp".

### I-8 · Importante: setores sem horário aparecem como "fechados" e somem do filtro "Só os abertos"
- **Onde:** `js/app.js:95` (`aberto:false` usa sempre `status--fechado`) e `:428`.
- **Efeito:** Pronto Atendimento, Segurança, Coordenação, NADD e Estágio ganham a pílula de "fechado", inclusive na tela **Emergência** (`app.js:684`). Com "Só os abertos agora" marcado, o Pronto Atendimento some.
- **Correção:** fazer `statusSetor` devolver um estado `desconhecido` (por exemplo `aberto:null`), com uma classe neutra (`status--confirmar`). No filtro, manter os setores de status desconhecido ou avisar que foram ocultados.

### I-9 · Importante: busca por "onde fica a biblioteca" coloca a ficha do setor só em 3º lugar
- **Onde:** `js/logic.js:72-80` (título de serviço com peso 10 + palavras com peso 8, contra nome de setor com peso 12).
- **Teste:** os resultados vêm na ordem `senha-biblioteca`, `nada-consta`, `biblioteca`. O mesmo acontece com "achados e perdidos" (a ficha do setor vem antes, mas o serviço fica em 2º).
- **Correção:** dar um bônus quando um token casa exatamente com o `apelido`/`nome` do setor (por exemplo, `+20`), ou quando a busca contém "onde".

### M-14 · Menor: a calculadora diz considerar "feriados nacionais", mas a lista não confere
- **Onde:** `js/app.js:603`, `js/logic.js:123` e `js/data.js:5`.
- **Detalhe:** Carnaval e Corpus Christi são pontos facultativos, não feriados nacionais, mas o código os pula. Já os feriados de São Luís/MA não são considerados. Exemplo: em set/2026 o resultado é 08/09, aniversário de São Luís, que é feriado municipal. Se o banco ou a instituição seguir o calendário local, o vencimento real é 09/09. As fontes não definem o calendário.
- **Correção:** trocar o texto por "Fins de semana, feriados nacionais e Carnaval/Corpus Christi não contam; feriados locais podem mudar a data (a confirmar)".

### M-15 · Menor: o Portal (digital) aparece no seletor de rotas e ganha um mini-mapa
- **Onde:** `js/data.js:904-908` (rota de 5px) e `js/app.js:508, 531`.
- **Correção:** retirar `portal` de `CEUMA.mapa.rotas`, ou filtrar `categoria === 'digital'` no `comRota` e no mini-mapa.

### M-16 · Menor: Achados mostra "Fechado · abre seg às 7h" no fim de semana como fato
- **Onde:** `js/data.js:247-251` e `js/logic.js:195-201`.
- **Fonte:** `guia_achados_e_perdidos_ceuma_atualizado.txt` dá o horário, mas não os dias da semana.
- **Correção:** só usar o status calculado em dias confirmados, ou acrescentar "(dias a confirmar)" no texto.

### M-17 · Menor: casamento por prefixo gera resultados estranhos
- **Onde:** `js/logic.js:42`.
- **Teste:** "ava" também retorna o serviço `prova`, porque o prefixo casa com `avaliacao`. "wifi" não retorna nada, embora a dica da biblioteca cite Wi-Fi (`data.js:230`). O bônus de frase (`:60-63`) junta os tokens já sem stopwords ("imposto renda"), então nunca casa com "imposto de renda".
- **Correção:** exigir pelo menos 4 letras para o prefixo, ou dar peso menor; incluir `wifi`/`internet` nas palavras da biblioteca; montar a frase do bônus a partir de `normalizar(query)`.

### Observações sem achado
- **XSS:** todo texto que vem do usuário (busca, filtro do glossário, hash) passa por `esc()` antes de ir para o `innerHTML`. O parâmetro `rota` é validado contra `rotas`. Não encontrei injeção.
- **Checklist:** persiste e recupera corretamente, com fallback em memória quando o `localStorage` falha. Os testes cobrem isso.
- **Busca na tela inicial:** o 1º caractere muda o hash e recria o input (`app.js:803`). Em iOS, o `focus()` disparado fora de um gesto do usuário pode fechar o teclado após a 1ª letra. Não testei; vale conferir no aparelho.
