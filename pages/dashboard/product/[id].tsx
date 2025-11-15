import { useRouter } from 'next/router';
import React, {useEffect} from 'react';

function ProductEdit(props: any) {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {

    }, []);

    return(
        <div>
            Product {id}
        </div>
    )
}

export default ProductEdit;