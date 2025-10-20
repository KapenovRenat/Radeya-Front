import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "@/store/reducers/products/products";
import {AppDispatch, RootState} from "@/store";
import {formatPriceKZT} from "@/utils/formatPriceKZT";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {parseLine} from "@/utils/parseNameProduct";
import Table from "@/components/table";
import TableRow from "@/components/table/tableRow";
import CircleColor from "@/components/cicleColor";


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
        dispatch(getProducts({page: page ? page : product.page ?? 1, limit: 20, search}))
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
            <div className="input-group input-group-lg">
                <span className="input-group-text" id="product-search">Поиск</span>
                <input type="text" className="form-control" aria-label="Sizing example input"
                       aria-describedby="inputGroup-sizing-lg" value={search} onChange={searchProduct}/>
                <button type="button" className="btn btn-primary" onClick={searchSubmit}>Поиск</button>
            </div>

            {
                product.items.length <= 0 && loading ? <div>Wait</div> :
                    <>
                        <Table tableId="products" rowsNames={rowsNames} >
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
                                    <TableRow key={item._id} data={rowItem}/>
                                )
                            })}
                        </Table>
                        {/*<table className="table">*/}
                        {/*    <thead>*/}
                        {/*    <tr>*/}
                        {/*        <th scope="col">Цвет</th>*/}
                        {/*        <th scope="col">Название</th>*/}
                        {/*        <th scope="col">Название ткань</th>*/}
                        {/*        <th scope="col">Тип ткани</th>*/}
                        {/*        <th scope="col">Размер</th>*/}
                        {/*        <th scope="col">Артикул</th>*/}
                        {/*        <th scope="col">Цена Каспи</th>*/}
                        {/*        <th scope="col">Ссылка Каспи</th>*/}
                        {/*    </tr>*/}
                        {/*    </thead>*/}
                        {/*    <tbody className="table-group-divider">*/}
                        {/*    {columns.map(item => (*/}
                        {/*        <tr key={item._id}>*/}
                        {/*            <td>{item?.colors && item?.colors.length > 0 ? item?.colors?.join(", ") : '-'}</td>*/}
                        {/*            <td>{item.name}</td>*/}
                        {/*            <td>{item?.fabrics && item?.fabrics.length > 0 ? item?.fabrics?.join(", ") : '-'}</td>*/}
                        {/*            <td>{item.upholstery}</td>*/}
                        {/*            <td>{item.sizeCm ? `${item.sizeCm} см` : '-'}</td>*/}
                        {/*            <td>{item.article}</td>*/}
                        {/*            <td>{formatPriceKZT(item.kaspiPrice)}</td>*/}
                        {/*            <td><a href={item.kaspiLink} target="_blank">Каспи</a></td>*/}
                        {/*        </tr>*/}
                        {/*    ))}*/}
                        {/*    </tbody>*/}
                        {/*</table>*/}
                </>
            }

            {
                product.items.length <= 0 && loading ? <></> : <div>
                    <Stack spacing={2}>
                        <Pagination count={product.total && product.limit ? Math.round(product.total / product.limit) : 1} defaultPage={product.page ?? undefined} color="primary" onChange={handleChangePagination}/>
                    </Stack>
                </div>
            }

        </div>
    );
}

export default DashboardProducts;