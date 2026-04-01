let places = [];

const statusEl = document.getElementById("status");
const previewEl = document.getElementById("preview");
const countEl = document.getElementById("count");
const listEl = document.getElementById("placesList");
const btnCsv = document.getElementById("btnCsv");
const btnJson = document.getElementById("btnJson");
const btnScan = document.getElementById("btnScan");

function setStatus(msg, type = "info") {
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
}

function renderPreview() {
  listEl.textContent = "";
  for (const p of places) {
    const div = document.createElement("div");
    div.className = "place";
    const nameDiv = document.createElement("div");
    nameDiv.className = "place-name";
    nameDiv.textContent = p.name;
    div.appendChild(nameDiv);
    if (p.address) {
      const addrDiv = document.createElement("div");
      addrDiv.className = "place-addr";
      addrDiv.textContent = p.address;
      div.appendChild(addrDiv);
    }
    listEl.appendChild(div);
  }
}

btnScan.addEventListener("click", async () => {
  btnScan.disabled = true;
  setStatus("掃描中...", "info");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes("google.com/maps")) {
      setStatus("請先打開 Google Maps 頁面", "error");
      btnScan.disabled = false;
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrollAndExtract,
    });

    places = results[0].result || [];

    if (places.length === 0) {
      setStatus("找不到地點。請確認你已打開清單頁面，並往下捲動載入所有地點。", "warning");
      btnScan.disabled = false;
      return;
    }

    countEl.textContent = `${places.length} 個地點`;
    renderPreview();
    previewEl.style.display = "block";
    btnCsv.disabled = false;
    btnJson.disabled = false;
    setStatus(`找到 ${places.length} 個地點`, "success");
  } catch (err) {
    setStatus(`錯誤：${err.message}`, "error");
  }
  btnScan.disabled = false;
});

btnCsv.addEventListener("click", () => {
  const header = "name,address,category,rating,reviews,url,lat,lng";
  const rows = places.map((p) =>
    [p.name, p.address, p.category, p.rating, p.reviews, p.url, p.lat, p.lng]
      .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
      .join(",")
  );
  download(header + "\n" + rows.join("\n"), "maps-list.csv", "text/csv");
});

btnJson.addEventListener("click", () => {
  download(JSON.stringify(places, null, 2), "maps-list.json", "application/json");
});

function download(content, filename, mime) {
  const blob = new Blob(["\uFEFF" + content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function scrollAndExtract() {
  // Find the scrollable container for the list
  const scrollContainer =
    document.querySelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf') ||
    document.querySelector('div.m6QErb[tabindex="-1"]') ||
    document.querySelector('div[role="feed"]');

  if (!scrollContainer) {
    // No scrollable container found, just extract what's visible
    return extractVisible();
  }

  const seen = new Set();
  const allPlaces = [];

  // Scroll through the entire list to force lazy-loaded items into the DOM
  let prevCount = 0;
  let stableRounds = 0;
  const maxRounds = 60; // safety limit

  for (let i = 0; i < maxRounds; i++) {
    // Collect currently visible places
    collectVisible(seen, allPlaces);

    // Scroll down
    scrollContainer.scrollTop = scrollContainer.scrollHeight;

    // Wait for new items to load
    await new Promise((r) => setTimeout(r, 400));

    if (allPlaces.length === prevCount) {
      stableRounds++;
      if (stableRounds >= 3) break; // no new items after 3 rounds
    } else {
      stableRounds = 0;
      prevCount = allPlaces.length;
    }
  }

  // Final collection pass
  collectVisible(seen, allPlaces);

  return allPlaces;

  function collectVisible(seen, out) {
    document.querySelectorAll("button.SMP2wb").forEach((btn) => {
      const nameEl = btn.querySelector(".fontHeadlineSmall");
      const name = nameEl?.textContent?.trim();
      if (!name || seen.has(name)) return;
      seen.add(name);

      const ratingEl = btn.querySelector(".MW4etd");
      const rating = ratingEl?.textContent?.trim() || "";

      const reviewEl = btn.querySelector(".UY7F9");
      const reviews = reviewEl?.textContent?.trim().replace(/[()]/g, "") || "";

      const infoSpans = btn.querySelectorAll(".IIrLbb > span");
      let category = "";
      const addressParts = [];
      infoSpans.forEach((span) => {
        const text = span.textContent?.trim();
        if (!text) return;
        if (span.closest(".Rv8Tad")) return;
        if (!category) {
          category = text;
        } else {
          addressParts.push(text);
        }
      });
      const address = addressParts.join(", ");

      out.push({ name, address, category, rating, reviews, url: "", lat: "", lng: "" });
    });
  }

  function extractVisible() {
    const places = [];
    const seen = new Set();
    document.querySelectorAll("button.SMP2wb").forEach((btn) => {
      const nameEl = btn.querySelector(".fontHeadlineSmall");
      const name = nameEl?.textContent?.trim();
      if (!name || seen.has(name)) return;
      seen.add(name);

      const ratingEl = btn.querySelector(".MW4etd");
      const rating = ratingEl?.textContent?.trim() || "";
      const reviewEl = btn.querySelector(".UY7F9");
      const reviews = reviewEl?.textContent?.trim().replace(/[()]/g, "") || "";

      const infoSpans = btn.querySelectorAll(".IIrLbb > span");
      let category = "";
      const addressParts = [];
      infoSpans.forEach((span) => {
        const text = span.textContent?.trim();
        if (!text) return;
        if (span.closest(".Rv8Tad")) return;
        if (!category) { category = text; } else { addressParts.push(text); }
      });

      places.push({ name, address: addressParts.join(", "), category, rating, reviews, url: "", lat: "", lng: "" });
    });
    return places;
  }
}
