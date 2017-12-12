
# Перепишите "rethrow" используя async/await

Ниже вы найдёте пример "rethrow" из главы <info:promise-chaining>. Перепишите его, используя `async/await` вместо `.then/catch`.

Замените рекурсию на цикл в `demoGithubUser`: с помощью `async/await` это делается просто.

```js run
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new HttpError(response);
      }
    })
}

// Спрашиваем имя пользователя, пока github не вернёт корректного пользователя
function demoGithubUser() {
  let name = prompt("Введите имя", "iliakan");

  return loadJson(`https://api.github.com/users/${name}`)
    .then(user => {
      alert(`Полное имя: ${user.name}.`);
      return user;
    })
    .catch(err => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("Нет такого пользователя, повторите ввод.");
        return demoGithubUser();
      } else {
        throw err;
      }
    });
}

demoGithubUser();
```
