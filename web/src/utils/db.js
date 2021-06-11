const DB_NAME = 'fe_whatsapp_db';
const STORE_NAME = 'files_store';
const DB_VERSION = 1;

function DBFunctor(dbName, dbVersion, opts) {
  this.init(dbName, dbVersion);
  this.__opts__ = opts || {};
  let DBOpenRequest = this.openDB();
  this.eventListener(DBOpenRequest);
}

DBFunctor.prototype.init = function (dbName, dbVersion) {
  this.name = dbName;
  this.version = dbVersion;
};

DBFunctor.prototype.openDB = function () {
  return window.indexedDB.open(this.name, this.version);
};

DBFunctor.prototype.createDefaultStore = function () {
  if (!this.db.objectStoreNames.contains(STORE_NAME)) {
    this.db.createObjectStore(STORE_NAME, {
      keyPath: 'id',
      autoIncrement: true,
    });
    console.log('创建一个新的空数据库');
    // personStore.createIndex('name', 'name', { unique: false });
    // personStore.createIndex('email', 'email', { unique: true });
  }
};


DBFunctor.prototype.eventListener = function (DBOpenRequest) {
  let _this = this;
  DBOpenRequest.onerror = function (event) {
    console.log('db open err', event);
  };
  DBOpenRequest.onsuccess = function (event) {
    _this.db = event.target.result;
  };

  DBOpenRequest.onupgradeneeded = function (event) {
    _this.db = event.target.result;
    if (
      _this.__opts__.callback &&
      typeof _this.__opts__.callback === 'function'
    ) {
      _this.__opts__.callback(_this.db);
    } else {
      _this.createDefaultStore();
    }
  };
};


DBFunctor.prototype.createStore = function (storeName) {
  if (!this.objectStoreNames.contains(storeName)) {
    return this.db.createObjectStore(storeName, {
      keyPath: 'id',
      autoIncrement: true,
    });
  }
};
DBFunctor.prototype.getStore = function (storeName, mode) {
  var tx = this.db.transaction([storeName], mode);
  return tx.objectStore(storeName);
};

let dbInstFunctory = function (n = DB_NAME, v = DB_VERSION, o = {}) {
  let db;
  return function create() {
    if (db) return db;
    return (db = new DBFunctor(n, v, o));
  };
};

let db = dbInstFunctory()();

function getObjectStore(store_name = STORE_NAME, mode = MODE.READ) {
  if (db) {
    return db.getStore(store_name, mode);
  } else {
    db = dbInstFunctory()();
    return null;
  }
}

const MODE = {
  READ_WRITE: 'readwrite',
  READ: 'readonly',
};

export { getObjectStore, STORE_NAME, MODE, db };
