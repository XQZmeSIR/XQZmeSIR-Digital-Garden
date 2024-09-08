---
category: "[[Clippings]]"
author: "[[H0H1: про HR-аналитику]]"
title: "Анализ HR вакансий. Часть 2. Знакомство с HeadHunter API"
source: https://teletype.in/@h0h1_hr_analytics/Q00Bvj-_Fua#j82h
clipped: 2024-09-09
published: 
topics: 
tags: [clippings]
---

Документация по API HeadHunter [\[1\]](https://github.com/hhru/api) содержит исчерпывающую информацию, настолько, что можно потратить много времени на её изучение. Мы же, по традиции, сфокусируемся на главном. Для нашей задачи по сбору активных HR вакансий, первое, что нужно сделать – это завести своё приложение. Это требуется для того, чтобы получить OAuth токен [\[2\]](https://ru.wikipedia.org/wiki/OAuth), который мы будем использовать для аутентификации при работе с API. На самом деле, какие-то запросы у вас могут отработать и без него, но никто не гарантирует надежной работы при таком подходе, поэтому мы создадим приложение и получим токен.

  
Авторизуемся через личный аккаунт hh.ru [\[3\]](https://hh.ru/) на сайте dev.hh.ru [\[4\]](https://dev.hh.ru/), затем нажимаем **Добавить приложение -> Регистрация нового приложения**

![](https://img1.teletype.in/files/48/d7/48d77aff-5ff2-464c-9e82-46436dc69e0a.png)

Заполняем заявку: придумайте название приложения, опишите для чего оно будет использоваться и укажите **Redirect URI** – он понадобится далее для получения OAuth токена. К примеру, у меня это просто ссылка на мой телеграм-канал.

![](https://img4.teletype.in/files/7d/20/7d201de8-d327-4adc-abe6-8a7fff7f0798.png)

Мою заявку одобрили приблизительно через неделю. В итоге приложение создано, и вы можете увидеть ваши **Redirect URI, Client ID и Client Secret**, всё это составные части получения заветного OAuth токена.

![](https://img4.teletype.in/files/b9/67/b967373d-fdcb-4c3b-9bab-af1bc2783df6.png)

Но помимо этого списка, нам нужно ещё получить **code.** Для этого подставьте параметры вашего приложения вместо **YOUR\_CLIENT\_ID** и **YOUR\_REDIRECT\_URI** вот в эту ссылку и откройте её в браузере:

[`https://hh.ru/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI`](https://hh.ru/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI)

Сталкиваемся с частью, которая осложняет автоматизацию этого процесса и нажимаем **Продолжить**

![](https://img3.teletype.in/files/67/59/6759f695-e63b-4c69-b5fc-a1d9d2419370.png)

Полученный **code** будет указан в пути открывшегося окна, забираем его себе.

![](https://img3.teletype.in/files/69/1a/691aafbb-eedf-43b1-86f4-fd89d158aa11.png)

Мы собрали все кусочки, необходимые для получения OAuth токена. Переходим в **R** чтобы завершить этот квест. Если R не установлен на вашем компьютере, то скачайте его и RStudio в качестве визуального интерфейса, и установите на ваш компьютер [\[5\]](https://posit.co/download/rstudio-desktop/). В следующей статье R будет основным инструментом для парсинга вакансий.

![](https://img2.teletype.in/files/98/f0/98f0188b-4185-4b91-9652-15f3c6120d4f.png)

```
#Библиотека для работы с HTTP (для установки install.packages('httr'))
library(httr)

#Все наши id
client\_id <- 'XXXX'
client\_secret <- 'XXXX'
code <- 'XXXX'

#POST запрос к hh.ru для получения токена
oauth\_endpoint <- "https://hh.ru/oauth/token"

response <- POST(
  oauth\_endpoint, 
  body = list(
    grant\_type = "authorization\_code",
    client\_id = client\_id,
    client\_secret = client\_secret,
    code = code,
    redirect\_uri = "https://t.me/h0h1\_hr\_analytics"
  ),
  encode = "form"
)

#Извлекаем токен
content <- content(response)
access\_token <- content$access\_token
access\_token
```

Тоже самое, но для поклонников **Python.** Удобно использьовать дистрибутив Anaconda3, в котором есть и сам язык, и визуальный интерфейс - Jupyter Notebook [\[6\].](https://www.anaconda.com/download)

![](https://img1.teletype.in/files/0b/51/0b5126a8-c7b6-4173-ae93-ddb176d42b86.png)

```python
#Библиотека для работы с HTTP (для установки !pip install requests)
import requests

#Все наши id
client\_id = 'XXXX'
client\_secret = 'XXXX'
code = 'XXXX'

#POST запрос к hh.ru для получения токена
oauth\_endpoint = "https://hh.ru/oauth/token"

response = requests.post(
    oauth\_endpoint,
    data = {
        'grant\_type': 'authorization\_code',
        'client\_id': client\_id,
        'client\_secret': client\_secret,
        'code': code,
        'redirect\_uri': 'https://t.me/h0h1\_hr\_analytics'
    }
)

#Извлекаем токен
content = response.json()
access\_token = content\['access\_token'\]
print(access\_token)
```

Не скрою - процесс несложный, но занудный и самое неприятное, что токен "живет" только две недели, то есть это упражнение потребуется повторять регулярно.

Теперь у нас есть база данных и доступы к hh.ru [\[3\]](https://hh.ru/) по API, мы готовы к тому, чтобы в следующий раз начать парсить вакансии.

**Ссылки**

1.  [https://github.com/hhru/api](https://github.com/hhru/api)
2.  [https://ru.wikipedia.org/wiki/OAuth](https://ru.wikipedia.org/wiki/OAuth)
3.  [https://hh.ru/](https://hh.ru/)
4.  [https://dev.hh.ru/](https://dev.hh.ru/)
5.  [https://posit.co/download/rstudio-desktop/](https://posit.co/download/rstudio-desktop/)
6.  [https://www.anaconda.com/download](https://www.anaconda.com/download)