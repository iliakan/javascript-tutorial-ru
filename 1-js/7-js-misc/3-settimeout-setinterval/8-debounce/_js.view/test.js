describe("debounce", function() {
  before(function() {
    this.clock = sinon.useFakeTimers();
  });

  after(function() {
    this.clock.restore();
  });

  it("вызывает функцию не чаще чем раз в ms миллисекунд", function() {
    let log = "";

    function f(a) {
      log += a;
    }

    f = debounce(f, 1000);

    f(1); // откладываем на 1000
    f(2); // игнорируем предыдущий и откладываем на 1000

    setTimeout(function() {
      f(3)
    }, 1100); // f(2) уже выполнены, откладываем f(3)
    setTimeout(function() {
      f(4)
    }, 1200); // игнорируем f(3), откладываем f(4)
    setTimeout(function() {
      f(5)
    }, 2500); // откладываем f(5)

    this.clock.tick(5000);
    assert.equal(log, "245");
  });

  it("сохраняет контекст вызова", function() {
    const obj = {
      f: function() {
        assert.equal(this, obj);
      }
    };

    obj.f = debounce(obj.f, 1000);
    obj.f("test");
  });

  it("сохраняет все аргументы", function() {
    function f(...args) {
      assert.deepEqual(args, ["первый", "второй"]);
    }

    f = debounce(f, 1000);
    f("первый", "второй");
  });

});