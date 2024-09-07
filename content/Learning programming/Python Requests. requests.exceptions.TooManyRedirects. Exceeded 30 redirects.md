---
date: 2024-09-07
draft: true
tags:
  - solution
---
Apparently Amazon does this based on the User-Agent header, at which point it sets a cookie that following requests should send back. The following works:

```python
>>> s = requests.Session()
>>> s.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36'
>>> r = s.get(url)
>>> r
<Response [200]>
```

This created a session (for ease of re-use and for cookie persistence), and a copy of the Chrome user agent string. The request succeeds (returns a 200 response).

---
### Reference:
- https://stackoverflow.com/a/44968120/24465070

### Related:
- 