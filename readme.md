# 🔄 ConverteCódigo — Conversor de Código (PWA)

Aplicação web que realiza a **conversão básica entre linguagens de programação**, permitindo copiar, colar, limpar e alternar códigos entre origem e destino.  
O projeto foi desenvolvido em **HTML, CSS e JavaScript puro** e pode ser instalado como **Progressive Web App (PWA)**.

Este projeto foi desenvolvido em colaboração com **Pedro Lucas**.

## 🚀 Funcionalidades

- 🔁 Conversão entre linguagens:
  - JavaScript ↔ Python
  - JavaScript ↔ PHP
  - JavaScript ↔ Java
  - JavaScript ↔ TypeScript
  - TypeScript → JavaScript
  - CSS ↔ SCSS
- 📝 Editor de código com:
  - Colar código
  - Copiar entrada
  - Copiar saída
  - Limpar campos
- 🔄 Troca rápida entre linguagem de origem e destino
- 📢 Sistema de notificações (toast)
- ⚠️ Avisos sobre limitações de conversão
- 📱 Interface moderna e responsiva
- 📦 Funciona offline (PWA)
- ⬇️ Instalável em desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Web APIs**
  - Clipboard API
  - File APIs
  - Service Workers
- **PWA**
  - `manifest.json`
  - `service worker`

## 📂 Estrutura do Projeto

```text
/
├── icons/           # Ícones do PWA
├── index.html       # Interface principal
├── offline.html     # Página offline
├── styles.css       # Estilos da aplicação
├── script.js        # Lógica de conversão e UI
├── app.js           # Funcionalidades adicionais / PWA
├── sw.js            # Service Worker
├── manifest.json    # Configuração do PWA
└── README.md        # Documentação
