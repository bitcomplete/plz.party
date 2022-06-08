const copyEl = document.getElementById('copy');

(async function asyncFunction() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyId,
  });

  // The body of this function will be executed as a content script inside the
  // current page
  function copyId() {
    copyEl.addEventListener('click', function listener(e) {
      e.preventDefault();
      const params = new URLSearchParams(window.location.search);
      params.set('userId', document.getElementById("userId").value);
      const inviteUrl = `${window.location.origin}${params.toString()}`;
      window.alert({inviteUrl});
      console.log({inviteUrl});
    })
  }
})();
