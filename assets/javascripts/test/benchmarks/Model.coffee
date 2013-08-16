define ['ot/model','OT','InMemory'], (Model, OT, InMemory) ->
  OT.SetDataService new InMemory()
  suite = new window.ItchCork.Suite 'Model Benchmarks', Model
  suite
  .it((c) ->
      c.apiRoute = '/todo/basic'
      c.put([]);
      c.get();
  ).shouldBe([])
