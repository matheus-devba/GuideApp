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
    pgm.createTable("listas", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    loja_id: {
      type: "integer",
      notNull: true,
      references: "lojas",
      referencesConstraintName: "fk_lojas_listas",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    nome: {
      type: "varchar(255)",
      notNull: true,
    },

    views: {
      type: "integer",
      default: 0,
    },

    descricao: {
      type: "text",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    }
    
  });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("listas");
};
