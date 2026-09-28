(() => {
  const root = document.createElement("div");
  root.id = "centralAI";
  root.innerHTML = `
    <button class="centralai-launcher" id="centralAILauncher" aria-label="Abrir CentralAI">
      <span class="centralai-spark">✦</span><span>CentralAI</span>
    </button>
    <section class="centralai-panel" id="centralAIPanel" aria-label="CentralAI" aria-hidden="true">
      <header class="centralai-head">
        <div><strong>CentralAI</strong><small>Assistente do CentralMarket</small></div>
        <button id="centralAIClose" aria-label="Fechar">×</button>
      </header>
      <div class="centralai-messages" id="centralAIMessages"></div>
      <div class="centralai-suggestions" id="centralAISuggestions">
        <button>Qual celular você recomenda?</button>
        <button>Quais produtos estão em oferta?</button>
        <button>Compare os produtos de áudio</button>
      </div>
      <form class="centralai-form" id="centralAIForm">
        <input id="centralAIInput" autocomplete="off" maxlength="500" placeholder="Pergunte sobre os produtos..." aria-label="Pergunte à CentralAI">
        <button type="submit" aria-label="Enviar">➤</button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const launcher = document.getElementById("centralAILauncher");
  const panel = document.getElementById("centralAIPanel");
  const close = document.getElementById("centralAIClose");
  const messages = document.getElementById("centralAIMessages");
  const form = document.getElementById("centralAIForm");
  const input = document.getElementById("centralAIInput");
  const suggestions = document.getElementById("centralAISuggestions");
  const history = [];

  function addMessage(text, role) {
    const el = document.createElement("div");
    el.className = `centralai-message ${role}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function open() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    launcher.classList.add("hidden");
    input.focus();
    if (!messages.children.length) addMessage("Olá! Sou a CentralAI. Posso ajudar você a encontrar produtos, comparar especificações e tirar dúvidas sobre o CentralMarket.", "assistant");
  }
  function hide() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    launcher.classList.remove("hidden");
  }

  async function ask(question) {
    addMessage(question, "user");
    history.push({ role: "user", content: question });
    suggestions.style.display = "none";
    input.value = "";
    input.disabled = true;
    const loading = addMessage("Pensando...", "assistant loading");
    try {
      const catalog = Array.isArray(window.CENTRALMARKET_CATALOG) ? window.CENTRALMARKET_CATALOG : [];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: history.slice(-8), catalog })
      });
      const data = await response.json();
      loading.remove();
      if (!response.ok || !data.answer) throw new Error(data.error || "Falha na CentralAI");
      addMessage(data.answer, "assistant");
      history.push({ role: "assistant", content: data.answer });
    } catch (error) {
      loading.remove();
      addMessage("Não consegui responder agora. Verifique se a CentralAI foi configurada no Cloudflare e tente novamente.", "assistant error");
    } finally {
      input.disabled = false;
      input.focus();
    }
  }

  launcher.addEventListener("click", open);
  close.addEventListener("click", hide);
  form.addEventListener("submit", e => {
    e.preventDefault();
    const question = input.value.trim();
    if (question) ask(question);
  });
  suggestions.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => ask(btn.textContent)));
})();
