**Q**: What’s the difference between DROP and TRUNCATE?  
**A**: DROP permanently deletes the object/table, whereas TRUNCATE deletes only rows and preserves the structure of the table. And it is MUCH FASTER.
1. **Row Deletion**:
    - **DELETE**: You can delete specific rows using a WHERE clause.
    - **TRUNCATE**: It removes all rows from the table without the option to specify conditions.
2. **Data Recovery**:
    - **DELETE**: Data can be recovered if the database supports transaction logging, as it logs each row deletion.
    - **TRUNCATE**: Data cannot be recovered because it does not log individual row deletions.
3. **Performance**:
    - **DELETE**: It is slower because it processes each row individually and logs each deletion.
    - **TRUNCATE**: It is faster because it deallocates the data pages used by the table, effectively resetting it.
4. **AUTO_INCREMENT Behavior**:    
    - **DELETE**: The AUTO_INCREMENT counter is not reset when rows are deleted.
    - **TRUNCATE**: The AUTO_INCREMENT counter is reset, meaning the next inserted row will start from the initial value.
<!--ID: 1743102704066-->


**Q**: Какие агрегатные функции знаешь?  
**A**: AVG, SUM, MIN, MAX, COUNT
<!--ID: 1743102704123-->


**Q**: What’s the difference between WHERE and HAVING?  
**A**: WHERE is executed before GROUP BY ||| HAVING after GROUP BY. `WHERE` работает с отдельными строками, а `HAVING` — с агрегированными результатами.
<!--ID: 1743102704164-->


**Q**: Что такое JOIN и для чего они используются в SQL?  
**A**: Это оператор, который используется для объединения строк из нескольких таблиц в одну общую между ними. JOIN позволяет представлять такие объединенные данные в одном результирующем наборе данных.
<!--ID: 1743102704721-->

**Q**: What is relational database?  
**A**: Relational database is the one that has a **relational** model in its core. In such databases the data is structured in tables with columns and rows. The tables can be connected with each other(relations).
<!--ID: 1743150463537-->


**Q**: Чем PostgreSQL немного отличается от других реляционных баз данных, что дает ей преимущество?  
**A**: Тем что это объектно-реляционная СУБД.
<!--ID: 1743150463572-->


**Q**: The DATE() operator feature?  
**A**: Функция DATE()позволяет исключить время при указании параметров даты.
<!--ID: 1743665095747-->


**Q**: Для чего используется оператор CASE в SQL?  
**A**: Оператор CASE это по сути как if-elif-else в питоне. Он помогает применять определенную пользователем логику и на основе этой логики создаёт _поле\столбец_, возвращающее значение в зависимости от условия. `CASE WHEN TOTAL < 2.00 THEN 'Baseline Purchase' END`.
<!--ID: 1743665095793-->


**Q**: Зачем в базах данных нужно иметь несколько таблиц?  
**A**: Для нормализации данных.
<!--ID: 1743665095838-->


**Q**: **DELETE** removes all the data from a table, but it DID NOT ...  
**A**: resets the auto-incrementing sequence with a SERIAL or AUTO-INCREMENT column. **TRUNCATE** does reset the sequence in MySQL and PostgreSQL.
<!--ID: 1743666278689-->

**Q**: What default JOIN is used when no other is defined?  
**A**: INNER JOIN. Default is INNER until the OUTER is defined in a query. 

**Q**: Which database doesn't support RIGHT OUTER JOIN?  
**A**: Fucking SQLite. Poor guy.

**Q**: Чего SQLite не поддерживает?  
**A**: Сетевого взаимодействие. Так как она легковесная дисковая база данных.

**Q**: Какое ограничение SQLite имеет в пользовательском доступе?  
**A**: при **многопользовательском доступе**, так как он работает по принципу: *один пишет-многие читают*.

**Q**: Определение ограничений в SQL
**A**: Ограничения накладываемые на выполнение операций с целью сохранения согласованности данных

**Q**: Какие есть типы ограничений в sql?
**A**: primary key, foreign key, check, unique, not null