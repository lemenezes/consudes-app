// Mapeia os códigos de idioma do app para os códigos aceitos pela MyMemory API
const LANG_TARGET: Record<string, string> = {
  es: 'es-ES',
  pt: 'pt-BR',
  en: 'en-US',
};

async function callMyMemory(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  if (from === to) return text;
  const source = LANG_TARGET[from] ?? from;
  const target = LANG_TARGET[to] ?? to;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`,
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

/** Traduz uma string de texto simples de from -> to */
export async function translatePlain(
  text: string,
  from: string,
  to: string,
): Promise<string> {
  if (!text.trim() || from === to) return text;
  return callMyMemory(text, from, to);
}

/**
 * Traduz conteúdo HTML de from -> to.
 * Preserva toda a estrutura de tags; apenas os nós de texto são modificados.
 */
export async function translateHTML(
  html: string,
  from: string,
  to: string,
): Promise<string> {
  if (!html || from === to) return html;

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
      node.textContent = await callMyMemory(original, from, to);
    }
  }

  return root.innerHTML;
}
