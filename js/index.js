
/* determine how to make XHR requests in this browser */
function xhr_callable() {
  var xhr;
  // Mozilla / Chromium / WebKit / KHMTL (like Gecko)
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();

  // IE
  } else if (window.ActiveXObject) {
    xhr = new ActiveXObject("Microsoft.xmlHttp");

  // ????
  } else {
    console.log("no way to xhrRequest, giving up");
    // you're drunk
    alert("don't know how internet works HTTP anymore?????");
    throw new Error("don't know how internet works HTTP anymore?????");
  }

  return xhr;
}

var http = {
  sync: {
    get: function (url, data) {
      var xhr = xhr_callable();

      xhr.open("GET", url, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data || null);
      // need an error condition here
      return xhr.responseText;

    },
    post: function (url, data) {
      var xhr = xhr_callable();

      xhr.open("POST", url, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data || null);
      // need an error condition here
      return xhr.responseText;
    }
  },

  nosync: {
    get: function (url, callback, failfun) {
      var xhr = xhr_callable();
      xhr.open("GET", url, true); // true for asynchronous

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(xhr.responseText);
          } else {
            failfun(xhr, url);
          }
        }
      }
      xhr.send(null); // connection close

    },

    post: function (url, callback, failfun, data) {
      var xhr = xhr_callable();

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(xhr.responseText);
          } else {
            failfun(xhr, url);
          }
        }
      }
      xhr.send(data);

    }
  }
}
