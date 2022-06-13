(function () {
  const PARAM_NAME = 'plz-party-user-id';

  // ==========================================================================
  // GUEST CODE
  // ==========================================================================
  const searchParams = new URL(window.location.href).searchParams;
  if (searchParams.has(PARAM_NAME)) {
    // We have the param in the url: this is a guest trying to connect
    const sessionId = searchParams.get(PARAM_NAME);
    const peer = new Peer();
    const connection = peer.connect(sessionId);
    console.log('Guest event - connection', {'DataConnection': connection, sessionId} );
  }

  let lastPeerId = null;
  let peer = null;
  let conn = null;

  // ==========================================================================
  // HOST CODE
  // ==========================================================================

  // Listens for changes to the "Party active" toggle in the extension popup
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Received message from popup: ", request);
      // Create own peer object with connection to shared PeerJS server
      if (request.sessionIsActive) {
        peer = new Peer(null, {
          debug: 2
        });
        initialize(peer);
      }
    }
  );

  /**
   * Sets up callbacks that handle any events related to our
   * peer object.
   */
   function initialize(peer) {
    peer.on('open', function (id) {
      console.log('Host event - open');
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
          console.log('Received null id from peer open');
          peer.id = lastPeerId;
      } else {
          lastPeerId = peer.id;
      }

      console.log('Sending peer id to popup', peer.id);
      chrome.runtime.sendMessage({peerId: peer.id});
    });

    peer.on('connection', function (c) {
      console.log('Host event - connection', {'DataConnection': c});

        // Allow only a single connection
        if (conn && conn.open) {
            c.on('open', function() {
              console.log('Host event - Already connected to another client');
              setTimeout(function() { c.close(); }, 500);
            });
            return;
        }

        conn = c;
        ready();
      });
    peer.on('error', function (err) {
        console.error('Host event - error', e);
      });
  };

  function ready() {
      conn.on('data', function (data) {
        console.log('Host event - data', {data});
      });
      conn.on('close', function () {
        console.log('Host event - close');
        conn = null;
      });
  }
})();