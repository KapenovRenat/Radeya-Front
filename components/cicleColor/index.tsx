import React from 'react';
import Tooltip from '@mui/material/Tooltip';

interface Props {
    width?: number;
    height?: number;
    title?: string;
}

export const colors = {
    "графит": "#252525",
    "серый": "#8f8f8f",
    "желтый": "#fff900",
    "голубой": "#0087ff",
}

export function findColorInText(text: string): string | null {
    if (!text) return null;

    const lower = text.toLowerCase().replace(/ё/g, "е");

    for (const [name, hex] of Object.entries(colors)) {
        if (lower.includes(name)) {
            return hex; // возвращаем hex первого совпавшего цвета
        }
    }

    return `#0087ff`; // если ни один не найден
}

function CircleColor(props: Props) {
    const { width = 25, height = 25, title = 'hello' } = props;
    const colorHex = findColorInText(title);

    return (
        <Tooltip title={title} placement="top-end" arrow>
            <div className="circle-color" style={{width, height, backgroundColor: colorHex ?? undefined}} />
        </Tooltip>

    );
}

export default CircleColor;