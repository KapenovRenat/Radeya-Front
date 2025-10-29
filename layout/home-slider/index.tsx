import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';

interface Props {
    children?: any;
}

export function HomeSlider(props: Props) {
    return (
        <div className="home-slider">
            <Swiper
                modules={[EffectFade]}
                effect="coverflow"
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                autoplay={true}
            >
                <SwiperSlide>
                    <img src="/bg_slide_2.jpg" alt=""/>
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/bg_slide_3.jpg" alt=""/>
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/bg_slide_1.jpg" alt=""/>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}