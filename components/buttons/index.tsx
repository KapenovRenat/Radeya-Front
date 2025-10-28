import React from 'react';
import classNames from 'classnames';

interface TypeButton {
    type?: 'submit' | 'default' | undefined | 'btn-transparent' | 'black-br',
    disabled?: boolean,
    children?: React.ReactNode
}

const Button = (props : TypeButton) => {
    const { type = 'submit', disabled = false, children } = props;

    const classStyle = type === 'submit' ? 'button-submit' : type === 'btn-transparent' ? 'btn-transparent' : type === 'black-br' ? 'btn-black-br' : '';


    return (
        <button disabled={disabled} className={classNames('button', classStyle)}>
            {children}
        </button>
    );
}

export default Button;