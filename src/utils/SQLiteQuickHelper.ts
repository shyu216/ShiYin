import { open } from 'react-native-quick-sqlite';


let db: any = null;

export const openDatabase = (): void => {
  db = open({name: 'poem.db', location:'./src/assets/databases/poem.db'});
}

export const executeSql = (sql: string, params: any[] = []): Promise<any> => new Promise((resolve, reject) => {
  if (db) {
    resolve(db.execute(sql, params));
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
