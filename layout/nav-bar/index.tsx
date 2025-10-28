import React, {useState} from 'react';
import classNames from "classnames";
import Burger from "@/components/burger";
import Button from "@/components/buttons";
import LogoRedSvg from "@/public/svg/radeya-logo-red.svg";

function NavBar(props: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={classNames('nav-bar')}>
            <div className="container">
                <div className="nav-bar__contain">
                    <div className="nav-bar__logo">
                        <a href="/" rel="noopener"><LogoRedSvg /></a>
                    </div>

                    <div className="nav-bar__menu" onClick={() => setIsOpen(!isOpen)}>
                        <Burger isOpen={isOpen} />
                        <p>Каталог</p>
                    </div>

                    <div className="nav-bar__search">

                    </div>

                    <div className="nav-bar__basket">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;