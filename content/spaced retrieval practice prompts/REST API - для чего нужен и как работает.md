---
date: "2025-04-02"
draft: false
tags:
  - 
---

**Q**: What is API and what it helps you with?  
**A**: API (Application Programming Interface) — язык, на котором приложения общаются между собой. С помощью API одно приложение может использовать возможности другого приложения. Например, интернет-магазин может вызывать банковские сервисы для оплаты покупок.
<!--ID: 1743665095572-->


**Q**: Что такое REST API?  
**A**: Это архитектурный стиль дизайна API в современных сервисах и приложениях, описывающий стандарты проектирования интерфейса своего приложения с другим. Если интерфейс взаимодействия приложения соответствует принципам REST API, то оно называется RESTful.
<!--ID: 1743665095665-->

**Q**: Еще одно определение REST API  
**A**: набор ограничений и стандартов для создания web-сервисов. То как приложения должны обмениваться между собой в интернете


**Q**: В чем главная особенность REST API?  
**A**: **Главная особенность REST API** — обмен сообщениями без сохранения состояния. *Каждое сообщение самодостаточное и содержит всю информацию, необходимую для его обработки*. Сервер не хранит результаты предыдущих сессий с клиентскими приложениями. Это обеспечивает *гибкость* и *масштабируемость* серверной части, *позволяет поддерживать асинхронные взаимодействия* и *реализовывать алгоритмы обработки любой сложности*. Кроме того, такой формат взаимодействия является универсальным — *он не зависит от технологий, используемых на клиенте и на сервере*, и не привязывает разработчиков к определенному провайдеру.
<!--ID: 1743665095712-->

**Q**: Какие http запросы бы знаешь?  
**A**: сервером достаточно пяти методов: 
- `GET` — получение информации об объекте (ресурсе).
- `POST` — создание нового объекта (ресурса).
- `PUT` — полная замена объекта (ресурса) на обновленную версию.
- `PATCH` — частичное изменение объекта (ресурса).
- `DELETE` — удаление информации об объекте (ресурсе).
- Реже используются методы `HEAD` (для получения заголовка объекта или ресурса) и `OPTIONS` (возвращает список доступных методов).
<!--ID: 1743955322510-->


### **Core Structure**  
**Q**: What are the 4 mandatory components of a REST API request?  
**A**: Endpoint, Parameters (path/query), Headers, Body.  
<!--ID: 1743955322551-->


**Q**: Explain the difference between path parameters and query parameters.  
**A**: Path parameters are embedded in the URL (e.g., `/users/{id}`), while query parameters follow `?` (e.g., `?sort=desc`).  
<!--ID: 1743955322593-->


**Q**: What’s the purpose of HTTP headers in an API request?  
**A**: They define metadata like authentication (`Authorization`), content type (`Content-Type`), or API version.  
<!--ID: 1743955322636-->


---

### **Endpoints**  
**Q**: How can one resource have multiple endpoints?  
**A**: Different actions (CRUD) use different paths, e.g., `POST /orders` vs. `GET /orders/{id}`.  
<!--ID: 1743955322678-->


**Q**: Build an endpoint with a path parameter for `userId` and query params for pagination.  
**A**: `/users/{userId}/orders?limit=10&page=2`.  
<!--ID: 1743955322712-->


---

### **Responses**  
**Q**: What does a `201` status code indicate?  
**A**: Resource successfully created (often with a `Location` header pointing to the new resource).  
<!--ID: 1743955322745-->


**Q**: When would an API response lack a body?  
**A**: For `204 No Content` (successful deletion) or `304 Not Modified` (cached content).  
<!--ID: 1743955322779-->


---

### **Errors**  
**Q**: Is a `404` error client-side or server-side?  
**A**: Client-side (invalid request for a non-existent resource).  
<!--ID: 1743955322821-->


**Q**: What’s the difference between `401` and `403`?  
**A**: `401` means unauthenticated; `403` means unauthorized (no permissions).  
<!--ID: 1743955322855-->


---

### **Design**  
**Q**: Why is JSON preferred over XML in REST APIs?  
**A**: JSON is lightweight, human-readable, and native to JavaScript.  
<!--ID: 1743955322888-->


**Q**: What’s the industry standard for API documentation?  
**A**: OpenAPI Specification (formerly Swagger).  
<!--ID: 1743955322921-->

**Q**: Что такое интерфейс? И какие интерфейсы бывают?  
**A**: совокупность средств методов и правил взаимодействия между элементами системы. Интерфейсы бывают **пользовательские**
 и **программные**.

**Q**: Преимущества приложений с REST API  
**A**: Единая логика валидации данных, единая точка входа, универсальность.
Клиент не имеет доступа к базе данных: безопасность.
Оптимизация нагрузки на базу данных.

**Q**: For which http requests there is no JSON body?  
**A**: For GET and DELETE

JSON тело запроса есть у всех запросов кроме GET and DELETE

POST https://baseurl.com/apiname/1.0/objectName/actionName


**Q**: Основные принципы REST API?  
**A**: *Client-Server*;
*Cacheable*(request has to have info about cache in buffer);
*Uniform Interface*(data is requested from **one** URL) - Для реализации единообразного интерфейса в REST API используется принцип **HATEOAS** (Hypermedia as the Engine of Application State);
*Stateless*(server can't keep data, the request should have everything needed in itself);
*Layered System*(servers can be on different levels but need to interact only with neighbors)



---


---
### Reference:
- 

### Related:
- 
