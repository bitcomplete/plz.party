const PARAM_NAME = 'plz-party-user-id';
let pageLocation;

let sessionIsActive = false;

function getPageLocation() {
  return {search: window.location.search, pathname: window.location.pathname, origin: window.location.origin};
}

function makeId() {
  const length = 8;
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
    if (i === 3) {
      result += '-';
    }
  }
  return result;
}

const userIdEl = document.getElementById('userId');
userIdEl.value = makeId();

const sessionEl = document.getElementById('session');
sessionEl.addEventListener('click', (e) => {
  // TODO: use this signal to start a new session or cancel it
  sessionIsActive = e.target.checked;
});

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
