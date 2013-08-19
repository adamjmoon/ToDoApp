require ['ot/model','OT','InMemory'], (Model, OT, InMemory) ->
  OT.DataService = new InMemory()
  suite = new window.ItchCork.Suite 'Model Benchmarks', Model
  suite
  .it((model) ->
      model.apiRoute = '/todo/basic'
      model.put([]);
      model.get().length;
  ).shouldBe(0)
  .benchmark()
  return