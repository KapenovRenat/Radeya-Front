import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, {useState} from 'react';
import SendIcon from '@mui/icons-material/Send';
import apiAxis from "@/utils/axios";

interface Props {

}

function RandomazeBlock(props: Props) {
    const [name, setName] = useState('');
    const [count, setCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string[]>([]);

    async function random() {
        setIsLoading(true);
        try {
            const res = await apiAxis.post("/randomaze-article", { name, count });
            const {data} = res.data;

            console.log('Randomaze article', data);
            setResult(data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }

    }

    return (
        <div className="randomaze-block">
            <h4>Рандомайзер Артикулов</h4>

            <div className="randomaze-block__input">
                <TextField
                    required
                    id="name"
                    label="Название Товара"
                    defaultValue="Название Товара"
                    value={name} onChange={(event) => setName(event.target.value)}
                />

                <TextField
                    type={"number"}
                    required
                    id="number"
                    label="Кол-во Артикулов"
                    defaultValue="Кол-во Артикулов"
                    value={count} onChange={(event) => setCount(event.target.value)}
                />

                <Button onClick={random} variant="contained" endIcon={<SendIcon />} disabled={isLoading && !!name && !!count}>
                    Рандом
                </Button>
            </div>

            {result.length > 0 ? <div className="randomaze-block__result">
                <h6>Артикулы: {result.length}</h6>
                <div className="randomaze-block__result_info">
                    {result.join(' ')}
                </div>
            </div> : null}
        </div>
    );
}

export default RandomazeBlock;