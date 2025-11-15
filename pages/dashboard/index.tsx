import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import {AppDispatch, RootState} from '@/store';
import {fetchMe} from "@/store/reducers/auth";
import {useDispatch} from "react-redux";
import { useRouter } from 'next/router';
import DashboardProducts from "@/layout/dashboard-products";
import RandomazeBlock from "@/layout/randomaze-block";
import Link from "next/link";
import { Button } from "@mui/material";
import {getProducts, syncKaspiProduct, getKaspiProduct} from "@/store/reducers/products/products";
import {parseLine} from "@/utils/parseNameProduct";
import {formatPriceKZT} from "@/utils/formatPriceKZT";
import CircleColor from "@/components/cicleColor";
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import TableRowComponent from 'components/table/tableRow';
import { usePathname } from 'next/navigation';

function Dashboard(props: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const productsSklad = useSelector((state: RootState) => state.products.product);
    const productsKaspi = useSelector((state: RootState) => state.products.productKM);
    const {loadingProductKaspi, msgProductKaspi, loading, loadingProductKaspiData} = useSelector((state: RootState) => state.products);
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();


    function searchProduct(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function getListProduct(page?: number) {
        dispatch(getProducts({page: page ? page : productsSklad.page ?? 1, limit: 10, search}))
            .unwrap()
            .then((data) => {
                // console.log("✅ Data:", data);
            })
            .catch(() => {
                // console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }

    function getListKaspiProduct(page?: number) {
        dispatch(getKaspiProduct({page: page ? page : productsKaspi.page ?? 1, limit: 10, search}))
            .unwrap()
            .then((data) => {
                console.log("✅ Data Kaspi:", data);
            })
            .catch(() => {
                console.log("❌ Данные не полученны!");
                // например router.push("/login");
            });
    }

    function searchSubmit() {
        getListProduct(1);
    }

    // залогинен ли
    useEffect(() => {
        dispatch(fetchMe())
            .unwrap()
            .then((user) => {
                // console.log("✅ Авторизован:", user);
            })
            .catch(() => {
                // console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }, [dispatch, router]);

    // Получает продукты моего склада
    useEffect(() => {
        dispatch(getProducts({page: 1, limit: 10}))
            .unwrap()
            .then((data) => {
                // console.log("✅ Data:", data);
            })
            .catch(() => {
                // console.log("❌ Не авторизован");
                // например router.push("/login");
            });

        getListKaspiProduct(1)
    }, []);


    function submitUpdateKaspiProducts() {
        dispatch(syncKaspiProduct({}))
            .unwrap()
            .then((data) => {
                // console.log("✅ Data:", data);
            })
            .catch(() => {
                // console.log("❌ Не вышло");
                // например router.push("/login");
            });
    }

    const handleChangePaginationSklad = (event: React.ChangeEvent<unknown>, value: number) => {
        if (!loading && productsSklad.page !== value) getListProduct(value);
    };

    const handleChangePaginationKaspi = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(value);
        if (!loadingProductKaspi && productsKaspi.page !== value) getListKaspiProduct(value);
    };

    const rowsNamesSklad = [
        'Цвет',
        'Название',
        'Название ткани',
        'Тип ткани',
        'Размер',
        'Артикул',
        'Цена Каспи',
        'Ссылка Каспи',
    ];

    const columnsSklad = productsSklad.items.length <= 0 ? [] : productsSklad.items.map((item: any) => {
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

    const productsSkladTable = {
        columns: columnsSklad.map((item: any) => {
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
        }),
        ...productsSklad
    }

    const rowsNamesKaspi = [
        'Изображение',
        'Артикул',
        'Название',
        'Цена',
        'Склад',
        'Кол-во Дней',
    ];

    const columnsKaspi = productsKaspi.items.length <= 0 ? [] : productsKaspi.items.map((item: any) => {
        const {
            name,
        } = parseLine(item.name);

        return {
            _id: item._id,
            name,
            article: item.article,
            kaspiPrice: formatPriceKZT(item.currentPrice),
            imgUrl: item.previewImgUrl,
            storeId: item.storeId,
            storeOrder: item.storeOrder,
        }
    });

    const productsKaspiTable = {
        columns: columnsKaspi.map((item: any) => {
            const rowItem = [
                item.imgUrl ? <img src={item.imgUrl} alt="kaspi-image" className="table-img"/> : '-',
                item.article ? item.article : '',
                item.name ? item.name : '',
                item.kaspiPrice ? item.kaspiPrice : '',
                item.storeId ? item.storeId : '',
                item.storeOrder ? item.storeOrder : '',
            ]

            return (
                <TableRowComponent key={item._id} data={rowItem} cursorActive={true} onClick={(value) => {
                    const findItem = productsKaspi.items.find((itemNew: any) => itemNew._id === item._id);
                    if (findItem) router.push(`${pathname}/product/${findItem.uniqueCode ? findItem.uniqueCode : findItem._id}`);
                }}/>
            )
        }),
        ...productsKaspi
    }


    return (
        <div className="container">
            <div className="dashboard">
                <h1>Dashboard</h1>
                {user ? <p>Привет, {user.login}!</p> : <p>Пожалуйста, войдите в систему.</p>}
                {user && user.role === 'admin' ? <button type="button" className="btn btn-success">Создать Таблицу</button> : null}

                <Button onClick={()=> router.push('/dashboard/create-product', undefined, { shallow: true })}>Добавить Товар</Button>


                <RandomazeBlock />

                <div style={{margin: '25px 0'}}>
                    <Button onClick={submitUpdateKaspiProducts} variant="contained" disabled={loadingProductKaspi}>
                        Обновить католог с Каспи
                    </Button>
                </div>

                <DashboardProducts
                    title={'Товары Каспи'}
                    type={'kaspi-table'}
                    columnsNames={rowsNamesKaspi}
                    dataTable={productsKaspiTable}
                    loading={loadingProductKaspiData}
                    handleChangePagination={handleChangePaginationKaspi}
                    heightTable={700}
                >
                    {
                        (productsSkladTable.items.length <= 0 && loading) || productsSkladTable.total === 0 ? <></> : <div className="input-group">
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
                </DashboardProducts>

                <DashboardProducts
                    title={'Товары из Мой Склад'}
                    type={'my-sklad'}
                    columnsNames={rowsNamesSklad}
                    dataTable={productsSkladTable}
                    loading={loading}
                    handleChangePagination={handleChangePaginationSklad}
                    heightTable={500}
                >
                    {
                        (productsSkladTable.items.length <= 0 && loading) || productsSkladTable.total === 0 ? <></> : <div className="input-group">
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
                </DashboardProducts>

            </div>
        </div>
    );
}

export default Dashboard;