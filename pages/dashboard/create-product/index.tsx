import React, {useEffect, useState} from 'react';
import apiAxis from "@/utils/axios";
import {User} from "@/types/auth";
import DashboardProducts from "@/layout/dashboard-products";
import {parseLine} from "@/utils/parseNameProduct";
import {formatPriceKZT} from "@/utils/formatPriceKZT";
import TableRowComponent from "@/components/table/tableRow";
import { Button, TextField } from '@mui/material';
import CreateForm from "@/layout/create-page/create-form";

interface Category {
    code: string;
    title: string;
}

interface Categories {
    page: number;
    limit: number;
    total: number;
    pages: number;
    items: Category[],
}

interface Props {

}

function CreateProductPage(props: Props) {
    const [isLoadCategory, setLoadCategory] = useState<boolean>(false);
    const [searchCategory, setSearchCategory] = useState<string>('');
    const [selectCategory, setSelectCategory] = useState<Category | null>();

    const [categories, setCategories] = useState<Categories>({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
        items: [],
    });

    useEffect(() => {
        getCategories(1);
    }, []);

    async function submitSearchCategory() {

        await getCategories(1);
    }

    async function searchCategoryHandle(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchCategory(e.target.value);
    }

    async function getCategories(page: number) {
        setLoadCategory(true);
        try {

            const res = await apiAxis.post("/products/get-category-kaspi-product", {
                page,
                limit: 10,
                search: searchCategory
            });
            setCategories(res.data);
            setLoadCategory(false);
        } catch (err: any) {
            setLoadCategory(false);
            return console.log(err.response?.data?.message || "Ошибка!");
        }
    }

    function selectClickCategory(data: string[]) {
        if (!selectCategory) setSelectCategory({
            code: data[0],
            title: data[1],
        });

    }

    const rowsNamesCategory = [
        'Code',
        'Название'
    ];

    const columnsCategory = categories.items.length <= 0 ? [] : categories.items.map((item: any) => {
        return {
            _id: item._id,
            code: item.code,
            title: item.title,
        }
    });

    const categoryKaspiTable = {
        columns: columnsCategory.map((item: any) => {
            const rowItem = [
                item.code ? item.code : '-',
                item.title ? item.title : '',
            ]

            return (
                <TableRowComponent key={item._id} data={rowItem} cursorActive={true} onClick={selectClickCategory}/>
            )
        }),
        ...categories
    }

    const handleChangePaginationKaspi = async (event: React.ChangeEvent<unknown>, value: number) => {
        if (!isLoadCategory && categories.page !== value) await getCategories(value);
    };

    return (
        <div className="container">
            <div className="create-product-page">
                Добавить Товар В Каспи

                {selectCategory ? <div className="category-select">
                    <p>Выбрана Категория: <b>{selectCategory.title}</b></p>
                    <Button
                        onClick={() => {
                            setSelectCategory(null);
                        }}
                        variant="contained"
                        disabled={isLoadCategory}>
                        Удалить
                    </Button>
                </div> : null}

                {!selectCategory ? <DashboardProducts
                    title={'Выбор Категории'}
                    type={'kaspi-category-table'}
                    columnsNames={rowsNamesCategory}
                    dataTable={categoryKaspiTable}
                    loading={isLoadCategory}
                    handleChangePagination={handleChangePaginationKaspi}
                    heightTable={210}
                    widthTable={800}
                >
                    <div className="input-group">
                        <TextField
                            className="search-input"
                            required
                            id="outlined-required"
                            label="Название Категории"
                            defaultValue="Название Категории"
                            value={searchCategory} onChange={searchCategoryHandle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchCategory.length !== 0 && !isLoadCategory) {
                                    e.preventDefault(); // чтобы форма не перезагружалась
                                    // submitSearchCategory(categories.page);
                                    getCategories(categories.page);
                                }
                            }}
                        />

                        <Button onClick={submitSearchCategory} variant="contained" disabled={isLoadCategory}>
                            Поиск
                        </Button>
                    </div>


                </DashboardProducts> : null}

                {selectCategory ? <CreateForm selectedCategory={selectCategory}/> : null}
            </div>
        </div>
    );
}

export default CreateProductPage;