---
publish: true
draft: true
created: 2026-06-13 16:16
modified: 2026-06-15T11:28:19.491+03:00
---

## 📝 Полная пошаговая инструкция `~/Downloads/superset-native`

### 1. Создаём папку проекта

```bash
mkdir -p ~/Downloads/superset-native/data
cd ~/Downloads/superset-native
```

### 2. Устанавливаем `uv` (если не установлен)

```bash
brew install uv
```

### 3. Создаём виртуальное окружение с Python 3.11 (имя `venv`)

```bash
uv venv --python 3.11 venv
source venv/bin/activate
```

### 4. Устанавливаем Apache Superset + явно `cachetools` (на всякий случай)

```bash
uv pip install apache-superset
uv pip install cachetools   # профилактика ошибки ModuleNotFoundError
```

### 5. Устанавливаем драйвер PostgreSQL (если нужен)

```bash
uv pip install psycopg2-binary
```

### 6. Создаём файл конфигурации `superset_config.py`

Сгенерируйте `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Затем создайте файл:

```bash
cat > superset_config.py << 'EOF'
import os

BASE_DIR = os.path.expanduser("~/Downloads/superset-native")
DATA_DIR = os.path.join(BASE_DIR, "data")
SUPERSET_HOME = DATA_DIR

PREVENT_UNSAFE_DB_CONNECTIONS = False

FEATURE_FLAGS = {
    "SQL_LAB": True,
    "CSV_UPLOAD": True,
    "EXCEL_UPLOAD": True,
}

SECRET_KEY = "ВСТАВЬТЕ_СГЕНЕРИРОВАННЫЙ_КЛЮЧ_СЮДА"

WTF_CSRF_ENABLED = False
EOF
```

### 7. Создаём скрипт запуска `start.sh` (с учётом `venv`)

```bash
cat > start.sh << 'EOF'
#!/bin/bash
cd ~/Downloads/superset-native
export SUPERSET_CONFIG_PATH=~/Downloads/superset-native/superset_config.py
export SUPERSET_HOME=~/Downloads/superset-native/data
source venv/bin/activate
superset run -p 8088 --with-threads --reload --debugger
EOF

chmod +x start.sh
```

### 8. Инициализируем Superset

```bash
# Убедитесь, что окружение активировано
source venv/bin/activate
export SUPERSET_CONFIG_PATH=~/Downloads/superset-native/superset_config.py
export SUPERSET_HOME=~/Downloads/superset-native/data

superset db upgrade
superset init
superset fab create-admin
```

### 9. Создаём или импортируем свою SQLite базу (опционально)

```bash
touch ~/Downloads/superset-native/data/my_analytics.db
```

### 10. Запускаем

```bash
./start.sh
```

### 11. Подключаем базу в веб-интерфейсе

- `http://localhost:8088`
- **Settings → Database Connections → + DATABASE**
- **Database**: `My Analytics`
- **SQLAlchemy URI**: `sqlite:////Users/ваше_имя/Downloads/superset-native/data/my_analytics.db`
- `sqlite:///` + путь к базе
- **Test Connection** → **Save**

---

## 🔐 Что такое `SECRET_KEY` и какой ставить?

`SECRET_KEY` — это **ключ шифрования**, который Flask (фреймворк, на котором работает Superset) использует для защиты сессий, cookies и других криптографических операций. **Без него Superset работать не будет** (будет падать с ошибкой или выдавать предупреждения).\
В продакшене ключ должен быть **длинным, случайным и никому не известным**. Для локального проекта подойдёт любой сложный набор символов.

### Простой способ сгенерировать ключ в терминале macOS:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Вы получите строку типа:
`Lxk2b9ZcR3vP8qF7tYhW5sGdJmNpQrUxVwAzByCxDuFgH`

Эту строку и вставьте в `superset_config.py` вместо `"your-secret-key-change-this"`.

---

## 🧹 Как полностью удалить нативный Superset (если понадобится)

```bash
cd ~/Downloads/superset-native
deactivate                 # выйти из окружения
rm -rf venv data superset_config.py start.sh
# По желанию: rm -rf ~/Downloads/superset-native
```

Метабаза и ваши базы удалятся вместе с папкой `data`.

---

## 📦 Структура готового проекта

```
~/Downloads/superset-native/
├── venv/                  # виртуальное окружение
├── data/
│   ├── superset.db         # метабаза Superset (создастся автоматически)
│   └── my_analytics.db     # ваша база (если создали)
├── superset_config.py
├── start.sh
└── (опционально) .gitignore
```

Всё самодостаточно, можно копировать на другой Mac и запускать (после установки `uv` и создания окружения). Docker больше не нужен.

Если нужен `.gitignore` для GitHub – создайте в папке проекта:

```bash
cat > .gitignore << EOF
venv/
data/*.db
start.sh
__pycache__/
*.pyc
EOF
```

Теперь у вас есть **чистый, воспроизводимый проект нативного Superset** с правильной конфигурацией.

---

### Reference:

- Тупой deepseek-v4-flash, которого я гнал переписывать это три раза

### Related:

-
