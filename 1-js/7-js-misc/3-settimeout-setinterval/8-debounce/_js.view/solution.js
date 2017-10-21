function debounce(f, ms) {

  let timer = null;

  return function (...args) {
    const complete = () => {
      f.apply(this, args);
      timer = null;
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(complete, ms);
  };
}