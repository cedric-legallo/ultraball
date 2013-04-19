/*global setGameDatas, hideLoader, showLoader, FileReader */
function onerror(message) {
    console.error(message);
}

function onFinished() {
    document.getElementById('loadButton').className = "hidden";
    document.getElementById('buttons').className = "";
    hideLoader();
}

function logText(text) {
    setGameDatas(text);
    onFinished();
}

function loadMatch(evt) {
    showLoader();
    if (window.File && window.FileReader) {
        // Great success! All the File APIs are supported.
        var file = document.getElementById('matchLoader').files[0]; // FileList object
        var reader = new FileReader();
        reader.onloadend = function () {
            logText(reader.result);
        };
        reader.onerror = function () {
            window.alert('prevenir Grumly et GM');
        };
        reader.readAsText(file);
    } else {
      //console.warn('The File APIs are not fully supported in this browser.');
        var d = new Date();
        var form = document.forms.fileForm;
        form.dateFile.value = d.getTime();
        form.submit();
  }
}

function onIframeLoad() {
    var d = document.forms.fileForm.dateFile.value;
    if (d) {
        var scr = document.getElementById("scr");
        scr.src = "http://ultraball.nodester.com/getMatch?id=" + d;
        var interval = setInterval(function () {
            if (returnedValue){
                clearInterval(interval);
                setGameDatas(returnedValue);
                onFinished();
            }
        }, 300);
    }
}