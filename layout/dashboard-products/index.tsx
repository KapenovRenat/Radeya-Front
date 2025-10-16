import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "@/store/reducers/products/products";
import {AppDispatch, RootState} from "@/store";

interface Props {
    children?: React.ReactNode;
}

function DashboardProducts(props: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const product = useSelector((state: RootState) => state.products.product);

    useEffect(() => {
        dispatch(getProducts({page: 1, limit: 20}))
            .unwrap()
            .then((data) => {
                console.log("✅ Data:", data);
            })
            .catch(() => {
                console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }, []);

    return (
        <div className="dashboard_products">
            {
                product.items.length <= 0 ? <div>Wait</div> : <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Img</th>
                        <th scope="col">Name</th>
                        <th scope="col">Article</th>
                        <th scope="col">Цена Каспи</th>
                        <th scope="col">Ссылка Каспи</th>
                    </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {product.items.map(item => (
                            <tr>
                                <th scope="row">
                                    {item.imageUrl ? <img src={item.imageUrl} alt=""/> : 'not imgae'}
                                </th>
                                <td>{item.name}</td>
                                <td>{item.article}</td>
                                <td>{item.kaspiPrice}</td>
                                <td><a href={item.kaspiLink}>Каспи</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

        </div>
    );
}

export default DashboardProducts;