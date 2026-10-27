# Portfólio Retrô (DevBoy)

Portfólio de programador em formato de console portátil. Somente HTML, CSS e JavaScript, sem dependências.

## Estrutura

```text
portfolio-retro/
├── index.html
├── css/
│   ├── console.css   # corpo do console, botões e fonte
│   └── screen.css    # telas, temas de cor e jogo
├── js/
│   ├── data.js       # EDITE AQUI: seus dados (projetos, skills, contatos)
│   ├── sound.js      # sons 8-bit gerados no navegador
│   ├── snake.js      # jogo da cobrinha
│   └── main.js       # telas e controles
└── assets/
    ├── fonts/        # opcional: PressStart2P-Regular.ttf
    └── img/          # opcional: eu.jpg
```

## Como usar
Abra `index.html` no navegador (ou rode `python -m http.server 8000`).

## Controles
Setas/WASD mover · Enter/Z = A · Esc/X = B · Shift = trocar tema · Espaço = início · M = som.
Também funciona com cliques/toques nos botões e nos itens da tela.
