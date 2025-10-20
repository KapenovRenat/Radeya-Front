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
}

function DashboardProducts(props: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const product = useSelector((state: RootState) => state.products.product);
    const {loading} = useSelector((state: RootState) => state.products);

    const [search, setSearch] = useState<string>('');


    useEffect(() => {
        getListProduct();
    }, []);

    function searchProduct(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function getListProduct(page?: number) {
        dispatch(getProducts({page: page ? page : product.page ?? 1, limit: 10, search}))
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
        if (!loading && product.page !== value) getListProduct(value);
    };

    const columns = product.items.length <= 0 ? [] : product.items.map((item) => {
        const {
            name,
            upholstery,
            sizeCm,
            colors,
            fabrics,
        } = parseLine(item.name);

        return {
            _id: item._id,
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

    const rowsNames = [
        'Цвет',
        'Название',
        'Название ткани',
        'Тип ткани',
        'Размер',
        'Артикул',
        'Цена Каспи',
        'Ссылка Каспи',
    ];

    return (
        <div className="dashboard_products">
            <h2>Товары из Мой Склад</h2>
            {
                (product.items.length <= 0 && loading) || product.total === 0 ? <></> : <div className="input-group">
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
                (product.items.length <= 0 && loading) || product.total === 0 ? <div style={{marginTop: '20px'}}><CircularProgress /></div> :
                    <>
                        <TableComponent tableId="products" rowsNames={rowsNames} >
                            {columns.map(item => {
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
                                    <TableRowComponent key={item._id} data={rowItem}/>
                                )
                            })}
                        </TableComponent>
                </>
            }

            {
                (product.items.length <= 0 && loading) || product.total === 0 ? <></> : <div className="dashboard_products__pagination">
                    <Stack spacing={2}>
                        <Pagination count={product.total && product.limit ? Math.round(product.total / product.limit) : 1} defaultPage={product.page ?? undefined} color="primary" onChange={handleChangePagination}/>
                    </Stack>
                </div>
            }

        </div>
    );
}

export default DashboardProducts;