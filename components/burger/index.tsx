import React from 'react';

interface Props {
    isOpen: boolean
}

function Burger(props: Props) {
    const {isOpen} = props;

    return (
        <div id="nav-icon3" className={isOpen ? 'open' : ''}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

export default Burger;