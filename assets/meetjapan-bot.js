(function () {
  const articlePrefix = window.location.pathname.includes("/articles/") ? "./" : "./articles/";
  const knowledge = [
    {
      id: "suica",
      title: "Mobile Suica",
      href: articlePrefix + "mobile-suica.html",
      keywords: ["suica", "mobile suica", "ic card", "train card", "iphone", "apple wallet", "transport"],
      answer:
        "Mobile Suica helps when you want to tap through train gates with your phone instead of buying tickets every time. It is useful, but not mandatory. If your phone setup feels stressful before the trip, keep things simpler first."
    },
    {
      id: "atm",
      title: "ATM guide",
      href: articlePrefix + "atm-guide.html",
      keywords: ["atm", "cash", "foreign card", "withdraw", "money", "seven bank", "card not working"],
      answer:
        "If your foreign card does not work where you expected, the best first move is usually a convenience-store ATM. The goal is to recover quickly, not waste energy trying random payment points."
    },
    {
      id: "taxfree",
      title: "Tax-free shopping",
      href: articlePrefix + "tax-free-shopping.html",
      keywords: ["tax free", "tax-free", "shopping", "duty free", "checkout", "passport"],
      answer:
        "Tax-free shopping in Japan is easier when you know what to bring and choose stores that make the process clear. The main mistake is leaving all the questions until checkout."
    },
    {
      id: "luggage",
      title: "Luggage forwarding",
      href: articlePrefix + "luggage-forwarding.html",
      keywords: ["luggage", "suitcase", "bag", "forwarding", "airport", "hotel", "delivery"],
      answer:
        "Luggage forwarding is worth considering if you do not want to drag a large suitcase through stations, stairs, and transfers. It is especially helpful on arrival days and hotel-change days."
    },
    {
      id: "onsen",
      title: "Tattoo-friendly onsen",
      href: articlePrefix + "tattoo-onsen.html",
      keywords: ["onsen", "tattoo", "spa", "ryokan", "bath", "hot spring"],
      answer:
        "Some onsen are tattoo-friendly and some are not. The safest approach is to check each location in advance and treat policy differences as normal, not personal."
    },
    {
      id: "train",
      title: "Train mistakes",
      href: articlePrefix + "express-train.html",
      keywords: ["express", "local", "rapid", "train", "wrong train", "station", "shibuya"],
      answer:
        "If you are unsure whether a train will stop at your station, choose the train that stops more often. Saving a few minutes is rarely worth the stress of overshooting your destination."
    },
    {
      id: "donki",
      title: "Don Quijote guide",
      href: articlePrefix + "donki-guide.html",
      keywords: ["donki", "don quijote", "shopping", "souvenirs", "donkiho-te", "drugstore"],
      answer:
        "Don Quijote gets much easier once you decide your shopping mission before you walk in. Pick one or two categories first so the store feels useful instead of overwhelming."
    }
  ];

  function renderBot() {
    const launcher = document.createElement("button");
    launcher.className = "mj-bot-launcher";
    launcher.type = "button";
    launcher.textContent = "Ask MeetJapan";

    const panel = document.createElement("section");
    panel.className = "mj-bot-panel";
    panel.setAttribute("aria-label", "MeetJapan help bot");
    panel.innerHTML = `
      <div class="mj-bot-head">
        <button class="mj-bot-close" id="mj-bot-close" type="button" aria-label="Close bot">×</button>
        <strong>Ask MeetJapan</strong>
        <span>Ask about Suica, ATMs, tax-free shopping, luggage, onsen, trains, or Donki.</span>
      </div>
      <div class="mj-bot-log" id="mj-bot-log"></div>
      <form class="mj-bot-form" id="mj-bot-form">
        <input class="mj-bot-input" id="mj-bot-input" type="text" placeholder="Example: Which ATM should I try first?" />
        <button class="mj-bot-submit" type="submit">Ask</button>
      </form>
    `;

    document.body.appendChild(panel);
    document.body.appendChild(launcher);

    const log = panel.querySelector("#mj-bot-log");
    const form = panel.querySelector("#mj-bot-form");
    const input = panel.querySelector("#mj-bot-input");
    const closeButton = panel.querySelector("#mj-bot-close");

    function addMessage(type, content, options = {}) {
      const el = document.createElement("div");
      el.className = `mj-bot-msg ${type}`;
      if (options.trustedHtml) {
        el.innerHTML = content;
      } else {
        el.textContent = content;
      }
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }

    function renderWelcome() {
      addMessage(
        "bot",
        `
          Ask a short question and I will point you to the best MeetJapan answer.
          <div class="mj-bot-quick">
            <button class="mj-bot-chip" data-question="How do I use Mobile Suica?">Mobile Suica</button>
            <button class="mj-bot-chip" data-question="Which ATM should I try first?">ATM</button>
            <button class="mj-bot-chip" data-question="Can I go to onsen with tattoos?">Onsen</button>
            <button class="mj-bot-chip" data-question="What does express train mean?">Train</button>
          </div>
        `,
        { trustedHtml: true }
      );
    }

    function findBestMatch(text) {
      const lower = text.toLowerCase();
      let best = null;
      let bestScore = 0;
      for (const item of knowledge) {
        const score = item.keywords.reduce((sum, keyword) => sum + (lower.includes(keyword) ? 1 : 0), 0);
        if (score > bestScore) {
          best = item;
          bestScore = score;
        }
      }
      return bestScore > 0 ? best : null;
    }

    function answerQuestion(text) {
      const match = findBestMatch(text);
      if (!match) {
        addMessage(
          "bot",
          `I am still an MVP, so I answer best on seven topics for now: Mobile Suica, ATMs, tax-free shopping, luggage forwarding, onsen, train mistakes, and Donki. Try one of those topics next.`
        );
        return;
      }
      addMessage(
        "bot",
        `${match.answer}<br><br><a href="${match.href}">Open the ${match.title} article</a>`,
        { trustedHtml: true }
      );
    }

    launcher.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      if (panel.classList.contains("is-open")) {
        input.focus();
      }
    });

    closeButton.addEventListener("click", function () {
      panel.classList.remove("is-open");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      addMessage("user", value);
      input.value = "";
      answerQuestion(value);
    });

    log.addEventListener("click", function (event) {
      const button = event.target.closest(".mj-bot-chip");
      if (!button) return;
      const question = button.getAttribute("data-question") || "";
      addMessage("user", question);
      answerQuestion(question);
    });

    renderWelcome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBot);
  } else {
    renderBot();
  }
})();
