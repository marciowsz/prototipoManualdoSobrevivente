/* Guia do Calouro CEUMA - dados (campus Renascença).
   Fonte: docs/fontes/*.txt. O que não foi confirmado está em `aConfirmar`. */
var CEUMA = (typeof window !== 'undefined' ? (window.CEUMA = window.CEUMA || {}) : {});

CEUMA.feriadosFixos = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '11-20', '12-25'];

CEUMA.setores = [
  {
    id: 'caa',
    nome: 'Central de Atendimento ao Aluno (CAA)',
    apelido: 'CAA',
    categoria: 'atendimento',
    icone: '🏛️',
    resumo: 'Boleto, prova, protocolo e orientação financeira da graduação.',
    palavras: ['atendimento', 'financeiro', 'senha de atendimento', 'balcao'],
    local: {
      descricao: 'Ao lado da Central de Matrícula, em frente à escadaria perto da rampa principal.',
      referencia: 'Praça da Gratidão',
      pontoMapa: 'caa'
    },
    horarios: [{ dias: [1, 2, 3, 4, 5], inicio: '08:00', fim: '17:00' }],
    horarioTexto: 'Seg a sex, 8h às 17h; sábados específicos 8h às 13h, só com agendamento',
    requisitos: ['Atendimento por senha ou agendamento'],
    resolve: [
      'Abertura de protocolos',
      'Entrega e retirada de provas (inclusive de semestres anteriores; pode demorar)',
      'Boletos, taxas e negociação de parcelas correntes',
      'Transferência de bolsa',
      'Alteração do responsável financeiro',
      'Orientação acadêmica e financeira da graduação',
      'Renovação semestral do ProUni (assinatura do livro físico por curso)',
      'Baixa parcial e questões financeiras do FIES'
    ],
    naoResolve: [
      { oque: 'Matrícula e rematrícula (é online)', setorId: 'portal' },
      { oque: 'Crachá e inscrição/dúvidas iniciais de ProUni e FIES (ingresso)', setorId: 'matricula' },
      { oque: 'Parcelas antigas em atraso (cobrança terceirizada pela Cobrafix)', setorId: null },
      { oque: 'Pós-graduação', setorId: null }
    ],
    contatos: [
      { tipo: 'telefone', valor: '4020-7525', href: 'tel:40207525' },
      { tipo: 'whatsapp', valor: '(61) 4042-5125', href: 'https://wa.me/556140425125' },
      { tipo: 'link', valor: 'Agendar atendimento (Calendly)', href: 'https://calendly.com/central-renascenca/atendimentodiversos' },
      { tipo: 'presencial', valor: 'Praça da Gratidão, ao lado da Central de Matrícula', href: null }
    ],
    dicas: [
      'Cerca de 80% do atendimento é financeiro, e todos os atendentes são assistentes financeiros.',
      'No balcão "Posso Ajudar?" é comum confundir CAA e Central de Matrícula: boleto, prova e protocolo é aqui.',
      'Pode agendar pelo Calendly para evitar fila.'
    ],
    aConfirmar: []
  },
  {
    id: 'matricula',
    nome: 'Central de Matrícula',
    apelido: 'Matrícula',
    categoria: 'atendimento',
    icone: '📝',
    resumo: 'Vínculo de ingressantes, ProUni, FIES e crachá institucional.',
    palavras: ['ingressante', 'vinculo', 'contrato', 'bolsa', 'atualizacao cadastral'],
    local: {
      descricao: 'Na Praça da Gratidão, ao lado imediato da CAA. Recepção frontal e sala anexa do ProUni/FIES.',
      referencia: 'Praça da Gratidão (área aberta com estátuas institucionais)',
      pontoMapa: 'matricula'
    },
    horarios: [{ dias: [1, 2, 3, 4, 5], inicio: '08:00', fim: '20:00' }],
    horarioTexto: 'Seg a sex, 8h às 20h (presencial até o dia 14). E-mail e WhatsApp nos demais dias',
    fechaPresencialAPartirDoDia: 15,
    requisitos: [],
    resolve: [
      'Vínculo e matrícula de ingressantes',
      'Inscrição e dúvidas iniciais de ProUni e FIES (sala anexa)',
      'Crachá institucional (aulas, laboratórios e estágios)',
      'Dúvidas sobre valores, contrato e matriz inicial',
      'Atualização cadastral, troca de e-mail/telefone e senhas do portal'
    ],
    naoResolve: [
      { oque: 'Boleto, prova e protocolo', setorId: 'caa' },
      { oque: 'Renovação semestral do ProUni (livro) e baixa parcial do FIES', setorId: 'caa' },
      { oque: 'Rematrícula (é online, pelo Portal)', setorId: 'portal' }
    ],
    contatos: [
      { tipo: 'email', valor: 'matricula.vestibular@ceuma.br', href: 'mailto:matricula.vestibular@ceuma.br' },
      { tipo: 'whatsapp', valor: '(98) 99178-1978', href: 'https://wa.me/5598991781978' },
      { tipo: 'presencial', valor: 'Praça da Gratidão, ao lado da CAA', href: null }
    ],
    dicas: [
      'A partir do dia 15 o balcão não atende presencialmente: use e-mail ou WhatsApp.',
      'Inscrição de ProUni/FIES ou crachá? É aqui. Boleto, prova, protocolo, renovação do ProUni ou FIES financeiro? Vá na CAA, ao lado.'
    ],
    aConfirmar: []
  },
  {
    id: 'apoio',
    nome: 'Apoio ao Aluno',
    apelido: 'Apoio',
    categoria: 'apoio',
    icone: '🙋',
    resumo: 'Cadastro do reconhecimento facial das catracas e orientação de localização.',
    palavras: ['catraca', 'facial', 'orientacao', 'entrada'],
    local: {
      descricao: 'No Pátio Principal, junto à estrutura com 4 telas de TV (outdoor digital).',
      referencia: 'Pátio Principal (4 telas de TV)',
      pontoMapa: 'apoioPatio'
    },
    horarios: [{ dias: [1, 2, 3, 4, 5], inicio: '08:00', fim: '19:00' }],
    horarioTexto: 'Seg a sex, 8h às 19h. Só presencial, por ordem de chegada',
    requisitos: ['Número do RA (indispensável)'],
    resolve: [
      'Cadastro de reconhecimento facial para as catracas',
      'Orientação de localização no campus',
      'Dúvidas básicas'
    ],
    naoResolve: [
      { oque: 'Matrícula, rematrícula e contrato', setorId: 'matricula' }
    ],
    contatos: [
      { tipo: 'presencial', valor: 'Pátio Principal, perto das 4 telas de TV', href: null }
    ],
    dicas: [
      'Decore o seu RA antes de ir: sem ele o cadastro não anda.',
      'Está perdido? Esta é a melhor parada para pedir direção.'
    ],
    aConfirmar: []
  },
  {
    id: 'coordenacao',
    nome: 'Secretaria da Coordenação de Curso',
    apelido: 'Coordenação',
    categoria: 'academico',
    icone: '🎓',
    resumo: 'Demandas acadêmicas: AVA, TCC, atividades complementares, colação e regimes especiais.',
    palavras: ['coordenador', 'curso', 'ava', 'tcc', 'reingresso', 'colacao', 'disciplina'],
    local: {
      descricao: 'Local ainda não confirmado. Pergunte no Apoio ao Aluno (4 telas de TV).',
      referencia: 'Pátio Principal (4 telas de TV)',
      pontoMapa: 'apoioPatio'
    },
    horarios: [],
    horarioTexto: 'Horário a confirmar',
    requisitos: ['Matrícula ativa', 'Demanda acadêmica'],
    resolve: [
      'Orientação de primeiro acesso ao Portal e diferença entre AVA Presencial, Semipresencial e EAD',
      'Problemas de acesso ou disciplina ausente no AVA (junto ao Suporte de TI)',
      'TCC (ficha de inscrição)',
      'Atividades complementares',
      'Colação de grau e Kit Formando',
      'Reingresso',
      'Regime domiciliar',
      'Regime especial'
    ],
    naoResolve: [
      { oque: 'Prova e financeiro', setorId: 'caa' },
      { oque: 'Ingressantes e ProUni/FIES', setorId: 'matricula' },
      { oque: 'Estágio', setorId: 'estagio' }
    ],
    contatos: [
      { tipo: 'presencial', valor: 'Pergunte no Apoio ao Aluno (4 telas de TV)', href: null }
    ],
    dicas: [
      'Coordenadores não têm acesso a valores financeiros.',
      'No reingresso, preencha com cuidado o período de retorno.',
      'Não entregue documentos de estágio aqui: eles vão para o Setor de Estágio.'
    ],
    aConfirmar: ['Local da secretaria', 'Horário de atendimento', 'Contato']
  },
  {
    id: 'nadd',
    nome: 'NADD (Núcleo de Apoio ao Docente e ao Discente)',
    apelido: 'NADD',
    categoria: 'apoio',
    icone: '📚',
    resumo: 'Apoio pedagógico, nivelamento e orientação de estudo.',
    palavras: ['nivelamento', 'portugues', 'matematica', 'reforco', 'estudo', 'pedagogico'],
    local: {
      descricao: 'Local ainda não confirmado. Pergunte no Apoio ao Aluno (4 telas de TV).',
      referencia: 'Pátio Principal (4 telas de TV)',
      pontoMapa: 'apoioPatio'
    },
    horarios: [],
    horarioTexto: 'Horário a confirmar',
    requisitos: [],
    resolve: [
      'Apoio a alunos e professores',
      'Nivelamento de Português e Matemática',
      'Suporte pedagógico e de estudo'
    ],
    naoResolve: [
      { oque: 'Boleto, prova e protocolo', setorId: 'caa' }
    ],
    contatos: [
      { tipo: 'presencial', valor: 'Pergunte no Apoio ao Aluno (4 telas de TV)', href: null }
    ],
    dicas: ['Está com dificuldade em alguma base (texto ou cálculo)? O nivelamento existe para isso.'],
    aConfirmar: ['Local', 'Horário', 'Contato']
  },
  {
    id: 'biblioteca',
    nome: 'Biblioteca',
    apelido: 'Biblioteca',
    categoria: 'academico',
    icone: '📖',
    resumo: 'Empréstimos, salas de estudo, nada consta e apoio a TCC.',
    palavras: ['livro', 'emprestimo', 'sala', 'estudo', 'pergamo', 'senha', 'nada consta', 'wifi', 'internet', 'computador'],
    local: {
      descricao: 'No meio da universidade, ao lado da entrada da quadra. Desça as escadas ao lado do Café CB.',
      referencia: 'Café CB e quadra',
      pontoMapa: 'biblioteca'
    },
    horarios: [
      { dias: [1, 2, 3, 4, 5], inicio: '08:00', fim: '21:30' },
      { dias: [6], inicio: '08:00', fim: '12:30' }
    ],
    horarioTexto: 'Seg a sex, 8h às 21h30 (a confirmar: há uma anotação divergente "8 a 9:30"); sáb, 8h às 12h30',
    requisitos: ['Documento com foto (foto do documento não vale; documento digital vale)'],
    resolve: [
      'Empréstimo e renovação de livros (10 dias; renovação pelo Meu Pérgamo até 50 dias no total)',
      'Salas de estudo em dias úteis (uso de 2h)',
      'Senha de 6 caracteres para empréstimos e salas',
      'Emissão de "nada consta" (certidão de débitos com a instituição; procedimento a confirmar)',
      'Apoio da bibliotecária em artigos e TCC'
    ],
    naoResolve: [
      { oque: 'Livros digitais: ficam no Meu Pérgamo, sem renovação', setorId: 'portal' }
    ],
    contatos: [
      { tipo: 'link', valor: 'Contato pelo site do Ceuma (e-mail e telefone não informados)', href: null },
      { tipo: 'presencial', valor: 'Escadas ao lado do Café CB', href: null }
    ],
    dicas: [
      'Leve um documento com foto para criar a senha.',
      'Salas: agende com pelo menos 1h de antecedência. Faixas: 8-10, 10-12, 12-14, 14-16, 16-18, 18-20 e 20-21h30.',
      'Dúvidas comuns: computadores, senha e Wi-Fi. Pergunte no balcão.'
    ],
    aConfirmar: ['Horário de segunda a sexta (há uma anotação divergente "8 a 9:30, segunda a sexta")', 'Procedimento para emitir o nada consta', 'E-mail e telefone da biblioteca']
  },
  {
    id: 'achados',
    nome: 'Achados e Perdidos',
    apelido: 'Achados',
    categoria: 'seguranca',
    icone: '🔎',
    resumo: 'Retire objetos esquecidos ou perdidos no campus.',
    palavras: ['perdi', 'perdido', 'esqueci', 'objeto', 'celular', 'carteira'],
    local: {
      descricao: '4º andar do prédio CEUMA III.',
      referencia: 'Prédio CEUMA III',
      pontoMapa: 'achados'
    },
    horarios: [
      { dias: [1, 2, 3, 4, 5], inicio: '07:00', fim: '12:00' },
      { dias: [1, 2, 3, 4, 5], inicio: '13:00', fim: '21:30' }
    ],
    horarioTexto: '7h às 12h e 13h às 21h30 (dias da semana a confirmar; considerado seg a sex)',
    diasAConfirmar: true,
    requisitos: ['Descrever as características do objeto', 'Se achado: nome, RA e CPF, e assinar a retirada'],
    resolve: [
      'Retirada de objetos achados no campus',
      'Guarda dos objetos por 1 ano (depois vão ao setor patrimonial e são descartados)'
    ],
    naoResolve: [
      { oque: 'Investigar um furto ou registrar ocorrência', setorId: 'seguranca' }
    ],
    contatos: [
      { tipo: 'presencial', valor: '4º andar do CEUMA III', href: null }
    ],
    dicas: [
      'Os objetos chegam pelos setoristas (serviços gerais e limpeza): volte depois se não achar de primeira.',
      'Quer investigar o que perdeu? Comece pelo registro na Segurança Patrimonial.'
    ],
    aConfirmar: ['Dias da semana de funcionamento']
  },
  {
    id: 'seguranca',
    nome: 'Segurança Patrimonial',
    apelido: 'Segurança',
    categoria: 'seguranca',
    icone: '🛡️',
    resumo: 'Registro formal de ocorrência quando você perdeu algo e quer investigar.',
    palavras: ['ocorrencia', 'furto', 'roubo', 'camera', 'monitoramento'],
    local: {
      descricao: 'Local ainda não confirmado. Pergunte no Apoio ao Aluno (4 telas de TV).',
      referencia: 'Pátio Principal (4 telas de TV)',
      pontoMapa: 'apoioPatio'
    },
    horarios: [],
    horarioTexto: 'Horário a confirmar',
    requisitos: ['Descrever o que foi perdido, onde e quando'],
    resolve: [
      'Registro formal da ocorrência',
      'Aciona o Monitoramento (câmeras)',
      'Se foi um aluno, a Coordenação aborda; se foi visitante, a própria Segurança'
    ],
    naoResolve: [
      { oque: 'Retirar objeto já encontrado', setorId: 'achados' }
    ],
    contatos: [
      { tipo: 'presencial', valor: 'Pergunte no Apoio ao Aluno (4 telas de TV)', href: null }
    ],
    dicas: ['Quanto mais detalhes (características, onde e quando), mais fácil de investigar.'],
    aConfirmar: ['Local', 'Horário', 'Contato']
  },
  {
    id: 'pronto',
    nome: 'Pronto Atendimento',
    apelido: 'Pronto Atendimento',
    categoria: 'seguranca',
    icone: '🚑',
    resumo: 'Primeiros socorros, apoio psicológico e proteção e prevenção contra incêndio.',
    palavras: ['emergencia', 'socorro', 'bombeiro', 'psicologico', 'ansiedade', 'mal'],
    local: {
      descricao: 'Local ainda não confirmado. Novatos têm dificuldade de chegar: pergunte no Apoio ao Aluno (4 telas de TV).',
      referencia: 'Pátio Principal (4 telas de TV)',
      pontoMapa: 'apoioPatio'
    },
    horarios: [],
    horarioTexto: 'Horário a confirmar (2 bombeiros no período diurno)',
    requisitos: [],
    resolve: [
      'Primeiros socorros',
      'Apoio psicológico',
      'Proteção e prevenção contra incêndio'
    ],
    naoResolve: [],
    contatos: [
      { tipo: 'presencial', valor: 'Pergunte no Apoio ao Aluno (4 telas de TV)', href: null }
    ],
    dicas: [
      'Em emergência, peça ajuda a qualquer funcionário ou segurança mais próximo.',
      'Conheça o caminho antes de precisar: ele faz parte da sua 1ª semana.'
    ],
    aConfirmar: ['Local', 'Horário noturno', 'Contato']
  },
  {
    id: 'estagio',
    nome: 'Setor de Estágio',
    apelido: 'Estágio',
    categoria: 'academico',
    icone: '💼',
    resumo: 'Contratos, seguro, convênio, validação e relatórios de estágio.',
    palavras: ['estagio', 'convenio', 'seguro', 'relatorio', 'extracurricular'],
    local: {
      descricao: 'Local ainda não confirmado. Pergunte no Apoio ao Aluno (4 telas de TV).',
      referencia: 'Pátio Principal (4 telas de TV)',
      pontoMapa: 'apoioPatio'
    },
    horarios: [],
    horarioTexto: 'Horário a confirmar',
    requisitos: [],
    resolve: [
      'Contratos e seguro de estágio',
      'Convênio',
      'Validação e relatórios de estágio (obrigatório e extracurricular)'
    ],
    naoResolve: [
      { oque: 'Entrega de documentos de estágio na coordenação (não faça isso)', setorId: 'coordenacao' }
    ],
    contatos: [
      { tipo: 'presencial', valor: 'Pergunte no Apoio ao Aluno (4 telas de TV)', href: null }
    ],
    dicas: ['Entregue os documentos de estágio aqui, nunca direto na coordenação.'],
    aConfirmar: ['Local', 'Horário', 'Contato']
  },
  {
    id: 'portal',
    nome: 'Portal do Aluno / App Grupo Ceuma',
    apelido: 'Portal',
    categoria: 'digital',
    icone: '📱',
    resumo: 'Boletos, relatórios, matrícula, protocolos, AVA e Meu Pérgamo, tudo online.',
    palavras: ['app', 'online', 'relatorios', 'ava', 'pergamo', 'sava', 'chamado'],
    local: {
      descricao: 'Digital: acesse pelo App Grupo Ceuma ou pelo navegador, sem fila.',
      referencia: 'Online, 24h',
      pontoMapa: 'entrada'
    },
    horarios: [],
    horarioTexto: 'Online 24h',
    requisitos: ['RA e senha'],
    resolve: [
      'Boletos',
      'Aba Relatórios: histórico escolar, declaração de quitação anual, informe de rendimentos (IRPF) e declaração de matrícula, com download imediato',
      'Matrícula e rematrícula 100% online (desde 2021)',
      'Abertura de protocolos e requerimentos',
      'Meu Pérgamo (biblioteca digital) e AVA',
      'Kit Formando e diploma digital'
    ],
    naoResolve: [
      { oque: 'Atendimento financeiro presencial', setorId: 'caa' }
    ],
    contatos: [
      { tipo: 'link', valor: 'App Grupo Ceuma / Portal do Aluno (endereço não informado nas fontes)', href: null },
      { tipo: 'whatsapp', valor: 'O WhatsApp responde com mensagem automática pedindo para abrir chamado no App Grupo Ceuma', href: null }
    ],
    dicas: [
      'Boleto com tela branca ou erro? Limpe o cache e os dados do navegador.',
      'Não abra o mesmo chamado em "Financeiro" e em "Acadêmico": isso duplica a fila.',
      'O alerta de vencimento só aparece quando você entra no sistema (sem push nem SMS). O WhatsApp só avisa depois de vencido.',
      'O SAVA é o atendimento virtual.'
    ],
    aConfirmar: ['Valores das taxas de documentos (tabela confusa nas fontes)', 'Endereço (link) do Portal']
  }
];

CEUMA.servicos = [
  {
    id: 'boleto', titulo: 'Pagar ou emitir boleto',
    palavras: ['boleto', 'mensalidade', 'pagar', 'pagamento', 'fatura', '2a via', 'segunda via', 'parcela'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal ou no App Grupo Ceuma.', 'Abra a área financeira e escolha a parcela.', 'Emita o boleto e pague.'],
    levar: ['RA e senha'],
    alerta: 'Tela branca ou erro? Limpe o cache e os dados do navegador.'
  },
  {
    id: 'vencimento', titulo: 'Quando vence a mensalidade',
    palavras: ['vencimento', 'vence', 'data', 'quinto dia util', '5o dia util', 'desconto', 'pontualidade'],
    setorId: 'portal', online: true,
    comoFazer: ['A mensalidade vence no 5º dia útil do mês, não em dia fixo.', 'Use a calculadora da aba Regras para saber a data do mês.', 'Entre no Portal para ver o alerta, pois ele não chega por SMS.'],
    levar: [],
    alerta: 'Pagar depois do vencimento perde o desconto de pontualidade.'
  },
  {
    id: 'negociar-corrente', titulo: 'Negociar parcelas',
    palavras: ['negociar', 'negociacao', 'atraso', 'atrasado', 'parcela', 'divida', 'financeiro'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à CAA, pegue senha ou agende pelo Calendly.', 'Informe seu RA e explique a situação.', 'Combine a negociação com o assistente financeiro.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Parcelas antigas em atraso são com a Cobrafix, não com a CAA; o limite entre parcela corrente e antiga deve ser confirmado na CAA.'
  },
  {
    id: 'cobrafix', titulo: 'Renegociar parcelas antigas em atraso (Cobrafix)',
    palavras: ['cobrafix', 'cobranca', 'divida antiga', 'renegociar', 'terceirizada'],
    setorId: null, online: false,
    comoFazer: ['A cobrança de parcelas antigas é feita pela Cobrafix, empresa terceirizada.', 'Fale diretamente com a Cobrafix (contato a confirmar); não vá à CAA para isso.'],
    levar: [],
    alerta: 'A CAA não negocia parcelas antigas em atraso. O contato da Cobrafix não consta nas fontes (a confirmar).'
  },
  {
    id: 'matricula-online', titulo: 'Matrícula e rematrícula online',
    palavras: ['matricula', 'rematricula', 'matricular', 'renovar', 'online'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal ou no App Grupo Ceuma.', 'Siga o fluxo de matrícula ou rematrícula.', 'Confira os dados ao final.'],
    levar: ['RA e senha'],
    alerta: 'Desde 2021 é 100% online: você não precisa ir à Central.'
  },
  {
    id: 'vinculo-ingressante', titulo: 'Vínculo e matrícula de ingressante',
    palavras: ['ingressante', 'calouro', 'vinculo', 'matricula', 'contrato', 'matriz'],
    setorId: 'matricula', online: false,
    comoFazer: ['Vá à Central de Matrícula, na Praça da Gratidão, ou use e-mail/WhatsApp.', 'Tire dúvidas sobre valores, contrato e matriz inicial.'],
    levar: [],
    alerta: 'Presencial só até o dia 14 de cada mês.'
  },
  {
    id: 'prouni', titulo: 'ProUni: inscrição e dúvidas iniciais',
    palavras: ['prouni', 'bolsa', 'inscricao prouni'],
    setorId: 'matricula', online: false,
    comoFazer: ['Procure a sala anexa do ProUni/FIES na Central de Matrícula.', 'Tire as dúvidas iniciais do seu ProUni.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Presencial só até o dia 14 de cada mês. Depois, e-mail ou WhatsApp.'
  },
  {
    id: 'prouni-renovacao', titulo: 'Renovação semestral do ProUni (livro)',
    palavras: ['prouni', 'renovacao prouni', 'renovar prouni', 'assinatura semestral', 'livro', 'bolsa'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à Central de Atendimento ao Aluno (CAA).', 'Assine o livro físico do seu curso a cada semestre.'],
    levar: [],
    alerta: 'A assinatura é presencial. Confirme na CAA o período e o que levar (a confirmar).'
  },
  {
    id: 'fies', titulo: 'FIES: inscrição e dúvidas iniciais',
    palavras: ['fies', 'financiamento', 'inscricao fies'],
    setorId: 'matricula', online: false,
    comoFazer: ['Procure a sala anexa do ProUni/FIES na Central de Matrícula.', 'Tire dúvidas sobre o seu financiamento.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Presencial só até o dia 14 de cada mês. Depois, e-mail ou WhatsApp.'
  },
  {
    id: 'fies-financeiro', titulo: 'FIES: baixa parcial e aditamento',
    palavras: ['fies', 'baixa parcial', 'aditamento', 'financiamento'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à CAA, pegue senha ou agende pelo Calendly.', 'Explique a situação ao assistente financeiro, que recalcula a mensalidade.'],
    levar: [],
    alerta: 'A baixa parcial acontece quando o aditamento é confirmado com atraso no sistema do MEC.'
  },
  {
    id: 'cracha', titulo: 'Crachá institucional',
    palavras: ['cracha', 'identificacao', 'laboratorio', 'estagio'],
    setorId: 'matricula', online: false,
    comoFazer: ['Vá à Central de Matrícula.', 'Peça o crachá informando o RA.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Necessário para aulas em laboratórios e estágios. Presencial só até o dia 14.'
  },
  {
    id: 'carteira-estudantil', titulo: '2ª via da carteira estudantil',
    palavras: ['carteira estudantil', 'carteirinha', 'segunda via carteira', '2a via carteira'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal ou no App Grupo Ceuma.', 'Abra o requerimento de 2ª via da carteira estudantil.'],
    levar: ['RA e senha'],
    alerta: 'Valor da taxa a confirmar. Não é o crachá institucional (esse é na Central de Matrícula).'
  },
  {
    id: 'carta-financeira', titulo: 'Conferir carta financeira, valores e contrato',
    palavras: ['carta financeira', 'valores', 'contrato', 'matriz inicial', 'mensalidade'],
    setorId: 'matricula', online: false,
    comoFazer: ['Leia a carta financeira do seu ingresso.', 'Anote o 5º dia útil como vencimento.', 'Na dúvida, fale com a Central de Matrícula.'],
    levar: [],
    alerta: null
  },
  {
    id: 'facial', titulo: 'Cadastrar reconhecimento facial (catraca)',
    palavras: ['facial', 'reconhecimento', 'catraca', 'entrar', 'entrada', 'acesso', 'rosto', 'foto'],
    setorId: 'apoio', online: false,
    comoFazer: ['Vá ao Apoio ao Aluno, no Pátio Principal (4 telas de TV).', 'Informe seu RA.', 'Faça o cadastro do rosto e teste na catraca.'],
    levar: ['RA'],
    alerta: 'Sem o RA o cadastro não anda. Atendimento por ordem de chegada.'
  },
  {
    id: 'orientacao-local', titulo: 'Descobrir onde fica um setor',
    palavras: ['onde fica', 'localizar', 'estou perdido', 'localizacao', 'orientacao', 'mapa', 'caminho'],
    setorId: 'apoio', online: false,
    comoFazer: ['Vá ao Pátio Principal, perto das 4 telas de TV.', 'Pergunte no Apoio ao Aluno.'],
    levar: [],
    alerta: null
  },
  {
    id: 'historico', titulo: 'Histórico escolar',
    palavras: ['historico', 'historico escolar', 'relatorios', 'notas'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal ou no App Grupo Ceuma.', 'Abra a aba Relatórios.', 'Baixe o histórico na hora.'],
    levar: ['RA e senha'],
    alerta: 'Pode haver taxa para a via oficial; valores a confirmar na CAA.'
  },
  {
    id: 'decl-matricula', titulo: 'Declaração de matrícula',
    palavras: ['declaracao', 'matricula', 'comprovante', 'relatorios', 'vinculo'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal e abra a aba Relatórios.', 'Baixe a declaração de matrícula.'],
    levar: ['RA e senha'],
    alerta: null
  },
  {
    id: 'decl-quitacao', titulo: 'Declaração de quitação anual de débitos',
    palavras: ['declaracao', 'quitacao', 'quitado', 'debitos', 'relatorios', 'financeira'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal e abra a aba Relatórios.', 'Baixe a declaração de quitação anual.'],
    levar: ['RA e senha'],
    alerta: 'Pode haver taxa para a via oficial; valores a confirmar na CAA.'
  },
  {
    id: 'informe-ir', titulo: 'Informe de rendimentos para o Imposto de Renda',
    palavras: ['informe', 'rendimentos', 'imposto', 'imposto de renda', 'irpf', 'ir', 'declaracao', 'relatorios'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal e abra a aba Relatórios.', 'Baixe o informe de rendimentos.'],
    levar: ['RA e senha'],
    alerta: null
  },
  {
    id: 'ementas', titulo: 'Programa de disciplinas (ementas)',
    palavras: ['ementa', 'ementas', 'programa de disciplinas', 'disciplinas'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal e solicite pelo requerimento.'],
    levar: ['RA e senha'],
    alerta: 'Pode haver taxa; valores a confirmar na CAA.'
  },
  {
    id: 'protocolo-online', titulo: 'Abrir protocolo ou requerimento online',
    palavras: ['protocolo', 'requerimento', 'chamado', 'solicitacao', 'sava', 'atendimento virtual'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no App Grupo Ceuma.', 'Abra um chamado na categoria certa (Financeiro ou Acadêmico).', 'Acompanhe a resposta pelo app.'],
    levar: ['RA e senha'],
    alerta: 'Não abra o mesmo chamado em Financeiro e Acadêmico: isso duplica a fila.'
  },
  {
    id: 'protocolo-presencial', titulo: 'Abrir protocolo presencialmente',
    palavras: ['protocolo', 'requerimento', 'balcao', 'presencial'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à CAA e pegue senha (ou agende).', 'Peça a abertura do protocolo informando o RA.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: null
  },
  {
    id: 'prova', titulo: 'Entregar ou retirar prova',
    palavras: ['prova', 'provas', 'retirar prova', 'entregar prova', 'avaliacao'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à CAA e pegue senha.', 'Informe seu RA e a prova desejada.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Provas de semestres anteriores também são atendidas, mas podem demorar.'
  },
  {
    id: 'bolsa', titulo: 'Transferir bolsa',
    palavras: ['bolsa', 'transferencia', 'transferir bolsa'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à CAA, pegue senha ou agende.', 'Explique o pedido ao assistente financeiro.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: null
  },
  {
    id: 'responsavel-financeiro', titulo: 'Alterar o responsável financeiro',
    palavras: ['responsavel financeiro', 'responsavel', 'financeiro', 'contrato', 'trocar'],
    setorId: 'caa', online: false,
    comoFazer: ['Vá à CAA, pegue senha ou agende.', 'Peça a alteração do responsável financeiro.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: null
  },
  {
    id: 'primeiro-acesso', titulo: 'Primeiro acesso ao Portal e ao AVA',
    palavras: ['primeiro acesso', 'senha', 'login', 'ava', 'portal', 'acessar', 'sala virtual'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Procure a coordenação do seu curso.', 'Peça a orientação do primeiro acesso.', 'Descubra qual é o seu AVA: Presencial, Semipresencial ou EAD.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Local e horário da coordenação ainda a confirmar.'
  },
  {
    id: 'senha-portal', titulo: 'Esqueci a senha do portal ou preciso atualizar meu cadastro',
    palavras: ['senha portal', 'esqueci senha', 'redefinir senha', 'email', 'telefone', 'cadastro', 'atualizacao cadastral', 'trocar email'],
    setorId: 'matricula', online: false,
    comoFazer: ['Vá à Central de Matrícula (presencial até o dia 14) ou use e-mail/WhatsApp.', 'Peça a redefinição da senha do portal ou a atualização de e-mail e telefone.'],
    levar: [],
    alerta: 'Não é a senha da fila da CAA nem a senha da biblioteca.'
  },
  {
    id: 'ava-disciplina', titulo: 'Disciplina ausente ou sem acesso no AVA',
    palavras: ['ava', 'disciplina', 'sem acesso', 'nao aparece', 'ausente', 'suporte ti'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Avise a coordenação do curso.', 'Ela aciona o Suporte de TI junto com você.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Local e horário da coordenação ainda a confirmar.'
  },
  {
    id: 'tcc', titulo: 'TCC: ficha de inscrição',
    palavras: ['tcc', 'trabalho de conclusao', 'monografia', 'inscricao'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Procure a coordenação do curso.', 'Preencha a ficha de inscrição do TCC.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'A bibliotecária também ajuda com artigos e TCC.'
  },
  {
    id: 'atividades-complementares', titulo: 'Atividades complementares',
    palavras: ['atividades complementares', 'horas complementares', 'complementares', 'ads', 'ciencia da computacao', 'engenharia de software'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Fale com a coordenação do curso.', 'Cumpra as horas exigidas e entregue os comprovantes.'],
    levar: ['Comprovantes'],
    alerta: 'Carga: 80h em ADS; 160h em Ciência da Computação e Engenharia de Software.'
  },
  {
    id: 'colacao', titulo: 'Colação de grau',
    palavras: ['colacao', 'colacao de grau', 'formatura', 'formando'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Entregue o Kit Formando completo e digitalizado pelo Portal.', 'A coordenação orienta sobre a colação de grau.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Colação é o ato oficial; a cerimônia simbólica (festa) é outra coisa.'
  },
  {
    id: 'kit-formando', titulo: 'Kit Formando (documentação do diploma)',
    palavras: ['kit formando', 'kit', 'diploma', 'diploma digital', 'formando'],
    setorId: 'portal', online: true,
    comoFazer: ['Entre no Portal ou no App Grupo Ceuma.', 'Envie a documentação digital exigida.'],
    levar: ['Documentos pessoais'],
    alerta: 'Não é o pacote da festa: é a documentação obrigatória para emitir o diploma.'
  },
  {
    id: 'reingresso', titulo: 'Reingresso',
    palavras: ['reingresso', 'voltar', 'retorno', 'abandono', 'prova de reingresso'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Procure a coordenação do curso.', 'Preencha o pedido com atenção ao período de retorno.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Cuidado ao preencher o período de retorno. Para quem ficou um semestre sem rematrícula; há também a Prova de Reingresso (detalhes a confirmar).'
  },
  {
    id: 'regime-domiciliar', titulo: 'Regime domiciliar',
    palavras: ['regime domiciliar', 'domiciliar', 'atestado', 'afastamento', 'doenca'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Abra um protocolo no portal anexando o atestado.', 'Acompanhe com a coordenação.'],
    levar: ['Atestado médico'],
    alerta: 'Vale para afastamento de 7 dias ou mais.'
  },
  {
    id: 'regime-especial', titulo: 'Regime especial (retenção por reprovações)',
    palavras: ['regime especial', 'reprovacao', 'reprovacoes', 'reprovado'],
    setorId: 'coordenacao', online: false,
    comoFazer: ['Fale com a coordenação do curso para saber como regularizar suas pendências.', 'Você só avança na matriz quando reduzir as reprovações para no máximo 5.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Com mais de 5 reprovações você fica retido no semestre ("período fatorial") até reduzir as pendências.'
  },
  {
    id: 'nivelamento', titulo: 'Nivelamento e apoio pedagógico',
    palavras: ['nivelamento', 'portugues', 'matematica', 'reforco', 'dificuldade', 'nadd', 'estudo', 'pedagogico'],
    setorId: 'nadd', online: false,
    comoFazer: ['Pergunte no Apoio ao Aluno como chegar ao NADD.', 'Combine seu nivelamento ou apoio de estudo.'],
    levar: [],
    alerta: 'Local, horário e contato do NADD ainda a confirmar.'
  },
  {
    id: 'emprestimo-livro', titulo: 'Emprestar e renovar livros',
    palavras: ['livro', 'livros', 'emprestimo', 'emprestar', 'renovar', 'pergamo', 'ebook'],
    setorId: 'biblioteca', online: false,
    comoFazer: ['Leve documento com foto à Biblioteca.', 'Empréstimo de 10 dias.', 'Renove pelo Meu Pérgamo, até 50 dias no total.'],
    levar: ['Documento com foto', 'Senha da biblioteca'],
    alerta: 'Ebooks no Meu Pérgamo não renovam.'
  },
  {
    id: 'senha-biblioteca', titulo: 'Criar a senha da biblioteca',
    palavras: ['senha', 'senha biblioteca', 'cadastro', 'login biblioteca'],
    setorId: 'biblioteca', online: false,
    comoFazer: ['Vá à Biblioteca com documento com foto.', 'Crie uma senha de 6 caracteres (letras ou números).'],
    levar: ['Documento com foto'],
    alerta: 'Foto do documento não vale; o documento digital vale.'
  },
  {
    id: 'sala-estudo', titulo: 'Reservar sala de estudo',
    palavras: ['sala', 'sala de estudo', 'estudar', 'reservar', 'agendar sala', 'grupo'],
    setorId: 'biblioteca', online: false,
    comoFazer: ['Agende com pelo menos 1h de antecedência.', 'Escolha uma faixa: 8-10, 10-12, 12-14, 14-16, 16-18, 18-20 ou 20-21h30.', 'Use por até 2h.'],
    levar: ['Senha da biblioteca'],
    alerta: 'Só em dias úteis.'
  },
  {
    id: 'nada-consta', titulo: 'Nada consta',
    palavras: ['nada consta', 'declaracao', 'biblioteca', 'pendencia'],
    setorId: 'biblioteca', online: false,
    comoFazer: ['Peça o nada consta no balcão da Biblioteca.'],
    levar: ['Documento com foto'],
    alerta: 'Certidão sobre débitos com a instituição, emitida pela Biblioteca. O procedimento exato é a confirmar.'
  },
  {
    id: 'objeto-perdido', titulo: 'Procurar objeto perdido ou esquecido',
    palavras: ['perdi', 'perdido', 'perdeu', 'esqueci', 'celular', 'carteira', 'chave', 'mochila', 'objeto', 'achados'],
    setorId: 'achados', online: false,
    comoFazer: ['Vá ao 4º andar do CEUMA III.', 'Descreva as características do objeto.', 'Se achado: informe nome, RA e CPF e assine a retirada.'],
    levar: ['RA', 'CPF'],
    alerta: 'Os objetos ficam guardados por 1 ano.'
  },
  {
    id: 'ocorrencia-perda', titulo: 'Registrar ocorrência de perda ou furto',
    palavras: ['perdi', 'perdido', 'celular', 'carteira', 'furto', 'roubo', 'roubaram', 'ocorrencia', 'camera', 'investigar'],
    setorId: 'seguranca', online: false,
    comoFazer: ['Procure a Segurança Patrimonial (pergunte no Apoio ao Aluno).', 'Informe características, onde e quando.', 'Eles acionam o Monitoramento (câmeras).'],
    levar: [],
    alerta: 'Local, horário e contato da Segurança ainda a confirmar.'
  },
  {
    id: 'passando-mal', titulo: 'Passando mal ou primeiros socorros',
    palavras: ['emergencia', 'passando mal', 'mal', 'socorro', 'desmaio', 'machucado', 'bombeiro', 'medico', 'saude'],
    setorId: 'pronto', online: false,
    comoFazer: ['Peça ajuda ao funcionário ou segurança mais próximo.', 'Vá ao Pronto Atendimento (pergunte no Apoio ao Aluno).'],
    levar: [],
    alerta: 'Local e horário noturno ainda a confirmar. Há 2 bombeiros no período diurno.'
  },
  {
    id: 'apoio-psicologico', titulo: 'Apoio psicológico e ansiedade',
    palavras: ['ansiedade', 'psicologo', 'psicologico', 'emocional', 'panico', 'estresse', 'emergencia'],
    setorId: 'pronto', online: false,
    comoFazer: ['Procure o Pronto Atendimento.', 'Conte o que está sentindo: há apoio psicológico.'],
    levar: [],
    alerta: 'Local e contato ainda a confirmar.'
  },
  {
    id: 'incendio', titulo: 'Incêndio e prevenção',
    palavras: ['incendio', 'fogo', 'fumaca', 'bombeiro', 'emergencia', 'extintor'],
    setorId: 'pronto', online: false,
    comoFazer: ['Avise imediatamente um bombeiro, segurança ou funcionário.', 'Saia do local com calma.'],
    levar: [],
    alerta: null
  },
  {
    id: 'estagio-contrato', titulo: 'Contrato, seguro e convênio de estágio',
    palavras: ['estagio', 'contrato', 'seguro', 'convenio', 'extracurricular', 'obrigatorio'],
    setorId: 'estagio', online: false,
    comoFazer: ['Procure o Setor de Estágio (pergunte no Apoio ao Aluno).', 'Leve as informações do seu estágio (empresa e curso); o que exatamente entregar é a confirmar.'],
    levar: ['RA (sugestão: leve por garantia)'],
    alerta: 'Local, horário e contato do setor ainda a confirmar.'
  },
  {
    id: 'estagio-relatorio', titulo: 'Relatórios e validação de estágio',
    palavras: ['relatorio', 'relatorios', 'estagio', 'validacao', 'validar', 'documentos'],
    setorId: 'estagio', online: false,
    comoFazer: ['Entregue relatórios e documentos no Setor de Estágio.'],
    levar: ['Relatórios assinados'],
    alerta: 'Não entregue documentos de estágio direto na coordenação.'
  }
];

CEUMA.mitos = [
  {
    id: 'm1', mito: 'A mensalidade vence todo dia 5 (ou dia 7).',
    verdade: 'Vence no 5º dia útil do mês, então a data muda. Pagar depois perde o desconto de pontualidade.',
    fonte: 'Central de Atendimento e Relatório Consolidado'
  },
  {
    id: 'm2', mito: 'Boleto atrasado me impede de fazer prova ou de me formar.',
    verdade: 'Não. Atraso gera só juros e encargos. O que bloqueia o nome na ata é não estar matriculado no semestre ou erro de enturmação.',
    fonte: 'Central de Atendimento'
  },
  {
    id: 'm3', mito: 'Posso renegociar parcelas antigas em atraso na Central.',
    verdade: 'Não. A cobrança de parcelas antigas é da Cobrafix, empresa terceirizada.',
    fonte: 'Central de Atendimento'
  },
  {
    id: 'm4', mito: 'Kit Formando é o pacote da festa de formatura.',
    verdade: 'É a documentação obrigatória para emitir o diploma, entregue de forma digital.',
    fonte: 'Coordenação de Curso'
  },
  {
    id: 'm5', mito: 'Colação de grau é a festa de formatura.',
    verdade: 'Colação é o ato oficial. A cerimônia simbólica é a festa.',
    fonte: 'Coordenação de Curso'
  },
  {
    id: 'm6', mito: 'Preciso ir à Central para fazer a matrícula ou rematrícula.',
    verdade: 'Desde 2021 é 100% online, pelo Portal.',
    fonte: 'Relatório Consolidado e entrevista da Central de Atendimento'
  },
  {
    id: 'm7', mito: 'Para pedir histórico ou declaração, tenho que enfrentar fila.',
    verdade: 'Histórico, declarações e informe de IR saem na aba Relatórios do Portal, com download imediato.',
    fonte: 'Relatório Consolidado'
  },
  {
    id: 'm8', mito: 'Abrir o mesmo chamado em Financeiro e em Acadêmico acelera a resposta.',
    verdade: 'Não acelera: duplica a fila.',
    fonte: 'Central de Atendimento'
  },
  {
    id: 'm9', mito: 'A Central de Matrícula atende presencialmente o mês todo.',
    verdade: 'O presencial encerra a partir do dia 15 de cada mês. Depois, use e-mail ou WhatsApp.',
    fonte: 'Central de Matrícula'
  },
  {
    id: 'm10', mito: 'CAA e Central de Matrícula são a mesma coisa.',
    verdade: 'Ficam lado a lado, mas são diferentes. Crachá e inscrição de ProUni/FIES: Central de Matrícula. Boleto, prova, protocolo e renovação do ProUni: CAA.',
    fonte: 'Central de Matrícula'
  }
];

CEUMA.glossario = [
  { termo: 'RA', definicao: 'Registro Acadêmico: seu número de aluno. Quase todo setor pede. Decore!', setorId: 'apoio' },
  { termo: 'Portal do Aluno', definicao: 'Sistema online com boletos, relatórios, protocolos e matrícula.', setorId: 'portal' },
  { termo: 'App Grupo Ceuma', definicao: 'Aplicativo do Portal. Baixe no celular para abrir chamados e ver boletos.', setorId: 'portal' },
  { termo: 'AVA', definicao: 'Ambiente Virtual de Aprendizagem. Existe em versões Presencial, Semipresencial e EAD.', setorId: 'coordenacao' },
  { termo: 'Meu Pérgamo', definicao: 'Biblioteca digital: renovação de livros e ebooks (ebooks não renovam).', setorId: 'biblioteca' },
  { termo: 'Nada consta', definicao: 'Certidão sobre débitos com a instituição, emitida no balcão da Biblioteca (procedimento a confirmar).', setorId: 'biblioteca' },
  { termo: 'Kit Formando', definicao: 'Documentação obrigatória, entregue em formato digital, para emitir o diploma.', setorId: 'portal' },
  { termo: 'Colação de grau', definicao: 'Ato oficial de conclusão do curso (diferente da cerimônia simbólica).', setorId: 'coordenacao' },
  { termo: 'Protocolo / chamado', definicao: 'Pedido formal registrado no sistema. Abra só um por assunto.', setorId: 'portal' },
  { termo: '5º dia útil', definicao: 'Data de vencimento da mensalidade: o quinto dia sem fim de semana nem feriado.', setorId: 'portal' },
  { termo: 'Carta financeira', definicao: 'Documento com valores e condições financeiras do seu ingresso.', setorId: 'matricula' },
  { termo: 'ProUni', definicao: 'Programa de bolsas do governo federal. Inscrição e dúvidas iniciais na Central de Matrícula; a renovação semestral (livro) é na CAA.', setorId: 'matricula' },
  { termo: 'FIES', definicao: 'Financiamento estudantil do governo (inclui aditamento e baixa parcial). Dúvidas iniciais na Central de Matrícula; baixa parcial e questões financeiras na CAA.', setorId: 'matricula' },
  { termo: 'Pravaler', definicao: 'Financiamento estudantil privado, citado nas fontes.', setorId: null },
  { termo: 'Cobrafix', definicao: 'Empresa terceirizada que cobra parcelas antigas em atraso (contato a confirmar; a CAA não negocia essas parcelas).', setorId: null },
  { termo: 'Rematrícula', definicao: 'Renovação da matrícula a cada semestre. É online pelo Portal.', setorId: 'portal' },
  { termo: 'Reingresso', definicao: 'Retorno de quem está em situação de abandono (sem rematrícula no semestre anterior); há uma Prova de Reingresso. Cuidado com o período de retorno.', setorId: 'coordenacao' },
  { termo: 'Regime domiciliar', definicao: 'Estudo em casa por afastamento de 7 dias ou mais, com atestado e protocolo no portal.', setorId: 'coordenacao' },
  { termo: 'Regime especial', definicao: 'Retenção de quem tem mais de 5 reprovações: o aluno fica no semestre ("período fatorial") até reduzir as pendências.', setorId: 'coordenacao' },
  { termo: 'Atividades complementares', definicao: 'Horas extras exigidas para se formar: 80h em ADS; 160h em Ciência da Computação e Engenharia de Software.', setorId: 'coordenacao' },
  { termo: 'Enturmação', definicao: 'Colocação do aluno em turma. Erro nela pode afetar o nome na ata.', setorId: 'coordenacao' },
  { termo: 'Reconhecimento facial / catraca', definicao: 'Cadastro do rosto para passar pelas catracas. Feito no Apoio ao Aluno.', setorId: 'apoio' },
  { termo: 'Crachá', definicao: 'Identificação institucional para aulas, laboratórios e estágios. Pedido na Central de Matrícula.', setorId: 'matricula' },
  { termo: 'NADD', definicao: 'Núcleo de Apoio ao Docente e ao Discente: nivelamento e apoio de estudo.', setorId: 'nadd' },
  { termo: 'CAA', definicao: 'Central de Atendimento ao Aluno: boleto, prova e protocolo.', setorId: 'caa' },
  { termo: 'SAVA', definicao: 'Atendimento virtual do Grupo Ceuma.', setorId: 'portal' }
];

CEUMA.checklist = [
  { id: 'ra', titulo: 'Decorar o seu RA', detalhe: 'Quase todo setor pede o RA. Anote e memorize.', setorId: null, semana: 1 },
  { id: 'facial', titulo: 'Cadastrar o reconhecimento facial', detalhe: 'No Apoio ao Aluno, no Pátio Principal. Leve o RA.', setorId: 'apoio', semana: 1 },
  { id: 'portal', titulo: 'Fazer o 1º acesso ao Portal', detalhe: 'Entre com seu RA e confira seus dados.', setorId: 'portal', semana: 1 },
  { id: 'ava', titulo: 'Descobrir qual é o seu AVA', detalhe: 'Presencial, Semipresencial ou EAD. Na dúvida, pergunte à coordenação.', setorId: 'coordenacao', semana: 1 },
  { id: 'app', titulo: 'Baixar o App Grupo Ceuma', detalhe: 'Boletos e chamados na palma da mão.', setorId: 'portal', semana: 1 },
  { id: 'senha-biblioteca', titulo: 'Criar a senha da biblioteca', detalhe: 'Leve documento com foto (o digital vale).', setorId: 'biblioteca', semana: 1 },
  { id: 'carta', titulo: 'Conferir a carta financeira e anotar o 5º dia útil', detalhe: 'A mensalidade vence no 5º dia útil, não em dia fixo.', setorId: 'matricula', semana: 1 },
  { id: 'pronto', titulo: 'Localizar o Pronto Atendimento', detalhe: 'Conheça o caminho antes de precisar. Na dúvida, pergunte no Apoio ao Aluno.', setorId: 'pronto', semana: 1 },
  { id: 'referencias', titulo: 'Conhecer os pontos de referência', detalhe: 'Pátio Principal (4 telas de TV), Praça da Gratidão, Café CB e CEUMA III.', setorId: 'apoio', semana: 1 },
  { id: 'cracha', titulo: 'Pedir o crachá, se tiver laboratório ou estágio', detalhe: 'Central de Matrícula, na Praça da Gratidão. Presencial só até o dia 14.', setorId: 'matricula', semana: 1 }
];

/* Mapa esquemático e ILUSTRATIVO: as posições reais são desconhecidas. */
(function () {
  var passoEntrada = 'Entre pela entrada principal.';
  var passoPatio = 'Siga até o Pátio Principal, onde fica a estrutura com 4 telas de TV.';
  var rotaPerguntar = function (nome) {
    return {
      de: 'entrada',
      passos: [passoEntrada, passoPatio, 'Pergunte no Apoio ao Aluno (4 telas de TV): ' + nome + ' ainda tem local a confirmar.'],
      caminho: [[500, 650], [500, 560], [500, 470]]
    };
  };
  CEUMA.mapa = {
    largura: 1000,
    altura: 700,
    pontos: [
      { id: 'entrada', nome: 'Entrada principal', x: 500, y: 650, tipo: 'entrada' },
      { id: 'apoioPatio', nome: 'Pátio Principal · Apoio ao Aluno (4 telas de TV)', x: 500, y: 470, tipo: 'setor' },
      { id: 'rampa', nome: 'Escadaria e rampa principal', x: 500, y: 370, tipo: 'referencia' },
      { id: 'pracaGratidao', nome: 'Praça da Gratidão (estátuas)', x: 500, y: 260, tipo: 'referencia' },
      { id: 'caa', nome: 'CAA', x: 420, y: 230, tipo: 'setor' },
      { id: 'matricula', nome: 'Central de Matrícula', x: 580, y: 230, tipo: 'setor' },
      { id: 'cafeCB', nome: 'Café CB', x: 200, y: 400, tipo: 'referencia' },
      { id: 'biblioteca', nome: 'Biblioteca', x: 200, y: 500, tipo: 'setor' },
      { id: 'quadra', nome: 'Quadra', x: 90, y: 520, tipo: 'referencia' },
      { id: 'ceumaIII', nome: 'Prédio CEUMA III', x: 850, y: 250, tipo: 'referencia' },
      { id: 'achados', nome: 'Achados e Perdidos (4º andar)', x: 850, y: 170, tipo: 'setor' },
      { id: 'santander', nome: 'Agência Santander', x: 830, y: 500, tipo: 'referencia' }
    ],
    areas: [
      { id: 'areaPatio', nome: 'Pátio Principal', x: 380, y: 410, w: 240, h: 120 },
      { id: 'areaPraca', nome: 'Praça da Gratidão', x: 340, y: 150, w: 320, h: 160 },
      { id: 'areaQuadra', nome: 'Quadra', x: 40, y: 450, w: 100, h: 130 },
      { id: 'areaCeumaIII', nome: 'CEUMA III', x: 770, y: 120, w: 160, h: 180 },
      { id: 'areaBiblioteca', nome: 'Biblioteca', x: 150, y: 460, w: 100, h: 80 }
    ],
    rotas: {
      apoio: {
        de: 'entrada',
        passos: [passoEntrada, passoPatio, 'O Apoio ao Aluno fica junto às 4 telas de TV.'],
        caminho: [[500, 650], [500, 560], [500, 470]]
      },
      caa: {
        de: 'entrada',
        passos: [passoEntrada, passoPatio, 'Suba a escadaria perto da rampa principal até a Praça da Gratidão.', 'A CAA fica ao lado da Central de Matrícula.'],
        caminho: [[500, 650], [500, 470], [500, 370], [500, 290], [420, 240]]
      },
      matricula: {
        de: 'entrada',
        passos: [passoEntrada, passoPatio, 'Suba a escadaria perto da rampa principal até a Praça da Gratidão (área com estátuas).', 'A Central de Matrícula fica ao lado da CAA.'],
        caminho: [[500, 650], [500, 470], [500, 370], [500, 290], [580, 240]]
      },
      biblioteca: {
        de: 'entrada',
        passos: [passoEntrada, passoPatio, 'Siga até o Café CB.', 'Desça as escadas ao lado do Café CB: a biblioteca fica perto da entrada da quadra.'],
        caminho: [[500, 650], [500, 470], [300, 430], [200, 410], [200, 490]]
      },
      achados: {
        de: 'entrada',
        passos: [passoEntrada, passoPatio, 'Siga até o prédio CEUMA III.', 'Suba até o 4º andar.'],
        caminho: [[500, 650], [500, 470], [700, 330], [850, 260], [850, 180]]
      },
      coordenacao: rotaPerguntar('A coordenação'),
      nadd: rotaPerguntar('O NADD'),
      seguranca: rotaPerguntar('A Segurança Patrimonial'),
      pronto: rotaPerguntar('O Pronto Atendimento'),
      estagio: rotaPerguntar('O Setor de Estágio')
    }
  };
})();
