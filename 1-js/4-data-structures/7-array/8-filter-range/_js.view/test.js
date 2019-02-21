describe("filterRange", function() {
  it("не меняет исходный массив", function() {
    var arr = [5, 4, 3, 8, 0];

    filterRange(arr, 0, 10);
    assert.deepEqual(arr, [5, 4, 3, 8, 0]);
  });

  it("оставляет только значения указанного интервала", function() {
    var arr = [5, 4, 3, 8, 0];

    var result = filterRange(arr, 2, 4);
    assert.deepEqual(result, [3, 8, 0]);
  });
});
