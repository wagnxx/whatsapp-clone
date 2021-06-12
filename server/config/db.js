// var sqlite3 = require('sqlite3').verbose();
// // var db = new sqlite3.Database(':memory:');
// var db = new sqlite3.Database('whatsapp-clone.db');

// const users = 'users';
// const userTableCreateSql =
//   'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT  , name chart(50) ,nick_name chart(50),email chart(150))';

// db.serialize(async function () {
//   let exist = await getTable(users, db);

//   if (!exist) {
//     db.run(userTableCreateSql);
//   }

//   const userRowsNums = await getTableRowsNum(users, db);
//   console.log(userRowsNums);
//   if (userRowsNums < 20) {
//     // var stmt = db.prepare('INSERT INTO users VALUES (NULL,?,?,?)');
//     // for (var i = 0; i < 10; i++) {
//     //   stmt.run(
//     //     'Ipsum ' + i,
//     //     'nick_name' + i * 10,
//     //     'emalcompany' + i + '@qq.com'
//     //   );
//     // }
//     // stmt.finalize();
//     db.get('select * from  users where id > 2 ', function (err, row) {
//       console.log('row', row);

//       console.log('err', err);
//     });
//   } else {
//     console.log('已经超过20条数据');
//   }

//   // db.each('SELECT rowid as rid,* FROM users ', function (err, row) {
//   //   console.log(row.email);
//   // });
//   // db.close();
// });

// function getTable(tbname) {
//   let sql =
//     "SELECT COUNT(*) as count FROM sqlite_master where type ='table' and name ='" +
//     tbname +
//     "'";

//   return new Promise((resolve, reject) => {
//     db.each(sql, function name(err, row) {
//       if (row.count >= 1) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     });
//   });
// }

// function getTableRowsNum(tbname) {
//   let sql = 'SELECT COUNT(*) as count FROM "' + tbname + '"';
//   return new Promise((resolve, reject) => {
//     db.each(sql, function name(err, row) {
//       resolve(row.count);
//     });
//   });
// }

const sqlite3 = require('sqlite3').verbose();
var db;

exports.db = db;

exports.open = function (path) {
  return new Promise(function (resolve) {
    this.db = new sqlite3.Database(path, function (err) {
      if (err) reject('Open error: ' + err.message);
      else resolve(path + ' opened');
    });
  });
};

// any query: insert/delete/update
exports.run = function (query, params = []) {
  return new Promise(function (resolve, reject) {
    this.db.run(query, params, function (err) {
      if (err) reject(err.message);
      else resolve(true);
    });
  });
};

// first row read
exports.get = function (query, params) {
  return new Promise(function (resolve, reject) {
    this.db.get(query, params, function (err, row) {
      if (err) reject('Read error: ' + err.message);
      else {
        resolve(row);
      }
    });
  });
};

// set of rows read
exports.all = function (query, params) {
  return new Promise(function (resolve, reject) {
    if (params == undefined) params = [];

    this.db.all(query, params, function (err, rows) {
      if (err) reject('Read error: ' + err.message);
      else {
        resolve(rows);
      }
    });
  });
};

// each row returned one by one
exports.each = function (query, params, action) {
  return new Promise(function (resolve, reject) {
    var db = this.db;
    db.serialize(function () {
      console.log('执行each:', query, params);
      db.each(query, params, function (err, row) {
        if (err) reject('Read error: ' + err.message);
        else {
          if (row) {
            action(row);
          }
        }
      });
      db.get('', function (err, row) {
        resolve(true);
      });
    });
  });
};

exports.close = function () {
  return new Promise(function (resolve, reject) {
    this.db.close();
    resolve(true);
  });
};
