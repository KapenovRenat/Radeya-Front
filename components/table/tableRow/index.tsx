import React, {ReactNode} from 'react';
import {formatPriceKZT} from "@/utils/formatPriceKZT";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface Props {
    data: any[];
    key: string | number;
}

const TableRowComponent = (props: Props) => {
    const {data, key} = props;

    return (
        <>
            <TableRow
                key={key}
                sx={{'&:last-child td, &:last-child th': { border: 0 } }}
            >
                {data.map((item, index) => <TableCell component="th" scope="row">{item !== null && item !== undefined && item !== '' ? item : '-'}</TableCell>)}
            </TableRow>

            {/*<tr key={key}>*/}
            {/*    {*/}
            {/*        data.map((item, index) => <td>{item !== null && item !== undefined && item !== '' ? item : '-'}</td>)*/}
            {/*    }*/}
            {/*</tr>*/}
        </>

    );
};

export default TableRowComponent;