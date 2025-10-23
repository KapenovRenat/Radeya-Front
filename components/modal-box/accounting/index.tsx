import React from 'react';
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import apiAxis from "@/utils/axios";
import {Product} from "@/types/products/products";

interface Props {
    closeModal: any;
}

const types = ['kaspi', 'ncity'];

function ModalAccounting(props: Props) {
    const {closeModal} = props;
    const newDate = new Date();
    const [isLoading, setIsLoading] = React.useState(false);
    const [date, setDate] = React.useState<Date | null>(newDate);
    const [type, setType] = React.useState<'kaspi' | 'ncity'>('kaspi');

    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value as 'kaspi' | 'ncity');
    };

    async function submit() {
        setIsLoading(true);

        if (!date) return; // защита от null

        try {
            const res = await apiAxis.post("/create-accounting", { date, type });
            setIsLoading(false);
            console.log(res);
            closeModal();
            return res;
        } catch (err: any) {
            return setIsLoading(false);
        }
    }

    return (
        <div className="modal-accounting">
            <h2>Окно создание таблицы учета</h2>

            <div className="modal-accounting__form">
                <div className="accounting__form_input">
                    <p>Дата Учета</p>
                    <input type="date" value={date ? date.toISOString().split("T")[0] : ""}
                           onChange={(e) =>
                               setDate(e.target.value ? new Date(e.target.value) : null)
                           } />
                </div>

                <div className="accounting__form_input">
                    <Select
                        labelId="demo-simple-select-label"
                        id="type-accounting"
                        value={type}
                        label="Type"
                        onChange={handleChange}
                    >
                        {types.map((item, index) => <MenuItem value={item} key={index}>{item.toUpperCase()}</MenuItem>)}
                    </Select>
                </div>

                <div className="accounting__form_input">
                    <Button variant="contained" onClick={submit} disabled={isLoading && date == null}>
                        Создать
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ModalAccounting;