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
    pgm.createTable("categorias", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    
    nome: {
      type: "varchar(255)",
      notNull: true,
    },

    nicho_id: {
      type: "integer",
      notNull: true,
      references: '"nicho"',
      referencesKey: '"id"',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    icone_url: {
      type: "varchar(500)",
      notNull: true,
    },

    cor: {
      type: "varchar(255)"
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

    views: {
      type: "integer",
      default: 0
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("categorias");
};
