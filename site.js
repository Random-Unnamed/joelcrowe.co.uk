// Loads the editable content (content/*.json) and fills in the page.
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const img = p => (p ? String(p).replace(/^\/+/, "") : "");   // works on a custom domain or a sub-folder
  const fmtDate = d => {
    const t = new Date(d + (String(d).length === 10 ? "T12:00:00" : ""));
    return isNaN(t) ? esc(d) : t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };
  // Article bodies are stored as HTML by the editor; plain Markdown is also accepted.
  function md(src) {
    const inline = t => esc(t)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => `<img alt="${a}" src="${img(u)}">`)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
    return src.split(/\n{2,}/).map(b => {
      b = b.trim(); if (!b) return "";
      const h = b.match(/^(#{1,4})\s+(.*)$/); if (h) return `<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`;
      if (/^[-*]\s/.test(b)) return "<ul>" + b.split(/\n/).map(l => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("") + "</ul>";
      if (/^\d+\.\s/.test(b)) return "<ol>" + b.split(/\n/).map(l => `<li>${inline(l.replace(/^\d+\.\s+/, ""))}</li>`).join("") + "</ol>";
      return `<p>${inline(b).replace(/\n/g, "<br>")}</p>`;
    }).join("\n");
  }
  const body = s => (/<\/?(p|h\d|ul|ol|div|img|strong|em|br)\b/i.test(s || "") ? s : md(s || ""));
  const slugOf = a => a.slug || String(a.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const get = u => fetch(u, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
  const $ = id => document.getElementById(id);
  const set = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };

  function maths() {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(document.body, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
      } catch (e) { }
    }
  }

  function common(S) {
    document.querySelectorAll("[data-text]").forEach(e => { e.textContent = S[e.dataset.text] ?? ""; });
    const mail = $("contact-email"); if (mail) { mail.textContent = S.contact_email; mail.href = "mailto:" + S.contact_email; }
    const L = (Array.isArray(S.links) ? S.links : []).filter(l => l && l.url);
    const box = $("links");
    const lh = box && box.querySelector("h2"); if (lh) lh.textContent = S.links_heading || "Links";
    if (box) {
      if (!L.length) { box.hidden = true; }
      else {
        const fix = u => (/^(https?:|mailto:)/i.test(u) ? u : "https://" + u);
        set("links-list", L.map(l => `<li><a href="${esc(fix(String(l.url).trim()))}" target="_blank" rel="noopener">${esc(l.label || l.url)}</a></li>`).join(""));
      }
    }
  }

  Promise.all([get("site.json"), get("articles.json")]).then(([S, A]) => {
    common(S);
    A = (Array.isArray(A) ? A : []).slice().sort((x, y) => String(y.date).localeCompare(String(x.date)));
    const page = document.body.dataset.page;
    if (page === "home") {
      document.title = S.site_title;
      set("about", body(S.about));
      set("articles", A.length ? A.map(a => `
        <a class="card" href="article.html?a=${encodeURIComponent(slugOf(a))}">
          ${a.cover ? `<img class="cover" src="${esc(img(a.cover))}" alt="${esc(a.cover_alt || "")}" loading="lazy">` : ""}
          <div class="card-text"><time>${fmtDate(a.date)}</time><h3>${esc(a.title)}</h3>
          <p>${esc(a.summary || "")}</p><span class="more">${esc(S.read_more)} →</span></div></a>`).join("")
        : `<p class="muted">${esc(S.no_articles)}</p>`);
    } else if (page === "article") {
      const want = new URLSearchParams(location.search).get("a");
      const a = A.find(x => slugOf(x) === want);
      if (!a) { set("article", `<p class="muted">Article not found.</p>`); return; }
      document.title = `${a.title} · ${S.site_title}`;
      set("article", `
        ${a.cover ? `<img class="hero" src="${esc(img(a.cover))}" alt="${esc(a.cover_alt || "")}">` : ""}
        <h1>${esc(a.title)}</h1>
        <p class="byline">${esc(S.byline_prefix)} ${esc(S.author_name)} · <time>${fmtDate(a.date)}</time></p>
        <div class="prose">${body(a.body)}</div>`);
    }
    maths();
  }).catch(err => {
    set("articles", `<p class="muted">Couldn't load content (${esc(err.message)}).</p>`);
    set("article", `<p class="muted">Couldn't load content (${esc(err.message)}).</p>`);
  });
})();
