import React from 'react';

const categories = ['Матрасы', 'Комоды', 'Диваны', 'Кухни', 'Шкафы', 'Тумбы', 'Столы', 'Кровати', 'Тумбы', 'Обувницы', 'Пуфики', 'Стулья', 'Все категории'];

interface Props {

}

function HomeCategoryCard(props: any) {
    const { key, value } = props;

    return <div className="category-card" key={key}>
        <span>{value}</span>
        <img src="/home-category/sofa.png" alt="sofa"/>
    </div>
}

function HomeCategory(props: Props) {
    return (
        <div className="home-category">
            <div className="home-category__cards">
                {categories.map((item, index) => <HomeCategoryCard key={index} value={item}/>)}
            </div>
        </div>
    );
}

export default HomeCategory;