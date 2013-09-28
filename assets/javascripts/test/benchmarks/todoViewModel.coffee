require ['viewmodels/todo','OT','InMemory'], (TodoViewModel, OT, InMemory) ->
  OT.DataService = new InMemory()
  suite = new window.ItchCork.Suite 'Todo ViewModel', TodoViewModel
  return