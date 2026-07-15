/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("lojas", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    nome: {
      type: "varchar(255)",
      notNull: true,
    },

    endereco: {
      type: "varchar(255)",
      notNull: true,
    },

    telefone: {
      type: "varchar(20)",
    },

    nicho: {
      type: "varchar(100)",
      notNull: true,
    },

    logo_url: {
      type: "varchar(500)",
      notNull: true,
    },

    banner_url: {
      type: "varchar(500)",
      notNull: true,
    },

    descricao: {
      type: "text",
    },

    whatsapp: {
      type: "varchar(20)",
      notNull: true,
    },

    ativo: {
      type: "boolean",
      notNull: true,
      default: true,
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    views: {
      type: "integer",
      default: 0
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("lojas");
};
