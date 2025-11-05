import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "@/store/reducers/products/products";
import {AppDispatch, RootState} from "@/store";
import {formatPriceKZT} from "@/utils/formatPriceKZT";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {parseLine} from "@/utils/parseNameProduct";
import TableComponent from "@/components/table";
import TableRowComponent from "@/components/table/tableRow";
import CircleColor from "@/components/cicleColor";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';


interface Props {
    children?: React.ReactNode;
    type: 'main' | 'my-sklad';
    rows: any;
    columsNames: any[];
    title: string
}

function DashboardProducts(props: Props) {
    const { rows, columsNames, title } = props;
    const {loading} = useSelector((state: RootState) => state.products);
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = useState<string>('');


    // useEffect(() => {
    //     getListProduct();
    // }, []);

    function searchProduct(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function getListProduct(page?: number) {
        dispatch(getProducts({page: page ? page : rows.page ?? 1, limit: 10, search}))
            .unwrap()
            .then((data) => {
                console.log("✅ Data:", data);
            })
            .catch(() => {
                console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }

    function searchSubmit() {
        getListProduct(1);
    }

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        if (!loading && rows.page !== value) getListProduct(value);
    };

    const columns = rows.items.length <= 0 ? [] : rows.items.map((item: any) => {
        const {
            name,
            upholstery,
            sizeCm,
            colors,
            fabrics,
        } = parseLine(item.name);

        return {
            id: item._id,
            name,
            upholstery,
            sizeCm,
            colors,
            fabrics,
            article: item.article,
            kaspiPrice: formatPriceKZT(item.kaspiPrice),
            kaspiLink: item.kaspiLink
        }
    });

    return (
        <div className="dashboard_products">
            <h2>{title}</h2>

            {
                (rows.items.length <= 0 && loading) || rows.total === 0 ? <></> : <div className="input-group">
                    <TextField
                        className="search-input"
                        required
                        id="outlined-required"
                        label="Название или артикул"
                        defaultValue="Название или артикул"
                        value={search} onChange={searchProduct}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && search.length !== 0 && !loading) {
                                e.preventDefault(); // чтобы форма не перезагружалась
                                searchSubmit();
                            }
                        }}
                    />

                    <Button onClick={searchSubmit} variant="contained" endIcon={<SendIcon />} disabled={loading}>
                        Поиск
                    </Button>
                </div>
            }

            {
                (rows.items.length <= 0 && loading) || rows.total === 0 ? <div style={{marginTop: '20px'}}><CircularProgress /></div> :
                    <>
                        <TableComponent tableId="products" rowsNames={columsNames} >
                            {columns.map((item: any) => {
                                const rowItem = [
                                    <CircleColor title={item?.colors && item?.colors.length > 0 ? item?.colors?.join(", ") : 'Неизвестно'}/>,
                                    item.name,
                                    item?.fabrics && item?.fabrics.length > 0 ? item?.fabrics?.join(", ") : '',
                                    item.upholstery ? item.upholstery : '',
                                    item.sizeCm ? `${item.sizeCm} см` : '',
                                    item.article ? item.article : '',
                                    item.kaspiPrice ? formatPriceKZT(item.kaspiPrice) : '',
                                    item.kaspiLink ? <a href={item.kaspiLink} target="_blank">Каспи</a> : ''
                                ]

                                return (
                                    <TableRowComponent key={item.id} data={rowItem}/>
                                )
                            })}
                        </TableComponent>
                </>
            }

            {
                (rows.items.length <= 0 && loading) || rows.total === 0 ? <></> : <div className="dashboard_products__pagination">
                    <Stack spacing={2}>
                        <Pagination count={rows.total && rows.limit ? Math.round(rows.total /  rows.limit) : 1} defaultPage={rows.page ?? undefined} color="primary" onChange={handleChangePagination}/>
                    </Stack>
                </div>
            }

        </div>
    );
}

export default DashboardProducts;