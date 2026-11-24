(function () {
  // Mobile menu
  var t = document.querySelector(".nav-toggle"), nav = document.getElementById("site-nav");
  if (t && nav) t.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Show the "Private" menu item only on a device where you are signed in.
  try { if (localStorage.getItem("ms-private-nav") === "1") { var p = document.querySelector(".nav-private"); if (p) p.hidden = false; } } catch (e) {}

  // Download counts from GitHub Releases (cached for 6 hours per visitor).
  var USER = "moinulshdu", TTL = 6 * 3600 * 1000;
  function fmt(n) { return n >= 10000 ? Math.round(n / 1000) + "k" : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n); }
  function getRepo(repo) {
    var key = "gh-dl-" + repo, cached = null;
    try { cached = JSON.parse(localStorage.getItem(key) || "null"); } catch (e) {}
    if (cached && Date.now() - cached.t < TTL) return Promise.resolve(cached);
    return fetch("https://api.github.com/repos/" + USER + "/" + repo + "/releases?per_page=100", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (rels) {
        var n = 0; rels.forEach(function (rel) { (rel.assets || []).forEach(function (a) { n += a.download_count || 0; }); });
        var latest = rels.filter(function (r) { return !r.draft && !r.prerelease; })[0];
        var out = { t: Date.now(), n: n, v: latest ? latest.tag_name : "" };
        try { localStorage.setItem(key, JSON.stringify(out)); } catch (e) {}
        return out;
      })
      .catch(function () { return cached; });
  }
  var repos = {};
  document.querySelectorAll("[data-repo],[data-repo-version]").forEach(function (el) { repos[el.dataset.repo || el.dataset.repoVersion] = 1; });
  Object.keys(repos).forEach(function (repo) {
    getRepo(repo).then(function (d) {
      document.querySelectorAll('[data-repo="' + repo + '"]').forEach(function (el) {
        var n = el.querySelector(".dl-n");
        if (!d) { el.classList.add("dl-unknown"); if (n) n.textContent = "–"; return; }
        if (n) n.textContent = fmt(d.n);
        el.title = d.n.toLocaleString() + " downloads";
        el.setAttribute("aria-label", d.n.toLocaleString() + " downloads");
      });
      document.querySelectorAll('[data-repo-version="' + repo + '"]').forEach(function (el) {
        if (d && d.v) { el.textContent = "Latest: " + d.v; el.hidden = false; }
      });
    });
  });

  // Screenshot lightbox
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var img = lb.querySelector("img");
    document.querySelectorAll("a.shot").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); img.src = a.href; img.alt = a.querySelector("img").alt; lb.hidden = false; });
    });
    lb.addEventListener("click", function () { lb.hidden = true; img.src = ""; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.hidden = true; });
  }
})();
