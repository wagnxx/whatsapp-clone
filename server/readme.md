# whatsapp-clone server end

主要用 socket.io 通信 和 即将用 sqlite 存储相应数据

### sqlite 的基本操作有:

- 创建数据库 .open dbName.db 会创建一个 db 文件
  - 打开数据库 : sqlite3 dbName.db
  - 附件数据库 attach dbName.db as 'dbName-alias.db'
  - 分离数据库 detach database aliase-name
- 创建表

```js
sqlite> CREATE TABLE COMPANY(
   ID INT PRIMARY KEY     NOT NULL,
   NAME           TEXT    NOT NULL,
   AGE            INT     NOT NULL,
   ADDRESS        CHAR(50),
   SALARY         REAL
);
```

- 查看表详情 : .shema tableName
- 表列表: .tables

- 插入 insert (同 mysql)

```js
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (1, 'Paul', 32, 'California', 20000.00 );


INSERT INTO COMPANY VALUES (7, 'James', 24, 'Houston', 10000.00 );

```

- select 语句 (同 mysql) select \* from Table_name

```js
// 格式化输出
sqlite>.header on
sqlite>.mode column    // .width 10 20 10   .width on
sqlite> SELECT * FROM COMPANY;

select (15 + 6) as addtion


sqlite> SELECT * FROM COMPANY
        WHERE AGE > (SELECT AGE FROM COMPANY WHERE SALARY > 65000);

sqlite> SELECT * FROM COMPANY
        WHERE AGE > (SELECT AGE FROM COMPANY WHERE SALARY > 65000);



```

- sqlite 运算符

```js
// SQLite 比较运算符
// 假设变量 a=10，变量 b=20，则：

// 运算符	描述	实例
// ==	检查两个操作数的值是否相等，如果相等则条件为真。	(a == b) 不为真。
// =	检查两个操作数的值是否相等，如果相等则条件为真。	(a = b) 不为真。
// !=	检查两个操作数的值是否相等，如果不相等则条件为真。	(a != b) 为真。
// <>	检查两个操作数的值是否相等，如果不相等则条件为真。	(a <> b) 为真。
// >	检查左操作数的值是否大于右操作数的值，如果是则条件为真。	(a > b) 不为真。
// <	检查左操作数的值是否小于右操作数的值，如果是则条件为真。	(a < b) 为真。
// >=	检查左操作数的值是否大于等于右操作数的值，如果是则条件为真。	(a >= b) 不为真。
// <=	检查左操作数的值是否小于等于右操作数的值，如果是则条件为真。	(a <= b) 为真。
// !<	检查左操作数的值是否不小于右操作数的值，如果是则条件为真。	(a !< b) 为假。
// !>	检查左操作数的值是否不大于右操作数的值，如果是则条件为真。	(a !> b) 为真。

位操作
& | ~ <<  >>
```

- update

```js


sqlite> UPDATE COMPANY SET ADDRESS = 'Texas', SALARY = 20000.00  where id=6;

// 如果您想修改 COMPANY 表中 ADDRESS 和 SALARY 列的所有值，则不需要使用 WHERE 子句，UPDATE 查询如下：

sqlite> UPDATE COMPANY SET ADDRESS = 'Texas', SALARY = 20000.00;

```

- delete

```js
 DELETE FROM COMPANY WHERE ID = 7;
 // 删除所有 去掉where
  DELETE FROM COMPANY ;

```

- 模块查询

```js
// like
%: >=0 的字符
_: 单个字符

// Glob
* : >=0
? : 单个字符


// 语句	描述
// WHERE SALARY GLOB '200*'	查找以 200 开头的任意值
// WHERE SALARY GLOB '*200*'	查找任意位置包含 200 的任意值
// WHERE SALARY GLOB '?00*'	查找第二位和第三位为 00 的任意值
// WHERE SALARY GLOB '2??'	查找以 2 开头，且长度至少为 3 个字符的任意值
// WHERE SALARY GLOB '*2'	查找以 2 结尾的任意值
// WHERE SALARY GLOB '?2*3'	查找第二位为 2，且以 3 结尾的任意值
// WHERE SALARY GLOB '2???3'	查找长度为 5 位数，且以 2 开头以 3 结尾的任意值
```

- limit
- order by
  - Order by [columName] [asc | desc]
- having

```js

SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY


SELECT column1, column2
FROM table1, table2
WHERE [ conditions ]
GROUP BY column1, column2
HAVING [ conditions ]
ORDER BY column1, column2



 SELECT * FROM COMPANY GROUP BY name HAVING count(name) < 2;
```

- join
  - cross join
  - inner join
  - outer join 类似 sql 的 left join

### sqlite 高级操作

- alter

* 在 SQLite 中，除了重命名表和在已有的表中添加列，ALTER TABLE 命令不支持其他操作。

- alter table tbname rename to new_tbname
- 新增新的一列 : alter table dbname add column column_def
