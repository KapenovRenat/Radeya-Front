import React, {useEffect, useRef, useState} from 'react';
import apiAxis from "@/utils/axios";
import CustomSelect from "@/components/custom-select";

interface Props {
    selectedCategory: { code: string, title: string };
}

function CreateForm(props: Props) {
    const [loadFields, setLoadFields] = useState<boolean>(true);
    const { selectedCategory } = props;
    const calledRef = useRef(false);
    const [categoryAttr, setCategoryAttr] = useState<any[]>([
        {
            "code": "Sofas*Type",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "диван",
                    "name": "диван"
                },
                {
                    "code": "тахта",
                    "name": "тахта"
                },
                {
                    "code": "кушетка",
                    "name": "кушетка"
                },
                {
                    "code": "комплект мягкой мебели",
                    "name": "комплект мягкой мебели"
                },
                {
                    "code": "мини-диван",
                    "name": "мини-диван"
                }
            ]
        },
        {
            "code": "Sofas*Folding design",
            "type": "boolean",
            "multiValued": false,
            "mandatory": true,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Folding design not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Shape",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "прямой",
                    "name": "прямой"
                },
                {
                    "code": "П-образный",
                    "name": "П-образный"
                },
                {
                    "code": "угловой левый",
                    "name": "угловой левый"
                },
                {
                    "code": "угловой правый",
                    "name": "угловой правый"
                },
                {
                    "code": "угловой универсальный",
                    "name": "угловой универсальный"
                },
                {
                    "code": "модульный",
                    "name": "модульный"
                }
            ]
        },
        {
            "code": "Sofas*Transformation mechanism",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "отсутствует",
                    "name": "отсутствует"
                },
                {
                    "code": "книжка",
                    "name": "книжка"
                },
                {
                    "code": "откидной",
                    "name": "откидной"
                },
                {
                    "code": "аккордеон",
                    "name": "аккордеон"
                },
                {
                    "code": "американская раскладушка",
                    "name": "американская раскладушка"
                },
                {
                    "code": "выкатной",
                    "name": "выкатной"
                },
                {
                    "code": "дельфин",
                    "name": "дельфин"
                },
                {
                    "code": "еврокнижка",
                    "name": "еврокнижка"
                },
                {
                    "code": "клик-клак",
                    "name": "клик-клак"
                },
                {
                    "code": "лит",
                    "name": "лит"
                },
                {
                    "code": "французская раскладушка",
                    "name": "французская раскладушка"
                },
                {
                    "code": "калипсо",
                    "name": "калипсо"
                },
                {
                    "code": "спартак",
                    "name": "спартак"
                },
                {
                    "code": "пантограф",
                    "name": "пантограф"
                },
                {
                    "code": "тик-так",
                    "name": "тик-так"
                },
                {
                    "code": "пума",
                    "name": "пума"
                },
                {
                    "code": "венеция",
                    "name": "венеция"
                },
                {
                    "code": "ножницы",
                    "name": "ножницы"
                },
                {
                    "code": "реклайнер",
                    "name": "реклайнер"
                },
                {
                    "code": "Pull and Step",
                    "name": "Pull and Step"
                },
                {
                    "code": "седафлекс",
                    "name": "седафлекс"
                }
            ]
        },
        {
            "code": "Sofas*Upholstery",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "трикотаж",
                    "name": "трикотаж"
                },
                {
                    "code": "полиэстер",
                    "name": "полиэстер"
                },
                {
                    "code": "ткань",
                    "name": "ткань"
                },
                {
                    "code": "комбинированная",
                    "name": "комбинированная"
                },
                {
                    "code": "велюр",
                    "name": "велюр"
                },
                {
                    "code": "натуральная кожа",
                    "name": "натуральная кожа"
                },
                {
                    "code": "искусственный мех",
                    "name": "искусственный мех"
                },
                {
                    "code": "рогожка",
                    "name": "рогожка"
                },
                {
                    "code": "шенилл",
                    "name": "шенилл"
                },
                {
                    "code": "вельвет",
                    "name": "вельвет"
                },
                {
                    "code": "микрофибра",
                    "name": "микрофибра"
                },
                {
                    "code": "флок",
                    "name": "флок"
                },
                {
                    "code": "искусственная замша",
                    "name": "искусственная замша"
                },
                {
                    "code": "микровелюр",
                    "name": "микровелюр"
                },
                {
                    "code": "винилискожа",
                    "name": "винилискожа"
                },
                {
                    "code": "саржа",
                    "name": "саржа"
                },
                {
                    "code": "бархат",
                    "name": "бархат"
                },
                {
                    "code": "букле",
                    "name": "букле"
                },
                {
                    "code": "микровельвет",
                    "name": "микровельвет"
                },
                {
                    "code": "нубук",
                    "name": "нубук"
                },
                {
                    "code": "экокожа (искусственная кожа)",
                    "name": "экокожа (искусственная кожа)"
                },
                {
                    "code": "микрошенилл",
                    "name": "микрошенилл"
                }
            ]
        },
        {
            "code": "Sofas*Features",
            "type": "enum",
            "multiValued": true,
            "mandatory": false,
            "values": [
                {
                    "code": "трансформер",
                    "name": "трансформер"
                },
                {
                    "code": "съемный чехол",
                    "name": "съемный чехол"
                },
                {
                    "code": "подлокотники",
                    "name": "подлокотники"
                },
                {
                    "code": "бельевой ящик",
                    "name": "бельевой ящик"
                },
                {
                    "code": "подъемный механизм",
                    "name": "подъемный механизм"
                },
                {
                    "code": "бескаркасный",
                    "name": "бескаркасный"
                },
                {
                    "code": "антивандальный материал",
                    "name": "антивандальный материал"
                },
                {
                    "code": "с полками в подлокотниках",
                    "name": "с полками в подлокотниках"
                },
                {
                    "code": "встроена беспроводная зарядка",
                    "name": "встроена беспроводная зарядка"
                },
                {
                    "code": "встроенный матрас",
                    "name": "встроенный матрас"
                },
                {
                    "code": "выдвижной столик",
                    "name": "выдвижной столик"
                }
            ]
        },
        {
            "code": "Sofas*Filler",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "синтепон",
                    "name": "синтепон"
                },
                {
                    "code": "полистирол",
                    "name": "полистирол"
                },
                {
                    "code": "пенополиуретан",
                    "name": "пенополиуретан"
                },
                {
                    "code": "ортопедический",
                    "name": "ортопедический"
                },
                {
                    "code": "дакроновое волокно",
                    "name": "дакроновое волокно"
                },
                {
                    "code": "независимый пружинный блок",
                    "name": "независимый пружинный блок"
                },
                {
                    "code": "зависимые пружины",
                    "name": "зависимые пружины"
                },
                {
                    "code": "полифилл",
                    "name": "полифилл"
                }
            ]
        },
        {
            "code": "Sofas*Rigidity",
            "type": "enum",
            "multiValued": false,
            "mandatory": false,
            "values": [
                {
                    "code": "мягкий",
                    "name": "мягкий"
                },
                {
                    "code": "жесткий",
                    "name": "жесткий"
                },
                {
                    "code": "средний",
                    "name": "средний"
                }
            ]
        },
        {
            "code": "Sofas*Width",
            "type": "number",
            "multiValued": false,
            "mandatory": true,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Width not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Depth",
            "type": "number",
            "multiValued": false,
            "mandatory": true,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Depth not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Height",
            "type": "number",
            "multiValued": false,
            "mandatory": true,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Height not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Sleeping place",
            "type": "enum",
            "multiValued": false,
            "mandatory": false,
            "values": [
                {
                    "code": "отсутствует",
                    "name": "отсутствует"
                },
                {
                    "code": "75x190 см",
                    "name": "75x190 см"
                },
                {
                    "code": "120x200 см",
                    "name": "120x200 см"
                },
                {
                    "code": "140x200 см",
                    "name": "140x200 см"
                },
                {
                    "code": "160x200 см",
                    "name": "160x200 см"
                },
                {
                    "code": "180x200 см",
                    "name": "180x200 см"
                },
                {
                    "code": "90x200 см",
                    "name": "90x200 см"
                },
                {
                    "code": "80x200 см",
                    "name": "80x200 см"
                },
                {
                    "code": "200x200 см",
                    "name": "200x200 см"
                },
                {
                    "code": "70х160 см",
                    "name": "70х160 см"
                },
                {
                    "code": "90х180 см",
                    "name": "90х180 см"
                },
                {
                    "code": "80х180 см",
                    "name": "80х180 см"
                },
                {
                    "code": "70х150 см",
                    "name": "70х150 см"
                },
                {
                    "code": "80х170 см",
                    "name": "80х170 см"
                },
                {
                    "code": "70х140 см",
                    "name": "70х140 см"
                },
                {
                    "code": "150x200 см",
                    "name": "150x200 см"
                },
                {
                    "code": "80х160 см",
                    "name": "80х160 см"
                },
                {
                    "code": "100х200 см",
                    "name": "100х200 см"
                },
                {
                    "code": "90х195 см",
                    "name": "90х195 см"
                },
                {
                    "code": "120x190 см",
                    "name": "120x190 см"
                },
                {
                    "code": "190х200 см",
                    "name": "190х200 см"
                },
                {
                    "code": "120х195 см",
                    "name": "120х195 см"
                },
                {
                    "code": "140х195 см",
                    "name": "140х195 см"
                },
                {
                    "code": "160х195 см",
                    "name": "160х195 см"
                },
                {
                    "code": "180х195 см",
                    "name": "180х195 см"
                },
                {
                    "code": "110x170 см",
                    "name": "110x170 см"
                },
                {
                    "code": "68х168 см",
                    "name": "68х168 см"
                },
                {
                    "code": "140х190 см",
                    "name": "140х190 см"
                },
                {
                    "code": "70x170 см",
                    "name": "70x170 см"
                },
                {
                    "code": "80х100 см",
                    "name": "80х100 см"
                },
                {
                    "code": "80х185 см",
                    "name": "80х185 см"
                },
                {
                    "code": "80х190 см",
                    "name": "80х190 см"
                },
                {
                    "code": "90х190 см",
                    "name": "90х190 см"
                },
                {
                    "code": "145х200 см",
                    "name": "145х200 см"
                },
                {
                    "code": "160х220 см",
                    "name": "160х220 см"
                },
                {
                    "code": "170х200 см",
                    "name": "170х200 см"
                },
                {
                    "code": "170x215 см",
                    "name": "170x215 см"
                },
                {
                    "code": "150x185 см",
                    "name": "150x185 см"
                },
                {
                    "code": "137х191 см",
                    "name": "137х191 см"
                },
                {
                    "code": "146x240 см",
                    "name": "146x240 см"
                },
                {
                    "code": "146x196 см",
                    "name": "146x196 см"
                },
                {
                    "code": "146x194 см",
                    "name": "146x194 см"
                },
                {
                    "code": "150x300 см",
                    "name": "150x300 см"
                },
                {
                    "code": "151x196 см",
                    "name": "151x196 см"
                },
                {
                    "code": "146x190 см",
                    "name": "146x190 см"
                },
                {
                    "code": "55x190 см",
                    "name": "55x190 см"
                },
                {
                    "code": "130х185 см",
                    "name": "130х185 см"
                },
                {
                    "code": "115x190 см",
                    "name": "115x190 см"
                },
                {
                    "code": "130х195 см",
                    "name": "130х195 см"
                },
                {
                    "code": "110x190 см",
                    "name": "110x190 см"
                },
                {
                    "code": "150x235 см",
                    "name": "150x235 см"
                },
                {
                    "code": "120х180 см",
                    "name": "120х180 см"
                },
                {
                    "code": "100х180 см",
                    "name": "100х180 см"
                },
                {
                    "code": "156x200 см",
                    "name": "156x200 см"
                },
                {
                    "code": "112x185 см",
                    "name": "112x185 см"
                },
                {
                    "code": "150x270 см",
                    "name": "150x270 см"
                },
                {
                    "code": "150x80 см",
                    "name": "150x80 см"
                },
                {
                    "code": "140x300 см",
                    "name": "140x300 см"
                },
                {
                    "code": "150х190 см",
                    "name": "150х190 см"
                },
                {
                    "code": "135х190 см",
                    "name": "135х190 см"
                },
                {
                    "code": "146х254 см",
                    "name": "146х254 см"
                },
                {
                    "code": "140х245 см",
                    "name": "140х245 см"
                },
                {
                    "code": "152х235 см",
                    "name": "152х235 см"
                },
                {
                    "code": "148x192 см",
                    "name": "148x192 см"
                },
                {
                    "code": "155х190 см",
                    "name": "155х190 см"
                },
                {
                    "code": "148х203 см",
                    "name": "148х203 см"
                },
                {
                    "code": "138х200 см",
                    "name": "138х200 см"
                },
                {
                    "code": "150х280 см",
                    "name": "150х280 см"
                },
                {
                    "code": "126х165 см",
                    "name": "126х165 см"
                },
                {
                    "code": "155х195 см",
                    "name": "155х195 см"
                },
                {
                    "code": "120х270 см",
                    "name": "120х270 см"
                },
                {
                    "code": "83х184 см",
                    "name": "83х184 см"
                },
                {
                    "code": "130х278 см",
                    "name": "130х278 см"
                },
                {
                    "code": "110х185 см",
                    "name": "110х185 см"
                },
                {
                    "code": "120х184 см",
                    "name": "120х184 см"
                },
                {
                    "code": "366x146 см",
                    "name": "366x146 см"
                },
                {
                    "code": "190х161 см",
                    "name": "190х161 см"
                },
                {
                    "code": "140х260 см",
                    "name": "140х260 см"
                },
                {
                    "code": "130х190 см",
                    "name": "130х190 см"
                },
                {
                    "code": "143x210 см",
                    "name": "143x210 см"
                },
                {
                    "code": "140х240 см",
                    "name": "140х240 см"
                },
                {
                    "code": "140х250 см",
                    "name": "140х250 см"
                },
                {
                    "code": "150х180 см",
                    "name": "150х180 см"
                },
                {
                    "code": "180х130 см",
                    "name": "180х130 см"
                },
                {
                    "code": "140x80 см",
                    "name": "140x80 см"
                },
                {
                    "code": "135x75 см",
                    "name": "135x75 см"
                },
                {
                    "code": "130x70 см",
                    "name": "130x70 см"
                },
                {
                    "code": "165х265 см",
                    "name": "165х265 см"
                },
                {
                    "code": "200х220 см",
                    "name": "200х220 см"
                },
                {
                    "code": "72х200 см",
                    "name": "72х200 см"
                },
                {
                    "code": "140х218 см",
                    "name": "140х218 см"
                },
                {
                    "code": "150х245 см",
                    "name": "150х245 см"
                },
                {
                    "code": "350х215 см",
                    "name": "350х215 см"
                },
                {
                    "code": "225х130 см",
                    "name": "225х130 см"
                },
                {
                    "code": "150х315 см",
                    "name": "150х315 см"
                },
                {
                    "code": "150х290 см",
                    "name": "150х290 см"
                },
                {
                    "code": "210х150 см",
                    "name": "210х150 см"
                },
                {
                    "code": "150х195 см",
                    "name": "150х195 см"
                },
                {
                    "code": "145х220 см",
                    "name": "145х220 см"
                },
                {
                    "code": "140х220 см",
                    "name": "140х220 см"
                },
                {
                    "code": "280х154 см",
                    "name": "280х154 см"
                },
                {
                    "code": "400x150 см",
                    "name": "400x150 см"
                },
                {
                    "code": "133х198 см",
                    "name": "133х198 см"
                },
                {
                    "code": "150х250 см",
                    "name": "150х250 см"
                },
                {
                    "code": "140x270 см",
                    "name": "140x270 см"
                },
                {
                    "code": "300х165 см",
                    "name": "300х165 см"
                },
                {
                    "code": "165х295 см",
                    "name": "165х295 см"
                },
                {
                    "code": "140х293 см",
                    "name": "140х293 см"
                },
                {
                    "code": "135х235 см",
                    "name": "135х235 см"
                },
                {
                    "code": "150х225 см",
                    "name": "150х225 см"
                },
                {
                    "code": "148х195 см",
                    "name": "148х195 см"
                },
                {
                    "code": "240х130 см",
                    "name": "240х130 см"
                },
                {
                    "code": "145х268 см",
                    "name": "145х268 см"
                },
                {
                    "code": "150x321 см",
                    "name": "150x321 см"
                },
                {
                    "code": "180х385 см",
                    "name": "180х385 см"
                },
                {
                    "code": "172х290 см",
                    "name": "172х290 см"
                },
                {
                    "code": "150х240 см",
                    "name": "150х240 см"
                },
                {
                    "code": "150х330 см",
                    "name": "150х330 см"
                },
                {
                    "code": "155х300 см",
                    "name": "155х300 см"
                },
                {
                    "code": "155х265 см",
                    "name": "155х265 см"
                },
                {
                    "code": "180х342 см",
                    "name": "180х342 см"
                },
                {
                    "code": "80х300 см",
                    "name": "80х300 см"
                },
                {
                    "code": "170х280 см",
                    "name": "170х280 см"
                },
                {
                    "code": "147х296 см",
                    "name": "147х296 см"
                },
                {
                    "code": "184х94 см",
                    "name": "184х94 см"
                },
                {
                    "code": "189х96 см",
                    "name": "189х96 см"
                },
                {
                    "code": "130х352 см",
                    "name": "130х352 см"
                },
                {
                    "code": "380х184 см",
                    "name": "380х184 см"
                },
                {
                    "code": "192х91 см",
                    "name": "192х91 см"
                },
                {
                    "code": "148х190 см",
                    "name": "148х190 см"
                },
                {
                    "code": "210х140 см",
                    "name": "210х140 см"
                },
                {
                    "code": "100х190 см",
                    "name": "100х190 см"
                },
                {
                    "code": "120х194 см",
                    "name": "120х194 см"
                },
                {
                    "code": "138х192 см",
                    "name": "138х192 см"
                },
                {
                    "code": "138х198 см",
                    "name": "138х198 см"
                },
                {
                    "code": "174х201 см",
                    "name": "174х201 см"
                },
                {
                    "code": "126х193 см",
                    "name": "126х193 см"
                },
                {
                    "code": "174х301 см",
                    "name": "174х301 см"
                },
                {
                    "code": "65х200 см",
                    "name": "65х200 см"
                },
                {
                    "code": "140х192 см",
                    "name": "140х192 см"
                },
                {
                    "code": "157х210 см",
                    "name": "157х210 см"
                },
                {
                    "code": "131х195 см",
                    "name": "131х195 см"
                },
                {
                    "code": "148х386 см",
                    "name": "148х386 см"
                },
                {
                    "code": "150х390 см",
                    "name": "150х390 см"
                },
                {
                    "code": "70х190 см",
                    "name": "70х190 см"
                },
                {
                    "code": "60х250 см",
                    "name": "60х250 см"
                },
                {
                    "code": "110х305 см",
                    "name": "110х305 см"
                },
                {
                    "code": "95х270 см",
                    "name": "95х270 см"
                },
                {
                    "code": "150х320 см",
                    "name": "150х320 см"
                },
                {
                    "code": "150х205 см",
                    "name": "150х205 см"
                },
                {
                    "code": "95х180 см",
                    "name": "95х180 см"
                },
                {
                    "code": "90х315 см",
                    "name": "90х315 см"
                },
                {
                    "code": "150х215 см",
                    "name": "150х215 см"
                },
                {
                    "code": "150х380 см",
                    "name": "150х380 см"
                },
                {
                    "code": "155х286 см",
                    "name": "155х286 см"
                },
                {
                    "code": "124х187 см",
                    "name": "124х187 см"
                },
                {
                    "code": "154х197 см",
                    "name": "154х197 см"
                },
                {
                    "code": "150х196 см",
                    "name": "150х196 см"
                },
                {
                    "code": "150х244 см",
                    "name": "150х244 см"
                },
                {
                    "code": "153х198 см",
                    "name": "153х198 см"
                },
                {
                    "code": "153х194 см",
                    "name": "153х194 см"
                },
                {
                    "code": "151х210 см",
                    "name": "151х210 см"
                },
                {
                    "code": "153х220 см",
                    "name": "153х220 см"
                },
                {
                    "code": "156х258 см",
                    "name": "156х258 см"
                },
                {
                    "code": "148х390 см",
                    "name": "148х390 см"
                },
                {
                    "code": "135х300 см",
                    "name": "135х300 см"
                },
                {
                    "code": "134х219 см",
                    "name": "134х219 см"
                },
                {
                    "code": "130х200 см",
                    "name": "130х200 см"
                },
                {
                    "code": "155x280 см",
                    "name": "155x280 см"
                },
                {
                    "code": "150х208 см",
                    "name": "150х208 см"
                },
                {
                    "code": "140х180 см",
                    "name": "140х180 см"
                },
                {
                    "code": "125х340 см",
                    "name": "125х340 см"
                }
            ]
        },
        {
            "code": "Sofas*Length when unfolded",
            "type": "number",
            "multiValued": false,
            "mandatory": false,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Length when unfolded not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Armrests",
            "type": "enum",
            "multiValued": false,
            "mandatory": false,
            "values": [
                {
                    "code": "жесткие",
                    "name": "жесткие"
                },
                {
                    "code": "мягкие",
                    "name": "мягкие"
                },
                {
                    "code": "без подлокотников",
                    "name": "без подлокотников"
                }
            ]
        },
        {
            "code": "Sofas*Number of seats",
            "type": "enum",
            "multiValued": false,
            "mandatory": false,
            "values": [
                {
                    "code": "двухместный",
                    "name": "двухместный"
                },
                {
                    "code": "трехместный",
                    "name": "трехместный"
                },
                {
                    "code": "четырехместный",
                    "name": "четырехместный"
                },
                {
                    "code": "шестиместный",
                    "name": "шестиместный"
                },
                {
                    "code": "пятиместный",
                    "name": "пятиместный"
                }
            ]
        },
        {
            "code": "Sofas*Application",
            "type": "enum",
            "multiValued": true,
            "mandatory": true,
            "values": [
                {
                    "code": "для офиса",
                    "name": "для офиса"
                },
                {
                    "code": "для гостиной",
                    "name": "для гостиной"
                },
                {
                    "code": "для кухни",
                    "name": "для кухни"
                },
                {
                    "code": "для холла",
                    "name": "для холла"
                },
                {
                    "code": "для сна",
                    "name": "для сна"
                },
                {
                    "code": "для кафе и ресторана",
                    "name": "для кафе и ресторана"
                },
                {
                    "code": "для приемной",
                    "name": "для приемной"
                }
            ]
        },
        {
            "code": "Sofas*Design",
            "type": "enum",
            "multiValued": true,
            "mandatory": true,
            "values": [
                {
                    "code": "классический",
                    "name": "классический"
                },
                {
                    "code": "восточный",
                    "name": "восточный"
                },
                {
                    "code": "современный",
                    "name": "современный"
                },
                {
                    "code": "арт-деко",
                    "name": "арт-деко"
                },
                {
                    "code": "модерн",
                    "name": "модерн"
                },
                {
                    "code": "лофт",
                    "name": "лофт"
                },
                {
                    "code": "хай-тек",
                    "name": "хай-тек"
                },
                {
                    "code": "прованс",
                    "name": "прованс"
                },
                {
                    "code": "минимализм",
                    "name": "минимализм"
                },
                {
                    "code": "скандинавский",
                    "name": "скандинавский"
                },
                {
                    "code": "лаунж",
                    "name": "лаунж"
                },
                {
                    "code": "честерфилд",
                    "name": "честерфилд"
                },
                {
                    "code": "венецианский",
                    "name": "венецианский"
                }
            ]
        },
        {
            "code": "Sofas*Furniture assembly",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "поставляется в собранном виде",
                    "name": "поставляется в собранном виде"
                },
                {
                    "code": "в разобранном виде (требуется сборка)",
                    "name": "в разобранном виде (требуется сборка)"
                }
            ]
        },
        {
            "code": "Sofas*Furniture legs",
            "type": "enum",
            "multiValued": true,
            "mandatory": false,
            "values": [
                {
                    "code": "пластик",
                    "name": "пластик"
                },
                {
                    "code": "дерево",
                    "name": "дерево"
                },
                {
                    "code": "металл",
                    "name": "металл"
                },
                {
                    "code": "ЛДСП",
                    "name": "ЛДСП"
                },
                {
                    "code": "без ножек",
                    "name": "без ножек"
                }
            ]
        },
        {
            "code": "Sofas*Decorative pillows",
            "type": "enum",
            "multiValued": false,
            "mandatory": false,
            "values": [
                {
                    "code": "2 подушки",
                    "name": "2 подушки"
                },
                {
                    "code": "3 подушки",
                    "name": "3 подушки"
                },
                {
                    "code": "4 подушки",
                    "name": "4 подушки"
                },
                {
                    "code": "5 подушек",
                    "name": "5 подушек"
                },
                {
                    "code": "6 подушек",
                    "name": "6 подушек"
                },
                {
                    "code": "без подушек в комплекте",
                    "name": "без подушек в комплекте"
                },
                {
                    "code": "8 подушек",
                    "name": "8 подушек"
                },
                {
                    "code": "7 подушек",
                    "name": "7 подушек"
                }
            ]
        },
        {
            "code": "Sofas*linen box",
            "type": "boolean",
            "multiValued": false,
            "mandatory": false,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*linen box not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Additional",
            "type": "string",
            "multiValued": false,
            "mandatory": false,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Additional not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*Model",
            "type": "string",
            "multiValued": false,
            "mandatory": true,
            "values": {
                "code": "ATTRIBUTE_NOT_FOUND",
                "message": "Attribute with id Sofas*Model not found or it does not have \"Enum\" type"
            }
        },
        {
            "code": "Sofas*View",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "комплект",
                    "name": "комплект"
                },
                {
                    "code": "диван",
                    "name": "диван"
                },
                {
                    "code": "тахта",
                    "name": "тахта"
                },
                {
                    "code": "кушетка",
                    "name": "кушетка"
                },
                {
                    "code": "софа",
                    "name": "софа"
                },
                {
                    "code": "диван прямой",
                    "name": "диван прямой"
                },
                {
                    "code": "диван модульный",
                    "name": "диван модульный"
                },
                {
                    "code": "диван угловой",
                    "name": "диван угловой"
                },
                {
                    "code": "диван п-образный",
                    "name": "диван п-образный"
                },
                {
                    "code": "бескаркасный диван",
                    "name": "бескаркасный диван"
                },
                {
                    "code": "мини-диван",
                    "name": "мини-диван"
                },
                {
                    "code": "угловой диван",
                    "name": "угловой диван"
                }
            ]
        },
        {
            "code": "Furniture*Color",
            "type": "enum",
            "multiValued": true,
            "mandatory": true,
            "values": [
                {
                    "code": "белый",
                    "name": "белый"
                },
                {
                    "code": "красный",
                    "name": "красный"
                },
                {
                    "code": "черный",
                    "name": "черный"
                },
                {
                    "code": "розовый",
                    "name": "розовый"
                },
                {
                    "code": "бежевый",
                    "name": "бежевый"
                },
                {
                    "code": "бирюзовый",
                    "name": "бирюзовый"
                },
                {
                    "code": "синий",
                    "name": "синий"
                },
                {
                    "code": "зеленый",
                    "name": "зеленый"
                },
                {
                    "code": "коричневый",
                    "name": "коричневый"
                },
                {
                    "code": "бордовый",
                    "name": "бордовый"
                },
                {
                    "code": "фиолетовый",
                    "name": "фиолетовый"
                },
                {
                    "code": "голубой",
                    "name": "голубой"
                },
                {
                    "code": "мультиколор",
                    "name": "мультиколор"
                },
                {
                    "code": "серый",
                    "name": "серый"
                },
                {
                    "code": "желтый",
                    "name": "желтый"
                },
                {
                    "code": "оранжевый",
                    "name": "оранжевый"
                },
                {
                    "code": "хаки",
                    "name": "хаки"
                },
                {
                    "code": "коралловый",
                    "name": "коралловый"
                },
                {
                    "code": "темно-зеленый",
                    "name": "темно-зеленый"
                },
                {
                    "code": "светло-зеленый",
                    "name": "светло-зеленый"
                },
                {
                    "code": "светло-розовый",
                    "name": "светло-розовый"
                },
                {
                    "code": "сиреневый",
                    "name": "сиреневый"
                },
                {
                    "code": "темно-синий",
                    "name": "темно-синий"
                },
                {
                    "code": "темно-серый",
                    "name": "темно-серый"
                },
                {
                    "code": "горчичный",
                    "name": "горчичный"
                },
                {
                    "code": "кремовый",
                    "name": "кремовый"
                },
                {
                    "code": "золотой",
                    "name": "золотой"
                },
                {
                    "code": "светло-коричневый",
                    "name": "светло-коричневый"
                },
                {
                    "code": "серебряный",
                    "name": "серебряный"
                },
                {
                    "code": "слоновая кость",
                    "name": "слоновая кость"
                },
                {
                    "code": "медный",
                    "name": "медный"
                },
                {
                    "code": "светло серый",
                    "name": "светло серый"
                },
                {
                    "code": "ваниль",
                    "name": "ваниль"
                },
                {
                    "code": "темно-коричневый",
                    "name": "темно-коричневый"
                },
                {
                    "code": "сливовый",
                    "name": "сливовый"
                },
                {
                    "code": "песочный",
                    "name": "песочный"
                },
                {
                    "code": "светло-фиолетовый",
                    "name": "светло-фиолетовый"
                },
                {
                    "code": "графит",
                    "name": "графит"
                },
                {
                    "code": "терракотовый",
                    "name": "терракотовый"
                },
                {
                    "code": "светло-желтый",
                    "name": "светло-желтый"
                },
                {
                    "code": "темно-фиолетовый",
                    "name": "темно-фиолетовый"
                },
                {
                    "code": "бледно-голубой",
                    "name": "бледно-голубой"
                }
            ]
        },
        {
            "code": "Furniture*Texture",
            "type": "enum",
            "multiValued": true,
            "mandatory": false,
            "values": [
                {
                    "code": "белый",
                    "name": "белый"
                },
                {
                    "code": "красный",
                    "name": "красный"
                },
                {
                    "code": "розовый",
                    "name": "розовый"
                },
                {
                    "code": "бежевый",
                    "name": "бежевый"
                },
                {
                    "code": "бирюзовый",
                    "name": "бирюзовый"
                },
                {
                    "code": "синий",
                    "name": "синий"
                },
                {
                    "code": "зеленый",
                    "name": "зеленый"
                },
                {
                    "code": "коричневый",
                    "name": "коричневый"
                },
                {
                    "code": "бордовый",
                    "name": "бордовый"
                },
                {
                    "code": "фиолетовый",
                    "name": "фиолетовый"
                },
                {
                    "code": "голубой",
                    "name": "голубой"
                },
                {
                    "code": "серый",
                    "name": "серый"
                },
                {
                    "code": "желтый",
                    "name": "желтый"
                },
                {
                    "code": "оранжевый",
                    "name": "оранжевый"
                },
                {
                    "code": "хаки",
                    "name": "хаки"
                },
                {
                    "code": "коралловый",
                    "name": "коралловый"
                },
                {
                    "code": "темно-зеленый",
                    "name": "темно-зеленый"
                },
                {
                    "code": "сиреневый",
                    "name": "сиреневый"
                },
                {
                    "code": "темно-синий",
                    "name": "темно-синий"
                },
                {
                    "code": "темно-серый",
                    "name": "темно-серый"
                },
                {
                    "code": "светло-серый",
                    "name": "светло-серый"
                },
                {
                    "code": "горчичный",
                    "name": "горчичный"
                },
                {
                    "code": "салатовый",
                    "name": "салатовый"
                },
                {
                    "code": "светло-коричневый",
                    "name": "светло-коричневый"
                },
                {
                    "code": "слоновая кость",
                    "name": "слоновая кость"
                },
                {
                    "code": "медный",
                    "name": "медный"
                },
                {
                    "code": "орех светлый",
                    "name": "орех светлый"
                },
                {
                    "code": "орех темный",
                    "name": "орех темный"
                },
                {
                    "code": "каштан",
                    "name": "каштан"
                },
                {
                    "code": "орех",
                    "name": "орех"
                },
                {
                    "code": "мрамор",
                    "name": "мрамор"
                },
                {
                    "code": "ваниль",
                    "name": "ваниль"
                },
                {
                    "code": "лаванда",
                    "name": "лаванда"
                },
                {
                    "code": "дуб",
                    "name": "дуб"
                },
                {
                    "code": "шоколад",
                    "name": "шоколад"
                },
                {
                    "code": "темно-коричневый",
                    "name": "темно-коричневый"
                },
                {
                    "code": "мятный",
                    "name": "мятный"
                },
                {
                    "code": "фуксия",
                    "name": "фуксия"
                },
                {
                    "code": "сливовый",
                    "name": "сливовый"
                },
                {
                    "code": "песочный",
                    "name": "песочный"
                },
                {
                    "code": "гранатовый",
                    "name": "гранатовый"
                },
                {
                    "code": "холодный белый",
                    "name": "холодный белый"
                },
                {
                    "code": "золото",
                    "name": "золото"
                },
                {
                    "code": "серебро",
                    "name": "серебро"
                },
                {
                    "code": "хром",
                    "name": "хром"
                },
                {
                    "code": "графит",
                    "name": "графит"
                },
                {
                    "code": "крем-брюле",
                    "name": "крем-брюле"
                },
                {
                    "code": "асфальт",
                    "name": "асфальт"
                },
                {
                    "code": "охра",
                    "name": "охра"
                },
                {
                    "code": "терракотовый",
                    "name": "терракотовый"
                },
                {
                    "code": "ярко-желтый",
                    "name": "ярко-желтый"
                },
                {
                    "code": "белый матовый",
                    "name": "белый матовый"
                },
                {
                    "code": "топленое молоко",
                    "name": "топленое молоко"
                },
                {
                    "code": "морковный",
                    "name": "морковный"
                },
                {
                    "code": "черный глянец",
                    "name": "черный глянец"
                },
                {
                    "code": "морской бриз",
                    "name": "морской бриз"
                },
                {
                    "code": "серо-бежевый",
                    "name": "серо-бежевый"
                },
                {
                    "code": "ярко-красный",
                    "name": "ярко-красный"
                },
                {
                    "code": "дуб молочный",
                    "name": "дуб молочный"
                },
                {
                    "code": "бледно-голубой",
                    "name": "бледно-голубой"
                },
                {
                    "code": "черный матовый",
                    "name": "черный матовый"
                },
                {
                    "code": "ярко-розовый",
                    "name": "ярко-розовый"
                },
                {
                    "code": "мрамор белый",
                    "name": "мрамор белый"
                },
                {
                    "code": "дуб крафт золотой",
                    "name": "дуб крафт золотой"
                },
                {
                    "code": "дуб винченца",
                    "name": "дуб винченца"
                },
                {
                    "code": "ателье светлый",
                    "name": "ателье светлый"
                },
                {
                    "code": "белый глянец",
                    "name": "белый глянец"
                },
                {
                    "code": "нежно розовый",
                    "name": "нежно розовый"
                },
                {
                    "code": "жемчужный белый",
                    "name": "жемчужный белый"
                },
                {
                    "code": "пепельный серый",
                    "name": "пепельный серый"
                }
            ]
        },
        {
            "code": "Furniture*Country",
            "type": "enum",
            "multiValued": false,
            "mandatory": true,
            "values": [
                {
                    "code": "Казахстан",
                    "name": "Казахстан"
                },
                {
                    "code": "Турция",
                    "name": "Турция"
                },
                {
                    "code": "Китай",
                    "name": "Китай"
                },
                {
                    "code": "Россия",
                    "name": "Россия"
                },
                {
                    "code": "Украина",
                    "name": "Украина"
                },
                {
                    "code": "Узбекистан",
                    "name": "Узбекистан"
                },
                {
                    "code": "Индия",
                    "name": "Индия"
                },
                {
                    "code": "Вьетнам",
                    "name": "Вьетнам"
                },
                {
                    "code": "Италия",
                    "name": "Италия"
                },
                {
                    "code": "Германия",
                    "name": "Германия"
                },
                {
                    "code": "США",
                    "name": "США"
                },
                {
                    "code": "Франция",
                    "name": "Франция"
                },
                {
                    "code": "Канада",
                    "name": "Канада"
                },
                {
                    "code": "Индонезия",
                    "name": "Индонезия"
                },
                {
                    "code": "Словакия",
                    "name": "Словакия"
                },
                {
                    "code": "Болгария",
                    "name": "Болгария"
                },
                {
                    "code": "Мексика",
                    "name": "Мексика"
                },
                {
                    "code": "Польша",
                    "name": "Польша"
                },
                {
                    "code": "Шри-Ланка",
                    "name": "Шри-Ланка"
                },
                {
                    "code": "Бангладеш",
                    "name": "Бангладеш"
                },
                {
                    "code": "Швеция",
                    "name": "Швеция"
                },
                {
                    "code": "Нидерланды",
                    "name": "Нидерланды"
                },
                {
                    "code": "Португалия",
                    "name": "Португалия"
                },
                {
                    "code": "Корея",
                    "name": "Корея"
                },
                {
                    "code": "Кения",
                    "name": "Кения"
                },
                {
                    "code": "Коста-Рика",
                    "name": "Коста-Рика"
                },
                {
                    "code": "Венесуэла",
                    "name": "Венесуэла"
                },
                {
                    "code": "Израиль",
                    "name": "Израиль"
                },
                {
                    "code": "Кабо-Верде",
                    "name": "Кабо-Верде"
                },
                {
                    "code": "Камерун",
                    "name": "Камерун"
                },
                {
                    "code": "Люксембург",
                    "name": "Люксембург"
                },
                {
                    "code": "Малави",
                    "name": "Малави"
                },
                {
                    "code": "Мозамбик",
                    "name": "Мозамбик"
                },
                {
                    "code": "Науру",
                    "name": "Науру"
                },
                {
                    "code": "Сирия",
                    "name": "Сирия"
                },
                {
                    "code": "Танзания",
                    "name": "Танзания"
                },
                {
                    "code": "Тунис",
                    "name": "Тунис"
                },
                {
                    "code": "Южная Осетия",
                    "name": "Южная Осетия"
                },
                {
                    "code": "Ямайка",
                    "name": "Ямайка"
                },
                {
                    "code": "Пакистан",
                    "name": "Пакистан"
                },
                {
                    "code": "Таиланд",
                    "name": "Таиланд"
                },
                {
                    "code": "Южная Корея",
                    "name": "Южная Корея"
                },
                {
                    "code": "Австралия",
                    "name": "Австралия"
                },
                {
                    "code": "Аргентина",
                    "name": "Аргентина"
                },
                {
                    "code": "Боливия",
                    "name": "Боливия"
                },
                {
                    "code": "Гамбия",
                    "name": "Гамбия"
                },
                {
                    "code": "Гвинея-Бисау",
                    "name": "Гвинея-Бисау"
                },
                {
                    "code": "Маршалловы Острова",
                    "name": "Маршалловы Острова"
                },
                {
                    "code": "Монголия",
                    "name": "Монголия"
                },
                {
                    "code": "Непал",
                    "name": "Непал"
                },
                {
                    "code": "Никарагуа",
                    "name": "Никарагуа"
                },
                {
                    "code": "Парагвай",
                    "name": "Парагвай"
                },
                {
                    "code": "Румыния",
                    "name": "Румыния"
                },
                {
                    "code": "Северная Македония",
                    "name": "Северная Македония"
                },
                {
                    "code": "Сент-Винсент и Гренадины",
                    "name": "Сент-Винсент и Гренадины"
                },
                {
                    "code": "Суринам",
                    "name": "Суринам"
                },
                {
                    "code": "Тринидад и Тобаго",
                    "name": "Тринидад и Тобаго"
                },
                {
                    "code": "Уганда",
                    "name": "Уганда"
                },
                {
                    "code": "Черногория",
                    "name": "Черногория"
                },
                {
                    "code": "Экваториальная Гвинея",
                    "name": "Экваториальная Гвинея"
                },
                {
                    "code": "Литва",
                    "name": "Литва"
                },
                {
                    "code": "Грузия",
                    "name": "Грузия"
                },
                {
                    "code": "Шотландия",
                    "name": "Шотландия"
                },
                {
                    "code": "Андорра",
                    "name": "Андорра"
                },
                {
                    "code": "Афганистан",
                    "name": "Афганистан"
                },
                {
                    "code": "Барбадос",
                    "name": "Барбадос"
                },
                {
                    "code": "Бахрейн",
                    "name": "Бахрейн"
                },
                {
                    "code": "Босния и Герцеговина",
                    "name": "Босния и Герцеговина"
                },
                {
                    "code": "Государство Палестина",
                    "name": "Государство Палестина"
                },
                {
                    "code": "Гренада",
                    "name": "Гренада"
                },
                {
                    "code": "Дания",
                    "name": "Дания"
                },
                {
                    "code": "КНДР",
                    "name": "КНДР"
                },
                {
                    "code": "Латвия",
                    "name": "Латвия"
                },
                {
                    "code": "Лесото",
                    "name": "Лесото"
                },
                {
                    "code": "Либерия",
                    "name": "Либерия"
                },
                {
                    "code": "Мадагаскар",
                    "name": "Мадагаскар"
                },
                {
                    "code": "Мьянма",
                    "name": "Мьянма"
                },
                {
                    "code": "Нигер",
                    "name": "Нигер"
                },
                {
                    "code": "Нигерия",
                    "name": "Нигерия"
                },
                {
                    "code": "Сингапур",
                    "name": "Сингапур"
                },
                {
                    "code": "Сомали",
                    "name": "Сомали"
                },
                {
                    "code": "Тонга",
                    "name": "Тонга"
                },
                {
                    "code": "Чад",
                    "name": "Чад"
                },
                {
                    "code": "ЮАР",
                    "name": "ЮАР"
                },
                {
                    "code": "Кот-д Ивуар",
                    "name": "Кот-д Ивуар"
                },
                {
                    "code": "Албания",
                    "name": "Албания"
                },
                {
                    "code": "Гаити",
                    "name": "Гаити"
                },
                {
                    "code": "Гвинея",
                    "name": "Гвинея"
                },
                {
                    "code": "Доминика",
                    "name": "Доминика"
                },
                {
                    "code": "Доминиканская Республика",
                    "name": "Доминиканская Республика"
                },
                {
                    "code": "Иордания",
                    "name": "Иордания"
                },
                {
                    "code": "Йемен",
                    "name": "Йемен"
                },
                {
                    "code": "Катар",
                    "name": "Катар"
                },
                {
                    "code": "Колумбия",
                    "name": "Колумбия"
                },
                {
                    "code": "Коморские Острова",
                    "name": "Коморские Острова"
                },
                {
                    "code": "Кувейт",
                    "name": "Кувейт"
                },
                {
                    "code": "Мали",
                    "name": "Мали"
                },
                {
                    "code": "Намибия",
                    "name": "Намибия"
                },
                {
                    "code": "Норвегия",
                    "name": "Норвегия"
                },
                {
                    "code": "Таджикистан",
                    "name": "Таджикистан"
                },
                {
                    "code": "Новая Зеландия",
                    "name": "Новая Зеландия"
                },
                {
                    "code": "Соломоновы Острова",
                    "name": "Соломоновы Острова"
                },
                {
                    "code": "Того",
                    "name": "Того"
                },
                {
                    "code": "Тувалу",
                    "name": "Тувалу"
                },
                {
                    "code": "Туркмения",
                    "name": "Туркмения"
                },
                {
                    "code": "Фиджи",
                    "name": "Фиджи"
                },
                {
                    "code": "Иран",
                    "name": "Иран"
                },
                {
                    "code": "Австрия",
                    "name": "Австрия"
                },
                {
                    "code": "Армения",
                    "name": "Армения"
                },
                {
                    "code": "Япония",
                    "name": "Япония"
                },
                {
                    "code": "Абхазия",
                    "name": "Абхазия"
                },
                {
                    "code": "Белиз",
                    "name": "Белиз"
                },
                {
                    "code": "Бруней",
                    "name": "Бруней"
                },
                {
                    "code": "Бурунди",
                    "name": "Бурунди"
                },
                {
                    "code": "Бутан",
                    "name": "Бутан"
                },
                {
                    "code": "Джибути",
                    "name": "Джибути"
                },
                {
                    "code": "Кирибати",
                    "name": "Кирибати"
                },
                {
                    "code": "Лаос",
                    "name": "Лаос"
                },
                {
                    "code": "Ливан",
                    "name": "Ливан"
                },
                {
                    "code": "Маврикий",
                    "name": "Маврикий"
                },
                {
                    "code": "Малайзия",
                    "name": "Малайзия"
                },
                {
                    "code": "Марокко",
                    "name": "Марокко"
                },
                {
                    "code": "Оман",
                    "name": "Оман"
                },
                {
                    "code": "Папуа - Новая Гвинея",
                    "name": "Папуа - Новая Гвинея"
                },
                {
                    "code": "Саудовская Аравия",
                    "name": "Саудовская Аравия"
                },
                {
                    "code": "Сенегал",
                    "name": "Сенегал"
                },
                {
                    "code": "Словения",
                    "name": "Словения"
                },
                {
                    "code": "Уругвай",
                    "name": "Уругвай"
                },
                {
                    "code": "Швейцария",
                    "name": "Швейцария"
                },
                {
                    "code": "Эритрея",
                    "name": "Эритрея"
                },
                {
                    "code": "Эстония",
                    "name": "Эстония"
                },
                {
                    "code": "Южный Судан",
                    "name": "Южный Судан"
                },
                {
                    "code": "Ирландия",
                    "name": "Ирландия"
                },
                {
                    "code": "Чехия",
                    "name": "Чехия"
                },
                {
                    "code": "Беларусь",
                    "name": "Беларусь"
                },
                {
                    "code": "Египет",
                    "name": "Египет"
                },
                {
                    "code": "Великобритания",
                    "name": "Великобритания"
                },
                {
                    "code": "Азербайджан",
                    "name": "Азербайджан"
                },
                {
                    "code": "Ангола",
                    "name": "Ангола"
                },
                {
                    "code": "Восточный Тимор",
                    "name": "Восточный Тимор"
                },
                {
                    "code": "Гайана",
                    "name": "Гайана"
                },
                {
                    "code": "Гватемала",
                    "name": "Гватемала"
                },
                {
                    "code": "Гондурас",
                    "name": "Гондурас"
                },
                {
                    "code": "Зимбабве",
                    "name": "Зимбабве"
                },
                {
                    "code": "Ирак",
                    "name": "Ирак"
                },
                {
                    "code": "Мавритания",
                    "name": "Мавритания"
                },
                {
                    "code": "Монако",
                    "name": "Монако"
                },
                {
                    "code": "Палау",
                    "name": "Палау"
                },
                {
                    "code": "Перу",
                    "name": "Перу"
                },
                {
                    "code": "Руанда",
                    "name": "Руанда"
                },
                {
                    "code": "Судан",
                    "name": "Судан"
                },
                {
                    "code": "Эсватини",
                    "name": "Эсватини"
                },
                {
                    "code": "Эфиопия",
                    "name": "Эфиопия"
                },
                {
                    "code": "Греция",
                    "name": "Греция"
                },
                {
                    "code": "Багамские Острова",
                    "name": "Багамские Острова"
                },
                {
                    "code": "Венгрия",
                    "name": "Венгрия"
                },
                {
                    "code": "Гана",
                    "name": "Гана"
                },
                {
                    "code": "Исландия",
                    "name": "Исландия"
                },
                {
                    "code": "ОАЭ",
                    "name": "ОАЭ"
                },
                {
                    "code": "Республика Конго",
                    "name": "Республика Конго"
                },
                {
                    "code": "Республика Корея",
                    "name": "Республика Корея"
                },
                {
                    "code": "Сальвадор",
                    "name": "Сальвадор"
                },
                {
                    "code": "Самоа",
                    "name": "Самоа"
                },
                {
                    "code": "Сан-Марино",
                    "name": "Сан-Марино"
                },
                {
                    "code": "Сент-Люсия",
                    "name": "Сент-Люсия"
                },
                {
                    "code": "Сербия",
                    "name": "Сербия"
                },
                {
                    "code": "Сьерра-Леоне",
                    "name": "Сьерра-Леоне"
                },
                {
                    "code": "Филиппины",
                    "name": "Филиппины"
                },
                {
                    "code": "Кыргызстан",
                    "name": "Кыргызстан"
                },
                {
                    "code": "Хорватия",
                    "name": "Хорватия"
                },
                {
                    "code": "Алжир",
                    "name": "Алжир"
                },
                {
                    "code": "Бенин",
                    "name": "Бенин"
                },
                {
                    "code": "Ботсвана",
                    "name": "Ботсвана"
                },
                {
                    "code": "Бразилия",
                    "name": "Бразилия"
                },
                {
                    "code": "Буркина-Фасо",
                    "name": "Буркина-Фасо"
                },
                {
                    "code": "Вануату",
                    "name": "Вануату"
                },
                {
                    "code": "Ватикан",
                    "name": "Ватикан"
                },
                {
                    "code": "Габон",
                    "name": "Габон"
                },
                {
                    "code": "ДР Конго",
                    "name": "ДР Конго"
                },
                {
                    "code": "Замбия",
                    "name": "Замбия"
                },
                {
                    "code": "Камбоджа",
                    "name": "Камбоджа"
                },
                {
                    "code": "Кипр",
                    "name": "Кипр"
                },
                {
                    "code": "Куба",
                    "name": "Куба"
                },
                {
                    "code": "Лихтенштейн",
                    "name": "Лихтенштейн"
                },
                {
                    "code": "Мальдивские Острова",
                    "name": "Мальдивские Острова"
                },
                {
                    "code": "Молдавия",
                    "name": "Молдавия"
                },
                {
                    "code": "Панама",
                    "name": "Панама"
                },
                {
                    "code": "Сан-Томе и Принсипи",
                    "name": "Сан-Томе и Принсипи"
                },
                {
                    "code": "Сейшельские Острова",
                    "name": "Сейшельские Острова"
                },
                {
                    "code": "Сент-Китс и Невис",
                    "name": "Сент-Китс и Невис"
                },
                {
                    "code": "Федеративные Штаты Микронезии",
                    "name": "Федеративные Штаты Микронезии"
                },
                {
                    "code": "ЦАР",
                    "name": "ЦАР"
                },
                {
                    "code": "Эквадор",
                    "name": "Эквадор"
                },
                {
                    "code": "Чили",
                    "name": "Чили"
                },
                {
                    "code": "Бельгия",
                    "name": "Бельгия"
                },
                {
                    "code": "Испания",
                    "name": "Испания"
                },
                {
                    "code": "Финляндия",
                    "name": "Финляндия"
                },
                {
                    "code": "Тайвань",
                    "name": "Тайвань"
                },
                {
                    "code": "Тимор",
                    "name": "Тимор"
                },
                {
                    "code": "Восточный",
                    "name": "Восточный"
                },
                {
                    "code": "Палестина",
                    "name": "Палестина"
                },
                {
                    "code": "Мальдивские Острова,",
                    "name": "Мальдивские Острова,"
                },
                {
                    "code": "Конго",
                    "name": "Конго"
                },
                {
                    "code": "Дубай",
                    "name": "Дубай"
                }
            ]
        }
    ]);

    useEffect(() => {
        if (!selectedCategory) return;
        if (calledRef.current) return;
        calledRef.current = true;

        // getFields();
    }, [selectedCategory]);

    async function getFields() {
        try {
            if (selectedCategory) {
                const res = await apiAxis.post("/products/get-fields-kaspi-product", {
                    categoryCode: selectedCategory.code,
                });

                // setCategoryAttr(res.data.fields);
                // setLoadFields(false);
            }
        } catch (err: any) {

            return console.log(err.response?.data?.message || "Ошибка!");
        }
    }

    function selectChange(data: any) {
        const {code, multiValued, value} = data;

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

    return (
        <div className="create-product-page__form">
            <h4>Категория: <b>{selectedCategory.title}</b></h4>

            <div className="page__form-grid">
                {
                    categoryAttr && categoryAttr.length > 0 ? categoryAttr.filter(item => item.code !== "Furniture*Color").map((item: any, index: number) => {

                        if (item.type === "enum") {
                            return <div className="create-product-page__form-input">
                                <p>Поле {index} {item.mandatory ? <b style={{color: 'red'}}>*</b> : null} {item.multiValued ? '+' : ''}</p>
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
                                            multiValued: item.multiValued
                                        })
                                    }}
                                />
                                {/*<FormControl fullWidth>*/}
                                {/*    <InputLabel variant="standard" htmlFor={item.code}>*/}
                                {/*        {item.code} <b style={{color: 'red'}}>{item.mandatory ? '*' : ''}</b> {item.multiValued ? '+' : ''}*/}
                                {/*    </InputLabel>*/}
                                {/*    <Select*/}
                                {/*        labelId={item.code}*/}
                                {/*        id={item.code}*/}
                                {/*        value={item.selected ? defaultValue(item.selected) : item.values[0]}*/}
                                {/*        label="Age"*/}
                                {/*        onChange={selectChange}*/}
                                {/*    >*/}
                                {/*        {*/}
                                {/*            item.values.length > 0 ? item.values.map((v: any) => {*/}
                                {/*                return  <MenuItem value={JSON.stringify({*/}
                                {/*                    code: item.code,*/}
                                {/*                    value: v,*/}
                                {/*                    multiValued: item.multiValued*/}
                                {/*                })}>{v.name}</MenuItem>*/}
                                {/*            }) : null*/}
                                {/*        }*/}
                                {/*    </Select>*/}

                                {/*</FormControl>*/}
                            </div>
                        }
                        return <>

                        </>
                    }) : null
                }
            </div>
        </div>
    );
}

export default CreateForm;