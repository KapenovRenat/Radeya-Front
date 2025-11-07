import React, {ReactNode} from 'react';
import {formatPriceKZT} from "@/utils/formatPriceKZT";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface Props {
    data: any[];
    key: string | number;
    cursorActive?: boolean;
    onClick?: (value: any) => void;
}

const TableRowComponent = (props: Props) => {
    const {data, key, cursorActive = false, onClick} = props;

    return (
        <>
            <TableRow
                key={key}
                sx={{'&:last-child td, &:last-child th': { border: 0 }, 'cursor': cursorActive ? 'pointer' : 'not-allowed' }}
                onClick={(e) => onClick ? onClick(data) : null}
            >
                {data.map((item, index) => <TableCell component="th" scope="row" >{item !== null && item !== undefined && item !== '' ? item : '-'}</TableCell>)}
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