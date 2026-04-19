export function useImageUrl(key?: string | null): string | undefined {
    if (!key) return undefined
    if (/^https?:\/\//i.test(key)) return key
    const { apiUrl } = useRuntimeConfig().public
    const base = String(apiUrl).replace(/\/+$/, '')
    return `${base}/images/${key}`
}
