
<header id="todoHeader" class="col-md-12">
  <div data-bind="visible: subLists().length&gt;0" class="row todoHeaderRow">
    <ul data-bind="foreach: subLists, visible: subLists().length&gt;0" class="nav nav-pills navbar-inverse collapse sublists-collapse in">
      <li data-bind="css: { active: $data == $parent.subList() }"><a data-bind="attr: { href: '#' + $parent.name()  + '/' + $data  }, html: $data"></a></li>
    </ul>
    <div class="collapse in addlist-collapse col-xs-12 visible-xs form-horizontal">
      <input type="text" data-bind="value: newSubList, valueUpdate: 'afterkeydown', enterKey: addSubList" class="col-xs-10"/>
      <div data-bind="click: addSubList" style="margin-left:5px;" class="btn btn-sm btn-success"><i class="glyphicon glyphicon-save"></i></div>
    </div>
    <div class="hidden-xs form-horizontal">
      <input type="text" placeholder="Add Custom List" data-bind="value: newSubList, valueUpdate: 'afterkeydown', enterKey: addSubList" class="input-sm customListInput"/><a data-bind="click: addSubList" title="Add Custom List" class="btn btn-sm btn-success"><i class="glyphicon glyphicon-save"></i></a>
    </div>
  </div>
  <h1 data-bind="text: name,visible: subLists().length===0"></h1>
</header>
<div id="todoappWrapper" class="todoappWrapper">
  <div class="currentToDoHeader"></div>
  <div class="currentToDo">
    <div id="currentToDo" class="col-md-12">
      <input id="toggle-all" data-bind="checked: allCompleted" type="checkbox"/>
      <label for="toggle-all">Mark all as complete</label>
      <input id="new-todo" data-bind="value: currentToDo, valueUpdate: 'afterkeydown', enterKey: add" placeholder="What needs to be done?" autofocus="" class="col-md-11 col-md-offset-2"/>
    </div>
  </div>
  <div id="todoapp">
    <ul id="todo-list" data-bind="foreach: filteredTodos">
      <li data-bind="css: { completed: completed, editing: editing }">
        <input data-bind="checked: completed" type="checkbox" class="toggle"/>
        <label data-bind="text: title, event: { dblclick: $root.editItem }"></label>
        <button data-bind="click: $root.remove" class="destroy btn btn-danger pull-right"></button>
        <input data-bind="value: title, valueUpdate: &quot;afterkeydown&quot;, enterKey: $root.stopEditing, selectAndFocus: editing, event: { blur: $root.stopEditing }" class="edit"/>
      </li>
    </ul>
  </div>
  <div id="footer" data-bind="visible: completedCount() || remainingCount()" class="col-md-12 col-lg-12">
    <div class="footer-inner"><span id="todo-count" class="col-md-2 col-xs-3"><strong data-bind="text: remainingCount">1</strong><span> left</span></span><span class="col-md-8 col-xs-7">
        <ul id="filters">
          <li><a data-bind="css: { selected: showMode() === 'all' }, attr: { href: '#' +currentRoute() + '/all' }" class="selected">All</a></li>
          <li><a data-bind="css: { selected: showMode() === 'active' }, attr: { href: '#' + currentRoute()+ '/active' }">Active</a></li>
          <li><a data-bind="css: { selected: showMode() === 'completed' }, attr: { href:  '#' + currentRoute() + '/completed' }">Completed</a></li>
        </ul></span>
      <button data-bind="visible: completedCount, click: removeCompleted" class="pull-right visible-xs">(<span data-bind="text: completedCount">0</span>)</button>
      <button data-bind="visible: completedCount, click: removeCompleted" class="pull-right hidden-xs">Clear completed (<span data-bind="text: completedCount">0</span>)</button>
    </div>
  </div>
</div>