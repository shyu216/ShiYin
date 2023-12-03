import SQLite, { SQLiteDatabase, ResultSet } from 'react-native-sqlite-storage';
import { readPoems } from './PoetryReader';

let db: SQLiteDatabase | null = null;


export const initDatabase = async (): Promise<void> => {
  if (db) {
    // check if the poetry is already in the database
    // if not, insert
    const checkIfEmpty = () => {
      return new Promise((resolve, reject) => {
        if (db) {
          db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Poems", [], (_, { rows }) => {
              if (rows.length === 0) {
                console.log("Poems is empty");
                resolve(true);
              } else {
                console.log("Poems is not empty");
                resolve(false);
              }
            }, (e) => {
              console.log('transaction error: ', e);
              reject(e);
            });
          }, (e) => {
            console.log('transaction error: ', e);
            reject(e);
          });
        } else {
          reject("Database not opened");
        }
      });
    }

    // 使用
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
        console.log('transaction error: ', e);
      }, () => {
        console.log('database : ', 'Poems, Tags, Poet_Tags created successfully');
      });

      await readPoems(db);
    } else {
      console.log("Poems is not empty, no need to insert");
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Poems", [], (_, { rows }) => {
          console.log("Poems: ", rows.length);
        });
        tx.executeSql("SELECT * FROM Tags", [], (_, { rows }) => {
          console.log("Tags: ", rows.length);
        });
        tx.executeSql("SELECT * FROM Poet_Tags", [], (_, { rows }) => {
          console.log("Poet_Tags: ", rows.length);
        });
      }, (e) => {
        console.log('transaction error: ', e);
      }, () => {
        console.log('database : ', 'Poems, Tags, Poet_Tags created successfully');
      });
    }
  } else {
    console.log("Database not opened");
  }
}


export const openDatabase = (): void => {
  if (db) {
    console.log("Database already opened");
  } else {
    db = SQLite.openDatabase({ name: 'poetry.db', createFromLocation: 1 }, () => {
      console.log("Database opened");
    }, (e) => {
      console.log("Database open error", e);
    });
  }
}

export const executeSql = (sql: string, params: any[] = []): Promise<ResultSet> => new Promise((resolve, reject) => {
  console.log("executeSql", sql, params);
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
  } else {
    console.log("Database was not OPENED");
  }
};

export const clearDatabase = (): void => {
  if (db) {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE IF EXISTS Poems");
      tx.executeSql("DROP TABLE IF EXISTS Tags");
      tx.executeSql("DROP TABLE IF EXISTS Poet_Tags");
    }, (e) => {
      console.log('transaction error: ', e);
    }, () => {
      console.log('database : ', 'Poems, Tags, Poet_Tags dropped successfully');
    });
    console.log("Database cleared");
  } else {
    console.log("Database was not OPENED");
  }
}