// Mapeia os códigos de idioma do app para os códigos aceitos pela MyMemory API
const LANG_TARGET: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
};

async function callMyMemory(text: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  const target = LANG_TARGET[to] ?? to;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${target}`,
    );
    if (!res.ok) return text;
    const json = (await res.json()) as {
      responseData?: { translatedText?: string };
      responseStatus?: number;
    };
    if (json.responseStatus !== 200) return text;
    return json.responseData?.translatedText ?? text;
  } catch {
    return text;
  }
}

/** Traduz uma string de texto simples de es → to */
export async function translatePlain(text: string, to: string): Promise<string> {
  if (to === 'es' || !text.trim()) return text;
  return callMyMemory(text, to);
}

/**
 * Traduz conteúdo HTML de es → to.
 * Preserva toda a estrutura de tags; apenas os nós de texto são modificados.
 */
export async function translateHTML(html: string, to: string): Promise<string> {
  if (!html || to === 'es') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
  const root = doc.body;

  // Coleta todos os nós de texto não-vazios
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null = walker.nextNode();
  while (n) {
    const t = n as Text;
    if (t.textContent?.trim()) nodes.push(t);
    n = walker.nextNode();
  }

  // Traduz cada nó sequencialmente (preserva estrutura HTML ao modificar só o texto)
  for (const node of nodes) {
    const original = node.textContent ?? '';
    if (original.trim()) {
      node.textContent = await callMyMemory(original, to);
    }
  }

  return root.innerHTML;
}
