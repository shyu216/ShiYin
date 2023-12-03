import SQLite, { SQLiteDatabase, ResultSet } from 'react-native-sqlite-storage';

let db: SQLiteDatabase | null = null;

export const openDatabase = (): void => {
  db = SQLite.openDatabase({ name: 'poem.db', createFromLocation: 1 }, () => { }, error => {
    console.log(error);
  });


  // check if the tables are created
  // db.transaction((tx) => {
  //   tx.executeSql(
  //     "SELECT name FROM sqlite_master WHERE type='table' AND name='ci'",
  //     [],
  //     (tx, results) => {
  //       if (results.rows.length == 0) {
  //         tx.executeSql(
  //           "CREATE TABLE ci (id INTEGER PRIMARY KEY AUTOINCREMENT, rhythmic TEXT, author TEXT, paragraphs TEXT, tags TEXT)",
  //           [],
  //           (tx, results) => {
  //             console.log("Table 'ci' created");
  //           },
  //           (tx, error) => {
  //             console.log("Table 'ci' could not be created");
  //           }
  //         );
  //       } else {
  //         console.log("Table 'ci' already exists");
  //       }
  //     },
  //     (tx, error) => {
  //       console.log("Table 'ci' could not be checked");
  //     }
  //   );
  // });

}

export const executeSql = (sql: string, params: any[] = []): Promise<ResultSet> => new Promise((resolve, reject) => {
  if (db) {
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (error) => {
          reject(error);
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