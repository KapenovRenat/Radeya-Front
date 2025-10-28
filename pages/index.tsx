import type { NextPage, GetServerSideProps } from 'next';
import axios from '../utils/axios';
import Button from "@/components/buttons";
import LocationBlock from "@/layout/location";
import NavBar from "@/layout/nav-bar";

interface HomeProps {
    user?: { name: string };
}

const Home: NextPage<HomeProps> = ({ user }) => (
    <div className="home">
        <LocationBlock />
        <NavBar />
        <div className="home-slider">
            <h2>Здесь будут большие баннеры!</h2>
        </div>
        <div className="container">

        </div>
    </div>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {


    const { query, params } = ctx;

    return {
        props: {
            query: query ?? null,   // сюда попадёт ctx.query
            params: params ?? null,  // сюда попадёт ctx.params
        },
    };
    // return {
    //     redirect: {
    //         destination: '/catalog',
    //         permanent: false,
    //     },
    // };

    // try {
    //     const res = await axios.get('/auth/validate', { headers: { cookie: ctx.req.headers.cookie || '' } });
    //     return { props: { user: res.data } };
    // } catch {
    //     return { props: {} };
    // }
};

export default Home;