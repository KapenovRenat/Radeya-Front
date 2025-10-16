import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import {AppDispatch, RootState} from '@/store';
import {fetchMe} from "@/store/reducers/auth";
import {useDispatch} from "react-redux";
import { useRouter } from 'next/router';

function Dashboard(props: any) {
    const user = useSelector((state: RootState) => state.auth.user);
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

    return (
        <div className="container">
            <div className="dashboard">
                <h1>Dashboard</h1>
                {user ? <p>Привет, {user.login}!</p> : <p>Пожалуйста, войдите в систему.</p>}
                {user && user.role === 'admin' ? <button type="button" className="btn btn-success">Создать Таблицу</button> : null}

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
            </div>
        </div>
    );
}

export default Dashboard;