import type { NextPage, GetServerSideProps } from 'next';
import axios from '../utils/axios';

interface HomeProps {
    user?: { name: string };
}

const Home: NextPage<HomeProps> = ({ user }) => (
    <div className="container">
        <h1>Добро пожаловать в мебельный магазин</h1>
        {user ? <p>Привет, {user.name}!</p> : <p>Пожалуйста, войдите в систему.</p>}
    </div>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        redirect: {
            destination: '/catalog',
            permanent: false,
        },
    };
    // try {
    //     const res = await axios.get('/auth/validate', { headers: { cookie: ctx.req.headers.cookie || '' } });
    //     return { props: { user: res.data } };
    // } catch {
    //     return { props: {} };
    // }
};

export default Home;