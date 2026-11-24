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
    items = []; $("#vault-list").textContent = "";
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
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      render();
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
    const t = document.createElement(i.type === "page" ? "button" : "a");
    t.className = "vi-title"; t.textContent = (i.pinned ? "★ " : "") + (i.title || "(untitled)");
    if (i.type === "page") { t.type = "button"; t.onclick = () => openReader(i); }
    else if (safeUrl(i.url)) { t.href = i.url; t.target = "_blank"; t.rel = "noopener noreferrer"; }
    main.append(t);
    const sub = i.type === "page" ? (i.body || "").replace(/[#*_>\-]/g, "").slice(0, 140) : (i.notes || "");
    if (sub) { const n = document.createElement("p"); n.className = "vi-notes"; n.textContent = sub; main.append(n); }
    const ed = document.createElement("button"); ed.className = "btn small"; ed.type = "button"; ed.textContent = "Edit";
    ed.onclick = () => openEditor(i.type || "link", i);
    el.append(ic, main, ed);
    return el;
  }

  function safeUrl(u) { try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:"; } catch (_) { return false; } }

  // ---------- editor ----------
  const dlg = $("#dlg-edit"), fe = $("#f-edit");
  function openEditor(type, item = null) {
    editing = { type, id: item ? item.id : null };
    fe.reset();
    $("#dlg-title").textContent = (item ? "Edit " : "New ") + (type === "page" ? "private page" : "link");
    $$(".for-link", fe).forEach(x => (x.hidden = type === "page"));
    $$(".for-page", fe).forEach(x => (x.hidden = type !== "page"));
    fe.url.required = type !== "page";
    $("#b-delete").hidden = !item;
    if (item) {
      fe.title.value = item.title || ""; fe.url.value = item.url || ""; fe.category.value = item.category || "";
      fe.notes.value = item.notes || ""; fe.body.value = item.body || ""; fe.pinned.checked = !!item.pinned;
    } else if (activeCat !== "All") fe.category.value = activeCat;
    else if (type === "page") fe.category.value = "Unpublished pages";
    dlg.showModal();
  }
  $("#b-add-link").onclick = () => openEditor("link");
  $("#b-add-page").onclick = () => openEditor("page");
  $("#q").addEventListener("input", render);

  fe.addEventListener("submit", async e => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    if (editing.type === "link" && !safeUrl(fe.url.value.trim())) { fe.url.setCustomValidity("Please enter a full link starting with https://"); fe.url.reportValidity(); fe.url.setCustomValidity(""); return; }
    const data = {
      type: editing.type, title: fe.title.value.trim(), category: fe.category.value.trim() || "Other",
      url: editing.type === "link" ? fe.url.value.trim() : "", notes: editing.type === "link" ? fe.notes.value : "",
      body: editing.type === "page" ? fe.body.value : "", pinned: fe.pinned.checked, updated: F.serverTimestamp()
    };
    try {
      if (editing.id) await F.updateDoc(F.doc(col(), editing.id), data);
      else await F.addDoc(col(), { ...data, created: F.serverTimestamp() });
      dlg.close();
    } catch (err) { alert(friendly(err)); }
  });
  $("#b-delete").onclick = async () => {
    if (!editing.id || !confirm("Delete this entry? This cannot be undone.")) return;
    try { await F.deleteDoc(F.doc(col(), editing.id)); dlg.close(); $("#dlg-read").close(); } catch (err) { alert(friendly(err)); }
  };

  // ---------- reader for private pages ----------
  let reading = null;
  function openReader(i) {
    reading = i;
    $("#read-title").textContent = i.title || "";
    $("#read-body").innerHTML = miniMarkdown(i.body || "");
    $("#dlg-read").showModal();
  }
  $("#b-read-close").onclick = () => $("#dlg-read").close();
  $("#b-read-edit").onclick = () => { $("#dlg-read").close(); openEditor("page", reading); };

  // ---------- menu: export, password link ----------
  const more = $("#m-more");
  $("#b-more").onclick = e => { e.stopPropagation(); more.hidden = !more.hidden; $("#b-more").setAttribute("aria-expanded", String(!more.hidden)); };
  document.addEventListener("click", e => { if (!e.target.closest(".menu-wrap")) more.hidden = true; });
  $("#b-export").onclick = () => {
    const clean = items.map(({ updated, created, ...r }) => r);
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "private-backup-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $("#b-pwreset").onclick = async () => {
    try { await A.sendPasswordResetEmail(auth, user.email, { url: location.href }); alert("A link to set a new password was sent to " + user.email + "."); }
    catch (err) { alert(friendly(err)); }
  };
}

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
