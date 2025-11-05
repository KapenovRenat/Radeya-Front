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
import {getProducts, syncKaspiProduct} from "@/store/reducers/products/products";

function Dashboard(props: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const productsSklad = useSelector((state: RootState) => state.products.product);
    const {loadingProductKaspi, msgProductKaspi} = useSelector((state: RootState) => state.products);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchMe())
            .unwrap()
            .then((user) => {
                console.log("✅ Авторизован:", user);
            })
            .catch(() => {
                console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }, [dispatch, router]);

    useEffect(() => {
        dispatch(getProducts({page: 1, limit: 10}))
            .unwrap()
            .then((data) => {
                console.log("✅ Data:", data);
            })
            .catch(() => {
                console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }, []);

    function submitUpdateKaspiProducts() {
        dispatch(syncKaspiProduct({}))
            .unwrap()
            .then((data) => {
                console.log("✅ Data:", data);
            })
            .catch(() => {
                console.log("❌ Не вышло");
                // например router.push("/login");
            });
    }

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

    return (
        <div className="container">
            <div className="dashboard">
                <h1>Dashboard</h1>
                {user ? <p>Привет, {user.login}!</p> : <p>Пожалуйста, войдите в систему.</p>}
                {user && user.role === 'admin' ? <button type="button" className="btn btn-success">Создать Таблицу</button> : null}

                <Button onClick={()=> router.push('/dashboard/create-product', undefined, { shallow: true })}>Добавить Товар</Button>

                <div className="dashboard__panel">
                    <h2>Учет заказов</h2>

                    <div className="dashboard__columns">
                        <div className="dashboard__columns_col">
                            <h6>Каспи Магазин</h6>

                            <div className="dashboard__columns_col-content">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Октябрь</h5>
                                        <div className="card-body_details">
                                            <p><b>кол-во заказов:</b> 100</p>
                                            <p><b>кол-во отмен:</b> 10</p>
                                            <p><b>Выручка:</b> 27,050,900 тенге</p>
                                        </div>
                                        <a href="#" className="btn btn-primary">Смотреть</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard__columns_col">
                            <h6>NCity</h6>

                            <div className="dashboard__columns_col-content">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Октябрь</h5>
                                        <div className="card-body_details">
                                            <p><b>кол-во заказов:</b> 100</p>
                                            <p><b>кол-во отмен:</b> 10</p>
                                            <p><b>Выручка:</b> 27,050,900 тенге</p>
                                        </div>
                                        <a href="#" className="btn btn-primary">Смотреть</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard__columns_col">
                            <h6>Артем</h6>

                            <div className="dashboard__columns_col-content">

                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Октябрь</h5>
                                        <div className="card-body_details">
                                            <p><b>кол-во заказов:</b> 100</p>
                                            <p><b>кол-во отмен:</b> 10</p>
                                            <p><b>Выручка:</b> 27,050,900 тенге</p>
                                        </div>
                                        <a href="#" className="btn btn-primary">Смотреть</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <RandomazeBlock />

                <div style={{margin: '25px 0'}}>
                    <Button onClick={submitUpdateKaspiProducts} variant="contained" disabled={loadingProductKaspi}>
                        Обновить католог с Каспи
                    </Button>
                </div>
                {/*<DashboardProducts title={'Товары с Каспи'} type={'my-sklad'} columsNames={rowsNamesSklad} rows={productsSklad}/>*/}

                <DashboardProducts title={'Товары из Мой Склад'} type={'my-sklad'} columsNames={rowsNamesSklad} rows={productsSklad}/>

            </div>
        </div>
    );
}

export default Dashboard;