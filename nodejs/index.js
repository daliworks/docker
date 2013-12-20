var express = require('express'),
    os = require('os'),
    ZooKeeper = require ('zookeeper'),
    async = require('async');

var PORT = 8080,
    EXT_IP = '192.168.1.88',
    EXT_PORT = 8001;

var zk = new ZooKeeper({
      connect: '192.168.1.88:49227',
      timeout: 200000,
      debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
     host_order_deterministic: false
    });

zk.connect(function (err) {
    if (err) throw err;
    console.log ('zk session established, id=%s', zk.client_id);
	
    async.series([
      function (done) {
        zk.a_exists('/nodeapps', null, function (rc, error, stat) {
            if (rc !== 0) {
              zk.a_create('/nodeapps', 'root directory of node apps', ZooKeeper.ZOO_PERSISTENT, function (rc, error, path) {
                console.log('root node is created', rc, error, path);
                done();
              });
            } else {
              console.log('root node already exists');
              done();
            }
        });
      },
      function (done) {
        zk.a_create ('/nodeapps/' + EXT_IP + ':' + EXT_PORT, 'some value', ZooKeeper.ZOO_EPHEMERAL, function (rc, error, path)  {
          if (rc !== 0) {
            console.log ('zk node create result: %d, error: "%s", path=%s', rc, error, path);
          } else {
            console.log ('created zk node %s\n', path);
	    console.log('client is node web app on ', os.hostname());
          }
          done();
        });
      }
    ], function (error, result) {
      console.log('done - ', result);
    });  
});

var app = express();
app.get('/', function (req, res) {
  res.send('Hello World from ' + os.hostname() + ' on ' + (new Date()) + '\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
