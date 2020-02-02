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
    get: function (url, data, mt) { return this._xhr("GET", url, data, mt) },
    post: function (url, data, mt) { return this._xhr("POST", url, data, mt) },

    _xhr: function (method, url, data, mime_type) {
      var xhr = xhr_callable();

      xhr.open(method, url, false);
      if (method === "POST") {
        xhr.setRequestHeader('Content-Type', mime_type || 'application/json');
      }
      xhr.send(data || null);
      // TODO
      if (xhr.status !== 200) {
        return null;
      }
      return xhr.responseText;
    },
  },

  nosync: {
    get: function (url, cb, ff, d, m) { return this._xhr("GET", url, cb, ff, d, m) },
    post: function (url, cb, ff, d, m) { return this._xhr("POST", url, cb, ff, d, m) },

    _xhr: function (method, url, callback, failfun, data, mime_type) {
      var xhr = xhr_callable();
      xhr.open(method, url, true); // true for asynchronous
      if (method == "POST") {
        xhr.setRequestHeader('Content-Type', mime_type || 'application/json');
      }

      var no_sync = this;

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            (callback || no_sync._json_ok)(xhr.responseText);
          } else {
            (failfun || no_sync._json_err)(xhr, url);
          }
        }
      }
      xhr.send(data || null);
    },
    _json_ok: function (text) {
      fill_table( JSON.parse(text) );
    },

    _json_err: function (xhr, url) {
      console.error('XHR failed: ' + url);
    }
  }
}

var EVIDENT_PROPERTIES = ['mass', 'volume', 'when', 'where', 'image', 'heightmap'];

/* developer env vs production server */
function get_env_host() {
  return null !== window.location.href.match(/^http:\/\/localhost:(3000|9000).*$/)
    ? "http://localhost:9000"
    : "https://catnipcdn.pagekite.me" ;
}

function load_all () {

  http.nosync.get( get_env_host() + '/all', null, null );
}

function fill_table (data) {
  var table = document.getElementById("potato-table");

  var counter = 1;
  data.forEach(function (obj) {
    var id = obj.id;
    var evident = obj.evident;
    var emergent = obj.emergent;

    var tr = document.createElement('tr');
    tr.innerHTML =
      // evident
      '<td class="row-number">' + counter + '</td>' +
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
    counter++;
  });

}

function search_records (query) {
  http.nosync.get(
    get_env_host() + '/search?query=' + window.encodeURI(query),
    null, null
  );
}

function create_record (record) {
  http.nosync.post(
    get_env_host() + '/create', null, null, JSON.stringify(record)
  )
}

function register_events () {

  /* for search by UID */
  document.getElementById('search-records-submit').addEventListener('click', function (e) {
    e.preventDefault();
    var query = document.getElementById('search-records-query').value;
    search_records(query);
  });
  // for create_record
  document.getElementById('create-record-submit').addEventListener('click', function (e) {
    e.preventDefault();
    var creating_record = {};
    EVIDENT_PROPERTIES.forEach( function (prop) {
      if ( prop === "when" ) {
        var
          date = document.getElementById('create-record-when-date').value,
          time = document.getElementById('create-record-when-time').value;

        console.log('date, time: ' + date + ', ' + time);
        creating_record.when = new Date(date + ' ' + time).getTime(); // epoch
      } else {
        var input = document.getElementById('create-record-' + prop).value;
        console.log('input = ' + prop + ': ' + input);
        creating_record[prop] = input;
      }
    } );
    create_record(creating_record);
  });
}


function main () {
  register_events();
  load_all();
}

window.onload = function _main () {
  console.log("init page");
  main();
}
