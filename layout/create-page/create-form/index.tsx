import React, {useEffect, useRef, useState} from 'react';
import apiAxis from "@/utils/axios";
import CustomSelect from "@/components/custom-select";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ImageUploader from "@/components/uploadImage/uploadImg";
import PreviewsImages from "@/components/uploadImage/preview-images";
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';

// Маппинг по последней части кода после *
const FIELD_LABELS: Record<string, string> = {
    'title': 'Название товара',
    'Type': 'Тип',
    'Folding design': 'Наличие механизма трансформации',
    'Shape': 'Форма',
    'Transformation mechanism': 'Механизм трансформации',
    'Upholstery': 'Обивка',
    'Features': 'Особенности',
    'Filler': 'Наполнение',
    'Rigidity': 'Жесткость',
    'Width': 'Ширина',
    'Depth': 'Глубина',
    'Height': 'Высота',
    'Sleeping place': 'Спальное место',
    'Length when unfolded': 'Длина в разложенном виде',
    'Armrests': 'Подлокотники',
    'Number of seats': 'Количество мест',
    'Application': 'Назначение',
    'Design': 'Дизайн',
    'Furniture assembly': 'Сборка мебели',
    'Furniture legs': 'Ножки',
    'Decorative pillows': 'Декоративные подушки',
    'linen box': 'Бельевой ящик',
    'Additional': 'Дополнительно',
    'Model': 'Модель',
    'View': 'Вид',
    'Color': 'Цвет',
    'Texture': 'Текстура',
    'Country': 'Страна производства',
    'korobs': 'Кол-во коробок',
};

// Функция, которая принимает code (например "Sofas*Type") и возвращает название
export function getFieldLabel(code: string): string {
    // Берём всё после последней звёздочки
    const key = code.split('*').pop()?.trim() || '';

    // Возвращаем перевод, если есть
    return FIELD_LABELS[key] || key;
}

interface Props {
    selectedCategory: { code: string, title: string };
}

function CreateForm(props: Props) {
    const [loadFields, setLoadFields] = useState<boolean>(true);
    const { selectedCategory } = props;
    const calledRef = useRef(false);
    const [categoryAttr, setCategoryAttr] = useState<any[]>([]);
    const [colorAttr, setColorAttr] = useState<any[]>([]);
    const [colorValues, setColorValues] = useState<any>(null);
    const [isPendingCreate, setIsPendingCreate] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedCategory) return;
        if (calledRef.current) return;
        calledRef.current = true;

        getFields();
    }, [selectedCategory]);

    async function generateDescription() {
        try {

        } catch (e) {}
    }

    async function createProduct() {
        setIsPendingCreate(true);
        try {
            const formData = new FormData();
            formData.append("brand", 'RADEYA');
            formData.append("categoryCode", selectedCategory.code);

            categoryAttr.forEach((attr, attrIndex) => {
                const keyColor = attr.code.split('*').pop()?.trim() || '';

                if (keyColor === 'Color' && Array.isArray(attr.selected)) {
                    // если это цвета — добавляем отдельно файлы
                    const colorsPayload = attr.selected?.map((color: any) => ({
                        code: color.code,
                    }));
                    formData.append('colors', JSON.stringify(colorsPayload));

                    // и отдельно файлы, если есть
                    attr.selected?.forEach((color: any, index: number) => {
                        color.images?.forEach((file: any, fileIndex: number) => {
                            formData.append(`images_${index}`, file);
                        });
                    });
                }
            });

            // categoryAttr тоже нужно отправить (JSON без файлов)
            const cleanedAttrs = categoryAttr.filter((f) => f.selected).map((a) => ({
                ...a,
                selected: Array.isArray(a.selected)
                    ? a.selected.map((sel: any) => ({
                        code: sel.code,
                        name: sel.name,
                    }))
                    : a.selected,
            }));

            formData.append("categoryAttr", JSON.stringify(cleanedAttrs));

            // Отправляем на сервер
            const resForm = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/create-kaspi-product`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(resForm.data)
            setIsPendingCreate(false);
        } catch (e) {
            setIsPendingCreate(false);
            console.log('Ошибка отправки: ', e)
        }
    }

    function getDisabledCreateBtn() {
        const filterMandatory = categoryAttr.filter((x) => x.mandatory);

        const hasEmpty = filterMandatory.some((item) => !item.selected);

        return hasEmpty;
    }

    async function getFields() {
        try {
            if (selectedCategory) {
                // Вернуть
                const res = await apiAxis.post("/products/get-fields-kaspi-product", {
                    categoryCode: selectedCategory.code,
                });


                const fileldsRes = res.data.fields;
                console.log({
                    fileldsRes
                })


                const newField = {
                        "code": "title",
                        "type": "string",
                        "multiValued": false,
                        "mandatory": true,
                        "values": ""
                    }

                const newFieldDesk = {
                    "code": "description",
                    "type": "string",
                    "multiValued": false,
                    "mandatory": true,
                    "values": ""
                }

                const newFieldKorob = {
                    "code": "korobs",
                    "type": "enum",
                    "multiValued": false,
                    "mandatory": false,
                    "values": [
                        {
                            code: 1,
                            name: '1 Коробка'
                        },
                        {
                            code: 2,
                            name: '2 Коробка'
                        },
                        {
                            code: 3,
                            name: '3 Коробка'
                        },
                        {
                            code: 4,
                            name: '4 Коробка'
                        },
                        {
                            code: 5,
                            name: '5 Коробка'
                        }
                    ]
                }

                // const colors = mockFieldSofas.find(item => {
                //     const key = item.code.split('*').pop()?.trim() || '';
                //
                //     if (key === 'Color') return key;
                // });

                const colors = fileldsRes.find((item: any) => {
                    const key = item.code.split('*').pop()?.trim() || '';

                    if (key === 'Color') return key;
                });

                console.log({
                    colors
                })

                if (colors) {
                    setColorAttr([...colors?.values as any]);
                }


                setCategoryAttr([newField, newFieldDesk, ...fileldsRes, newFieldKorob]);
                setLoadFields(false);
            }
        } catch (err: any) {

            return console.log(err.response?.data?.message || "Ошибка!");
        }
    }

    function selectChange(data: any) {
        const {code, multiValued, value, mandatory} = data;

        setCategoryAttr(prev => {
            return prev.map(item => {
                if (item.code === code) {
                    return {
                        ...item,
                        selected: multiValued
                            ? [ ...(item.selected || []), value ]
                            : value,
                    }
                }

                return item;
            })
        });
    }

    function defaultValue(obj: any) {
        if (obj.selected && Array.isArray(obj.selected)) {
            return obj.selected.map((item: any) => item.name).join(', ');
        }

        return obj.selected.name;
    }

    const colorField = categoryAttr.length > 0 ? categoryAttr.find(item => {
        const key = item.code.split('*').pop()?.trim() || '';

        if (key === 'Color') return key;
    }) : null;

    return (
        <>
            {
                loadFields ? <div>Идет Загрузка Полей ... </div> : <div className="create-product-page__form">
                    <h4>Категория: <b>{selectedCategory.title}</b></h4>

                    <div className="page__form-grid">
                        {
                            categoryAttr && categoryAttr.length > 0 ? categoryAttr.filter(item => item.code !== "Furniture*Color" && item.code !== "description").map((item: any, index: number) => {

                                if (item.type === "enum") {
                                    return <div className="create-product-page__form-input" key={item.code}>
                                        <p>{getFieldLabel(item.code)} {item.mandatory ? <b style={{color: 'red'}}>*</b> : null} {item.multiValued ? '+' : ''}</p>
                                        <CustomSelect
                                            options={item.values.map((v: any, index: number) => {
                                                return {
                                                    value: v.code,
                                                    label: v.name
                                                }
                                            })}
                                            label={item.selected ? defaultValue(item) : 'Заполните Поле'}
                                            onClick={(option) => {
                                                selectChange({
                                                    code: item.code,
                                                    value: {
                                                        code: option.value,
                                                        name: option.label
                                                    },
                                                    multiValued: item.multiValued,
                                                    mandatory: item.mandatory
                                                })
                                            }}
                                        />
                                    </div>
                                }

                                if (item.type === "boolean") {
                                    return <div className="create-product-page__form-input" key={item.code}>
                                        <p>{getFieldLabel(item.code)} {item.mandatory ? <b style={{color: 'red'}}>*</b> : null} {item.multiValued ? '+' : ''}</p>
                                        <FormControlLabel control={<Checkbox checked={item.selected === true} onChange={(e) => {
                                            selectChange({
                                                code: item.code,
                                                value: true,
                                                multiValued: item.multiValued,
                                                mandatory: item.mandatory
                                            })
                                        }}/>} label="Да" />
                                        <FormControlLabel control={<Checkbox
                                            checked={item.selected === false}
                                            onChange={(e) => {
                                                selectChange({
                                                    code: item.code,
                                                    value: false,
                                                    multiValued: item.multiValued,
                                                    mandatory: item.mandatory
                                                })
                                            }}
                                        />} label="Нет" />
                                    </div>
                                }

                                if (item.type === "number") {
                                    return <div className="create-product-page__form-input" key={item.code}>
                                        <p>{getFieldLabel(item.code)} {item.mandatory ? <b style={{color: 'red'}}>*</b> : null} {item.multiValued ? '+' : ''}</p>
                                        <TextField
                                            sx={{height: '42px'}}
                                            className="input-cust"
                                            id={item.code}
                                            placeholder={'Заполните поле'}
                                            value={item.selected}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                selectChange({
                                                    code: item.code,
                                                    value: Number(value),
                                                    multiValued: item.multiValued,
                                                    mandatory: item.mandatory
                                                })
                                            }}
                                        />
                                    </div>
                                }

                                if (item.type === "string") {
                                    return <div className="create-product-page__form-input" key={item.code}>
                                        <p>{getFieldLabel(item.code)} {item.mandatory ? <b style={{color: 'red'}}>*</b> : null} {item.multiValued ? '+' : ''}</p>
                                        <TextField
                                            sx={{height: '42px'}}
                                            className="input-cust"
                                            id={item.code}
                                            placeholder={'Заполните поле'}
                                            value={item.selected}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                selectChange({
                                                    code: item.code,
                                                    value: value,
                                                    multiValued: item.multiValued,
                                                    mandatory: item.mandatory
                                                })
                                            }}
                                        />
                                    </div>
                                }

                                return <>

                                </>
                            }) : null
                        }
                    </div>

                    <div className="other-product-create">
                        <div className="create-deskription">
                            <div className="create-product-page__form-input">
                                <p>Описание - (Перед этим Желательно заполнить поля) <b style={{color: 'red'}}>*</b></p>
                                <TextField
                                    id={"product-description"}
                                    multiline
                                    rows={12}
                                    placeholder={'Заполните поле (Перед этим Желательно заполнить поля)'}
                                    value={categoryAttr && categoryAttr.length > 0 ? categoryAttr.find(item => item.code === "description").selected : ''}
                                    onChange={(event) => {
                                        const value = event.target.value
                                        selectChange({
                                            code: 'description',
                                            value: value,
                                            multiValued: false,
                                            mandatory: true
                                        })
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '10px'
                                    }}
                                >
                                    <Button
                                        onClick={() => generateDescription()}
                                        variant="contained"
                                        style={{
                                            marginTop: '10px'
                                        }}
                                        disabled={true}
                                    >
                                        Сгенерировать Описание AI <br/>
                                    </Button>

                                    {isPendingCreate ? <Button
                                        loading
                                        variant="outlined"
                                        loadingPosition="end"
                                        startIcon={<SaveIcon />}
                                    >
                                        Идет загрузка!
                                    </Button> : <Button
                                        onClick={() => createProduct()}
                                        variant="contained"
                                        style={{
                                            marginTop: '10px'
                                        }}
                                        className="btn-submit-create"
                                        disabled={getDisabledCreateBtn()}
                                    >
                                        Создать товар
                                    </Button>}
                                </div>
                            </div>
                        </div>

                        {colorAttr && colorAttr.length > 0 ? <div className="create-colors-product">
                            {
                                colorField.selected && colorField.selected.length > 0 ? <div className="create-colors-product_items">
                                    {
                                        colorField.selected.map((v: any, index: number) => {
                                            return (
                                                <div className="colors-product_items-item">
                                                    <h3>Цвет: <b>{v.name}</b></h3>
                                                    <div className="items-item_buttons">
                                                        <ImageUploader handleSelectImage={(images, previews) => {
                                                            setCategoryAttr((prev) =>
                                                                prev.map((item: any) => {
                                                                    // другие атрибуты не трогаем
                                                                    if (item.code !== colorField.code) {
                                                                        return item;
                                                                    }

                                                                    // если selected нет или он не массив
                                                                    if (!Array.isArray(item.selected)) {
                                                                        return item;
                                                                    }

                                                                    const newSelected = item.selected.map((sel: any) => {
                                                                        // это не тот цвет, который мы сейчас обновляем
                                                                        if (!sel || sel.code !== v.code) {
                                                                            return sel; // ОБЯЗАТЕЛЬНО вернуть sel
                                                                        }

                                                                        return {
                                                                            ...sel,
                                                                            images: [...(sel.images ?? []), ...images],
                                                                            prvImages: [...(sel.prvImages ?? []), ...previews],
                                                                        };
                                                                    });

                                                                    return {
                                                                        ...item,
                                                                        selected: newSelected,
                                                                    };
                                                                })
                                                            );
                                                        }}/>
                                                        <Button
                                                            onClick={() => {
                                                                setCategoryAttr(prev => {
                                                                    return prev.map(item => {
                                                                        if (item.code === colorField.code) {
                                                                            return {
                                                                                ...item,
                                                                                selected: item.selected.filter((y: any) => v.code !== y.code),
                                                                            }
                                                                        }

                                                                        return item;
                                                                    })
                                                                });
                                                            }}
                                                            variant="contained"
                                                        >
                                                            Удалить цвет
                                                        </Button>
                                                    </div>
                                                    <PreviewsImages previews={v.prvImages} removeImage={(i) => {
                                                        setCategoryAttr((prev) =>
                                                            prev.map((item: any) => {
                                                                if (item.code !== colorField.code) return item;
                                                                if (!Array.isArray(item.selected)) return item;

                                                                const newSelected = item.selected.map((sel: any) => {
                                                                    if (!sel || sel.code !== v.code) return sel;

                                                                    return {
                                                                        ...sel,
                                                                        images: sel.images?.filter((_: any, idx: number) => idx !== i) ?? [],
                                                                        prvImages: sel.prvImages?.filter((_: any, idx: number) => idx !== i) ?? [],
                                                                    };
                                                                });

                                                                return { ...item, selected: newSelected };
                                                            })
                                                        );
                                                    }}/>
                                                </div>
                                            )
                                        })
                                    }

                                </div> : null
                            }

                            <div className="create-colors-product_title">
                                <p>Добавить цвет <b style={{color: 'red'}}>*</b></p>
                                <CustomSelect
                                    options={colorAttr.map((v: any, index: number) => {
                                        return {
                                            value: v.code,
                                            label: v.name
                                        }
                                    })}
                                    label={colorValues ? colorValues.value.name : 'Выберите цвет'}
                                    onClick={(option) => {
                                        setColorValues({
                                            code: colorField.code,
                                            value: {
                                                code: option.value,
                                                name: option.label,
                                                images: [],
                                                prvImages: []
                                            },
                                            multiValued: colorField.multiValued,
                                            mandatory: colorField.mandatory
                                        })
                                    }}
                                />
                                <Button
                                    onClick={() => {
                                        if (colorValues) {
                                            selectChange({
                                                code: colorValues.code,
                                                value: colorValues.value,
                                                multiValued: colorValues.multiValued,
                                                mandatory: colorValues.mandatory
                                            })
                                        }
                                    }}
                                    variant="contained"
                                    disabled={!colorValues}
                                >
                                    Добавить Цвет
                                </Button>

                            </div>

                        </div> : null}
                    </div>
                </div>
            }
        </>
    );
}

export default CreateForm;