const bcrypt = require('bcrypt');

export async function verificarSenha(senhaOriginal) {
    // 2. Como verificar a senha no momento do login
    const senhaCorreta = await bcrypt.compare(senhaOriginal, password_hash);
    console.log('Senha está correta?', senhaCorreta); // Retorna true
}

export async function criarHash(senhaOriginal) {
    // 1. Gera o hash (O número 10 é o custo/segurança do algoritmo)
    const password_hash = await bcrypt.hash(senhaOriginal, 10);
    console.log('Hash para salvar no banco:', password_hash);
}

gerenciarSenha();
