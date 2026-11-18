# Guia do Calouro CEUMA — Design (aprovado em 18/11/2026)

## Intenção
Web app leve (66,7% da enquete preferiu "Web App / site leve no navegador") para o aluno que acaba de entrar no CEUMA Renascença, não conhece nada e não quer ficar perdido. Ataca as três dores das pesquisas:
1. **Onde fica** (Ishikawa "Localização", NADD, Pronto Atendimento, Coordenação).
2. **Qual setor resolve o quê** (confusão CAA × Central de Matrícula; coordenação vira triagem informal).
3. **Regras e mitos não explicados** (5º dia útil, boleto não impede prova, Cobrafix, Kit Formando, matrícula online, aba Relatórios do portal).

## Objetivos
- Busca "Preciso de…" → setor certo + o que levar + se dá para resolver online.
- Ficha de cada setor: local + ponto de referência, horário (com status aberto/fechado agora), requisitos, contatos, o que resolve / o que NÃO resolve.
- Mapa esquemático com pontos de referência e "como chegar" passo a passo.
- Checklist "Minha 1ª semana" persistido no navegador.
- Mitos × Verdades, calculadora de vencimento (5º dia útil com feriados nacionais), glossário.
- Botão de emergência fixo → Pronto Atendimento.
- Dados não confirmados nas entrevistas exibem selo "a confirmar".

## Não-objetivos
Login, backend, integração com Portal/App reais, totem físico, planta real do campus.

## Anti-objetivos
Inventar dados como se fossem oficiais; exigir instalação; texto burocrático; não funcionar no celular.

## Abordagens consideradas
- **HTML/CSS/JS puro, sem build (escolhida)** — abre direto do arquivo, leve, fácil de manter.
- React/Vite — mais estrutura, mas exige toolchain; exagero para protótipo.
- PDF navegável — 11% da enquete; não permite busca/triagem nem mapa interativo.

## Decisões (chamadas do Claude)
- Mobile-first, SPA com navegação por hash (`#/inicio`, `#/setor/caa`…).
- Dados separados (`js/data.js`) da lógica (`js/logic.js`) e da UI (`js/app.js`).
- Mapa é SVG esquemático, rotulado "ilustrativo".
- Fontes de verdade: `docs/fontes/*.txt`.
