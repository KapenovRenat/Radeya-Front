import React, {useEffect, useState} from 'react';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TableComponent from "@/components/table";

import CircularProgress from '@mui/material/CircularProgress';


interface Props {
    children?: React.ReactNode;
    type: string;
    dataTable: any;
    columnsNames: any[];
    title: string;
    loading?: boolean;
    handleChangePagination?: (event: React.ChangeEvent<unknown>, value: number) => void;
    heightTable?: number;
    widthTable?: number | null;
}

function DashboardProducts(props: Props) {
    const { dataTable, columnsNames, title, loading, children, handleChangePagination, type, heightTable = 700, widthTable } = props;

    return (
        <div className="dashboard_products" id={type}>
            <h2>{title}</h2>

            {children}

            {
                (dataTable.items.length <= 0 && loading) || dataTable.total === 0 ? <div style={{marginTop: '20px'}}><CircularProgress /></div> :
                    <>
                        <TableComponent tableId="products" rowsNames={columnsNames} heightTable={heightTable} widthTable={widthTable}>
                            {dataTable.columns}
                        </TableComponent>
                </>
            }

            {
                (dataTable.items.length <= 0 && loading) || dataTable.total === 0 ? <></> : <div className="dashboard_products__pagination">
                    <Stack spacing={2}>
                        <Pagination count={dataTable.total && dataTable.limit ? Math.round(dataTable.total /  dataTable.limit) : 1} defaultPage={dataTable.page ?? undefined} color="primary" onChange={handleChangePagination}/>
                    </Stack>
                </div>
            }

        </div>
    );
}

export default DashboardProducts;