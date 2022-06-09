(function () {
  console.log("in connection js")

  var lastPeerId = null;
  var peer = null;
  var conn = null;
  var sendButton = document.getElementById("sendButton");

  /**
   * Create the Peer object for our end of the connection.
   *
   * Sets up callbacks that handle any events related to our
   * peer object.
   */
   function initialize() {
      // Create own peer object with connection to shared PeerJS server
      peer = new Peer(null, {
          debug: 2
      });

      peer.on('open', function (id) {
          // Workaround for peer.reconnect deleting previous id
          if (peer.id === null) {
              console.log('Received null id from peer open');
              peer.id = lastPeerId;
          } else {
              lastPeerId = peer.id;
          }

          console.log('ID: ' + peer.id);
          console.log("Awaiting connection")
      });
      peer.on('connection', function (c) {
          // Allow only a single connection
          if (conn && conn.open) {
              c.on('open', function() {
                  c.send("Already connected to another client");
                  setTimeout(function() { c.close(); }, 500);
              });
              return;
          }

          conn = c;
          console.log("Connected to: " + conn.peer);
          ready();
      });
      peer.on('error', function (err) {
          console.log(err);
          alert('' + err);
      });
  };

  function ready() {
      conn.on('data', function (data) {
          console.log("Data recieved: ", data);
      });
      conn.on('close', function () {
          console.log("connection reset, awaiting connection")
          conn = null;
      });
  }

  // Send message
  sendButton.addEventListener('click', function () {
      if (conn && conn.open) {
          var msg = sendMessageBox.value;
          sendMessageBox.value = "";
          conn.send(msg);
          console.log("Sent: " + msg)
      } else {
          console.log('Connection is closed');
      }
  });

  initialize();
})();