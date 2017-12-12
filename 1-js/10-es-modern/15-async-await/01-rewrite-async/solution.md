
См. примечания под кодом:

```js run
async function loadJson(url) { // (1)
  let response = await fetch(url); // (2)

  if (response.status == 200) {
    let json = await response.json(); // (3)
    return json;
  }

  throw new Error(response.status);
}

loadJson('no-such-user.json')
  .catch(alert); // Error: 404 (4)
```

Примечания:

1. Функцию `loadUrl` делаем `async`.
2. Все `.then` внутри меняем на `await`.
3. Можно написать `return response.json()` вместо ожидания `await`-ом, например так:

    ```js
    if (response.status == 200) {
      return response.json(); // (3)
    }
    ```

    Затем внешний код будет ждать с помощью `await`, когда завершится промис. Но в нашем случае это не важно.
4. Ошибка, возникшая в `loadJson`, обработается с помощью `.catch`. Мы не сможем написать `await loadJson(…)`, поскольку мы находимся вне `async`-функции.
