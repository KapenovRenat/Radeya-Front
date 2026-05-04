import '../styles/global.scss';
import 'swiper/css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <Component {...pageProps} />
            </LocalizationProvider>
        </Provider>
    );
}

export default MyApp;
