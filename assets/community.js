(function () {
  const STORAGE_KEY = "meetjapan-community-v1";

  const seedPosts = [
    {
      id: "seed-1",
      type: "question",
      category: "Transport",
      author: "Traveler from Canada",
      title: "How do I know if an express train will skip my station?",
      body: "I can read the platform signs a little, but I still feel nervous about getting on the wrong train in Tokyo.",
      createdAt: "2026-03-13",
      answers: [
        {
          id: "a-1",
          author: "Tokyo local",
          body: "If you are unsure, take the train that stops more often. On your first days, certainty is more valuable than saving a few minutes.",
          curated: true
        }
      ]
    },
    {
      id: "seed-2",
      type: "impression",
      category: "Etiquette",
      author: "Traveler from Germany",
      title: "Japan feels calm, but I was never sure where to throw things away",
      body: "The streets were clean, but I kept carrying trash longer than expected. I wish I had understood the rhythm earlier.",
      createdAt: "2026-03-12",
      answers: [
        {
          id: "a-2",
          author: "Osaka resident",
          body: "That is a very common visitor experience. In Japan, many people carry small waste until they return to a station, convenience store area, or home-like base.",
          curated: true
        }
      ]
    },
    {
      id: "seed-3",
      type: "question",
      category: "Onsen",
      author: "Traveler from Singapore",
      title: "How should I check tattoo rules without making it awkward?",
      body: "I want to be respectful, but I also do not want to show up and create a strange situation at the entrance.",
      createdAt: "2026-03-11",
      answers: [
        {
          id: "a-3",
          author: "Ryokan worker in Japan",
          body: "The easiest way is to check the facility website first and contact them if the page is unclear. Different onsen make different decisions, so it is normal to confirm in advance.",
          curated: true
        }
      ]
    }
  ];

  function loadPosts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPosts));
      return seedPosts.slice();
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPosts));
      return seedPosts.slice();
    }
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function summarize(text, maxLength = 120) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) return normalized;
    return `${normalized.slice(0, maxLength).trimEnd()}...`;
  }

  function buildAnswered(posts) {
    return posts
      .flatMap((post) =>
        (post.answers || [])
          .filter((answer) => answer.curated)
          .map((answer) => ({ post, answer }))
      )
      .slice(0, 8);
  }

  function renderCommunity() {
    const app = document.querySelector("[data-community-app]");
    if (!app) return;

    let posts = loadPosts();
    let activeCategory = "All";
    let searchTerm = "";

    const answeredList = app.querySelector("[data-answered-list]");
    const postList = app.querySelector("[data-post-list]");
    const form = app.querySelector("[data-post-form]");
    const searchInput = app.querySelector("[data-search-input]");
    const filterWrap = app.querySelector("[data-filter-wrap]");

    function filteredPosts() {
      return posts.filter((post) => {
        const categoryMatch = activeCategory === "All" || post.category === activeCategory;
        const haystack = `${post.title} ${post.body} ${(post.answers || []).map((a) => a.body).join(" ")}`.toLowerCase();
        const searchMatch = !searchTerm || haystack.includes(searchTerm);
        return categoryMatch && searchMatch;
      });
    }

    function renderAnswered() {
      const items = buildAnswered(posts);
      if (!items.length) {
        answeredList.innerHTML = `<div class="community-empty">No curated answers yet.</div>`;
        return;
      }
      answeredList.innerHTML = items
        .map(
          ({ post, answer }) => `
            <article class="community-post" data-collapsible-post>
              <div class="community-post-head">
                <div class="community-post-title">
                  <h3>${escapeHtml(post.title)}</h3>
                  <p class="community-post-summary">${escapeHtml(summarize(answer.body, 110))}</p>
                </div>
                <div class="community-meta">
                  <span class="community-badge">MeetJapan Answered</span>
                  <span class="community-badge alt">${escapeHtml(post.category)}</span>
                </div>
                <button class="community-post-toggle" type="button" data-action="toggle-post" aria-expanded="false">Open</button>
              </div>
              <div class="community-post-body" hidden>
                <p>${escapeHtml(answer.body)}</p>
                <div class="community-actions">
                  <a class="button secondary" href="#all-posts">See full thread</a>
                </div>
              </div>
            </article>
          `
        )
        .join("");
    }

    function renderPosts() {
      const list = filteredPosts();
      if (!list.length) {
        postList.innerHTML = `<div class="community-empty">No matching posts yet. Try another keyword or add the first question in this category.</div>`;
        return;
      }
      postList.innerHTML = list
        .map((post) => {
          const answers = (post.answers || [])
            .map(
              (answer) => `
                <div class="community-answer">
                  <div class="community-meta">
                    <span class="community-badge">${answer.curated ? "MeetJapan Answered" : "Reply"}</span>
                    <span class="community-badge alt">${escapeHtml(answer.author)}</span>
                  </div>
                  <p>${escapeHtml(answer.body)}</p>
                </div>
              `
            )
            .join("");

          return `
            <article class="community-post" data-post-id="${post.id}" data-collapsible-post>
              <div class="community-post-head">
                <div class="community-post-title">
                  <h3>${escapeHtml(post.title)}</h3>
                  <p class="community-post-summary">${escapeHtml(summarize(post.body, 120))}</p>
                </div>
                <div class="community-meta">
                  <span class="community-badge alt">${escapeHtml(post.category)}</span>
                  <span class="community-badge">${escapeHtml(post.type)}</span>
                </div>
                <button class="community-post-toggle" type="button" data-action="toggle-post" aria-expanded="false">Open</button>
              </div>
              <div class="community-post-body" hidden>
                <p>${escapeHtml(post.body)}</p>
                <div class="community-meta">
                  <span>${escapeHtml(post.author)}</span>
                  <span>${escapeHtml(post.createdAt)}</span>
                </div>
                ${answers}
                <div class="community-actions">
                  <button class="community-chip" type="button" data-action="reply" data-post-id="${post.id}">Answer this</button>
                </div>
                <form class="community-inline-form" data-reply-form="${post.id}">
                  <input class="community-input" name="author" type="text" placeholder="Your name or role" required>
                  <textarea class="community-textarea" name="body" placeholder="Add a practical answer from a local or resident point of view" required></textarea>
                  <label><input type="checkbox" name="curated"> Mark this as MeetJapan Answered</label>
                  <button class="button primary" type="submit">Post answer</button>
                </form>
              </div>
            </article>
          `;
        })
        .join("");
    }

    function renderFilters() {
      const categories = ["All", "Transport", "Money", "Shopping", "Onsen", "Etiquette"];
      filterWrap.innerHTML = categories
        .map(
          (category) =>
            `<button class="community-chip ${category === activeCategory ? "is-active" : ""}" type="button" data-category="${category}">${category}</button>`
        )
        .join("");
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const post = {
        id: `post-${Date.now()}`,
        type: data.get("type"),
        category: data.get("category"),
        author: data.get("author"),
        title: data.get("title"),
        body: data.get("body"),
        createdAt: new Date().toISOString().slice(0, 10),
        answers: []
      };
      posts = [post, ...posts];
      savePosts(posts);
      form.reset();
      renderPosts();
      renderAnswered();
    });

    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      renderPosts();
    });

    filterWrap.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.getAttribute("data-category") || "All";
      renderFilters();
      renderPosts();
    });

    postList.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-action='toggle-post']");
      if (toggle) {
        const card = toggle.closest("[data-collapsible-post]");
        const body = card?.querySelector(".community-post-body");
        if (!card || !body) return;
        const isExpanded = card.classList.toggle("is-expanded");
        body.hidden = !isExpanded;
        toggle.setAttribute("aria-expanded", String(isExpanded));
        toggle.textContent = isExpanded ? "Close" : "Open";
        return;
      }

      const button = event.target.closest("[data-action='reply']");
      if (!button) return;
      const postId = button.getAttribute("data-post-id");
      const formEl = postList.querySelector(`[data-reply-form="${postId}"]`);
      if (formEl) formEl.classList.toggle("is-open");
    });

    answeredList.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-action='toggle-post']");
      if (!toggle) return;
      const card = toggle.closest("[data-collapsible-post]");
      const body = card?.querySelector(".community-post-body");
      if (!card || !body) return;
      const isExpanded = card.classList.toggle("is-expanded");
      body.hidden = !isExpanded;
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggle.textContent = isExpanded ? "Close" : "Open";
    });

    postList.addEventListener("submit", (event) => {
      const formEl = event.target.closest("[data-reply-form]");
      if (!formEl) return;
      event.preventDefault();
      const postId = formEl.getAttribute("data-reply-form");
      const data = new FormData(formEl);
      posts = posts.map((post) => {
        if (post.id !== postId) return post;
        const answers = post.answers || [];
        answers.unshift({
          id: `answer-${Date.now()}`,
          author: data.get("author"),
          body: data.get("body"),
          curated: data.get("curated") === "on"
        });
        return { ...post, answers };
      });
      savePosts(posts);
      renderPosts();
      renderAnswered();
    });

    renderFilters();
    renderAnswered();
    renderPosts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCommunity);
  } else {
    renderCommunity();
  }
})();
