(function () {
  "use strict";

  const BUTTON_ID = "gmaps-export-btn";

  // ── Scan state (pause / stop) ──
  let scanState = "idle"; // "running" | "paused" | "stopped" | "idle"

  const observer = new MutationObserver(() => tryInject());
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(tryInject, 2000);

  // ── Inject export button ──
  function tryInject() {
    if (document.getElementById(BUTTON_ID)) return;
    const toolbar = findToolbar();
    if (!toolbar) return;

    const wrapper = document.createElement("div");
    wrapper.className = "TrU0dc kdfrQc gvzHte WY7ZIb";

    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.className = "S9kvJb";
    btn.setAttribute("aria-label", "匯出清單");
    btn.style.cssText = "cursor:pointer;";

    const span = document.createElement("span");
    span.className = "DVeyrd";

    const icon = document.createElement("span");
    icon.className = "Cw1rxd";
    icon.setAttribute("aria-hidden", "true");
    icon.style.cssText = "font-size:18px;line-height:1;";
    icon.textContent = "\u2B07";

    const label = document.createElement("span");
    label.className = "GMtm7c fontTitleSmall";
    label.style.fontFamily = '"Google Sans", Roboto, "Noto Sans TC", Arial, sans-serif';
    label.textContent = "匯出";

    const dot = document.createElement("div");
    dot.className = "OyjIsf zemfqc";

    span.appendChild(dot);
    span.appendChild(icon);
    span.appendChild(label);
    btn.appendChild(span);
    wrapper.appendChild(btn);
    toolbar.appendChild(wrapper);

    btn.addEventListener("click", handleExport);
  }

  function findToolbar() {
    const saved = document.querySelector('button[data-value="已儲存"], button[aria-label="已儲存"]');
    if (!saved) return null;
    return saved.closest(".m6QErb.vRIAEd") || saved.parentElement?.parentElement;
  }

  // ── Control bar (progress + pause/resume/stop) ──
  function showControlBar(text) {
    let bar = document.getElementById("gmaps-export-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "gmaps-export-bar";
      bar.style.cssText =
        "position:fixed;top:0;left:0;right:0;z-index:99999;background:#1a1a2e;" +
        "color:#fff;padding:8px 16px;display:flex;align-items:center;gap:12px;" +
        "font:500 13px/1.4 'Google Sans',Roboto,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.4);";

      const status = document.createElement("span");
      status.id = "gmaps-export-status";
      status.style.flex = "1";
      bar.appendChild(status);

      const pauseBtn = document.createElement("button");
      pauseBtn.id = "gmaps-export-pause";
      pauseBtn.textContent = "⏸ 暫停";
      pauseBtn.style.cssText = btnStyle("#ffd166");
      pauseBtn.addEventListener("click", () => {
        if (scanState === "running") {
          scanState = "paused";
          pauseBtn.textContent = "▶ 繼續";
          pauseBtn.style.cssText = btnStyle("#95d5b2");
          updateStatus();
        } else if (scanState === "paused") {
          scanState = "running";
          pauseBtn.textContent = "⏸ 暫停";
          pauseBtn.style.cssText = btnStyle("#ffd166");
          updateStatus();
        }
      });
      bar.appendChild(pauseBtn);

      const stopBtn = document.createElement("button");
      stopBtn.id = "gmaps-export-stop";
      stopBtn.textContent = "⏹ 停止並匯出";
      stopBtn.style.cssText = btnStyle("#e94560");
      stopBtn.addEventListener("click", () => { scanState = "stopped"; });
      bar.appendChild(stopBtn);

      document.body.appendChild(bar);
    }

    const status = document.getElementById("gmaps-export-status");
    if (status) status.textContent = text;
  }

  function btnStyle(bg) {
    return `background:${bg};color:#1a1a2e;border:none;border-radius:6px;padding:5px 14px;` +
      "font:600 12px/1.4 'Google Sans',Roboto,sans-serif;cursor:pointer;white-space:nowrap;";
  }

  let currentStatusText = "";
  function updateStatus() {
    const status = document.getElementById("gmaps-export-status");
    if (!status) return;
    const prefix = scanState === "paused" ? "⏸ 已暫停 — " : "";
    status.textContent = prefix + currentStatusText;
  }

  function setProgress(text) {
    currentStatusText = text;
    updateStatus();
    const status = document.getElementById("gmaps-export-status");
    if (status && scanState === "running") status.textContent = text;
  }

  function hideControlBar() {
    const b = document.getElementById("gmaps-export-bar");
    if (b) b.remove();
  }

  // Wait while paused, return false if stopped
  async function checkState() {
    while (scanState === "paused") {
      await sleep(200);
    }
    return scanState !== "stopped";
  }

  // ── Main export flow ──
  async function handleExport(e) {
    const btn = e.currentTarget;
    const label = btn.querySelector(".GMtm7c");
    const origText = label.textContent;
    label.textContent = "掃描中...";
    btn.disabled = true;
    scanState = "running";

    try {
      // Save viewport bounds NOW, before scanning moves the map
      const savedViewportBounds = getViewportBounds();

      showControlBar("Phase 1: 捲動載入清單...");
      const basicList = await scrollAndCollect();

      if (basicList.length === 0 || scanState === "stopped") {
        if (basicList.length === 0) {
          label.textContent = "找不到地點";
          setTimeout(() => { label.textContent = origText; btn.disabled = false; }, 2000);
        }
        hideControlBar();
        scanState = "idle";
        label.textContent = origText;
        btn.disabled = false;
        return;
      }

      setProgress(`Phase 2: 抓取詳細資料 (0/${basicList.length})...`);
      const detailed = await fetchDetails(basicList);

      hideControlBar();
      scanState = "idle";

      const viewportPlaces = filterByBounds(detailed, savedViewportBounds);
      await showExportPicker(detailed, viewportPlaces);
    } catch (err) {
      console.error("[Maps Exporter]", err);
      label.textContent = "錯誤";
      hideControlBar();
      scanState = "idle";
      setTimeout(() => { label.textContent = origText; btn.disabled = false; }, 2000);
      return;
    }

    label.textContent = origText;
    btn.disabled = false;
  }

  // ── Phase 1: Scroll the list to collect all items ──
  async function scrollAndCollect() {
    const scrollContainer =
      document.querySelector("div.m6QErb.DxyBCb.kA9KIf.dS8AEf") ||
      document.querySelector('div[role="feed"]');
    const listPanel = scrollContainer || document.querySelector('div[role="main"]');

    const seen = new Set();
    const allPlaces = [];

    if (!scrollContainer) {
      collectVisible(listPanel, seen, allPlaces);
      return allPlaces;
    }

    let prevCount = 0;
    let stableRounds = 0;

    for (let i = 0; i < 80; i++) {
      if (!(await checkState())) break;
      collectVisible(listPanel, seen, allPlaces);
      setProgress(`Phase 1: 捲動載入清單... (${allPlaces.length} 個地點)`);
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      await sleep(400);

      if (allPlaces.length === prevCount) {
        stableRounds++;
        if (stableRounds >= 4) break;
      } else {
        stableRounds = 0;
        prevCount = allPlaces.length;
      }
    }

    collectVisible(listPanel, seen, allPlaces);
    return allPlaces;
  }

  function collectVisible(root, seen, out) {
    if (!root) return;
    root.querySelectorAll("button.SMP2wb").forEach((btn) => {
      const nameEl = btn.querySelector(".fontHeadlineSmall");
      const name = nameEl?.textContent?.trim();
      if (!name || seen.has(name)) return;

      const infoSpans = btn.querySelectorAll(".IIrLbb > span");
      const infos = [];
      infoSpans.forEach((span) => {
        const text = span.textContent?.trim();
        if (text && !span.closest(".Rv8Tad")) infos.push(text);
      });
      if (infos.length === 0) return;

      seen.add(name);

      const ratingEl = btn.querySelector(".MW4etd");
      const rating = ratingEl?.textContent?.trim() || "";
      const reviewEl = btn.querySelector(".UY7F9");
      const reviews = reviewEl?.textContent?.trim().replace(/[()]/g, "") || "";
      const category = infos[0] || "";

      out.push({
        name,
        address: "",
        category,
        rating,
        reviews,
        phone: "",
        website: "",
        hours: "",
        url: "",
        lat: "",
        lng: "",
      });
    });
  }

  // ── Phase 2: Click each place to get details ──
  async function fetchDetails(places) {
    const listUrl = location.href;
    let prevUrl = listUrl;

    for (let i = 0; i < places.length; i++) {
      if (!(await checkState())) break;

      setProgress(`Phase 2: 抓取詳細資料 (${i + 1}/${places.length}) ${places[i].name}`);

      await ensureOnList(listUrl);

      // Remember the URL before clicking so we can detect navigation
      prevUrl = location.href;

      const clicked = await findAndClick(places[i].name);
      if (!clicked) continue;

      // Wait for the detail page to load with the CORRECT place
      const detailLoaded = await waitForCorrectDetail(places[i].name, prevUrl);
      if (!detailLoaded) {
        await ensureOnList(listUrl);
        continue;
      }

      // Extract all details
      const detail = await extractDetail();
      Object.assign(places[i], detail);

      history.back();
      await waitForList();
      await sleep(500);
    }

    return places;
  }

  async function extractDetail() {
    const result = { address: "", phone: "", website: "", hours: "", url: "", lat: "", lng: "" };

    // Address
    const addrBtn = document.querySelector('button[data-item-id="address"]');
    if (addrBtn) {
      const addrText = addrBtn.querySelector(".Io6YTe")?.textContent?.trim() || addrBtn.textContent?.trim();
      if (addrText) result.address = addrText;
    }

    // Phone
    const phoneBtn = document.querySelector('button[data-item-id^="phone"]');
    if (phoneBtn) {
      const phoneText = phoneBtn.querySelector(".Io6YTe")?.textContent?.trim() || phoneBtn.textContent?.trim();
      if (phoneText) result.phone = phoneText;
    }

    // Website
    const webLink = document.querySelector('a[data-item-id="authority"]');
    if (webLink) {
      result.website = webLink.href || webLink.textContent?.trim() || "";
    }

    // Hours — click to expand, then read the table
    result.hours = await extractHours();

    // URL
    result.url = location.href;

    // Coordinates — extract from the place-specific part of the URL (!3d=lat, !4d=lng)
    // NOT from @lat,lng which is just the viewport center
    const placeCoord = location.href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (placeCoord) {
      result.lat = placeCoord[1];
      result.lng = placeCoord[2];
    }

    return result;
  }

  async function extractHours() {
    // Find the hours dropdown button (aria-expanded="false" with 營業時間 icon)
    const hoursBtn = document.querySelector('.OMl5r[aria-expanded="false"] span[aria-label="營業時間"]');
    if (hoursBtn) {
      // Click the parent button to expand
      const btn = hoursBtn.closest('[aria-expanded="false"]');
      if (btn) {
        btn.click();
        await sleep(500);
      }
    }

    // Now read the expanded hours table
    const rows = document.querySelectorAll("table.eK4R0e tr.y0skZc");
    if (rows.length > 0) {
      const parts = [];
      rows.forEach((row) => {
        const day = row.querySelector(".ylH6lf")?.textContent?.trim();
        const time = row.querySelector(".mxowUb")?.getAttribute("aria-label") ||
                     row.querySelector(".mxowUb")?.textContent?.trim();
        if (day && time) parts.push(`${day}: ${time}`);
      });
      if (parts.length > 0) return parts.join("; ");
    }

    // Fallback: already expanded or simple text
    const statusSpan = document.querySelector("span.ZDu9vd");
    if (statusSpan) {
      const text = statusSpan.textContent?.trim();
      if (text && (text.includes("打烊") || text.includes("營業") || text.includes("24 小時") || text.includes("關閉"))) {
        return text;
      }
    }

    return "";
  }

  // Wait until the detail panel shows a place (h1 title + address button)
  async function waitForCorrectDetail(expectedName, prevUrl) {
    // Note the h1 text BEFORE we expect it to change (might be from previous place)
    const prevH1 = document.querySelector("h1.DUwDvf")?.textContent?.trim() || "";

    for (let i = 0; i < 40; i++) {
      await sleep(200);

      // Check if we navigated to directions or wrong page
      if (location.href.includes("/dir/")) return false;

      // Check for h1 title (the place name on the detail panel)
      const h1 = document.querySelector("h1.DUwDvf");
      if (!h1) continue;
      const currentH1 = h1.textContent?.trim() || "";

      // Accept if: h1 appeared/changed AND there's detail content (address button or info)
      const hasDetail = document.querySelector('button[data-item-id="address"]') ||
                        document.querySelector('button[data-item-id^="phone"]') ||
                        document.querySelector(".Io6YTe");

      if (currentH1 && hasDetail) {
        // If h1 changed from previous, we're on a new place — good
        // If h1 is the same but URL changed, also good (same-name edge case)
        // If it's the first place (prevH1 was empty), accept immediately
        if (currentH1 !== prevH1 || location.href !== prevUrl || !prevH1) {
          await sleep(600); // let phone, hours, etc. load
          return true;
        }
      }
    }

    // Final fallback: if there's any detail content visible, accept it
    const hasAnyDetail = document.querySelector('button[data-item-id="address"], h1.DUwDvf');
    if (hasAnyDetail) {
      await sleep(600);
      return true;
    }
    return false;
  }

  // ── Navigation helpers ──
  async function ensureOnList(listUrl) {
    for (let tries = 0; tries < 10; tries++) {
      const url = location.href;
      if (url.includes("/dir/")) {
        history.back();
        await sleep(800);
        continue;
      }
      const btns = document.querySelectorAll("button.SMP2wb");
      if (btns.length >= 2) return;
      await sleep(500);
    }
    if (listUrl) {
      location.href = listUrl;
      await sleep(2000);
      await waitForList();
    }
  }

  async function findAndClick(name) {
    const scrollContainer =
      document.querySelector("div.m6QErb.DxyBCb.kA9KIf.dS8AEf") ||
      document.querySelector('div[role="feed"]');
    if (!scrollContainer) return false;

    if (clickByName(scrollContainer, name)) return true;

    scrollContainer.scrollTop = 0;
    await sleep(400);

    for (let attempt = 0; attempt < 60; attempt++) {
      if (clickByName(scrollContainer, name)) return true;
      scrollContainer.scrollTop += 250;
      await sleep(250);
    }
    return false;
  }

  function clickByName(root, name) {
    const btns = root.querySelectorAll("button.SMP2wb");
    for (const btn of btns) {
      const nameEl = btn.querySelector(".fontHeadlineSmall");
      if (nameEl?.textContent?.trim() === name) {
        btn.scrollIntoView({ block: "center", behavior: "instant" });
        btn.click();
        return true;
      }
    }
    return false;
  }

  async function waitForList() {
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      if (document.querySelectorAll("button.SMP2wb").length >= 3) return;
    }
  }

  // ── Viewport filter ──
  function getViewportBounds() {
    // Parse @lat,lng,zoom from URL
    const m = location.href.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
    if (!m) return null;

    const centerLat = parseFloat(m[1]);
    const centerLng = parseFloat(m[2]);
    const zoom = parseFloat(m[3]);

    // Estimate visible span based on zoom level
    // At zoom z, 256px covers 360/2^z degrees longitude
    // Typical map panel is ~60% of window width, ~90% of height
    const mapWidthPx = window.innerWidth * 0.6;
    const mapHeightPx = window.innerHeight * 0.9;
    const degreesPerPx = 360 / (256 * Math.pow(2, zoom));
    const lngSpan = mapWidthPx * degreesPerPx / 2;
    const latSpan = mapHeightPx * degreesPerPx / 2;

    return {
      minLat: centerLat - latSpan,
      maxLat: centerLat + latSpan,
      minLng: centerLng - lngSpan,
      maxLng: centerLng + lngSpan,
    };
  }

  function filterByBounds(places, bounds) {
    if (!bounds) return places;

    return places.filter((p) => {
      const lat = parseFloat(p.lat);
      const lng = parseFloat(p.lng);
      if (isNaN(lat) || isNaN(lng)) return false;
      return lat >= bounds.minLat && lat <= bounds.maxLat &&
             lng >= bounds.minLng && lng <= bounds.maxLng;
    });
  }

  // ── Export picker (stays open, can export multiple times) ──
  function showExportPicker(allPlaces, viewportPlaces) {
    return new Promise((resolve) => {
      const old = document.getElementById("gmaps-export-picker");
      if (old) old.remove();
      const oldBd = document.getElementById("gmaps-export-backdrop");
      if (oldBd) oldBd.remove();

      const font = "'Google Sans',Roboto,sans-serif";

      const picker = document.createElement("div");
      picker.id = "gmaps-export-picker";
      picker.style.cssText =
        "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;" +
        "background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.3);" +
        "padding:24px;display:flex;flex-direction:column;gap:16px;min-width:300px;";

      // ── Close button (top right) ──
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "\u2715";
      closeBtn.style.cssText =
        "position:absolute;top:12px;right:14px;background:none;border:none;" +
        "font-size:18px;color:#888;cursor:pointer;padding:4px 8px;line-height:1;";
      closeBtn.addEventListener("click", closePicker);
      picker.appendChild(closeBtn);

      // ── Title ──
      const title = document.createElement("div");
      title.style.cssText = `font:600 17px/1.4 ${font};color:#202124;text-align:center;padding-right:24px;`;
      title.textContent = `掃描完成`;
      picker.appendChild(title);

      // ── All places section ──
      const allSection = makeSection(
        `全部匯出（${allPlaces.length} 個地點）`,
        allPlaces, "#1a73e8", "#f1f3f4", "#202124"
      );
      picker.appendChild(allSection);

      // ── Viewport section ──
      if (viewportPlaces.length > 0 && viewportPlaces.length < allPlaces.length) {
        const divider = document.createElement("div");
        divider.style.cssText = "height:1px;background:#e0e0e0;";
        picker.appendChild(divider);

        const vpSection = makeSection(
          `可見範圍（${viewportPlaces.length} 個地點）`,
          viewportPlaces, "#0d652d", "#e8f5e9", "#0d652d"
        );
        picker.appendChild(vpSection);
      }

      function makeSection(labelText, data, csvBg, jsonBg, jsonColor) {
        const section = document.createElement("div");

        const label = document.createElement("div");
        label.style.cssText = `font:500 14px/1.4 ${font};color:#202124;margin-bottom:8px;`;
        label.textContent = labelText;
        section.appendChild(label);

        const btns = document.createElement("div");
        btns.style.cssText = "display:flex;gap:8px;";

        const csvBtn = document.createElement("button");
        csvBtn.textContent = "CSV";
        csvBtn.style.cssText =
          `padding:8px 20px;border:none;border-radius:8px;font:500 14px/1.4 ${font};` +
          `cursor:pointer;flex:1;background:${csvBg};color:#fff;`;
        csvBtn.addEventListener("click", () => {
          downloadCsv(data);
          flash(csvBtn, "已下載!");
        });
        btns.appendChild(csvBtn);

        const jsonBtn = document.createElement("button");
        jsonBtn.textContent = "JSON";
        jsonBtn.style.cssText =
          `padding:8px 20px;border:none;border-radius:8px;font:500 14px/1.4 ${font};` +
          `cursor:pointer;flex:1;background:${jsonBg};color:${jsonColor};`;
        jsonBtn.addEventListener("click", () => {
          downloadJson(data);
          flash(jsonBtn, "已下載!");
        });
        btns.appendChild(jsonBtn);

        section.appendChild(btns);
        return section;
      }

      function flash(btn, msg) {
        const orig = btn.textContent;
        btn.textContent = msg;
        setTimeout(() => { btn.textContent = orig; }, 1200);
      }

      // ── Backdrop (click to close) ──
      const backdrop = document.createElement("div");
      backdrop.id = "gmaps-export-backdrop";
      backdrop.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.3);";
      backdrop.addEventListener("click", closePicker);

      function closePicker() {
        picker.remove();
        backdrop.remove();
        resolve();
      }

      document.body.appendChild(backdrop);
      document.body.appendChild(picker);
    });
  }

  // ── Download helpers ──
  function downloadCsv(places) {
    const header = "name,address,category,rating,reviews,phone,website,hours,url,lat,lng";
    const rows = places.map((p) =>
      [p.name, p.address, p.category, p.rating, p.reviews, p.phone, p.website, p.hours, p.url, p.lat, p.lng]
        .map((v) => '"' + String(v || "").replace(/"/g, '""') + '"')
        .join(",")
    );
    download(header + "\n" + rows.join("\n"), "maps-list.csv", "text/csv");
  }

  function downloadJson(places) {
    download(JSON.stringify(places, null, 2), "maps-list.json", "application/json");
  }

  function download(content, filename, mime) {
    const blob = new Blob(["\uFEFF" + content], { type: mime + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
})();
