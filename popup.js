const PARAM_NAME = 'plz-party-user-id';
let pageLocation;
let sessionIsActive = false;
let peerId = null;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('message received', {request, sender});
  }
);

const sessionEl = document.getElementById('session');
sessionEl.addEventListener('click', (e) => {
  sessionIsActive = e.target.checked;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {sessionIsActive});
  });
});

(async function asyncFunction() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    // Ask the page for its location:
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: () => ({search: window.location.search, pathname: window.location.pathname, origin: window.location.origin}),
    }, (injectionResults) => {
      pageLocation = injectionResults[0].result;
    });

    document.getElementById('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!pageLocation) {
        return;
      }

      const params = new URLSearchParams(pageLocation.search);
      params.set(PARAM_NAME, peerId);
      const inviteUrl = `${pageLocation.origin}${pageLocation.pathname}?${params.toString()}`;

      const type = "text/plain";
      const blob = new Blob([inviteUrl], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.clipboard.write(data);
    })
  }
)();
