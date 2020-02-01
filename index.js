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
      if (xhr.status !== 200) {
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

/* developer env vs production server */
function get_env_host() {
  return null !== window.location.href.match(/^http:\/\/localhost:(3000|9000).*$/)
    ? "http://localhost:9000"
    : "https://catnipcdn.pagekite.me" ;
}

function fill_table () {
  var str_data = http.sync.get(get_env_host() + '/data');
  if (data === null) {
    console.log('some error fetching');
    return false;
  }
  var data = JSON.parse(str_data);
  var table = document.getElementById("potatoTable");

  data.forEach(function (obj) {
    var id = obj.id;
    var evident = obj.evident;
    var emergent = obj.emergent;

    var tr = document.createElement('tr');
    tr.innerHTML =
      // evident
      '<td class="id">' + id + '</td>' +
      '<td class="evident mass">' + evident.mass + '</td>' +
      '<td class="evident volume">' + evident.volume + '</td>' +
      '<td class="evident when">' + evident.introduced.when + '</td>' +
      '<td class="evident where">' + evident.introduced.where + '</td>' +
      '<td class="evident image">' + evident['3d'].image + '</td>' +
      '<td class="evident heightmap">' + evident['3d'].heightmap + '</td>' +

      // emergent
      '<td class="emergent density">' + emergent.density + '</td>'  +
      '<td class="emergent variety">' + emergent.variety + '</td>' +
      '<td class="emergent color">' + (emergent.color === undefined ? '' : emergent.color) + '</td>' +
      '<td class="emergent size">' + emergent.size + '</td>' +
      '<td class="emergent grade">' + emergent.grade + '</td>'
      ;
    table.appendChild(tr);
  });

}

function main () {
  fill_table();
}

window.onload = function _main () {
  console.log("init page");
  main();
}
