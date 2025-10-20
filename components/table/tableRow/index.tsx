import React, {ReactNode} from 'react';
import {formatPriceKZT} from "@/utils/formatPriceKZT";

interface Props {
    data: any[];
    key: string | number;
}

const TableRow = (props: Props) => {
    const {data, key} = props;

    return (
        <tr key={key}>
            {
                data.map((item, index) => <td>{item !== null && item !== undefined && item !== '' ? item : '-'}</td>)
            }
        </tr>
    );
};

export default TableRow;