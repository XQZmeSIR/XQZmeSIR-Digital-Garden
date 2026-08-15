---
publish: true
draft: true
created: 2026-04-05 19:13
modified: 2026-04-05T20:41:49.740+03:00
---

Ниже — нормальный практический гайд без воды. Цель простая:

1. у тебя есть очищенный CSV
2. ты хочешь загрузить его в PostgreSQL
3. ты хочешь понимать **не только “куда нажать в DBeaver”**, а **что реально происходит на уровне SQL и CLI**

---

# Общая логика процесса

Импорт CSV в PostgreSQL — это не “магия DBeaver”. Это почти всегда одна и та же цепочка:

1. **Изучить CSV**
2. **Определить схему таблицы**
3. **Создать таблицу**
4. **Загрузить данные**
5. **Проверить результат**
6. **При необходимости — добавить индексы / ограничения / очистку**

Это важно:
**главная работа не в кнопке Import, а в правильной схеме таблицы.**

Если схема плохая — импорт пройдет, но база будет мусорной.
Если схема хорошая — потом SQL-анализ будет нормальным.

---

# Что нужно решить до импорта

Перед загрузкой CSV в Postgres нужно понять 6 вещей:

## 1. Есть ли заголовок

Пример:

```csv
id,name,age,city
1,Alex,25,Berlin
2,John,31,Paris
```

Здесь первая строка — header.

## 2. Какой разделитель

Чаще всего:

- `,`
- `;`
- `\t` (tab)

## 3. Как кодируются пропуски

Например:

- пустая строка
- `NULL`
- `NaN`
- `N/A`
- `unknown`

## 4. Какие типы данных у столбцов

Например:

- `integer`
- `numeric`
- `text`
- `date`
- `timestamp`
- `boolean`

## 5. Нужен ли surrogate key

Часто CSV не имеет хорошего первичного ключа. Тогда стоит добавить:

```sql
id bigserial primary key
```

## 6. Нужна ли staging-таблица

Очень полезный подход:

- **staging table** — грузим “как есть”
- **final table** — потом нормализуем и кастуем типы

Это особенно полезно, если CSV грязный.

---

# Подходы импорта

Есть 3 нормальных практических сценария:

## Вариант A — быстро и просто

Создать таблицу и импортировать CSV напрямую через DBeaver.

Подходит, если:

- CSV небольшой/средний
- данные уже очищены
- ты хочешь быстро потренироваться

## Вариант B — через `psql`

Использовать:

- SQL `COPY`
- meta-command `\copy`

Это уже ближе к реальной работе.

## Вариант C — через staging table

Сначала грузишь всё в строки/text, потом отдельным SQL приводишь типы.

Это самый устойчивый подход для грязных данных.

---

# Сначала — как проектировать таблицу

Допустим, CSV такой:

```csv
customer_id,full_name,age,signup_date,spent_amount,is_active
101,Alex Smith,29,2024-01-15,120.50,true
102,John Brown,34,2024-02-10,89.99,false
```

Тогда таблица может быть такой:

```sql
create table customers (
    customer_id integer primary key,
    full_name text not null,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

## Как выбирать типы

### `text`

Используй по умолчанию для строк.
Не надо избыточно лепить `varchar(255)`, если нет бизнес-причины.

### `integer` / `bigint`

Для целых чисел.
`bigint` — если значений очень много.

### `numeric(12,2)`

Для денег и точных чисел.
Не используй `float` для финансов.

### `date`

Если только дата.

### `timestamp`

Если дата + время.

### `boolean`

Для `true/false`.

---

# Практический совет по EDA перед импортом

Перед загрузкой через Pandas проверь:

```python
import pandas as pd

df = pd.read_csv("data.csv")

print(df.head())
print(df.info())
print(df.isna().sum())
print(df.nunique())
```

Полезно еще посмотреть:

```python
print(df.dtypes)
```

Если хочешь подготовить CSV под PostgreSQL, часто полезно:

```python
df.columns = (
    df.columns
      .str.strip()
      .str.lower()
      .str.replace(" ", "_")
      .str.replace(r"[^\w]+", "_", regex=True)
)
```

То есть привести имена столбцов к виду:

- `Customer ID` → `customer_id`
- `Spent Amount ($)` → `spent_amount`

Это сильно упрощает жизнь в SQL.

---

# Импорт через DBeaver

## Способ 1 — создать таблицу и импортировать CSV

### Шаг 1

Подключаешься к базе в DBeaver.

### Шаг 2

Создаешь таблицу через SQL Editor:

```sql
create table customers (
    customer_id integer primary key,
    full_name text,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

### Шаг 3

Правый клик по таблице → **Import Data**

### Шаг 4

Выбираешь CSV-файл.

### Шаг 5

Настраиваешь:

- delimiter
- header
- encoding
- mapping columns

### Шаг 6

Запускаешь импорт.

---

## Способ 2 — DBeaver сам создаст таблицу

Иногда DBeaver умеет на основе CSV сам предложить схему. Это удобно, но не идеально.

Проблема:
он может неверно определить типы:

- дату засунуть в text
- числа в varchar
- boolean не распознать
- длины строк оценить криво

Для обучения это нормально, но для хорошей практики лучше:

1. сначала самому определить схему
2. потом импортировать

---

# Проверка после импорта

После любого импорта сразу выполняй:

```sql
select * from customers limit 10;
```

```sql
select count(*) from customers;
```

```sql
select count(*) filter (where customer_id is null) as null_customer_id,
       count(*) filter (where full_name is null) as null_full_name
from customers;
```

Если нужно проверить дубликаты:

```sql
select customer_id, count(*)
from customers
group by customer_id
having count(*) > 1;
```

---

# Импорт через `psql`

Теперь к важному. В PostgreSQL есть две похожие, но принципиально разные вещи:

## 1. `COPY`

SQL-команда PostgreSQL-сервера.

Пример:

```sql
COPY customers(customer_id, full_name, age, signup_date, spent_amount, is_active)
FROM '/absolute/path/to/customers.csv'
WITH (
    FORMAT csv,
    HEADER true
);
```

## 2. `\copy`

Это команда клиента `psql`, которая читает файл **с машины клиента**, а не с машины сервера.

Пример:

```sql
\copy customers(customer_id, full_name, age, signup_date, spent_amount, is_active) \
from '/Users/you/data/customers.csv' \
with (format csv, header true)
```

---

# Ключевое различие: `COPY` vs `\copy`

## `COPY`

- выполняется сервером Postgres
- файл должен быть доступен **серверу**
- часто требует повышенных прав
- очень быстрый

## `\copy`

- выполняется через клиент `psql`
- файл читается с твоего локального компьютера
- обычно удобнее в локальной практике
- в реальной жизни используется очень часто

Для твоего случая на локальном Mac почти всегда удобнее именно:

```sql
\copy ...
```

---

# Полный сценарий через `psql`

## Шаг 1. Подключиться

```bash
psql -U your_user -d your_database -h localhost -p 5432
```

Например:

```bash
psql -U postgres -d kaggle_practice -h localhost -p 5432
```

Если хочешь сразу через connection string:

```bash
psql "host=localhost port=5432 dbname=kaggle_practice user=postgres"
```

---

## Шаг 2. Создать таблицу

```sql
create table customers (
    customer_id integer primary key,
    full_name text,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

---

## Шаг 3. Импортировать через `\copy`

```sql
\copy customers(customer_id, full_name, age, signup_date, spent_amount, is_active)
from '/Users/yourname/Desktop/customers.csv'
with (format csv, header true);
```

Если разделитель `;`, то:

```sql
\copy customers
from '/Users/yourname/Desktop/customers.csv'
with (format csv, header true, delimiter ';');
```

Если null представлен пустой строкой:

```sql
\copy customers
from '/Users/yourname/Desktop/customers.csv'
with (format csv, header true, null '');
```

---

## Шаг 4. Проверить

```sql
select count(*) from customers;
select * from customers limit 10;
```

---

# Если хочется через SQL `COPY`

Это делается так:

```sql
COPY customers
FROM '/absolute/path/to/customers.csv'
WITH (FORMAT csv, HEADER true);
```

Но на локальной машине часто упираешься в:

- права доступа
- доступность файла для сервера
- ограничения Postgres

Поэтому для практики лучше держать в голове правило:

**локальный импорт руками → `\copy`**
**серверный controlled import → `COPY`**

---

# Импорт через `pgcli`

`pgcli` — это по сути более приятный клиент к Postgres.
Он поддерживает SQL и psql-подобные штуки, но в реальной практике надо помнить:

- SQL-команда `COPY` — работает как SQL
- `\copy` зависит от клиентской поддержки meta-команд

Часто безопаснее мыслить так:

## В `pgcli` используешь:

1. подключение
2. создание таблицы
3. SQL-запросы
4. если `\copy` ведет себя нестабильно — идешь в обычный `psql`

Подключение:

```bash
pgcli postgresql://postgres:password@localhost:5432/kaggle_practice
```

Или:

```bash
pgcli -h localhost -p 5432 -U postgres kaggle_practice
```

После входа:

```sql
create table customers (
    customer_id integer primary key,
    full_name text,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

Дальше либо пробуешь:

```sql
\copy customers
from '/Users/yourname/Desktop/customers.csv'
with (format csv, header true);
```

либо используешь `psql` для самого импорта, а `pgcli` оставляешь для работы с SQL.

Мой практический совет:
**для загрузки CSV держи основным инструментом `psql`, а не `pgcli`.**
`pgcli` хорош как shell для запросов, но не как основной ingestion-инструмент.

---

# Самый надежный подход: staging table

Если CSV грязный, не пытайся сразу идеально кастовать всё в финальные типы.
Сначала грузишь в сырой слой.

## Шаг 1. Создать staging table

```sql
create table staging_customers (
    customer_id text,
    full_name text,
    age text,
    signup_date text,
    spent_amount text,
    is_active text
);
```

## Шаг 2. Загрузить CSV

```sql
\copy staging_customers
from '/Users/yourname/Desktop/customers.csv'
with (format csv, header true);
```

## Шаг 3. Создать финальную таблицу

```sql
create table customers (
    customer_id integer primary key,
    full_name text,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

## Шаг 4. Перелить с преобразованием

```sql
insert into customers (
    customer_id,
    full_name,
    age,
    signup_date,
    spent_amount,
    is_active
)
select
    customer_id::integer,
    full_name,
    nullif(age, '')::integer,
    nullif(signup_date, '')::date,
    nullif(spent_amount, '')::numeric(12,2),
    nullif(is_active, '')::boolean
from staging_customers;
```

Это уже хороший инженерный подход.

---

# Почему staging table сильнее прямого импорта

Потому что реальный CSV часто содержит:

- пустые строки
- смешанные типы
- “N/A”
- мусор в числовом поле
- кривые даты
- пробелы
- дубликаты

Если ты грузишь сразу в final table, импорт ломается на первой проблемной строке.

Если грузишь в staging:

- данные заходят
- потом ты диагностируешь мусор SQL-запросами
- потом исправляешь

---

# Полезные SQL-проверки после staging

## Найти строки, где age не число

```sql
select *
from staging_customers
where age is not null
  and age <> ''
  and age !~ '^\d+$';
```

## Найти кривые даты

Напрямую проверить дату regex-ом можно грубо:

```sql
select *
from staging_customers
where signup_date is not null
  and signup_date <> ''
  and signup_date !~ '^\d{4}-\d{2}-\d{2}$';
```

## Найти странные boolean

```sql
select distinct is_active
from staging_customers;
```

---

# Если CSV уже очищен в Pandas

Хороший вариант — подготовить CSV так, чтобы Postgres его съел без борьбы.

Например:

```python
import pandas as pd

df = pd.read_csv("raw.csv")

df.columns = (
    df.columns
      .str.strip()
      .str.lower()
      .str.replace(" ", "_")
      .str.replace(r"[^\w]+", "_", regex=True)
)

df = df.drop_duplicates()

df.to_csv("clean.csv", index=False)
```

Если есть даты:

```python
df["signup_date"] = pd.to_datetime(df["signup_date"], errors="coerce").dt.date
```

Если есть булевы:

```python
df["is_active"] = df["is_active"].astype("boolean")
```

Если есть числовые:

```python
df["spent_amount"] = pd.to_numeric(df["spent_amount"], errors="coerce")
```

Потом сохраняешь:

```python
df.to_csv("clean.csv", index=False)
```

---

# Как автоматически получить SQL schema из Pandas

Pandas dtype не равен PostgreSQL dtype один в один, но можно использовать как черновик.

Пример грубой логики:

```python
print(df.dtypes)
```

Допустим:

```python
customer_id      int64
full_name       object
age              int64
signup_date     object
spent_amount    float64
is_active         bool
```

Из этого ты можешь сделать:

```sql
create table customers (
    customer_id bigint,
    full_name text,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

Но слепо автоматике доверять не надо.

---

# Если хочешь импортировать без ручного create table

Есть внешние способы, но для обучения лучше делать руками.
Почему:

- ты учишься мыслить как аналитик/инженер
- ты понимаешь типы
- ты начинаешь видеть data quality issues
- ты перестаешь зависеть от GUI

Кнопка “auto-import” развивает слабое понимание.

---

# Полезные команды `psql`

## Список таблиц

```sql
\dt
```

## Описание таблицы

```sql
\d customers
```

## Выход

```sql
\q
```

## Выполнить SQL из файла

```bash
psql -U postgres -d kaggle_practice -f schema.sql
```

## Выполнить одну команду из shell

```bash
psql -U postgres -d kaggle_practice -c "select count(*) from customers;"
```

---

# Хорошая практика: держать schema.sql и load.sql

Вместо ручной возни полезно делать два файла.

## `schema.sql`

```sql
drop table if exists customers;

create table customers (
    customer_id integer primary key,
    full_name text,
    age integer,
    signup_date date,
    spent_amount numeric(12,2),
    is_active boolean
);
```

## `load.sql`

```sql
\copy customers(customer_id, full_name, age, signup_date, spent_amount, is_active)
from '/Users/yourname/Desktop/customers.csv'
with (format csv, header true);
```

Тогда workflow такой:

```bash
psql -U postgres -d kaggle_practice -f schema.sql
psql -U postgres -d kaggle_practice -f load.sql
```

Это уже похоже на взрослый reproducible process.

---

# Как разметить таблицу “правильно”

Вот где суть.

## Минимальный уровень

- адекватные имена столбцов
- правильные типы данных
- `primary key`, если есть
- `not null`, если поле обязательно

Пример:

```sql
create table sales (
    sale_id bigint primary key,
    customer_id bigint not null,
    product_name text not null,
    quantity integer not null,
    unit_price numeric(12,2) not null,
    sale_date date not null
);
```

## Следующий уровень

- `check constraints`
- индексы
- foreign keys
- unique

Пример:

```sql
create table sales (
    sale_id bigint primary key,
    customer_id bigint not null,
    product_name text not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(12,2) not null check (unit_price >= 0),
    sale_date date not null
);
```

---

# Когда добавлять индексы

Индексы нужны не “потому что так красиво”, а под частые запросы.

Например, если часто фильтруешь по `sale_date`:

```sql
create index idx_sales_sale_date on sales(sale_date);
```

Если часто делаешь join по `customer_id`:

```sql
create index idx_sales_customer_id on sales(customer_id);
```

Но для маленького Kaggle-датасета индексы часто не критичны.

---

# Типичные ошибки при импорте CSV в Postgres

## 1. Неверный delimiter

CSV может быть не comma, а semicolon.

Ошибка: столбцы “съезжают”.

Решение:

```sql
with (format csv, header true, delimiter ';')
```

---

## 2. Проблемы с кодировкой

Русский текст может ломаться из-за encoding.

Иногда надо указать:

```sql
with (format csv, header true, encoding 'UTF8')
```

---

## 3. Пустые строки не кастуются в integer/date

Например `''::integer` упадет.

Решение:

- staging table
- `nullif(col, '')`

---

## 4. Даты в неожиданном формате

Например `03/15/2024` вместо `2024-03-15`.

Решение:

- преобразовать в Pandas заранее
- или использовать staging и потом `to_date()`

Пример:

```sql
to_date(signup_date, 'MM/DD/YYYY')
```

---

## 5. Дубликаты по primary key

Если есть повторяющиеся ID, вставка сломается.

Проверка:

```sql
select customer_id, count(*)
from staging_customers
group by customer_id
having count(*) > 1;
```

---

## 6. Зарезервированные слова в названиях столбцов

Например:

- `order`
- `group`
- `user`

Лучше избегать.

Плохой вариант:

```sql
create table test ("order" text);
```

Лучше переименовать:

- `order_name`
- `user_name`

---

# Как бы я рекомендовал тебе тренироваться

Вот реальный полезный пайплайн.

## Сценарий для практики

### Этап 1 — EDA в Pandas

- открыть CSV
- посмотреть shape, columns, types, missing values
- убрать мусор
- нормализовать названия столбцов

### Этап 2 — определить SQL-схему

- выбрать типы
- выбрать PK
- выбрать nullable/not null

### Этап 3 — создать таблицу в Postgres

- через DBeaver SQL Editor
- или через `psql`

### Этап 4 — загрузить данные

- сначала через DBeaver
- потом тот же датасет через `psql \copy`

### Этап 5 — верификация

- `count(*)`
- `limit 10`
- null checks
- duplicate checks

### Этап 6 — mini-analysis in SQL

- `group by`
- `order by`
- агрегаты
- joins, если несколько таблиц

---

# Пример полного мини-цикла

## 1. Создать таблицу

```sql
drop table if exists employees;

create table employees (
    employee_id integer primary key,
    full_name text not null,
    department text,
    salary numeric(12,2),
    hire_date date
);
```

## 2. Загрузить CSV через `psql`

```sql
\copy employees(employee_id, full_name, department, salary, hire_date)
from '/Users/yourname/Desktop/employees.csv'
with (format csv, header true);
```

## 3. Проверить

```sql
select count(*) from employees;
select * from employees limit 5;
```

## 4. Мини-анализ

```sql
select department, avg(salary) as avg_salary
from employees
group by department
order by avg_salary desc;
```

---

# Когда использовать DBeaver, а когда CLI

## DBeaver

Используй, когда:

- быстро посмотреть данные
- сделать импорт через GUI
- визуально проверить mapping
- удобно писать SQL

## `psql`

Используй, когда:

- хочешь понимать PostgreSQL глубже
- автоматизируешь импорт
- работаешь через shell/script
- хочешь reproducible workflow

## `pgcli`

Используй, когда:

- хочешь более приятный CLI
- автодополнение
- удобную интерактивную работу

Но для самого импорта CSV я бы ставил приоритет так:

**DBeaver → для простого визуального импорта**
**psql → для серьезного и повторяемого импорта**
**pgcli → как удобная SQL-консоль, но не основной ingestion tool**

---

# Что стоит запомнить как базовое правило

Если кратко:

## Для чистого CSV

1. вручную создаешь таблицу
2. грузишь через `\copy`

## Для грязного CSV

1. staging table из `text`
2. `\copy` в staging
3. `insert into final select ... cast ...`

Это и есть правильное мышление.

---

# Минимальный набор команд, который тебе реально нужен

## Подключение

```bash
psql -U postgres -d your_db -h localhost -p 5432
```

## Создание таблицы

```sql
create table your_table (...);
```

## Импорт

```sql
\copy your_table from '/absolute/path/file.csv' with (format csv, header true);
```

## Проверка

```sql
select count(*) from your_table;
select * from your_table limit 10;
```

## Описание таблицы

```sql
\d your_table
```

---

# Мой прямой вывод

Суть не в том, чтобы “научиться импортировать CSV”.
Это слишком низкий уровень фрейма.

Суть в другом:

**ты строишь пайплайн перехода из сырого файла в аналитически пригодную таблицу.**

Вот это уже правильное мышление:

- raw data
- schema design
- ingestion
- validation
- analysis

И именно это отличает человека, который просто жмет кнопки в DBeaver, от человека, который реально понимает, что делает.

---

Если хочешь, следующим сообщением я могу дать тебе:
**1)** готовый шаблон `schema.sql + load.sql + checks.sql`,
или **2)** разобрать твой конкретный CSV и показать, как именно под него спроектировать таблицу.

---

### Reference:

- ChatGPT

### Related:

- [[How to import-export CSV from Kaggle to PostgreSQL  using psql copy command?]]
- [[Staging Tables in PostgreSQL]]
