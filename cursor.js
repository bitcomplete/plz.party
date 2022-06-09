(function () {
  console.log("tracking cursor movement");
  // limit number of storage sync operations to avoid MAX_WRITE_OPERATIONS_PER_MINUTE error
  let timestampCoodinateUpdated = new Date().getTime();
  let lock = false;

  document.onmousemove = function(e)
  {
    var x = e.pageX;
    var y = e.pageY;
    if (new Date().getTime() - timestampCoodinateUpdated > 50 && !lock) {
      // set lock
      lock = true;
      console.log('updating cursor coordinates');
      chrome.storage.sync.set({ plz_party_cursor_coordinates: {offsetX: x, offsetY: y} });
      // reset timestamp
      timestampCoodinateUpdated = new Date().getTime();
      // release lock
      lock = false;
      chrome.storage.sync.get('plz_party_cursor_coordinates', function(result) {
        console.log(`${result.plz_party_cursor_coordinates.offsetX}, ${result.plz_party_cursor_coordinates.offsetY}`)
      })
    }
  };
  
})();