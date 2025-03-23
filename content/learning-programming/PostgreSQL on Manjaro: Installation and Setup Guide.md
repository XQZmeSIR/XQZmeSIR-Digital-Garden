Here’s a detailed guide on how to download, set up, and use PostgreSQL on Linux Manjaro, structured for use as a concise and practical cheatsheet. 

---

## PostgreSQL on Manjaro: Installation and Setup Guide  

### 1. **Install PostgreSQL**  
Manjaro uses `pacman` as its package manager, and PostgreSQL is available in the official repositories.  

```bash
# Update package database
sudo pacman -Syu

# Install PostgreSQL
sudo pacman -S postgresql
```

---

### 2. **Initialize the Database Cluster**  
PostgreSQL requires a data directory for storing databases. After installation, you need to initialize this directory.  

```bash
# Initialize PostgreSQL database cluster
sudo -iu postgres initdb --locale=en_US.UTF-8 -D /var/lib/postgres/data
```

- **`--locale=en_US.UTF-8`** ensures UTF-8 encoding for text storage.  
- **`-D`** specifies the data directory.

---

### 3. **Start and Enable PostgreSQL Service**  
To use PostgreSQL, start the database server and enable it to start on boot.  

```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Enable PostgreSQL to start on boot
sudo systemctl enable postgresql
```

---

### 4. **Switch to the PostgreSQL User**  
PostgreSQL uses a special system user (`postgres`) for managing the database.  

```bash
# Switch to the postgres user
sudo -iu postgres
```

Once logged in as `postgres`, you can use the `psql` command-line utility.  

---

### 5. **Create a New Role and Database**  
By default, PostgreSQL has a `postgres` superuser role. To create your user and database:  

```bash
# Access PostgreSQL shell
psql

# Create a new database user (role) with a password
CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword';

# Create a new database
CREATE DATABASE mydb OWNER myuser;

# Exit the PostgreSQL shell
\q
```

---

### 6. **Connect to Your Database**  
Exit from the `postgres` user and log in as your Linux user. You can then connect to your database:  

```bash
# Connect to PostgreSQL as your new user
psql -U myuser -d mydb -h localhost
```

- **`-U`**: Specifies the username.  
- **`-d`**: Specifies the database name.  
- **`-h`**: Specifies the host (localhost).  

---

### 7. **Basic PostgreSQL Commands**  

#### Working with Databases
- List all databases:  
  ```sql
  \l
  ```  
- Connect to a database:  
  ```sql
  \c database_name
  ```  
- Create a database:  
  ```sql
  CREATE DATABASE db_name;
  ```  
- Drop a database:  
  ```sql
  DROP DATABASE db_name;
  ```  

#### Working with Tables
- List tables:  
  ```sql
  \dt
  ```  
- Create a table:  
  ```sql
  CREATE TABLE table_name (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      age INT
  );
  ```  
- Insert data:  
  ```sql
  INSERT INTO table_name (name, age) VALUES ('John Doe', 30);
  ```  
- Query data:  
  ```sql
  SELECT * FROM table_name;
  ```  
- Drop a table:  
  ```sql
  DROP TABLE table_name;
  ```  

#### Miscellaneous
- Quit `psql`:  
  ```sql
  \q
  ```  
- Show help for SQL commands:  
  ```sql
  \h command_name
  ```  

---

### 8. **Enable Remote Connections (Optional)**  
To allow remote connections:  

1. **Edit the PostgreSQL configuration file**:  
   ```bash
   sudo nano /var/lib/postgres/data/postgresql.conf
   ```  
   - Uncomment and set `listen_addresses`:  
     ```conf
     listen_addresses = '*'
     ```  

2. **Configure access control**:  
   Edit the `pg_hba.conf` file:  
   ```bash
   sudo nano /var/lib/postgres/data/pg_hba.conf
   ```  
   Add a line like this to allow connections:  
   ```conf
   host all all 0.0.0.0/0 md5
   ```  

3. **Restart PostgreSQL**:  
   ```bash
   sudo systemctl restart postgresql
   ```

---

### 9. **Backup and Restore**  
#### Backup a database:  
```bash
pg_dump -U myuser -d mydb -F c -f mydb.backup
```

#### Restore a database:  
```bash
pg_restore -U myuser -d mydb -F c mydb.backup
```

---

### 10. **Uninstall PostgreSQL (if needed)**  
To remove PostgreSQL:  

```bash
# Stop the service
sudo systemctl stop postgresql

# Remove PostgreSQL and its dependencies
sudo pacman -Rsn postgresql

# Optionally, remove the data directory
sudo rm -rf /var/lib/postgres/data
```

---

### Additional Tips  
- **Logs**: PostgreSQL logs are located at `/var/lib/postgres/data/log`.  
- **Documentation**: Use `man psql` or visit the [official PostgreSQL documentation](https://www.postgresql.org/docs/).  

--- 

This guide is designed to give you a quick start and reference for PostgreSQL on Manjaro. Save it for troubleshooting, setups, or daily use!
