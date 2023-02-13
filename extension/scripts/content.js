let intreval = null;
let port = null;
let isFound = false;
let isProcessCompleted = false;
let passwordNode = null;
let run = false;
let linkData = undefined;
let smartlinkResponse = undefined;
let activeFingerPrint = 0;

const overlay = document.createElement("div");
overlay.className = "krypton__overlay";

const generateUUID = () => {
  let d = new Date().getTime(),
    d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
};

const enableSmartLinkHandller = (data) => {
  if (port !== null && !port.opened()) {
    port.open("Arduino", 57600);
    const intreval = setInterval(() => {
      if (port.opened()) {
        writeHandller();
      }
    }, 1000);
    const writeHandller = () => {
      clearInterval(intreval);
      linkData = data;
      port.write("KEA:XX");
    };
  } else if (port.opened()) {
    linkData = data;
    port.write("KEA:XX");
  }
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "ADD") {
    enableSmartLinkHandller(message);
  }
  if (message.type === "CHK") {
    let options = "";
    smartlinkResponse = message.data;

    message.data.forEach((data) => {
      options += `  <option value=${data.username}>${data.username}</option>`;
    });
    if (message.data.length > 0)
      activeFingerPrint = Number(message.data[0].biometricId);
    overlay.innerHTML = ` <div class='krypton__modal_body'>
     <div class='krypton__modal'>
     <p class='krypton__close_ico' id='krypton-close'>X</p>
     <h1>Krypton Extension</h1>
     <h4>This Website is enabled with smart linking</h4>
     <select id='krypton-username' class='krypton__select'>
        ${options}
     </select>
     <br />
     <button class='krypton__button' id='krypton-authorize'>Authorize</button>
     </div>
     </div>
  `;
    injectOverlyaHandller(overlay);
  }
});

function setup() {
  port = createSerial();
  const usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
}

const linkPasswordHandller = async (data) => {
  [deviceId, fingerprintId] = data.split("|");
  alert(
    "Process Starts For Smart Linking\nPlease don't close the tab until another popup comes"
  );
  const payload = {
    id: generateUUID(),
    deviceId: deviceId,
    domain: linkData.domain,
    username: linkData.username,
    biometricId: fingerprintId,
  };
  const response = await fetch(
    "https://5qsom7krrb.execute-api.us-east-1.amazonaws.com/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (response.status === 200) {
    alert("This Account Is Successfully SmartLinked 🎉 🎉");
  } else {
    alert("Something Went Wrong 🥶 Try Again");
  }
};

const checkLinkStatus = async (deviceId) => {
  const domain = new URL(window.location.href).origin;
  await chrome.runtime.sendMessage({
    type: "CHK",
    domain: domain,
    deviceId: encodeURIComponent(deviceId.replace(/(\r\n|\n|\r)/gm, "")),
  });
};

function draw() {
  const str = port.read();
  if (str.length > 0) {
    const [command, value] = str.split(":");
    if (command === "KEAX") {
      linkPasswordHandller(value);
    } else if (command === "KEGX") {
      checkLinkStatus(value);
    }
  }
}

const closeHandller = () => {
  document.body.removeChild(overlay);
  isFound = false;
};

const getUsernameHandller = (e) => {
  const selectedUsername = e.target.value;
  const activeData = smartlinkResponse.filter(
    (res) => res.username === selectedUsername
  );
  if (activeData.length === 1)
    activeFingerPrint = Number(activeData[0].biometricId);
};

const authorizeHandller = () => {
  if (port.opened()) {
    passwordNode.focus();
    port.write(`KEP:${activeFingerPrint}`);
    alert(
      "Verify Your Session 🤖\nBe Patience\nThis process takes some seconds\nPlease check your krypton key 🗝️"
    );
    document.body.removeChild(overlay);
    isProcessCompleted = true;
    isFound = false;
  }
};

const injectOverlyaHandller = (overlay) => {
  if (passwordNode.focus) {
    document.body.appendChild(overlay);
    document
      .getElementById("krypton-close")
      .addEventListener("click", closeHandller);
    document
      .getElementById("krypton-authorize")
      .addEventListener("click", authorizeHandller);
    document
      .getElementById("krypton-username")
      .addEventListener("change", getUsernameHandller);
  }
};

const findDomNodes = () => {
  passwordNode = document.querySelector("input[type='password']");
  if (passwordNode !== null) {
    if (!Boolean(passwordNode.getAttribute("aria-hidden"))) {
      isFound = true;
      if (port !== null && port.opened()) {
        port.write("KEG:XX");
      } else {
        port.open("Arduino", 57600);
        const intreval = setInterval(() => {
          if (port.opened()) {
            writeHandller();
          }
        }, 1000);
        const writeHandller = () => {
          clearInterval(intreval);
          port.write("KEG:XX");
        };
      }
    }
  }
};

const mutationObserver = new MutationObserver((mutations) => {
  for (let i = 0; i < mutations.length; i++) {
    if (
      mutations[i].nextSibling !== null &&
      !isFound &&
      mutations[i].removedNodes[0] !== overlay &&
      mutations[i].previousSibling !== document.createElement("script") &&
      !isProcessCompleted
    ) {
      findDomNodes();
      break;
    }
  }
});

mutationObserver.observe(document.documentElement, {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: false,
});

setTimeout(findDomNodes, 1000);
