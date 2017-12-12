
Здесь нет ничего хитрого. Просто замените `.catch` на `try...catch` внутри `demoGithubUser` и добавьте `async/await` там, где это необходимо:

```js run
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
  let response = await fetch(url);
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}

// Спрашиваем имя пользователя, пока github не вернёт корректного пользователя
async function demoGithubUser() {

  let user;
  while(true) {
    let name = prompt("Введите имя", "iliakan");

    try {
      user = await loadJson(`https://api.github.com/users/${name}`);
      break; // ошибки нет, выходим из цикла
    } catch(err) {
      if (err instanceof HttpError && err.response.status == 404) {
        // цикл продолжается после alert
        alert("Нет такого пользователя, повторите ввод.");
      } else {
        // неизвестная ошибка, пробрасываем
        throw err;
      }
    }
  }


  alert(`Полное имя: ${user.name}.`);
  return user;
}

demoGithubUser();
```
