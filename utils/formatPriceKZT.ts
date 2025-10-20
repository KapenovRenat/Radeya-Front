export function formatPriceKZT(value: number | string): string {
    if (value == null) return "—";

    const num = Number(value);

    if (isNaN(num)) return String(value);

    return `${num.toLocaleString("ru-RU")} ₸`;
}