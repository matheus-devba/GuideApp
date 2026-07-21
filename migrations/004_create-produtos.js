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
    pgm.createTable("produtos", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    loja_id: {
      type: "integer",
      notNull: true,
      references: "lojas",
      referencesConstraintName: "fk_produtos_loja",
      onUpdate: 'CASCADE',
      onDelete: "CASCADE"
    },

    categoria_id: {
      type: "integer",
      notNull: true,
      references: "categorias",
      referencesConstraintName: "fk_produtos_categorias",
      onUpdate: 'CASCADE',
      onDelete: "RESTRICT"
    },

    nome: {
      type: "varchar(255)",
      notNull: true
    },

    preco_normal: {
    type: 'numeric',
    precision: 10,
    scale: 2,
    notNull: true,
    },

    preco_promocional: {
    type: 'numeric',
    precision: 10,
    scale: 2
    },

    descricao: {
      type: "text",
    },


    ativo: {
      type: "boolean",
      notNull: true,
      default: true,
    },

    destaque: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
      notNull: true
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

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("produtos");
};
