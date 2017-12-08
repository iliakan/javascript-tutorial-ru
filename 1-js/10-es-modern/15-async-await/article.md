# Async/await

Для более комфортной работы с промисами существует специальный синтаксис — "async/await". Он удивительно прост в понимании и использовании.

## Асинхронные функции

Начнём с ключевого слова `async`. Его можно написать перед функцией, вот так:

```js
async function f() {
  return 1;
}
```

Слово "async" перед функцией говорит о следующем: данная функция всегда возвращает промис. Если в коде есть `return <не-промис>`, то JavaScript автоматически завернёт возвращаемое значение в промис, разрешающийся этим значением.

Так, например, вышеупомянутый код вернёт промис, разрешающийся с результатом `1`. Проверим это:

```js run
async function f() {
  return 1;
}

f().then(alert); // 1
```

...Мы могли вернуть промис и явным образом, что было бы равносильно:

```js run
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```

В общем, `async` делает так, что функция всегда возвращает промис (если возвращается обычное значение, то оно оборачивается в промис). Просто, не так ли? Но есть и другое ключевое слово — `await` — оно работает только внутри `async`-функций. И оно просто шикарно!

## Await

Синтаксис:

```js
// работает только внутри async-функций
let value = await promise;
```

Ключевое слово `await` заставляет JavaScript ждать, пока промис завершится с каким-либо результатом.

Пример промиса, разрешающегося через 1 секунду:
```js run
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("готово!"), 1000)
  });

*!*
  let result = await promise; // ждёт разрешения промиса (*)
*/!*

  alert(result); // "готово!"
}

f();
```

Выполнение функции приостанавливается на строке `(*)`, затем продолжается, когда промис разрешается. При этом `result` принимает значение результата. Таким образом, наш код показывает "готово!" спустя одну секунду.

Подчернём, что `await` действительно делает так, что JavaScript ждёт разрешения промиса, а потом продолжает, используя его результат. При этом ресурсы процессора не расходуются, поскольку в это время движок может производить другую работу: исполнять другие скрипты, обрабатывать события и т.д.


Это прсто более элегантный способ получения результата промиса, чем `promise.then`. Такой код проще писать и читать.

````warn header="В обычных функциях использовать `await` нельзя"
Если попытаемся использовать `await` в функциях, объявленных без `async`, то получим синтаксическую ошибку:

```js run
function f() {
  let promise = Promise.resolve(1);
*!*
  let result = await promise; // Синтаксическая ошибка
*/!*
}
```

Если забыть поставить `async` перед функцией, то будет такая ошибка. Как уже сказано, `await` работает только внутри `async function`.
````

Let's take `showAvatar()` example from the chapter <info:promise-chaining> and rewrite it using `async/await`:

1. We'll need to replace `.then` calls by `await`.
2. Also we should make the function `async` for them to work.

```js run
async function showAvatar() {

  // read our JSON
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();

  // read github user
  let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // show the avatar
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // wait 3 seconds
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  img.remove();

  return githubUser;
}

showAvatar();
```

Pretty clean and easy to read, right? Much better than before.

````smart header="`await` won't work in the top-level code"
People who are just starting to use `await` tend to forget that, but we can't write `await` in the top-level code. That wouldn't work:

```js run
// syntax error in top-level code
let response = await fetch('/article/promise-chaining/user.json');
let user = await response.json();
```

So we need to have a wrapping async function for the code that awaits. Just as in the example above.
````
````smart header="`await` accepts thenables"
Like `promise.then`, `await` allows to use thenable objects (those with a callable `then` method). Again, the idea is that a 3rd-party object may be not a promise, but promise-compatible: if it supports `.then`, that's enough to use with `await`.

For instance, here `await` accepts `new Thenable(1)`:
```js run
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve); // function() { native code }
    // resolve with this.num*2 after 1000ms
    setTimeout(() => resolve(this.num * 2), 1000); // (*)
  }
};

async function f() {
  // waits for 1 second, then result becomes 2
  let result = await new Thenable(1);
  alert(result);
}

f();
```

If `await` gets a non-promise object with `.then`, it calls that method providing native functions `resolve`, `reject` as arguments. Then `await` waits until one of them is called (in the example above it happens in the line `(*)`) and then proceeds with the result.
````

````smart header="Async methods"
A class method can also be async, just put `async` before it.

Like here:

```js run
class Waiter {
*!*
  async wait() {
*/!*
    return await Promise.resolve(1);
  }
}

new Waiter()
  .wait()
  .then(alert); // 1
```
The meaning is the same: it ensures that the returned value is a promise and enables `await`.

````
## Error handling

If a promise resolves normally, then `await promise` returns the result. But in case of a rejection it throws the error, just if there were a `throw` statement at that line.

This code:

```js
async function f() {
*!*
  await Promise.reject(new Error("Whoops!"));
*/!*
}
```

...Is the same as this:

```js
async function f() {
*!*
  throw new Error("Whoops!");
*/!*
}
```

In real situations the promise may take some time before it rejects. So `await` will wait, and then throw an error.

We can catch that error using `try..catch`, the same way as a regular `throw`:

```js run
async function f() {

  try {
    let response = await fetch('http://no-such-url');
  } catch(err) {
*!*
    alert(err); // TypeError: failed to fetch
*/!*
  }
}

f();
```

In case of an error, the control jumps to the `catch` block. We can also wrap multiple lines:

```js run
async function f() {

  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch(err) {
    // catches errors both in fetch and response.json
    alert(err);
  }
}

f();
```

If we don't have `try..catch`, then the promise generated by the call of the async function `f()` becomes rejected. We can append `.catch` to handle it:

```js run
async function f() {
  let response = await fetch('http://no-such-url');
}

// f() becomes a rejected promise
*!*
f().catch(alert); // TypeError: failed to fetch // (*)
*/!*
```

If we forget to add `.catch` there, then we get an unhandled promise error (and can see it in the console). We can catch such errors using a global event handler as described in the chapter <info:promise-chaining>.


```smart header="`async/await` and `promise.then/catch`"
When we use `async/await`, we rarely need `.then`, because `await` handles the waiting for us. And we can use a regular `try..catch` instead of `.catch`. That's usually (not always) more convenient.

But at the top level of the code, when we're outside of any `async` function, we're syntactically unable to use `await`, so it's a normal practice to add `.then/catch` to handle the final result or falling-through errors.

Like in the line `(*)` of the example above.
```

````smart header="`async/await` works well with `Promise.all`"
When we need to wait for multiple promises, we can wrap them in `Promise.all` and then `await`:

```js
// wait for the array of results
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```

In case of an error, it propagates as usual: from the failed promise to `Promise.all`, and then becomes an exception that we can catch using `try..catch` around the call.

````

## Summary

The `async` keyword before a function has two effects:

1. Makes it always return a promise.
2. Allows to use `await` in it.

The `await` keyword before a promise makes JavaScript wait until that promise settles, and then:

1. If it's an error, the exception is generated, same as if `throw error` were called at that very place.
2. Otherwise, it returns the result, so we can assign it to a value.

Together they provide a great framework to write asynchronous code that is easy both to read and write.

With `async/await` we rarely need to write `promise.then/catch`, but we still shouldn't forget that they are based on promises, because sometimes (e.g. in the outermost scope) we have to use these methods. Also `Promise.all` is a nice thing to wait for many tasks simultaneously.
