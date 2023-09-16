const WebSocket = require('ws');
const elc = require('electron');
const url = require('url');

let ws = null,
  messageEvts = Object.create(null);

function run(msg) {
  for (key in messageEvts) {
    messageEvts[key].call(null, msg);
  }
}

exports.startWSS = (port) => {
  const wss = new WebSocket.Server({ port: port || 9527 });

  wss.on('connection', function connection(wst, request) {
    const pathname = url.parse(request.url).pathname;
    ws = wst;
    if (pathname === '/utools') {
      // ws.on('error', (error) => run(error));
      // ws.on('close', () => {
      // });
      ws.on('message', (msg) => run(msg.toString()));
    }
  });
};

exports.close = () => {
  if (!ws) return;
  messageEvts = Object.create(null);
  ws.close(1000);
};

exports.removeListen = (name) => {
  delete messageEvts[name];
};

// ----
exports.listen = (name, onMessage) => {
  if (!name || typeof onMessage !== 'function') return;
  messageEvts[name] = onMessage;
};

exports.send = (data) => {
  if (!ws) return;
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};
