(function () {
  const el = document.currentScript;
  if (el && el.dataset) {
    window.apiToken = el.dataset.apiToken || "";
    window.predefinedQuestions = el.dataset.predefinedQs
      ? JSON.parse(el.dataset.predefinedQs)
      : [];
    window.welcomeMessage = el.dataset.welcome || "Witaj! Jak mogę Ci pomóc?";
    window.chatbotName = el.dataset.botName || "AI";
  }
  /* ───── KONFIG ────────────────────────────────────────────────────────── */
  const TTL_MS = 60 * 60 * 1_000; // 1h
  const MAX_MSGS = 100; // MAX MESS in HISTORY
  const ENDPOINT = "https://talkly.chat/api/chatbot/get-answer";
  const CSS =
    "https://cdn.jsdelivr.net/gh/TalklyChat/Embeds@main/talkly_v0.0.5/style.css";

  /* ───── POMOCNICZE ────────────────────────────────────────────────────── */
  const uuid = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  const now = () => Date.now();
  const hms = () =>
    new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());

  function sanitize(html) {
    const ALLOW = ["A", "STRONG", "BR"];
    const SAFE_SCHEME = /^(https?:)?\/\//i;

    const decodeHtml = (input) => {
      const txt = document.createElement("textarea");
      txt.innerHTML = input;
      return txt.value;
    };

    const tmpl = document.createElement("template");
    tmpl.innerHTML = html;

    tmpl.content.querySelectorAll("*").forEach((el) => {
      const tag = el.nodeName;

      if (!ALLOW.includes(tag)) {
        el.replaceWith(...el.childNodes);
        return;
      }

      [...el.attributes].forEach((attr) => {
        const attrName = attr.name.toLowerCase();

        if (attrName.startsWith("on")) {
          el.removeAttribute(attr.name);
          return;
        }

        if (tag === "A" && attrName === "href") {
          const rawHref = el.getAttribute("href") ?? "";
          const decodedHref = decodeHtml(rawHref.trim());

          if (!SAFE_SCHEME.test(decodedHref)) {
            el.replaceWith(document.createTextNode(el.textContent));
            return;
          }

          el.setAttribute("href", decodedHref);
          return;
        }

        el.removeAttribute(attr.name);
      });

      if (tag === "A") {
        el.setAttribute("rel", "noopener noreferrer");
        el.setAttribute("target", "_blank");
      }
    });

    return tmpl.innerHTML;
  }

  /* --- MARKDOWN --------------------------------------------------------- */
  function markdown(txt) {
    const withLinks = txt.replace(/(https?:\/\/[^\s]+)/g, (u) => {
      const clean = u.replace(/[.,;:!?)\]\}]+$/, ""); //  ← dodane ) ] }
      return `<a href="${clean}">${clean}</a>` + u.slice(clean.length);
    });

    const formatted = withLinks
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    // Filtr XSS
    return sanitize(formatted);
  }

  /* ───── STORAGE ───────────────────────────────────────────────────────── */
  class Storage {
    KEY = "chat_hist_v2";
    CID = "chat_cid_v2";

    #clean(arr = this.#load()) {
      return arr.filter((o) => now() - o.ts < TTL_MS);
    }

    #load() {
      return JSON.parse(localStorage.getItem(this.KEY) || "[]");
    }
    #save(arr) {
      localStorage.setItem(this.KEY, JSON.stringify(arr));
    }

    add(sender, msg, time) {
      const data = this.#clean().slice(-MAX_MSGS + 1);
      data.push({ s: sender, m: msg, ts: now(), t: time });
      this.#save(data);
    }

    list() {
      return this.#clean();
    }

    clear() {
      localStorage.removeItem(this.KEY);
    }

    cid() {
      let id = localStorage.getItem(this.CID);
      if (!id) {
        id = uuid();
        localStorage.setItem(this.CID, id);
      }
      return id;
    }

    reset() {
      this.clear();
      localStorage.setItem(this.CID, uuid());
    }
  }

  /* ───── SERVICE (fetch + streaming) ───────────────────────────────────── */
  class Service {
    constructor(endpoint, store) {
      this.endpoint = endpoint;
      this.store = store;
      this.ctrl = null;
    }
    async ask(question, apiKey, company, onChunk) {
      this.ctrl?.abort();
      this.ctrl = new AbortController();

      const res = await fetch(this.endpoint, {
        method: "POST",
        signal: this.ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey || "",
          "X-Conversation-ID": this.store.cid(),
        },
        body: JSON.stringify({ question, company }),
      });

      if (!res.ok) throw new Error(`Błąd ${res.status}`);

      const rdr = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await rdr.read();
        if (done) break;
        onChunk(dec.decode(value));
      }
    }
  }

  /* ───── UI ────────────────────────────────────────────────────────────── */
  class UI {
    constructor(shadow, store, service, bot) {
      this.$ = shadow;
      this.store = store;
      this.service = service;
      this.bot = bot;
    }

    init() {
      this.render();
      this.cache();
      this.bind();
      this.restore();
      if (!this.msgs.children.length) this.welcome();
    }

    /* ---------- markup + placeholder na CSS ---------- */
    render() {
      const questions = window.predefinedQuestions?.slice(0, 2) || [];
      const predefinedHTML = questions
        .map(
          (q) => `
              <button class="block text-left border border-black/30 bg-gray-100 text-gray-700 text-sm rounded-xl py-2 px-3 hover:bg-gray-200 duration-300 focus:outline-none mb-2">
                ${q}
              </button>`
        )
        .join("");

      /* CSS ------------------------------------------------ */
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS;
      shadow.append(link);

      /* HTML */
      this.$.innerHTML += `
<button id="chat-toggle-button"
class="fixed border border-white/70 bottom-10 right-4 bg-black text-white rounded-full p-2 shadow-lg hover:scale-105 transition-transform duration-300">
<img class="w-12 p-2" src="http://localhost:8000/img/icons/chat_ico_default.svg" alt="ico" />
</button>

<div id="mainChatContainer"
class="hidden transition-all duration-500 ease-in-out transform translate-x-[120%] flex flex-col w-full md:w-[440px] 3xl:w-[600px] h-[89vh] xl:h-[73vh] 3xl:h-[64vh] fixed bottom-4 right-0 md:right-4 border rounded-md rounded-t-3xl bg-white">

<!-- Header -->
<div class="bg-black rounded-t-3xl py-4 px-6 relative">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <div>
        <h2 class="font-bold text-white text-lg">${this.bot}</h2>
        <p class="text-white/60 text-xs tracking-wide">powered by talkly.chat</p>
      </div>
    </div>
    <div class="flex items-center space-x-1">
      <button class="clearChatStorage p-2 hover:bg-white/5 rounded-full transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
      <button class="closeChat p-2 hover:bg-white/5 rounded-full transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Messages -->
<div id="messagesContainer" class="messages-container"></div>

<!-- Predefined + input -->
<div class="mt-auto">
  <div id="predefined-questions" class="px-4 py-2 bg-white">
    ${predefinedHTML}
  </div>

  <div class="px-4 py-2 bg-white border-t rounded-b-lg">
    <form id="chatForm" class="flex items-center justify-center w-full space-x-2">
          <textarea
               rows="1"
                class="flex w-full rounded-md border border-white bg-transparent
                       px-3 py-2 text-base md:text-sm placeholder-[#6b7280] text-[#030712]
                       focus:ring-0 focus:outline-none focus:border-white
                       resize-none overflow-hidden disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Wiadomość..."
                minlength="3"
                maxlength="300"></textarea>
      <button type="submit" class="w-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
          class="size-6 text-black">
          <path
            d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </button>
    </form>
  </div>
</div>
</div>`;
    }

    /* ---------- Selectors ---------- */
    cache() {
      this.toggle = this.$.getElementById("chat-toggle-button");
      this.panel = this.$.getElementById("mainChatContainer");
      this.msgs = this.$.getElementById("messagesContainer");
      this.form = this.$.getElementById("chatForm");
      this.input = this.form?.querySelector("textarea");
      this.clear = this.$.querySelector(".clearChatStorage");
      this.close = this.$.querySelector(".closeChat");
      this.predef = this.$.getElementById("predefined-questions");
    }

    /* ---------- Event ---------- */
    bind() {
      this.toggle?.addEventListener("click", () => this.open());
      this.close?.addEventListener("click", (e) => this.open(e));
      this.clear?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.store.reset();
        this.msgs.innerHTML = "";
        this.predef.style.display = "block";
        this.welcome();
      });

      if (this.input) {
        const autoGrow = () => {
          this.input.style.height = "auto";
          this.input.style.height = this.input.scrollHeight + "px";
        };
        autoGrow();
        this.input.addEventListener("input", autoGrow);
        this.autoGrow = autoGrow;
      }

      this.form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = this.input.value.trim();
        if (q.length < 3) return;
        const time = hms();
        this.input.value = "";
        this.autoGrow();
        this.append("user", markdown(q), time);
        this.store.add("Ty", q, time);
        this.predef.style.display = "none";
        this.ask(q);
      });

      this.input?.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.form.dispatchEvent(new Event("submit"));
        }
      });

      this.predef?.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => {
          this.input.value = b.textContent.trim();
          this.predef.style.display = "none";
          this.form.dispatchEvent(new Event("submit"));
        })
      );
    }

    /* ---------- helpers UI ---------- */
    open(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.panel.classList.toggle("hidden");
      this.panel.classList.toggle("translate-x-[120%]");
      setTimeout(() => this.down(true), 10);
      this.input.focus();
    }
    down(force) {
      this.msgs.scrollTo({
        top: this.msgs.scrollHeight,
        behavior: force ? "auto" : "smooth",
      });
    }

    /**
     * @param {"ai"|"user"} type
     * @param {string} rawHtml
     * @param {string} time
     * @param {boolean} [withBorder=true]
     * @returns {HTMLParagraphElement}
     */
    append(type, rawHtml, time, withBorder = true) {
      const isAI = type === "ai";

      const bubbleClsAI = withBorder
        ? "bg-white border border-gray-200 space-y-3 p-3"
        : "bg-white p-3";

      const div = document.createElement("div");
      div.className = isAI
        ? "w-11/12 mx-auto flex gap-x-2 mt-4 chat-message"
        : "flex w-11/12 mx-auto gap-x-2 me-4 mt-4 chat-message";

      const html = isAI
        ? `<img class="inline-block w-10 h-10 rounded-full"
           src="https://cdn.jsdelivr.net/gh/TalklyChat/Embeds@main/avatar.webp" alt="Avatar">
     <div>
       <div class="${bubbleClsAI} rounded-2xl">
         <p class="leading-relaxed text-sm text-gray-800">${rawHtml}</p>
       </div>
       <span class="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500">
          <svg class="shrink-0 w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 7 17l-5-5"></path>
                          <path d="m22 10-7.5 7.5L13 16"></path>
                      </svg>
         <span style="font-size:10px" class="mt-1">${time}</span>
       </span>
     </div>`
        : `<div class="grow text-end space-y-3">
       <div class="inline-flex flex-col justify-end">
         <div class="inline-block bg-black rounded-2xl p-3 shadow-sm">
           <p class="text-sm text-white text-left">${rawHtml}</p>
         </div>
         <span class="mt-1.5 ms-auto flex items-center gap-x-1 text-xs text-gray-500">
             <svg class="shrink-0 w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 7 17l-5-5"></path>
                          <path d="m22 10-7.5 7.5L13 16"></path>
                      </svg>
           <span style="font-size:10px" class="mt-1">${time}</span>
         </span>
       </div>
     </div>
     <span class="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600">
       <span class="text-sm font-medium text-white leading-none">Ty</span>
     </span>`;

      div.innerHTML = html;
      this.msgs.append(div);
      this.down();
      return div.querySelector("p");
    }

    restore() {
      const hist = this.store.list();
      for (const o of hist) {
        this.append(o.s === "AI" ? "ai" : "user", markdown(o.m), o.t);
      }
      if (hist.length) this.predef.style.display = "none";
    }
    welcome() {
      this.append("ai", markdown(window.welcomeMessage), hms());
    }

    async ask(question) {
      const time = hms();

      const p = this.append(
        "ai",
        `<div class="typing-indicator"><span></span><span></span><span></span></div>`,
        time,
        false
      );
      const bubbleBox = p.parentElement;
      let borderAdded = false;
      let text = "";

      try {
        /* 2. Stream response ----------------------------------- */
        await this.service.ask(
          question,
          window.apiToken,
          window.chatbotName || "AI",
          (chunk) => {
            text += chunk;
            p.innerHTML = markdown(text);

            if (!borderAdded) {
              bubbleBox.classList.add("border", "border-gray-200", "space-y-3");
              const loader = bubbleBox.querySelector(".typing-indicator");
              if (loader) loader.remove();
              borderAdded = true;
            }
            this.down();
          }
        );

        /* 3. Save history ------------------------------------------ */
        this.store.add("AI", text, time);
      } catch (e) {
        console.error(e);
        p.innerHTML = "❌ Błąd serwera, spróbuj ponownie.";
      }
    }
  }

  /* ───── START ─────────────────────────────────────────────────────────── */
  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "closed" });
  document.body.append(host);

  const store = new Storage();
  const svc = new Service(ENDPOINT, store);
  new UI(shadow, store, svc, window.chatbotName || "AI").init();
})();
