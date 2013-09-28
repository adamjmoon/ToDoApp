require ['viewmodels/shell','OT','InMemory'], (ShellViewModel, OT, InMemory) ->
  OT.DataService = new InMemory()
  suite = new window.ItchCork.Suite 'Todo ViewModel', ShellViewModel
  return