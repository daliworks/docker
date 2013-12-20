/* global require, console */

'use strict';

var httpProxy = require('http-proxy'),
    ZooKeeper = require ('zookeeper'),
    async = require('async');

var addresses, zk;

zk = new ZooKeeper({
  connect: '192.168.1.88:49227',
  timeout: 200000,
  debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
 host_order_deterministic: false
});

// var addresses = [
//   {
//     host: '192.168.1.88',
//     port: 8001
//   },
//   {
//     host: '192.168.1.88',
//     port: 8002
//   },
//   {
//     host: '192.168.1.88',
//     port: 8003
//   }
// ];

//
// A simple round-robin load balancing strategy.
//
// First, list the servers you want to use in your rotation.
//

function addWatch(node) {
  zk.aw_get_children(node,
    function (type, state, path) { // this is watcher
      console.log ('get children watcher of parent is triggered: type=%d, state=%d, path=%s \n', type, state, path);

      zk.a_get_children(node, null, function (rc, error, children) {
        if (rc !== 0) {
            console.log('ERROR zk a_get_children: %d, error: %s', rc, error);
        } else if (children === null || children.length === 0) {
            console.log('ERROR zk a_get_children: unexpected child state %s', JSON.stringify(children));
        } else {
            console.log('zk a_get_children SUCCESS ', children);

            addresses = [];

            children.forEach(function (child) {
              var host = child.split(':')[0], port = child.split(':')[1];

              addresses.push({
                host: host,
                port: port
              });
            });
        }
      });

      addWatch(node);
    },
    function (rc, error, stat, value) {// this is response from aw_get_children
        console.log ('get parent node result: %d, error: %s, stat=%j, value=%s \n', rc, error, stat, value);
        if (rc !== 0) {
            throw error;
        }
    }
);
}

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
      addresses = [];

      zk.a_get_children('/nodeapps', null, function (rc, error, children) {
        if (rc !== 0) {
            console.log('ERROR zk a_get_children: %d, error: %s', rc, error);
        } else if (children === null || children.length === 0) {
            console.log('ERROR zk a_get_children: unexpected child state %s', JSON.stringify(children));
        } else {
            console.log('zk a_get_children SUCCESS ', children);

            children.forEach(function (child) {
              var host = child.split(':')[0], port = child.split(':')[1];

              addresses.push({
                host: host,
                port: port
              });
            });
        }

        done();
      });
    },
    function (done) {
      addWatch('/nodeapps');
      done();
    },
    function (done) {
      httpProxy.createServer(function (req, res, proxy) {
        //
        // On each request, get the first location from the list...
        //
        var target = addresses.shift();

        //
        // ...then proxy to the server whose 'turn' it is...
        //
        console.log('balancing request to: ', target);
        proxy.proxyRequest(req, res, target);

        //
        // ...and then the server you just used becomes the last item in the list.
        //
        addresses.push(target);
      }).listen(80);

      done();
    }
  ], function (error, result) {
    console.log('done - ', result);
  });
});


