const pool = require("../database/connection.js")

async function seedProdutos() {

    await pool.query(`
        INSERT INTO produtos
        (
            loja_id,
            categoria_id,
            nome,
            preco_normal,
            preco_promocional,
            descricao,
            destaque,
            forma_de_pagamento
        )

        VALUES

        (
            '3',
            '1',
            'Loção Nutritiva Desodorante Nativa Spa Uva Merlot 400ml',
            '89.90',
            '79.90',
            'A Loção Nutritiva Desodorante Nativa Spa Uva Merlot te convida a degustar o prazer da sua própria companhia com a potência de um tratamento que desacelera os principais sinais do tempo desde o primeiro uso¹, recuperando o tempo que sempre foi seu.',
            true,
            '2x sem juros'
        ),
        (
            '3',
            '12',
            'Floratta Rose Perfume Feminino Floral Spray 75ml Vegano Cruelty-Free',
            '13.90',
            '99.90',
            'O Perfume Feminino Floratta Rose Colônia 75ml é a escolha perfeita para a mulher romântica que busca uma fragrância floral e delicada.',
            true,
            '2x sem juros'
        ),
        (
            '4',
            '13',
            'Conjunto Morena Rosa Camisa Manga Longa Calça Wide Cintura Média Azul',
            '2039.90',
            '1999.90',
            'Os conjuntos da Morena Rosa unem versatilidade, praticidade e o melhor da moda para criar produções que expressam uma mulher encantadora e inesquecível.',
            true,
            'ou 12x de R$ 169,99 sem juros
'
    );
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedProdutos
