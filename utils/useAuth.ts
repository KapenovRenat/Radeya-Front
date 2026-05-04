import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AppDispatch, RootState } from '@/store';
import { fetchMe } from '@/store/reducers/auth';

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchMe())
            .unwrap()
            .catch(() => {
                router.push('/auth');
            });
    }, [dispatch, router]);

    return { user, loading };
}
