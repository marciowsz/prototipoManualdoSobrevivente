# Guia do Calouro CEUMA — protótipo

Web app leve, sem instalação, para o aluno novato do CEUMA Renascença: onde fica cada setor, qual setor resolve o quê, o que levar, regras e mitos.

## Como abrir
- Dê dois cliques em `index.html` **ou** rode `python -m http.server 8765` nesta pasta e acesse http://localhost:8765.

## Telas
Início com busca "O que você precisa resolver?" · Setores (ficha com local, horário, aberto/fechado agora, o que levar, resolve / não é aqui, contatos, como chegar) · Mapa ilustrativo com rotas · Minha 1ª semana (checklist salvo no aparelho) · Regras (mitos × verdades, calculadora do 5º dia útil, glossário) · Emergência.

## Estrutura
- `js/data.js` — conteúdo (extraído de `docs/fontes/`). Dados não validados ficam em `aConfirmar` e aparecem com selo "a confirmar".
- `js/logic.js` — busca, horários/feriados, 5º dia útil, checklist.
- `js/app.js`, `css/styles.css`, `index.html` — interface.
- Testes: `node --test`.
- Design, plano e revisões: `docs/superpowers/`.
