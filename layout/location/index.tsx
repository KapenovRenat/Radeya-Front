import React from 'react';
import LocationSvg from '@/public/svg/location.svg';

function LocationBlock(props: any) {

    return <div className={'location-block'} >
        <div className="container">
            <div className="location-block__contain">
                <div className="loc-popup">
                    <LocationSvg />
                    <p>Астана</p>
                </div>

                <div>

                </div>
            </div>
        </div>
    </div>
}

export default LocationBlock;