import React, {useEffect, useRef, useState} from 'react';

interface Props {
    label: string;
    options: {value: any, label: string}[];
    onClick: (option: {value: any, label: string}) => void;
    heightPx?: number;
    heightPxOptions?: number;
}

function CustomSelect(props: Props) {
    const { label, options, onClick, heightPx = 40, heightPxOptions = 200 } = props;
    const [search, setSearch] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [filtered, setFiltered] = useState(options || []);

    // 🔹 ref на корневой div селекта
    const selectRef = useRef<HTMLDivElement>(null);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);

        if (e.target.value.trim() === "") {
            // если поле пустое — вернуть весь список
            setFiltered(options);
        } else {
            // фильтруем по code или name (без учёта регистра)
            const lower = e.target.value.toLowerCase();
            const result = options.filter(
                (item) =>
                    item.value.toLowerCase().includes(lower) ||
                    item.label.toLowerCase().includes(lower)
            );
            setFiltered(result);
        }
    }

    function openOptions() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="custom-select" style={{height: `${heightPx}px`}} ref={selectRef}>
            <div className="custom-select_label" onClick={openOptions}>
                <p>{label}</p>
            </div>

            {
                isOpen ? <div className="custom-select_options" style={{height:`${heightPxOptions}px`, bottom: `-${heightPxOptions + 20}px`}}>
                    <div className="custom-select_options-head">
                        <input type="text" onChange={onChange} value={search} placeholder={'Поиск...'}/>
                    </div>

                    <div className="custom-select_options-items">
                        {filtered.map((option, index) => (
                            <div key={option.value} className="custom-select-item" onClick={() => onClick(option)}>
                                <p>{option.label}</p>
                            </div>
                        ))}
                    </div>
                </div> : null
            }
        </div>
    );
}

export default CustomSelect;