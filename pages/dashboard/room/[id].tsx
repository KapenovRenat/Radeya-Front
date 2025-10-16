import { useRouter } from 'next/router';
import React from 'react';

function RoomPage(props: any) {
    const router = useRouter();
    const { id } = router.query;

    return(
        <div>
            ROOM {id}
        </div>
    )
}

export default RoomPage;