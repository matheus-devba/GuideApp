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

    pgm.createTable("eventos", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    
    tipo_evento: {
      type: "varchar(50)",
      notNull: true,
    },

     loja_id: {
      type: "integer",
      references: "lojas",
      referencesConstraintName: "fk_lojas_eventos",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    produto_id: {
      type: "integer",
      references: "produtos",
      referencesConstraintName: "fk_produtos_eventos",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    lista_id: {
      type: "integer",
      references: "listas",
      referencesConstraintName: "fk_listas_eventos",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    }
})
    pgm.createIndex("eventos", ["produto_id"]);
    pgm.createIndex("eventos", ["loja_id"]);
    pgm.createIndex("eventos", ["lista_id"]);
    pgm.createIndex("eventos", ["tipo_evento"]);
    pgm.createIndex("eventos", ["created_at"]);

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("eventos")
};
