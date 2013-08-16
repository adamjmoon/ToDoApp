var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
var fittedContentHeight = windowHeight - 100;
var cov = document.getElementsByTagName("iframe");
document.getElementsByTagName("iframe")[0].style.height = fittedContentHeight;

