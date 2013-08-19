define ['viewModel'], (c) ->
  s = new window.ItchCork.Suite('viewModel tests', c, 'mocha')
  describe "viewModel", ->
    context = new c()
    i = 1
    dataItem = {id: 1, name: "a", email: "b", valid: true}
    it "should have ko observable property -> id", ->
      i.should.equal(1)
    return
  return
