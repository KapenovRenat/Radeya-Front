type ParsedItem = {
    name: string;
    upholstery?: string | null;
    sizeCm?: number | null;                  // одиночный размер, если был "235см"
    dimensionsCm?: { l: number; w: number; h: number } | null; // если был "234x113x90"
    colors?: string[];
    fabrics?: string[];
    raw?: string;
    fallback?: boolean;
};

const escapeRx = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// разделители размеров: латинская x, кириллическая х, знак ×, а также *
const DIM_SEP = "[xх×*]";
// 234x113x90 (возможны пробелы и суффикс "см")
const dimRx = new RegExp(
    `^(\\d{2,4})\\s*${DIM_SEP}\\s*(\\d{2,4})\\s*${DIM_SEP}\\s*(\\d{2,4})(?:\\s*см)?$`,
    "i"
);
// одиночный размер "235см"
const sizeRx = /^(\d{2,4})\s*см$/i;

export function parseLine(input: string): ParsedItem {
    let line = input.trim();

    // 1) Сначала забираем ткани в [кв. скобках]
    const fabrics: string[] = [];
    line = line
        .replace(/\[([^\]]+)\]/g, (_, inner: string) => {
            inner
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
                .forEach(s => fabrics.push(s));
            return "";
        })
        .replace(/\s{2,}/g, " ")
        .trim();

    // 2) Разбиваем по запятым
    const parts = line.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) {
        return { name: input, raw: input, fallback: true };
    }

    // 3) Имя — до первой запятой
    const name = parts[0];

    // 4) Обивка
    let upholstery: string | null = null;
    const upIdx = parts.findIndex(p => /^обивка\s+/i.test(p));
    if (upIdx >= 0) upholstery = parts[upIdx].replace(/^обивка\s+/i, "").trim() || null;

    // 5) Размеры
    let sizeCm: number | null = null;
    let dimensions: { l: number; w: number; h: number } | null = null;

    // Сначала ищем тройные размеры вида 234x113x90
    let dimIdx = parts.findIndex(p => dimRx.test(p));
    if (dimIdx >= 0) {
        const m = parts[dimIdx].match(dimRx)!;
        dimensions = { l: Number(m[1]), w: Number(m[2]), h: Number(m[3]) };
    }

    // Если тройных нет — пробуем одиночный "235см"
    let szIdx = -1;
    if (!dimensions) {
        szIdx = parts.findIndex(p => sizeRx.test(p));
        if (szIdx >= 0) {
            const m = parts[szIdx].match(sizeRx)!;
            sizeCm = Number(m[1]);
        }
    }

    // 6) Цвета — всё, что идёт после последнего из upIdx/dimIdx/szIdx
    let startColorsFrom = 1;
    if (upIdx >= 0) startColorsFrom = Math.max(startColorsFrom, upIdx + 1);
    if (dimIdx >= 0) startColorsFrom = Math.max(startColorsFrom, dimIdx + 1);
    if (szIdx  >= 0) startColorsFrom = Math.max(startColorsFrom, szIdx  + 1);

    const colors: string[] = parts
        .slice(startColorsFrom)
        .filter(p => p.length > 0 && !/^обивка\s+/i.test(p));

    const nothingParsed =
        !upholstery && !sizeCm && !dimensions && colors.length === 0 && fabrics.length === 0;

    if (nothingParsed && parts.length === 1) {
        return { name, raw: input, fallback: true };
    }

    return {
        name,
        upholstery: upholstery ?? null,
        sizeCm: sizeCm ?? null,
        dimensionsCm: dimensions ?? null,
        colors,
        fabrics,
    };
}

export function formatParsed(p: ParsedItem): string {
    if (p.fallback) return p.raw ?? p.name;

    const chunks: string[] = [p.name];
    if (p.upholstery) chunks.push(`обивка: ${p.upholstery}`);
    if (p.dimensionsCm) chunks.push(`${p.dimensionsCm.l}×${p.dimensionsCm.w}×${p.dimensionsCm.h}см`);
    else if (p.sizeCm) chunks.push(`${p.sizeCm}см`);
    if (p.colors?.length) chunks.push(`цвет: ${p.colors.join(", ")}`);
    if (p.fabrics?.length) chunks.push(`[${p.fabrics.join(", ")}]`);
    return chunks.join(", ");
}
