/* Joanna Wiaterek: site script.
   It reads the plain-text files in the "content" folder and builds the lists.
   You should never need to edit this file. */

(function () {
  "use strict";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Escapes text, then turns [label](url) into a link.
  function inline(s) {
    return esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  }

  function linkOrText(href, html) {
    return href ? '<a href="' + esc(href) + '">' + html + "</a>" : html;
  }

  // Reads blocks like "key: value" separated by lines containing only ---
  function parseBlocks(text) {
    var out = [];
    text.replace(/\r\n?/g, "\n").split(/^[ \t]*---[ \t]*$/m).forEach(function (block) {
      var item = {}, has = false;
      block.split("\n").forEach(function (line) {
        var t = line.trim();
        if (!t || t.charAt(0) === "#") return;
        var i = line.indexOf(":");
        if (i < 1) return;
        item[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
        has = true;
      });
      if (has) out.push(item);
    });
    return out;
  }

  function parseDate(s) {
    var m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/.exec((s || "").trim());
    if (!m) return { y: 0, m: 0, d: 0, key: 0 };
    var y = +m[1], mo = m[2] ? +m[2] : 0, d = m[3] ? +m[3] : 0;
    if (mo > 12 || d > 31) return { y: 0, m: 0, d: 0, key: 0 };
    return { y: y, m: mo, d: d, key: y * 10000 + mo * 100 + d };
  }

  function fmtDate(p) {
    if (!p || !p.y) return "";
    if (p.d) return p.d + " " + MONTHS[p.m - 1] + " " + p.y;
    if (p.m) return MONTHS[p.m - 1] + " " + p.y;
    return String(p.y);
  }

  function load(path) {
    return fetch(path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path + " (" + r.status + ")");
      return r.text();
    });
  }

  // Loads a content file, sorted newest first.
  function getItems(path) {
    return load(path).then(function (text) {
      var items = parseBlocks(text);
      items.forEach(function (it) { it._d = parseDate(it.date); });
      items.sort(function (a, b) { return b._d.key - a._d.key; });
      return items;
    });
  }

  function splitTags(s) {
    return (s || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
  }

  function postHref(it) {
    if (it.link) return it.link;
    if (it.slug) return "post.html?p=" + encodeURIComponent(it.slug);
    return "";
  }

  function tagLinks(tags) {
    if (!tags.length) return "";
    return '<span class="tags">' + tags.map(function (t) {
      return '<a href="blog.html?tag=' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
    }).join(", ") + "</span>";
  }

  function empty(msg) { return '<li class="notice">' + esc(msg) + "</li>"; }

  function failure(file) {
    console.error("Could not load " + file);
    return '<p class="notice">This list could not be loaded.<small>' + esc(file) + "</small></p>";
  }

  /* ---------- renderers ---------- */

  function row(it, href, sub) {
    return '<li class="row"><span class="when">' + esc(fmtDate(it._d)) + "</span><div><h3>" +
      linkOrText(href, esc(it.title || "Untitled")) + "</h3>" +
      (sub ? "<p>" + inline(sub) + "</p>" : "") + "</div></li>";
  }

  function groupByYear(items) {
    var groups = [], cur = null;
    items.forEach(function (it) {
      if (!cur || cur.y !== it._d.y) { cur = { y: it._d.y, items: [] }; groups.push(cur); }
      cur.items.push(it);
    });
    return groups;
  }

  function yearGroups(items, entryFn) {
    return groupByYear(items).map(function (g) {
      return '<section class="year-group"><h2>' + (g.y || "Undated") + "</h2><div>" +
        g.items.map(entryFn).join("") + "</div></section>";
    }).join("");
  }

  function newsEntry(it) {
    return '<article class="entry"><h3>' + linkOrText(it.link, esc(it.title || "Untitled")) + "</h3>" +
      (it.text ? "<p>" + inline(it.text) + "</p>" : "") +
      '<p class="meta">' + esc(fmtDate(it._d)) + "</p></article>";
  }

  function pubEntry(it) {
    var authors = esc(it.authors || "").replace(/Joanna Wiaterek/g, "<strong>Joanna Wiaterek</strong>");
    var date = fmtDate(it._d);
    return '<article class="entry"><h3>' + linkOrText(it.link, esc(it.title || "Untitled")) + "</h3>" +
      (authors ? "<p>" + authors + "</p>" : "") +
      '<p class="meta">' + (it.venue ? '<span class="venue">' + esc(it.venue) + "</span>" : "") +
      (it.venue && date ? ", " : "") + esc(date) + "</p></article>";
  }

  function postEntry(it) {
    var bits = [fmtDate(it._d)];
    if (it.minutes) bits.push(it.minutes + " min read");
    return '<article class="entry"><h3>' + linkOrText(postHref(it), esc(it.title || "Untitled")) + "</h3>" +
      (it.summary ? "<p>" + inline(it.summary) + "</p>" : "") +
      '<p class="meta">' + esc(bits.filter(Boolean).join(", ")) + tagLinks(splitTags(it.tags)) + "</p></article>";
  }

  /* ---------- pages ---------- */

  function pageHome() {
    var n = document.getElementById("latest-news");
    var w = document.getElementById("latest-writing");
    getItems("content/news.txt").then(function (items) {
      n.innerHTML = items.length
        ? items.slice(0, 3).map(function (it) { return row(it, it.link, it.text); }).join("")
        : empty("No news yet.");
    }).catch(function () { n.innerHTML = failure("content/news.txt"); });
    getItems("content/blog.txt").then(function (items) {
      w.innerHTML = items.length
        ? items.slice(0, 3).map(function (it) { return row(it, postHref(it), it.summary); }).join("")
        : empty("No posts yet.");
    }).catch(function () { w.innerHTML = failure("content/blog.txt"); });
  }

  function pageNews() {
    var out = document.getElementById("list");
    getItems("content/news.txt").then(function (items) {
      out.innerHTML = items.length ? yearGroups(items, newsEntry) : '<p class="notice">No news yet.</p>';
    }).catch(function () { out.innerHTML = failure("content/news.txt"); });
  }

  function pagePublications() {
    var out = document.getElementById("list");
    getItems("content/publications.txt").then(function (items) {
      out.innerHTML = items.length ? yearGroups(items, pubEntry) : '<p class="notice">No publications yet.</p>';
    }).catch(function () { out.innerHTML = failure("content/publications.txt"); });
  }

  function pageBlog() {
    var out = document.getElementById("list");
    var filters = document.getElementById("filters");
    var wanted = (new URLSearchParams(location.search).get("tag") || "").toLowerCase();

    getItems("content/blog.txt").then(function (items) {
      var tags = [], seen = {};
      items.forEach(function (it) {
        splitTags(it.tags).forEach(function (t) {
          if (!seen[t.toLowerCase()]) { seen[t.toLowerCase()] = 1; tags.push(t); }
        });
      });
      function chip(label, href, active) {
        return '<li><a href="' + href + '"' + (active ? ' aria-current="true"' : "") + ">" + esc(label) + "</a></li>";
      }
      if (tags.length) {
        filters.innerHTML = chip("All", "blog.html", !wanted) + tags.map(function (t) {
          return chip(t, "blog.html?tag=" + encodeURIComponent(t), t.toLowerCase() === wanted);
        }).join("");
      }
      var shown = wanted ? items.filter(function (it) {
        return splitTags(it.tags).some(function (t) { return t.toLowerCase() === wanted; });
      }) : items;
      out.innerHTML = shown.length ? yearGroups(shown, postEntry) : '<p class="notice">No posts yet.</p>';
    }).catch(function () { out.innerHTML = failure("content/blog.txt"); });
  }

  function splitFrontMatter(md) {
    md = md.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    var fm = {}, m = /^---\n([\s\S]*?)\n---\n?/.exec(md);
    if (m) {
      m[1].split("\n").forEach(function (l) {
        var i = l.indexOf(":");
        if (i > 0) fm[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      });
      md = md.slice(m[0].length);
    }
    return { fm: fm, body: md.replace(/\{%-?\s*(end)?raw\s*-?%\}/g, "") };
  }

  function pagePost() {
    var article = document.getElementById("article");
    var slug = (new URLSearchParams(location.search).get("p") || "").trim();

    function notFound() {
      document.title = "Post not found | Joanna Wiaterek";
      article.innerHTML = "<h1>This post could not be found</h1>" +
        '<p>Try the <a href="blog.html">list of all posts</a>.</p>';
    }

    if (!/^[a-z0-9][a-z0-9_-]*$/i.test(slug) || !window.marked) { notFound(); return; }

    Promise.all([
      getItems("content/blog.txt").catch(function () { return []; }),
      load("content/posts/" + slug + ".md")
    ]).then(function (res) {
      var meta = res[0].filter(function (it) { return it.slug === slug; })[0] || { _d: parseDate("") };
      var parts = splitFrontMatter(res[1]);
      var title = meta.title || parts.fm.title || slug;
      var minutes = meta.minutes || Math.max(1, Math.round(parts.body.split(/\s+/).length / 220));
      var html = window.marked.parse(parts.body).replace(/(src)="\/(?!\/)/g, '$1="');
      var date = fmtDate(meta._d.y ? meta._d : parseDate(parts.fm.date ? parts.fm.date.slice(0, 10) : ""));

      document.title = title + " | Joanna Wiaterek";
      article.innerHTML = "<h1>" + esc(title) + "</h1>" +
        '<p class="meta">' + esc([date, minutes + " min read"].filter(Boolean).join(", ")) +
        tagLinks(splitTags(meta.tags)) + "</p>" +
        '<div class="prose">' + html + "</div>";
    }).catch(notFound);
  }

  function footer() {
    var el = document.getElementById("foot");
    if (!el) return;
    var year = new Date().getFullYear();
    load("content/site.txt").then(function (text) {
      var s = parseBlocks(text)[0] || {};
      var links = [];
      if (s.linkedin) links.push(["LinkedIn", s.linkedin]);
      if (s.x) links.push(["X", s.x]);
      if (s.substack) links.push(["CASA Substack", s.substack]);
      if (s.email) links.push(["Email", "mailto:" + s.email]);
      el.innerHTML = '<div class="wrap"><p>\u00a9 ' + year + " " + esc(s.name || "Joanna Wiaterek") + "</p>" +
        (links.length ? "<ul>" + links.map(function (l) {
          return '<li><a href="' + esc(l[1]) + '">' + esc(l[0]) + "</a></li>";
        }).join("") + "</ul>" : "") + "</div>";
    }).catch(function () {
      el.innerHTML = '<div class="wrap"><p>\u00a9 ' + year + " Joanna Wiaterek</p></div>";
    });
  }

  /* ---------- start ---------- */

  function start() {
    var page = document.body.getAttribute("data-page");
    if (page === "home") pageHome();
    else if (page === "news") pageNews();
    else if (page === "blog") pageBlog();
    else if (page === "publications") pagePublications();
    else if (page === "post") pagePost();
    footer();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
