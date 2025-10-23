import React, {useEffect, useState} from 'react';
import {AppDispatch, RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {getAccounting} from "@/store/reducers/accounting/accounting";

interface Props {

}

function DashboardAccounting(props: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const {loading} = useSelector((state: RootState) => state.accounting);

    const [search, setSearch] = useState<string>('');


    useEffect(() => {
        getList();
    }, []);


    function getList(page?: number) {
        dispatch(getAccounting({page: 1, limit: 10}))
            .unwrap()
            .then((data) => {
                console.log("✅ Data:", data);
            })
            .catch(() => {
                console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }

    return (
        <div className="dashboard__accounting">
            <h2>Учет заказов</h2>

            <div className="dashboard__accounting__columns">
                <div className="dashboard__accounting__columns_col">
                    <div className="dashboard__accounting__columns_col-content">
                        <div className="accounting-card">
                            <div className="accounting-card-body">
                                <h5 className="accounting-card-title">Октябрь 2025 (Kaspi)</h5>
                                <div className="accounting-car-body_details">
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
    );
}

export default DashboardAccounting;