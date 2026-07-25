
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
    pgm.createTable("usuarios", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    loja_id: {
      type: "integer",
      references: "lojas",
      referencesConstraintName: "fk_lojas_usuarios",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    nome: {
      type: "varchar(255)",
      notNull: true,
    },

    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true
    },

    password_hash: {
      type: "varchar(255)",
      notNull: true
    },

    tipo: {
      type: "varchar(255)",
      notNull: true,
      default: "cliente"
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
    }
    
  });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("usuarios");
};
