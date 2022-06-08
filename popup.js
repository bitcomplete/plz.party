// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  console.log('popup.js');
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

let submitButton = document.getElementById("submit");

// When the button is clicked
submitButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let name = document.getElementById("name").value;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: printOutInput,
    args: [name],
  });
});

// The body of this function will be executed as a content script inside the
// current page
function printOutInput(name) {
  console.log('submitted form!');
  chrome.storage.sync.set({ name });
  console.log('name is ' + name);
}