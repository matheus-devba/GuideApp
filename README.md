Enviar seeds -> node seeds/loja.seed.js ou node seeds/index.js
Salve -> npm install --save-dev nodemon e npm run dev
Criar migration -> npm run migration:create create_categorias


deploy monolítico
Se for usar a Opção A (Monolítico - Backend e Frontend na mesma URL):
javascript


// Detecta se está rodando na sua máquina ou no servidor em produção
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API_BASE_URL = isLocalhost 
    ? "http://localhost:3000" 
    : window.location.origin; // Em produção usará o próprio domínio (ex: https://seu-app.up.railway.app)