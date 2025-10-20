import React, {ReactNode} from 'react';
import {formatPriceKZT} from "@/utils/formatPriceKZT";

interface Props {
    rowsNames: string[];
    children?: React.ReactNode;
    tableId: string
}

function Table(props: Props) {
    const {children, rowsNames, tableId} = props;

    return (
        <table className="table" id={tableId}>
            <thead>
            <tr>
                {rowsNames.map((name, index) => (
                    <th scope="col" key={index}>{name}</th>
                ))}
            </tr>
            </thead>
            <tbody className="table-group-divider">
            {children}
            {/*{rowsData.map(item => (*/}
            {/*    <tr key={item._id}>*/}
            {/*        <td>{item?.colors && item?.colors.length > 0 ? item?.colors?.join(", ") : '-'}</td>*/}
            {/*        <td>{item.name}</td>*/}
            {/*        <td>{item?.fabrics && item?.fabrics.length > 0 ? item?.fabrics?.join(", ") : '-'}</td>*/}
            {/*        <td>{item.upholstery}</td>*/}
            {/*        <td>{item.sizeCm ? `${item.sizeCm} см` : '-'}</td>*/}
            {/*        <td>{item.article}</td>*/}
            {/*        <td>{formatPriceKZT(item.kaspiPrice)}</td>*/}
            {/*        <td><a href={item.kaspiLink} target="_blank">Каспи</a></td>*/}
            {/*    </tr>*/}
            {/*))}*/}
            </tbody>
        </table>
    );
}

export default Table;