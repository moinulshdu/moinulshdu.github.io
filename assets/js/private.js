// Private area: Firebase Authentication (email + password) and a Firestore
// "vault" of links and private pages that only the signed-in owner can read.
const V = "10.12.2";
const cfg = window.FIREBASE_CONFIG;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NAV_FLAG = "ms-private-nav";

function show(view) {
  $$(".pv-view").forEach(v => (v.hidden = v.dataset.view !== view));
  $$(".pv-msg").forEach(m => { m.textContent = ""; m.className = "pv-msg"; });
  window.scrollTo(0, 0);
}
function msg(form, text, ok = false) {
  const m = $(".pv-msg", form.closest(".pv-view"));
  m.textContent = text; m.className = "pv-msg " + (ok ? "ok" : "err");
}
function friendly(e) {
  const c = (e && e.code) || "";
  const map = {
    "auth/invalid-credential": "Email or password is not correct.",
    "auth/wrong-password": "Email or password is not correct.",
    "auth/user-not-found": "Email or password is not correct.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/email-already-in-use": "An account with this email already exists. Try signing in or resetting the password.",
    "auth/weak-password": "Please choose a longer password.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/operation-not-allowed": "New accounts are switched off for this site.",
    "auth/admin-restricted-operation": "New accounts are switched off for this site.",
    "auth/network-request-failed": "No connection. Check your internet and try again.",
    "permission-denied": "Access denied."
  };
  return map[c] || ("Something went wrong (" + (c || e.message || e) + ").");
}

if (!cfg) {
  show("setup");
} else {
  start().catch(e => { console.error(e); show("setup"); });
}

async function start() {
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const A = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const F = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  let unsub = null, items = [], activeCat = "All", editing = null, user = null;
  let mdrive = null, mdriveDoc = null, drafts = [], draftsLoaded = false;

  // ---------- navigation between forms ----------
  document.addEventListener("click", e => {
    const go = e.target.closest("[data-go]");
    if (go) { e.preventDefault(); show(go.dataset.go); }
    if (e.target.closest(".pv-signout")) { e.preventDefault(); doSignOut(); }
  });

  // ---------- sign in ----------
  $("#f-signin").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target;
    try {
      await A.setPersistence(auth, f.remember.checked ? A.browserLocalPersistence : A.browserSessionPersistence);
      await A.signInWithEmailAndPassword(auth, f.email.value.trim(), f.password.value);
      f.reset();
    } catch (err) { msg(f, friendly(err)); }
  });

  // ---------- sign up ----------
  $("#f-signup").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target;
    const email = f.email.value.trim();
    if (f.password.value !== f.password2.value) return msg(f, "The two passwords are different.");
    const owner = (window.PRIVATE_OWNER_EMAIL || "").trim().toLowerCase();
    if (owner && email.toLowerCase() !== owner) return msg(f, "New accounts are switched off for this site.");
    try {
      await A.setPersistence(auth, A.browserSessionPersistence);
      const cred = await A.createUserWithEmailAndPassword(auth, email, f.password.value);
      await A.sendEmailVerification(cred.user, { url: location.href });
      f.reset();
    } catch (err) { msg(f, friendly(err)); }
  });

  // ---------- reset password ----------
  $("#f-reset").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target;
    try { await A.sendPasswordResetEmail(auth, f.email.value.trim(), { url: location.href }); }
    catch (err) { if (err.code !== "auth/user-not-found") return msg(f, friendly(err)); }
    msg(f, "If that email has an account, a reset link is on its way. Check your inbox and spam folder.", true);
  });

  // ---------- email verification ----------
  $("#b-verified").addEventListener("click", async () => {
    await A.reload(auth.currentUser);
    if (auth.currentUser.emailVerified) {
      await auth.currentUser.getIdToken(true);   // refresh token so the database sees it
      openVault(auth.currentUser);
    } else msg($("#b-verified"), "Not confirmed yet — open the link in the email first.");
  });
  $("#b-resend").addEventListener("click", async () => {
    try { await A.sendEmailVerification(auth.currentUser, { url: location.href }); msg($("#b-resend"), "Sent again.", true); }
    catch (err) { msg($("#b-resend"), friendly(err)); }
  });

  async function doSignOut() {
    if (unsub) { unsub(); unsub = null; }
    items = []; drafts = []; mdrive = null; mdriveDoc = null; draftsLoaded = false;
    $("#vault-list").textContent = ""; $("#drafts").textContent = "";
    try { localStorage.removeItem(NAV_FLAG); } catch (_) {}
    await A.signOut(auth);
  }

  A.onAuthStateChanged(auth, u => {
    user = u;
    $$(".pv-email").forEach(s => (s.textContent = u ? u.email : ""));
    if (!u) { show("signin"); return; }
    if (!u.emailVerified) { show("verify"); return; }
    openVault(u);
  });

  // ---------- idle sign-out ----------
  let idleTimer;
  const idleMs = (window.PRIVATE_IDLE_MINUTES || 30) * 60000;
  const bump = () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (auth.currentUser) doSignOut(); }, idleMs); };
  ["click", "keydown", "scroll", "touchstart"].forEach(ev => document.addEventListener(ev, bump, { passive: true }));
  bump();

  // ---------- vault ----------
  const col = () => F.collection(db, "vaults", user.uid, "items");

  function openVault(u) {
    try { localStorage.setItem(NAV_FLAG, "1"); } catch (_) {}
    const nav = document.querySelector(".nav-private"); if (nav) nav.hidden = false;
    show("vault");
    if (unsub) unsub();
    unsub = F.onSnapshot(col(), snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const st = all.find(i => i.type === "settings");
      const changed = JSON.stringify(st && st.mdrive || null) !== JSON.stringify(mdrive);
      mdriveDoc = st || null; mdrive = st && st.mdrive || null;
      items = all.filter(i => i.type !== "settings");
      render();
      if (changed || !draftsLoaded) loadDrafts();
    }, err => { $("#vault-list").innerHTML = ""; const p = document.createElement("p"); p.className = "pv-msg err"; p.textContent = friendly(err) + " Check that the Firestore rules from firestore.rules are published."; $("#vault-list").append(p); });
  }

  const catsOf = () => [...new Set(items.map(i => i.category || "Other"))].sort((a, b) => a.localeCompare(b));

  function render() {
    // category chips + datalist
    const cats = catsOf();
    if (activeCat !== "All" && !cats.includes(activeCat)) activeCat = "All";
    const bar = $("#cats"); bar.textContent = "";
    ["All", ...cats].forEach(c => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip" + (c === activeCat ? " on" : ""); b.textContent = c;
      b.onclick = () => { activeCat = c; render(); };
      bar.append(b);
    });
    const dl = $("#cat-list"); dl.textContent = "";
    [...new Set([...cats, "Google Drive", "Health", "Documents", "Unpublished pages", "Other"])].forEach(c => { const o = document.createElement("option"); o.value = c; dl.append(o); });

    // filtered list grouped by category
    const q = $("#q").value.trim().toLowerCase();
    const shown = items.filter(i => (activeCat === "All" || (i.category || "Other") === activeCat) &&
      (!q || [i.title, i.notes, i.category, i.url, i.body].join(" ").toLowerCase().includes(q)));
    shown.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (a.title || "").localeCompare(b.title || ""));
    const list = $("#vault-list"); list.textContent = "";
    if (!items.length) { list.innerHTML = '<div class="card pad empty">Nothing here yet. Use <b>+ Add link</b> for Google Drive files and folders, or <b>+ New private page</b> for notes and unpublished pages.</div>'; return; }
    if (!shown.length) { list.innerHTML = '<div class="card pad empty">No matches.</div>'; return; }
    const groups = {};
    shown.forEach(i => (groups[i.category || "Other"] ||= []).push(i));
    Object.keys(groups).sort().forEach(g => {
      const sec = document.createElement("section");
      const h = document.createElement("h2"); h.textContent = g; sec.append(h);
      const ul = document.createElement("div"); ul.className = "vault-items";
      groups[g].forEach(i => ul.append(row(i)));
      sec.append(ul); list.append(sec);
    });
  }

  function iconFor(i) {
    if (i.type === "page") return "📝";
    if (i.type === "article") return "📰";
    const u = (i.url || "").toLowerCase();
    if (u.includes("docs.google.com/document")) return "📄";
    if (u.includes("docs.google.com/spreadsheets")) return "📊";
    if (u.includes("docs.google.com/presentation")) return "📽️";
    if (u.includes("drive.google.com/drive/folders")) return "📁";
    if (u.includes("drive.google.com")) return "🗂️";
    if (u.endsWith(".pdf")) return "📕";
    return "🔗";
  }

  function row(i) {
    const el = document.createElement("div"); el.className = "vault-item";
    const ic = document.createElement("span"); ic.className = "vi-icon"; ic.textContent = iconFor(i);
    const main = document.createElement("div"); main.className = "vi-main";
    const isDoc = i.type === "page" || i.type === "article";
    const t = document.createElement(isDoc ? "button" : "a");
    t.className = "vi-title"; t.textContent = (i.pinned ? "★ " : "") + (i.title || "(untitled)");
    if (isDoc) { t.type = "button"; t.onclick = () => openReader(i); }
    else if (safeUrl(i.url)) { t.href = i.url; t.target = "_blank"; t.rel = "noopener noreferrer"; }
    main.append(t);
    const sub = i.type === "article" ? "Draft article" + (i.date ? " · " + i.date : "") + (i.summary ? " — " + i.summary : "")
      : i.type === "page" ? (i.body || "").replace(/[#*_>\-]/g, "").slice(0, 140) : (i.notes || "");
    if (sub) { const n = document.createElement("p"); n.className = "vi-notes"; n.textContent = sub; main.append(n); }
    const ed = document.createElement("button"); ed.className = "btn small"; ed.type = "button"; ed.textContent = "Edit";
    ed.onclick = () => openEditor(i.type || "link", i);
    if (i.type === "article") {
      const mv = document.createElement("button"); mv.className = "btn small"; mv.type = "button"; mv.textContent = "Move to mDrive";
      mv.onclick = () => moveToMdrive(i);
      const box = document.createElement("div"); box.className = "btns"; box.append(mv, ed);
      el.append(ic, main, box);
    } else el.append(ic, main, ed);
    return el;
  }

  function safeUrl(u) { try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:"; } catch (_) { return false; } }

  // ---------- editor ----------
  const dlg = $("#dlg-edit"), fe = $("#f-edit");
  function openEditor(type, item = null) {
    editing = { type, id: item ? item.id : null, draft: item && item.path ? item : null };
    fe.category.closest("label").hidden = type === "article" && !(item && item.id);
    fe.pinned.closest("label").hidden = type === "article" && !(item && item.id);
    fe.reset();
    $("#dlg-title").textContent = (item ? "Edit " : "New ") + ({ page: "private page", article: "draft article", link: "link" })[type];
    $$(".for-link, .for-page, .for-article", fe).forEach(x => (x.hidden = !x.classList.contains("for-" + type)));
    $(".lbl-page", fe).hidden = type !== "page"; $(".lbl-article", fe).hidden = type !== "article";
    dlg.classList.toggle("article-mode", type === "article");
    fe.url.required = type === "link";
    $("#b-delete").hidden = !item;
    if (item) {
      fe.title.value = item.title || ""; fe.url.value = item.url || ""; fe.category.value = item.category || "";
      fe.notes.value = item.notes || ""; fe.body.value = item.body || ""; fe.pinned.checked = !!item.pinned;
      fe.date.value = item.date || ""; fe.summary.value = item.summary || ""; fe.toc_figure.value = item.toc_figure || "";
      fe.tags.value = (item.tags || []).join(", "); fe.math.checked = !!item.math;
    } else if (type === "article") { fe.category.value = "Draft articles"; fe.date.value = localToday(); }
    else if (activeCat !== "All") fe.category.value = activeCat;
    else if (type === "page") fe.category.value = "Unpublished pages";
    dlg.showModal();
  }
  $("#b-add-link").onclick = () => openEditor("link");
  $("#b-add-page").onclick = () => openEditor("page");
  $("#b-add-article").onclick = () => { if (!mdrive) return openMdrive(); openEditor("article"); };
  $("#q").addEventListener("input", render);

  fe.addEventListener("submit", async e => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    if (editing.type === "link" && !safeUrl(fe.url.value.trim())) { fe.url.setCustomValidity("Please enter a full link starting with https://"); fe.url.reportValidity(); fe.url.setCustomValidity(""); return; }
    const data = {
      type: editing.type, title: fe.title.value.trim(), category: fe.category.value.trim() || "Other",
      url: editing.type === "link" ? fe.url.value.trim() : "", notes: editing.type === "link" ? fe.notes.value : "",
      body: editing.type !== "link" ? fe.body.value : "", pinned: fe.pinned.checked, updated: F.serverTimestamp()
    };
    if (editing.type === "article" && !editing.id) {          // draft stored in mDrive
      const art = { title: data.title, date: fe.date.value || localToday(), summary: fe.summary.value.trim(),
        toc_figure: fe.toc_figure.value.trim(), math: fe.math.checked, tags: fe.tags.value.split(",").map(x => x.trim()).filter(Boolean), body: fe.body.value };
      const btn = $("#b-save"); btn.disabled = true; btn.textContent = "Saving…";
      try { await saveDraft(art, editing.draft); dlg.close(); await loadDrafts(); }
      catch (err) { alert("Could not save to GitHub: " + (err.message || err)); }
      finally { btn.disabled = false; btn.textContent = "Save"; }
      return;
    }
    if (editing.type === "article") Object.assign(data, {
      date: fe.date.value || localToday(), summary: fe.summary.value.trim(),
      toc_figure: fe.toc_figure.value.trim(), math: fe.math.checked,
      tags: fe.tags.value.split(",").map(x => x.trim()).filter(Boolean)
    });
    try {
      if (editing.id) await F.updateDoc(F.doc(col(), editing.id), data);
      else await F.addDoc(col(), { ...data, created: F.serverTimestamp() });
      dlg.close();
    } catch (err) { alert(friendly(err)); }
  });
  $("#b-delete").onclick = async () => {
    if (editing.draft) {
      if (!confirm("Delete the draft file " + editing.draft.name + " from GitHub? (GitHub keeps it in the repository's history.)")) return;
      try { await gh("DELETE", editing.draft.path, { message: "Delete draft " + editing.draft.name, sha: editing.draft.sha, branch: mdrive.branch });
        dlg.close(); $("#dlg-read").close(); await loadDrafts(); } catch (err) { alert("Could not delete: " + (err.message || err)); }
      return;
    }
    if (!editing.id || !confirm("Delete this entry? This cannot be undone.")) return;
    try { await F.deleteDoc(F.doc(col(), editing.id)); dlg.close(); $("#dlg-read").close(); } catch (err) { alert(friendly(err)); }
  };

  // ---------- reader for private pages ----------
  let reading = null;
  async function openReader(i) {
    reading = i;
    const isArt = i.type === "article";
    $("#read-title").textContent = isArt ? "Preview (only you can see this)" : (i.title || "");
    $("#b-read-publish").hidden = !isArt;
    $("#dlg-read").classList.toggle("article-mode", isArt);
    if (!isArt) { $("#read-body").innerHTML = miniMarkdown(i.body || ""); $("#dlg-read").showModal(); return; }
    $("#read-body").innerHTML = '<p class="muted">Rendering…</p>';
    $("#dlg-read").showModal();
    try { $("#read-body").innerHTML = await renderArticle(i); if (i.math) typeset($("#read-body")).catch(() => {}); }
    catch (e) { $("#read-body").textContent = "Preview could not load (no internet?). " + e; }
  }
  $("#b-read-publish").onclick = () => downloadArticle(reading);

  $("#b-read-close").onclick = () => $("#dlg-read").close();
  $("#b-read-edit").onclick = () => { $("#dlg-read").close(); openEditor(reading.type === "article" ? "article" : "page", reading); };

  // ---------- draft articles in the private GitHub repository (mDrive) ----------
  const enc = p => p.split("/").map(encodeURIComponent).join("/");
  async function gh(method, path, body) {
    const url = "https://api.github.com/repos/" + mdrive.owner + "/" + mdrive.repo + (path === null ? "" : "/contents/" + enc(path)) +
      (method === "GET" && path !== null ? "?ref=" + encodeURIComponent(mdrive.branch) : "");
    const r = await fetch(url, { method, headers: { Authorization: "Bearer " + mdrive.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    if (r.status === 404 && method === "GET") return null;
    if (!r.ok) { let m = r.status + ""; try { m = (await r.json()).message || m; } catch (_) {} throw new Error(m === "Bad credentials" ? "the access key is wrong or expired" : m); }
    return r.status === 204 ? null : r.json();
  }
  const b64dec = b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, "")), c => c.charCodeAt(0)));
  function b64enc(t) { const u = new TextEncoder().encode(t); let s2 = ""; for (let k = 0; k < u.length; k += 0x8000) s2 += String.fromCharCode.apply(null, u.subarray(k, k + 0x8000)); return btoa(s2); }
  async function parseMd(text, name) {
    const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    let meta = {}, body = text;
    if (m) { await loadScript(LIBS.yaml); try { meta = window.jsyaml.load(m[1]) || {}; } catch (_) {} body = text.slice(m[0].length); }
    const fromName = (name.match(/^(\d{4}-\d{2}-\d{2})-/) || [])[1];
    let date = meta.date ? new Date(meta.date) : null;
    date = date && !isNaN(date) ? date.toISOString().slice(0, 10) : (fromName || "");
    return { meta, type: "article", title: String(meta.title || name.replace(/\.md$/, "")), date, summary: String(meta.summary || "").trim(),
      toc_figure: String(meta.toc_figure || ""), math: !!meta.math, tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [], body: body.replace(/^\s+/, "") };
  }
  function buildMd(art, meta = {}) {
    const q = v => JSON.stringify(String(v || ""));
    const known = ["title", "date", "math", "summary", "toc_figure", "tags", "draft", "published"];
    const extra = Object.entries(meta).filter(([k]) => !known.includes(k));
    const fm = ["---", "title: " + q(art.title), "date: " + art.date, "math: " + (art.math ? "true" : "false"), "summary: " + q(art.summary),
      "toc_figure: " + q(art.toc_figure), "tags: " + JSON.stringify(art.tags || [])];
    if (extra.length && window.jsyaml) fm.push(window.jsyaml.dump(Object.fromEntries(extra)).trim());
    fm.push("---", "");
    return fm.join("\n") + (art.body || "").replace(/\s*$/, "\n");
  }
  const slugOf = t => (t || "article").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "article";
  async function saveDraft(art, existing) {
    await loadScript(LIBS.yaml);
    const text = buildMd(art, existing ? existing.meta : {});
    const path = existing ? existing.path : mdrive.folder.replace(/\/+$/, "") + "/" + art.date + "-" + slugOf(art.title) + ".md";
    if (!existing && await gh("GET", path)) throw new Error("a draft with this date and title already exists");
    await gh("PUT", path, { message: (existing ? "Update" : "Add") + " draft: " + art.title, content: b64enc(text), branch: mdrive.branch, ...(existing ? { sha: existing.sha } : {}) });
  }
  async function moveToMdrive(i) {
    if (!mdrive) return openMdrive();
    if (!confirm("Copy “" + i.title + "” into your GitHub draft folder and remove it from this list?")) return;
    try { await saveDraft({ title: i.title, date: i.date || localToday(), summary: i.summary, toc_figure: i.toc_figure, math: i.math, tags: i.tags, body: i.body });
      await F.deleteDoc(F.doc(col(), i.id)); await loadDrafts(); }
    catch (err) { alert("Could not move it: " + (err.message || err)); }
  }
  function draftRow(dft) {
    const el = document.createElement("div"); el.className = "vault-item";
    const ic = document.createElement("span"); ic.className = "vi-icon"; ic.textContent = "📰";
    const main = document.createElement("div"); main.className = "vi-main";
    const t = document.createElement("button"); t.type = "button"; t.className = "vi-title"; t.textContent = dft.title; t.onclick = () => openReader(dft);
    const n = document.createElement("p"); n.className = "vi-notes"; n.textContent = (dft.date ? dft.date + " · " : "") + dft.name + (dft.summary ? " — " + dft.summary : "");
    main.append(t, n);
    const box = document.createElement("div"); box.className = "btns";
    const mk = (label, fn) => { const b2 = document.createElement("button"); b2.type = "button"; b2.className = "btn small"; b2.textContent = label; b2.onclick = fn; return b2; };
    const gl = document.createElement("a"); gl.className = "btn small"; gl.textContent = "GitHub ↗"; gl.target = "_blank"; gl.rel = "noopener";
    gl.href = "https://github.com/" + mdrive.owner + "/" + mdrive.repo + "/blob/" + encodeURIComponent(mdrive.branch) + "/" + enc(dft.path);
    box.append(mk("Preview", () => openReader(dft)), mk("Edit", () => openEditor("article", dft)), gl);
    el.append(ic, main, box);
    return el;
  }
  async function loadDrafts() {
    const box = $("#drafts"); draftsLoaded = true;
    const head = document.createElement("div"); head.className = "drafts-head";
    const h = document.createElement("h2"); h.textContent = "Draft articles (private, in " + (mdrive ? mdrive.repo : "GitHub") + ")";
    const btns = document.createElement("div"); btns.className = "btns";
    if (!mdrive) {
      box.replaceChildren(head); head.append(h);
      const c = document.createElement("div"); c.className = "card pad";
      c.innerHTML = "<p>Your draft articles are .md files in a folder of your private GitHub repository. Connect it once to list, preview, edit and publish them here.</p>";
      const b2 = document.createElement("button"); b2.className = "btn primary"; b2.type = "button"; b2.textContent = "Connect the draft folder"; b2.onclick = openMdrive;
      c.append(b2); box.append(c); return;
    }
    const refresh = document.createElement("button"); refresh.className = "btn small"; refresh.type = "button"; refresh.textContent = "↻ Refresh"; refresh.onclick = loadDrafts;
    const folderLink = document.createElement("a"); folderLink.className = "btn small"; folderLink.textContent = "Folder ↗"; folderLink.target = "_blank"; folderLink.rel = "noopener";
    folderLink.href = "https://github.com/" + mdrive.owner + "/" + mdrive.repo + "/tree/" + encodeURIComponent(mdrive.branch) + "/" + enc(mdrive.folder);
    btns.append(refresh, folderLink); head.append(h, btns);
    const list = document.createElement("div"); list.className = "vault-items"; list.innerHTML = '<p class="muted" style="padding:12px 16px;margin:0">Loading drafts…</p>';
    box.replaceChildren(head, list);
    try {
      const files = ((await gh("GET", mdrive.folder)) || []).filter(f => f.type === "file" && /\.md$/i.test(f.name) && !/^readme\.md$/i.test(f.name));
      drafts = await Promise.all(files.map(async f => { const j = await gh("GET", f.path); return { ...(await parseMd(b64dec(j.content), f.name)), name: f.name, path: f.path, sha: j.sha }; }));
      drafts.sort((a2, b2) => (b2.date || "").localeCompare(a2.date || ""));
      list.textContent = "";
      if (!drafts.length) { list.innerHTML = '<p class="muted" style="padding:12px 16px;margin:0">No drafts yet. Click <b>+ New draft article</b>, or upload .md files to the folder on GitHub.</p>'; return; }
      drafts.forEach(dft => list.append(draftRow(dft)));
    } catch (err) { list.innerHTML = ""; const p = document.createElement("p"); p.className = "pv-msg err"; p.style.padding = "12px 16px"; p.textContent = "Could not read the draft folder: " + (err.message || err) + ". Check the settings in ⋯ › Draft folder on GitHub."; list.append(p); }
  }
  // settings dialog
  const dm = $("#dlg-mdrive"), fm2 = $("#f-mdrive");
  function openMdrive() {
    more.hidden = true; $("#mdrive-msg").textContent = ""; $("#mdrive-msg").className = "pv-msg";
    if (mdrive) for (const k of ["owner", "repo", "branch", "folder"]) fm2[k].value = mdrive[k];
    fm2.token.value = ""; fm2.token.required = !mdrive; fm2.token.placeholder = mdrive ? "leave empty to keep the saved key" : "github_pat_…";
    dm.showModal();
  }
  $("#b-mdrive").onclick = openMdrive;
  fm2.addEventListener("submit", async e => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    const cfg = { owner: fm2.owner.value.trim(), repo: fm2.repo.value.trim(), branch: fm2.branch.value.trim(),
      folder: fm2.folder.value.trim().replace(/^\/+|\/+$/g, ""), token: fm2.token.value.trim() || (mdrive && mdrive.token) || "" };
    const msgEl = $("#mdrive-msg"); msgEl.className = "pv-msg"; msgEl.textContent = "Testing…";
    const old = mdrive; mdrive = cfg;
    try {
      const repo = await gh("GET", null);
      if (!repo) throw new Error("repository not found (check the name, and that the key may access it)");
      if (repo.permissions && repo.permissions.push === false) throw new Error("the key can read but not write; give it Contents: Read and write");
      if (!repo.private) { if (!confirm(cfg.repo + " is a PUBLIC repository, so drafts there are visible to everyone. Use it anyway?")) throw new Error("cancelled"); }
      const branchOk = await fetch("https://api.github.com/repos/" + cfg.owner + "/" + cfg.repo + "/branches/" + encodeURIComponent(cfg.branch), { headers: { Authorization: "Bearer " + cfg.token } });
      if (!branchOk.ok) throw new Error("branch “" + cfg.branch + "” not found (it may be main or master)");
      const data = { type: "settings", title: "settings", mdrive: cfg, updated: F.serverTimestamp() };
      if (mdriveDoc) await F.updateDoc(F.doc(col(), mdriveDoc.id), data); else await F.addDoc(col(), data);
      dm.close(); loadDrafts();
    } catch (err) { mdrive = old; msgEl.className = "pv-msg err"; msgEl.textContent = "Not saved: " + (err.message || err) + "."; }
  });

  // ---------- menu: export, password link ----------
  const more = $("#m-more");
  $("#b-more").onclick = e => { e.stopPropagation(); more.hidden = !more.hidden; $("#b-more").setAttribute("aria-expanded", String(!more.hidden)); };
  document.addEventListener("click", e => { if (!e.target.closest(".menu-wrap")) more.hidden = true; });
  $("#b-export").onclick = () => {
    const clean = items.map(({ updated, created, ...r }) => r);
    if (mdrive) clean.push({ type: "settings", mdrive: { ...mdrive, token: "(not exported)" } });
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "private-backup-" + localToday() + ".json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $("#b-pwreset").onclick = async () => {
    try { await A.sendPasswordResetEmail(auth, user.email, { url: location.href }); alert("A link to set a new password was sent to " + user.email + "."); }
    catch (err) { alert(friendly(err)); }
  };
}

// ---------- full article preview & publishing ----------
const LIBS = {
  marked: "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js",
  purify: "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js",
  yaml: "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js",
  mathjax: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
};
const loaded = {};
function loadScript(src) {
  return loaded[src] ||= new Promise((ok, bad) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => bad(new Error("could not load " + src)); document.head.append(s); });
}
const escHtml = s => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
async function renderArticle(i) {
  await Promise.all([loadScript(LIBS.marked), loadScript(LIBS.purify)]);
  let src = (i.body || "").replace(/\{\{\s*site\.baseurl\s*\}\}/g, "");
  const math = [];                 // keep equations away from the Markdown parser
  if (i.math) src = src.replace(/\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\$)[^$\n]+?\$/g, m => { math.push(m); return "MATHPH" + (math.length - 1) + "X"; });
  let html = window.DOMPurify.sanitize(window.marked.parse(src));
  html = html.replace(/MATHPH(\d+)X/g, (_, k) => escHtml(math[+k]));
  const d = i.date ? new Date(i.date + "T12:00:00") : null;
  const dateTxt = d ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
  return `<p class="preview-note">Private draft preview — not on the public website. When it's ready, click <b>Download for publishing</b>.</p>
    <div class="article-head"><h1>${escHtml(i.title)}</h1><p class="meta">Md Moinul Islam · ${escHtml(dateTxt)}</p>
    ${i.summary ? `<p class="lead">${escHtml(i.summary)}</p>` : ""}
    ${i.toc_figure ? `<figure class="toc-fig"><img src="${escHtml(i.toc_figure)}" alt=""></figure>` : ""}</div>
    <div class="prose">${html}</div>
    ${(i.tags || []).length ? `<p class="tags">${i.tags.map(t => `<span class="chip">${escHtml(t)}</span>`).join("")}</p>` : ""}`;
}
async function typeset(el) {
  window.MathJax = window.MathJax || { tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]], displayMath: [["$$", "$$"], ["\\[", "\\]"]] }, startup: { typeset: false } };
  await loadScript(LIBS.mathjax);
  if (window.MathJax.startup && window.MathJax.startup.promise) await window.MathJax.startup.promise;
  if (window.MathJax.typesetPromise) await window.MathJax.typesetPromise([el]);
}
function downloadArticle(i) {
  const date = i.date || localToday();
  const slug = (i.title || "article").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "article";
  const q = v => JSON.stringify(String(v || ""));          // JSON strings are valid YAML
  const fm = ["---", "title: " + q(i.title), "date: " + date, "math: " + (i.math ? "true" : "false"),
    "summary: " + q(i.summary), "toc_figure: " + q(i.toc_figure), "tags: " + JSON.stringify(i.tags || []), "---", ""].join("\n");
  const blob = new Blob([fm + (i.body || "").replace(/\s*$/, "\n")], { type: "text/markdown" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = date + "-" + slug + ".md"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  alert("Saved " + a.download + " to your Downloads folder.\n\nTo publish: on GitHub open the _posts folder → Add file → Upload files → drop this file → Commit changes. Upload any pictures to images/articles first. The article appears on the website about 2 minutes later.");
}

function localToday() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

// Small, safe Markdown: escapes HTML first, then # headings, **bold**, *italic*, - lists, [text](https://links).
function miniMarkdown(src) {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
  const out = []; let list = false;
  for (const line of src.split(/\r?\n/)) {
    const h = line.match(/^(#{1,3})\s+(.*)/), li = line.match(/^\s*[-*]\s+(.*)/);
    if (!li && list) { out.push("</ul>"); list = false; }
    if (h) out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`);
    else if (li) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inline(li[1])}</li>`); }
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("\n");
}
