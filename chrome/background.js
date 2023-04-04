chrome.cookies.onChanged.addListener(function (changeInfo) {
  const cookie = changeInfo.cookie;
  if (
    cookie.name == "PREF" &&
    (!cookie.value.includes("f6=400") ||
      !cookie.value.includes("f5=") ||
      changeInfo.removed)
  )
    setCookie(cookie.storeId);
});

function setCookie(storeId) {
  chrome.cookies.getAll(
    { name: "PREF", domain: ".youtube.com", storeId: storeId },
    function (cookies) {
      if (cookies[0])
        // Check if cookie exists (just in case)
        patchedCookieValue = patchCookieValue(cookies[0].value);
      else patchedCookieValue = "f6=400";
      chrome.cookies.set({
        name: "PREF",
        url: "https://youtube.com/",
        domain: ".youtube.com",
        value: patchedCookieValue,
        storeId: storeId,
      });
    }
  );
}

// Patches cookie value for dark theme (f6) and autoplay (f5)
// Patches cookie value for dark theme (f6) and autoplay (f5)
function patchCookieValue(value) {
  if (!value) {
    value = "f6=400&f5=30000&hl=en&tz=Europe.Istanbul&f7=1";
  } else {
    value = value.replace(/f6=\d+/, "f6=400");
    if (!value.includes("f6")) {
      value = value + "&f6=400";
    }
    if (!value.includes("f5")) {
      // autoplay
      value = value + "&f5=30000"; // Disable it
    } else {
      value = value.replace(/f5=\d+/, "f5=30000");
    }
    if (!value.includes("hl")) {
      // language setting
      value = value + "&hl=en"; // lang = en
    } else {
      value = value.replace(/hl=\w+/, "hl=en");
    }
    if (!value.includes("tz")) {
      // region
      value = value + "&tz=Europe.Istanbul"; // region europe istanbul
    }
    if (!value.includes("f7")) {
      // inline playback
      value = value + "&f7=1"; // disable
    } else {
      value = value.replace(/f7=\d+/, "f7=1");
    }
  }
  return value;
}

function setCookieToAllStores() {
  chrome.cookies.getAllCookieStores(function (cookieStores) {
    for (let store of cookieStores) setCookie(store.id);
  });
}

// Set cookies when a new window is created
chrome.windows.onCreated.addListener(() => {
  setCookieToAllStores();
});

// Set cookies once when the extension starts
setCookieToAllStores();
