import type { NextPage } from 'next';
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import apiAxis from "@/utils/axios";
import {User} from "@/types/auth";
import {fetchMe, loginUser} from "@/store/reducers/auth";
import {AppDispatch} from "@/store";

interface CatalogProps {
    user?: { name: string };
}

const Auth: NextPage<CatalogProps> = ({ user }) => {
    const [swapAuth, setSwapAuth] = useState<boolean>(false);
    const status = 'loading';
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchMe())
            .unwrap()
            .then((user) => {
                console.log("✅ Авторизован:", user);
                router.push("/dashboard"); // переход, если авторизован
            })
            .catch(() => {
                console.log("❌ Не авторизован");
                // например router.push("/login");
            });
    }, [dispatch, router]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {

            if (swapAuth) {
                const payload: User = {
                    login,
                    password,
                    role: 'manager'
                }

                const { data } = await apiAxis.post("/auth/register", payload);

                return data.user;
            }

            const resultAction = await dispatch(loginUser({login, password}));

            // можно обработать результат (успех/ошибка)
            if (loginUser.fulfilled.match(resultAction)) {
                router.push("/dashboard");
                console.log("✅ Успешный вход:", resultAction.payload);
            } else {
                console.error("❌ Ошибка входа:", resultAction.payload);
            }
            // return data.user;
        } catch (e: any) {
            console.log(e)
        }
    }

    return (
        <div className="container">
            <div className="auth-form">
                <h1>Авторизация</h1>

                <div>
                    <button type="button" className="btn btn-primary" onClick={() => setSwapAuth(false)}>Вход</button>
                    <button type="button" className="btn btn-danger" onClick={() => setSwapAuth(true)}>Регистрация</button>
                </div>

                <div className="auth-form_login">
                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">Login</label>
                        <input type="text" className="form-control" id="login" placeholder="Login" value={login} onChange={e=>setLogin(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)}/>
                    </div>

                    <button type="button" className="btn btn-primary" onClick={(e) => onSubmit(e)}>{swapAuth ? 'Регистрация' : 'Войти'}</button>
                </div>

            </div>
        </div>
    )
}

export default Auth;