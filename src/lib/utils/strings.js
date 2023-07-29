export function capitalizeEachWord(s) {
    return s
        .split(" ")
        .map((s) => (s ? `${s[0].toUpperCase()}${s.slice(1)}` : ""))
        .join(" ")
        .trim()
}
