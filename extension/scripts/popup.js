const activeTab = document.getElementById("active-tab");
const addTab = document.getElementById("add-tab");
const creditsTab = document.getElementById("credits-tab");
const activePanel = document.getElementById("active-panel");
const addPanel = document.getElementById("add-panel");
const creditsPanel = document.getElementById("credits-panel");
const url = document.getElementById("url");
const userInput = document.getElementById("username");
const linkButton = document.getElementById("link");
const infoElement = document.getElementById("info");
const kryptonConnect = document.getElementById("krypton-connect");

let activeUrl = undefined;

chrome.tabs.query(
  {
    currentWindow: true,
    active: true,
  },
  (tab) => {
    activeUrl = tab[0].url;
    url.innerText = "🔗 " + new URL(activeUrl).origin;
  }
);

function setup() {
  port = createSerial();
  const usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
}

const tabHandller = (tabName) => {
  if (tabName === "active") {
    addTab.classList.remove("active");
    creditsTab.classList.remove("active");
    activeTab.classList.add("active");
    activePanel.style.display = "block";
    addPanel.style.display = "none";
    creditsPanel.style.display = "none";
  } else if (tabName === "add") {
    activeTab.classList.remove("active");
    creditsTab.classList.remove("active");
    addTab.classList.add("active");
    activePanel.style.display = "none";
    addPanel.style.display = "block";
    creditsPanel.style.display = "none";
  } else {
    addTab.classList.remove("active");
    activeTab.classList.remove("active");
    creditsTab.classList.add("active");
    activePanel.style.display = "none";
    addPanel.style.display = "none";
    creditsPanel.style.display = "block";
  }
};

const linkHandller = () => {
  const username = userInput.value;
  if (username.length === 0) {
    infoElement.innerText = "* Username is required";
    infoElement.style.color = "red";
    infoElement.style.display = "block";
  } else {
    infoElement.innerText =
      "* Verify Your identity by placing your registered fingerprint for this account in your connected device. Be Patience. This step may take few minutes. Don't close the current tab";
    infoElement.style.display = "block";
    infoElement.style.color = "#868484";
    linkButton.innerText = "Verify process starts";
    linkButton.style.backgroundColor = "#868484";
    verificationProcess(username);
  }
};

const verificationProcess = async (username) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const payload = {
    type: "ADD",
    username: username,
    domain: new URL(activeUrl).origin,
  };
  await chrome.tabs.sendMessage(tab.id, payload);
};

activeTab.addEventListener("click", () => tabHandller("active"));
addTab.addEventListener("click", () => tabHandller("add"));
creditsTab.addEventListener("click", () => tabHandller("credits"));
linkButton.addEventListener("click", linkHandller);
