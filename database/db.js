import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('estudo_musical.db');

export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS planos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plano_id INTEGER,
        descricao TEXT NOT NULL,
        concluida INTEGER DEFAULT 0,
        FOREIGN KEY (plano_id) REFERENCES planos(id)
      );`
    );
  });
};

export default db;
