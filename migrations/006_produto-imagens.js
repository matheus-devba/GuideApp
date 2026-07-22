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
    pgm.createTable("produto_imagens", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    produto_id: {
      type: "integer",
      notNull: true,
      references: "produtos",
      referencesConstraintName: "fk_produtos_produto_imagens",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    url: {
      type: "varchar(500)",
      notNull: true,
    },

    ordem: {
      type: "integer",
      notNull: true
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    }
    
  });
  
  pgm.addConstraint(
    "produto_imagens",
    "uq_produto_imagens_produto_ordem",
    {
      unique: ["produto_id", "ordem"],
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("produto_imagens");
};
