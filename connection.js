(function () {
  console.log("in connection js")

  var lastPeerId = null;
  var peer = null;
  var conn = null;

  // Listens for changes to the "Party active" toggle in the extension popup
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // TODO: use request.sessionIsActive to start/cancel a session
      console.log("recieved message from popup: ", request);
      // Create own peer object with connection to shared PeerJS server
      peer = new Peer(null, {
          debug: 2
      });
      initialize(peer);

      console.log("Awaiting connection")

      sendResponse({peerId: peer._id});
    }
  );

  /**
   * Sets up callbacks that handle any events related to our
   * peer object.
   */
   function initialize(peer) {
    peer.on('open', function (id) {
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
          console.log('Received null id from peer open');
          peer.id = lastPeerId;
      } else {
          lastPeerId = peer.id;
      }

      console.log('open', peer.id);
      chrome.runtime.sendMessage({peerId: peer.id});
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
})();