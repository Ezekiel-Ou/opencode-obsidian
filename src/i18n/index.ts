import en from "./locale/en";
import zhCN from "./locale/zh-cn";

type Locale = typeof en;

const locales: Record<string, Locale> = {
  en,
  "zh-cn": zhCN,
  "zh-CN": zhCN,
  zh: zhCN,
};

let currentLocale: string = "zh-cn"; // 默认使用中文

/**
 * 设置当前语言
 */
export function setLocale(locale: string): void {
  if (locales[locale]) {
    currentLocale = locale;
  } else {
    // 尝试匹配语言前缀（例如 "zh-TW" -> "zh"）
    const langPrefix = locale.split("-")[0];
    if (locales[langPrefix]) {
      currentLocale = langPrefix;
    }
  }
}

/**
 * 获取当前语言
 */
export function getLocale(): string {
  return currentLocale;
}

/**
 * 翻译函数
 */
export function t(key: keyof Locale): string {
  const locale = locales[currentLocale] || locales.en;
  return locale[key] || key;
}

/**
 * 初始化 i18n，从 Obsidian 获取语言设置
 */
export function initI18n(obsidianLocale?: string): void {
  // 默认使用中文，除非 Obsidian 明确设置了其他语言
  if (obsidianLocale && locales[obsidianLocale]) {
    setLocale(obsidianLocale);
  } else if (obsidianLocale) {
    // 尝试匹配语言前缀
    const langPrefix = obsidianLocale.split("-")[0];
    if (locales[langPrefix]) {
      setLocale(langPrefix);
    }
  }
  // 否则保持默认的中文
}

export type { Locale };
