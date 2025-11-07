import React from 'react';

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

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value)
    }

    function openOptions() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="custom-select" style={{height: `${heightPx}px`}}>
            <div className="custom-select_label" onClick={openOptions}>
                <p>{label}</p>
            </div>

            {
                isOpen ? <div className="custom-select_options" style={{height:`${heightPxOptions}px`, bottom: `-${heightPxOptions + 20}px`}}>
                    <div className="custom-select_options-head">
                        <input type="text" onChange={onChange} value={search} placeholder={'Поиск...'}/>
                    </div>

                    <div className="custom-select_options-items">
                        {options.map((option, index) => (
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