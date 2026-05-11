---
publish: true
created: 2026-03-07T02:30:13.852+03:00
modified: 2026-04-05T19:12:59.976+03:00
---

# ,PostgreSQL `\copy` Cheatsheet

## Basic Syntax

```sql
\copy table_name [ (column1, column2, ...) ] FROM 'file_path' [ WITH ] (FORMAT format, DELIMITER 'delimiter', HEADER [boolean], ...)
```

## Importing Data (FROM)

```sql
-- Basic CSV import
\copy table_name FROM '/path/to/file.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true)

-- TSV file import
\copy table_name FROM '/path/to/file.tsv' WITH (FORMAT csv, DELIMITER '\t', HEADER true)

-- Import specific columns only
\copy table_name (col1, col2, col3) FROM '/path/to/file.csv' WITH CSV HEADER

-- Import with different encoding
\copy table_name FROM '/path/to/file.csv' WITH (FORMAT csv, ENCODING 'UTF8', HEADER true)
```

## Exporting Data (TO)

```sql
-- Export to CSV
\copy table_name TO '/path/to/output.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true)

-- Export query results
\copy (SELECT * FROM table WHERE condition) TO '/path/to/output.csv' WITH CSV HEADER

-- Export with custom delimiter
\copy table_name TO '/path/to/output.txt' WITH (FORMAT csv, DELIMITER '|', HEADER true)
```

## Common Options

| Option         | Description                                      | Example                          |
|----------------|--------------------------------------------------|----------------------------------|
| FORMAT         | File format (csv, text, binary)                 | `FORMAT csv`                     |
| DELIMITER      | Field separator character                      | `DELIMITER '|'`                  |
| HEADER         | Whether file has header row                    | `HEADER true`                    |
| QUOTE         | Quoting character                              | `QUOTE '"'`                      |
| NULL          | How NULL values are represented                | `NULL '\N'`                      |
| ENCODING      | File encoding                                  | `ENCODING 'LATIN1'`              |
| FORCE\_QUOTE   | Force quoting for specified columns            | `FORCE_QUOTE (col1, col2)`       |

## Practical Examples

1. **Import from CSV with custom settings**

```sql
\copy customers FROM '/data/import.csv' WITH (
    FORMAT csv,
    DELIMITER ';',
    HEADER true,
    NULL 'NULL',
    ENCODING 'WIN1252'
)
```

2. **Export query results to TSV**

```sql
\copy (SELECT id, name FROM active_users WHERE signup_date > '2023-01-01') 
TO '/reports/active_users.tsv' 
WITH (FORMAT csv, DELIMITER '\t', HEADER true)
```

3. **Import with error handling**

```sql
\copy products FROM '/tmp/products.csv' WITH CSV HEADER;
-- If errors occur:
\echo Import encountered errors
\set ON_ERROR_STOP on
```

## Important Notes

- `\copy` is a psql client command (not SQL), so it uses local file paths and your user's permissions
- For large files, consider using `COPY` (server-side) instead for better performance
- Use absolute paths to avoid permission issues
- The command must be on a single line (or use `\` for line continuation)
- For binary format, use `FORMAT binary`

Would you like me to add any specific use cases to this cheatsheet?
