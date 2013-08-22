require ['ot/model','OT','InMemory'], (Model, OT, InMemory) ->
  OT.DataService = new InMemory()
  suite = new window.ItchCork.Suite 'Model Benchmarks', Model
  suite
  .it 'get() should return an empty array when put() is called with an empty array',
    (model) ->
      model.put []
      model.get().length
  .shouldBe(0)
  .it 'get() should return an array with length of 1 when put() is called with [1]',
    (model) ->
      model.put [1]
      model.get().length
  .shouldBe(1)
  .benchmark()
  return