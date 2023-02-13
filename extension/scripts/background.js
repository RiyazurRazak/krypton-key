chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "CHK") {
    const response = await fetch(
      `https://5qsom7krrb.execute-api.us-east-1.amazonaws.com/get?deviceid=${message.deviceId}&domain=${message.domain}`
    );
    const payload = await response.text();
    const data = JSON.parse(payload);
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { data: data, type: "CHK" });
  }
});
