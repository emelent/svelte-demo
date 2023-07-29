export function capitalizeEachWord(s: string): string {
    return s
        .split(" ")
        .map((s) => (s ? `${s[0].toUpperCase()}${s.slice(1)}` : ""))
        .join(" ")
        .trim()
}
