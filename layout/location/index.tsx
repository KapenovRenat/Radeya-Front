import React from 'react';

function LocationBlock(props: any) {

    return <div className={'location-block'} >
        <div className="container">
            <div className="location-block__contain">
                <div className="loc-popup">
                    <img src="/svg/location.svg" alt="Location" />
                    <p>Астана</p>
                </div>

                <div>

                </div>
            </div>
        </div>
    </div>
}

export default LocationBlock;