Код для полифилла здесь особенно прост.

Реализовывать ничего не надо, просто записать нужный метод в `Element.prototype.matches`, если его там нет:

```js
(function(e) {

  // проверяем поддержку
  if (!e.matches) {

    // определяем свойство
    e.matches = e.matchesSelector ||
      e.webkitMatchesSelector ||
      e.mozMatchesSelector ||
      e.msMatchesSelector;

  }

})(Element.prototype);
```

