const bcrypt = require('bcrypt');

async function gerenciarSenha(senhaOriginal) {
    const senhaOriginal = 'MinhaSenhaSegura123';
    
    // 1. Gera o hash (O número 10 é o custo/segurança do algoritmo)
    const password_hash = await bcrypt.hash(senhaOriginal, 10);
    console.log('Hash para salvar no banco:', password_hash);

    // 2. Como verificar a senha no momento do login
    const senhaCorreta = await bcrypt.compare('MinhaSenhaSegura123', password_hash);
    console.log('Senha está correta?', senhaCorreta); // Retorna true
}

gerenciarSenha();
