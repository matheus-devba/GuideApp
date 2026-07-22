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
    pgm.createTable("lista_produto", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    lista_id: {
      type: "integer",
      notNull: true,
      references: "listas",
      referencesConstraintName: "fk_listas_lista_produto",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    produto_id: {
      type: "integer",
      notNull: true,
      references: "produtos",
      referencesConstraintName: "fk_produtos_lista_produto",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    created_at: {
    type: "timestamp",
    notNull: true,
    default: pgm.func("CURRENT_TIMESTAMP"),
    }
    
  });

    pgm.addConstraint(
    "lista_produto",
    "uq_lista_produto",
    {
        unique: ["lista_id", "produto_id"],
    }
    );

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("lista_produto");
};
