const pool = require("../database/connection.js")

async function seedLojas() {

    await pool.query(`
        INSERT INTO lojas
        (
            nome,
            endereco,
            telefone,
            nicho,
            logo_url,
            banner_url,
            descricao,
            whatsapp,
            ativo
        )

        VALUES

        (
            'Paris Perfumaria',
            'Rua Manoel Procópio Nº59',
            '(75) 983384725',
            'Cosméticos',
            '/uploads/logo/logo-paris.jpeg',
            '/uploads/banners/perfumaria-store.jpeg',
            'Loja especializada em cosméticos.',
            '(75) 983384725',
            true
        ),
        (
            'Morena Rosa',
            'Rua Manoel Procópio Nº59',
            '(75) 983384725',
            'Moda',
            '/uploads/logo/logo-morena-rosa.png',
            '/uploads/banners/morena-rosa-banner.webp',
            'Loja especializada em moda feminina.',
            '(75) 983384725',
            true
    );
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedLojas
