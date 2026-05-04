import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchMe, loginUser } from '@/store/reducers/auth';
import { AppDispatch, RootState } from '@/store';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Auth: NextPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(fetchMe())
            .unwrap()
            .then(() => router.push('/dashboard'))
            .catch(() => {});
    }, [dispatch, router]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = await dispatch(loginUser({ login, password }));
        if (loginUser.fulfilled.match(result)) {
            router.push('/dashboard');
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: 5,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                        Radeya
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                        Войдите в свой аккаунт
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        fullWidth
                        autoComplete="username"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
                        }}
                    />

                    <TextField
                        label="Пароль"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((v) => !v)}
                                        edge="end"
                                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 1,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd6, #6a3d9a)',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Войти'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Auth;
