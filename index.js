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
    _xhr: function (method, url, data, mime_type) {
      var xhr = xhr_callable();

      xhr.open(method, url, false);
      xhr.setRequestHeader('Content-Type', mime_type || 'application/json');
      xhr.send(data || null);
      // TODO
      if (xhr.status === 200) {
        return null;
      }
      return xhr.responseText;
    },

    get: function (url, data) {
      return this._xhr("GET", url, data);
    },
    post: function (url, data) {
      return this._xhr("POST", url, data);
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

function fill_table () {
  var str_data = http.sync.get('https://catnipcdn.pagekite.me/data');
  if (data === null) {
    console.log('some error fetching');
    return false;
  }
  var data = JSON.parse(str_data);
  console.log(data);
  
  var potato = data.volume + '_' + data.mass + '_' + data.time + '_' + data.place
  function idWriter () {
    var potatoList = data.map(p => {
      p = potato;
      return p;
    })
    return potatoList;
  }
  idWriter();
}

function main () {
  fill_table();
}

window.onload = function _main () {
  console.log("init page");
  main();
}
