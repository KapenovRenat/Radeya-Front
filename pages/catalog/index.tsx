import type { NextPage } from 'next';

interface CatalogProps {
    user?: { name: string };
}

const Catalog: NextPage<CatalogProps> = ({ user }) => (
    <div className="container">
        <h1>Catalog</h1>
        {user ? <p>Привет, {user.name}!</p> : <p>Пожалуйста, войдите в систему.</p>}
    </div>
);

export default Catalog;