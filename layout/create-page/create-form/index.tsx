import React, {useEffect, useRef, useState} from 'react';
import apiAxis from "@/utils/axios";

interface Props {
    selectedCategory: { code: string, title: string };
}

function CreateForm(props: Props) {
    const [loadFields, setLoadFields] = useState<boolean>(true);
    const { selectedCategory } = props;
    const calledRef = useRef(false);

    useEffect(() => {
        if (!selectedCategory) return;
        if (calledRef.current) return;
        calledRef.current = true;

        getFields();
    }, [selectedCategory]);

    async function getFields() {
        try {
            if (selectedCategory) {
                const res = await apiAxis.post("/products/get-fields-kaspi-product", {
                    categoryCode: selectedCategory.code,
                });

                console.log(res.data)
                setLoadFields(false);
            }
        } catch (err: any) {

            return console.log(err.response?.data?.message || "Ошибка!");
        }
    }

    return (
        <div className="create-product-page__form">
            форма
        </div>
    );
}

export default CreateForm;