import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "@/store/reducers/products/products";
import {AppDispatch, RootState} from "@/store";

interface Props {
    children?: React.ReactNode;
}

function DashboardProducts(props: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const product = useSelector((state: RootState) => state.products.product);

    const [search, setSearch] = useState<string>('');

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

    function searchProduct(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    return (
        <div className="dashboard_products">
            <div className="input-group input-group-lg">
                <span className="input-group-text" id="product-search">Поиск</span>
                <input type="text" className="form-control" aria-label="Sizing example input"
                       aria-describedby="inputGroup-sizing-lg" value={search} onChange={searchProduct}/>
            </div>

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
                        <tr key={item._id}>
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