const PARAM_NAME = 'plz-party-user-id';

let pageLocation;

function getPageLocation() {
  return {search: window.location.search, pathname: window.location.pathname, origin: window.location.origin};
}

const userIdEl = document.getElementById('userId');

(async function asyncFunction() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    userIdEl.addEventListener('keypress', function listener(e) {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getPageLocation,
      }, (injectionResults) => {
        pageLocation = injectionResults[0].result;
      });
    });

    document.getElementById('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!userIdEl.value || !pageLocation) {
        return;
      }

      const params = new URLSearchParams(pageLocation.search);
      params.set(PARAM_NAME, userIdEl.value);
      const inviteUrl = `${pageLocation.origin}${pageLocation.pathname}?${params.toString()}`;

      const type = "text/plain";
      const blob = new Blob([inviteUrl], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.clipboard.write(data);
    })
  }
)();
