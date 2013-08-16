var li;
if (window.location.pathname == "/coverage") {
    li = document.getElementById('coverage');
}
else {
    li = document.getElementById('results');
}
li.className = 'active';

