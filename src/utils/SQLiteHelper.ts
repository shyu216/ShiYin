import SQLite, { SQLiteDatabase, ResultSet } from 'react-native-sqlite-storage';
import { readPoems } from './PoetryReader';

let db: SQLiteDatabase | null = null;

const log = (message: string, ...optionalParams: any[]) => {
  console.log(`[SQLiteHelper] ${message}`, ...optionalParams);
};

export const initDatabase = async (): Promise<string> => {
  if (db) {
    const checkIfEmpty = () => {
      return new Promise((resolve, reject) => {
        if (db) {
          db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Poems", [], (_, { rows }) => {
              if (rows.length === 0) {
                log("Poems is empty");
                resolve(true);
              } else {
                log("Poems is not empty");
                resolve(false);
              }
            }, (e) => {
              log('Transaction error: ', e);
              resolve(true);
            });
          }, (e) => {
            log('Transaction error: ', e);
            resolve(true);
          });
        } else {
          log("Database not opened");
          resolve(false);
        }
      });
    }

    const is_empty = await checkIfEmpty();

    if (is_empty) {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Poems (
              id INTEGER PRIMARY KEY,
              title BLOB,
              author BLOB,
              content BLOB,
              chapter BLOB,
              section BLOB
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Tags (
              id INTEGER PRIMARY KEY,
              tag BLOB
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Poet_Tags (
              poet_id INTEGER,
              tag_id INTEGER,
              PRIMARY KEY (poet_id, tag_id),
              FOREIGN KEY (poet_id) REFERENCES Poets (id),
              FOREIGN KEY (tag_id) REFERENCES Tags (id)
          );`
        );
      }, (e) => {
        log('Transaction error: ', e);
      }, () => {
        
      });

      await readPoems(db);
      return "Poems inserted";
    } else {
      log("Poems is not empty, no need to insert");
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Poems", [], (_, { rows }) => {
          log("Poems: ", rows.length);
        });
        tx.executeSql("SELECT * FROM Tags", [], (_, { rows }) => {
          log("Tags: ", rows.length);
        });
        tx.executeSql("SELECT * FROM Poet_Tags", [], (_, { rows }) => {
          log("Poet_Tags: ", rows.length);
        });
      }, (e) => {
        log('Transaction error: ', e);
      }, () => {
        log('Database created successfully');
      });
    }
    return "Poems is not empty, no need to insert";
  } else {
    log("Database not opened");
    return "Database not opened";
  }
}

export const openDatabase = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (db) {
      log("Database already opened");
      resolve("Database already opened");
    } else {
      db = SQLite.openDatabase({ name: 'MainDB' }, () => {
        log("Database opened");
        resolve("Database opened");
      }, (e) => {
        log("Database open error", e);
        reject(e);
      });
    }
  });
}

export const executeSql = (sql: string, params: any[] = []): Promise<ResultSet> => new Promise((resolve, reject) => {
  log("Execute", sql, params);
  if (db) {
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (e) => {
          reject(e);
        });
    });
  } else {
    reject("Database not opened");
  }
});

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
    log("Database closed");
  } else {
    log("Database was not opened");
  }
};

export const clearDatabase = (): void => {
  if (db) {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE IF EXISTS Poems");
      tx.executeSql("DROP TABLE IF EXISTS Tags");
      tx.executeSql("DROP TABLE IF EXISTS Poet_Tags");
    }, (e) => {
      log('Transaction error: ', e);
    }, () => {
      log('Database dropped successfully');
    });
    log("Database cleared");
  } else {
    log("Database was not opened");
  }
}