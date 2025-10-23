import React from 'react';

interface Props {
    children: React.ReactNode;
}

function ModalBox(props: Props) {
    const {children} = props;

    return (
        <div className="modal-box">
            {children}
        </div>
    );
}

export default ModalBox;