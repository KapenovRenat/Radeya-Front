import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import {AppDispatch, RootState} from '@/store';
import {fetchMe} from "@/store/reducers/auth";
import {useDispatch} from "react-redux";
import { useRouter } from 'next/router';
import DashboardProducts from "@/layout/dashboard-products";
import RandomazeBlock from "@/layout/randomaze-block";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ModalBox from "@/components/modal-box";
import ModalAccounting from "@/components/modal-box/accounting";
import DashboardAccounting from "@/layout/dashboard-accounting";

function Dashboard(props: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [openModal, setOpenModal] = React.useState(false);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

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
                {user && user.role === 'admin' ? <Button onClick={handleOpen} variant="contained">
                    Создать таблицу учета
                </Button> : null}

                <Modal
                    open={openModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ModalBox>
                        <ModalAccounting closeModal={handleClose}/>
                    </ModalBox>
                </Modal>

                <DashboardAccounting/>


                <RandomazeBlock />

                <DashboardProducts/>

            </div>
        </div>
    );
}

export default Dashboard;