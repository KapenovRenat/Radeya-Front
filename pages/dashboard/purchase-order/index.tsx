import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchSuppliers, syncSuppliers } from '@/store/reducers/suppliers';
import { fetchSalesHistory } from '@/store/reducers/salesHistory';
import { ISupplier } from '@/types/suppliers';
import { useAuth } from '@/utils/useAuth';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';

type SortKey = 'sellQty' | 'available' | 'daysLeft' | 'profit' | 'profitPct' | 'salesPerDay';
type SortDir = 'asc' | 'desc';

const fmt = (val: number | null) =>
    val != null ? val.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ₸' : '—';

const fmtNum = (val: number) => val.toLocaleString('ru-RU');

function PurchaseOrderPage() {
    const { user, loading: authLoading } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const { items: suppliers, loading: suppliersLoading, syncing } = useSelector((state: RootState) => state.suppliers);
    const { items, total, loading, error } = useSelector((state: RootState) => state.salesHistory);

    const [selected, setSelected] = useState<ISupplier | null>(null);
    const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs().startOf('month'));
    const [dateTo, setDateTo]     = useState<Dayjs | null>(dayjs());
    const [sortKey, setSortKey]   = useState<SortKey>('sellQty');
    const [sortDir, setSortDir]   = useState<SortDir>('desc');

    useEffect(() => {
        if (user) dispatch(fetchSuppliers());
    }, [dispatch, user]);

    function handleSearch() {
        dispatch(fetchSalesHistory({
            supplierId: selected?.msId,
            dateFrom: dateFrom ? dateFrom.format('YYYY-MM-DD 00:00:00') : undefined,
            dateTo:   dateTo   ? dateTo.format('YYYY-MM-DD 23:59:59')   : undefined,
        }));
    }

    // Сортировка (хуки — до любого return)
    function handleSort(key: SortKey) {
        if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    }

    const sortedItems = useMemo(() => {
        return [...items].map(item => ({
            ...item,
            daysLeft: item.salesPerDay > 0 ? +(item.available / item.salesPerDay).toFixed(1) : 9999,
        })).sort((a, b) => {
            const av = (a as any)[sortKey];
            const bv = (b as any)[sortKey];
            return sortDir === 'asc' ? av - bv : bv - av;
        });
    }, [items, sortKey, sortDir]);

    if (authLoading || !user) return <CircularProgress sx={{ m: 4 }} />;

    // Итоги
    const totalSellSum   = items.reduce((a, i) => a + i.sellSum,  0);
    const totalCostSum   = items.reduce((a, i) => a + i.costSum,  0);
    const totalProfit    = items.reduce((a, i) => a + i.profit,   0);
    const totalProfitPct = totalCostSum > 0 ? +((totalProfit / totalCostSum) * 100).toFixed(2) : 0;

    return (
        <div className="container">
            <div className="dashboard">
                <Typography variant="h4" fontWeight={700} mb={3}>История продаж</Typography>

                {/* Фильтры */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                    <Autocomplete
                        sx={{ width: 300 }}
                        options={suppliers}
                        getOptionLabel={(o) => o.name}
                        value={selected}
                        onChange={(_, value) => setSelected(value)}
                        loading={suppliersLoading}
                        noOptionsText="Поставщики не найдены"
                        isOptionEqualToValue={(o, v) => o._id === v._id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Поставщик"
                                placeholder="Все поставщики"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {suppliersLoading && <CircularProgress size={18} />}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Tooltip title="Обновить список из МойСклад">
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => dispatch(syncSuppliers())}
                                disabled={syncing}
                                sx={{ minWidth: 44, height: 56, px: 1.5 }}
                            >
                                {syncing ? <CircularProgress size={20} /> : <SyncIcon />}
                            </Button>
                        </span>
                    </Tooltip>

                    <DatePicker
                        label="От"
                        value={dateFrom}
                        onChange={(v) => setDateFrom(v)}
                        maxDate={dateTo ?? undefined}
                        slotProps={{ textField: { sx: { width: 170 } } }}
                    />
                    <DatePicker
                        label="До"
                        value={dateTo}
                        onChange={(v) => setDateTo(v)}
                        minDate={dateFrom ?? undefined}
                        maxDate={dayjs()}
                        slotProps={{ textField: { sx: { width: 170 } } }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <SearchIcon />}
                        sx={{ height: 56, px: 3 }}
                    >
                        Показать
                    </Button>
                </Box>

                {error && <Typography color="error" mb={2}>{error}</Typography>}

                {/* Итоги */}
                {items.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Товаров',       value: total },
                            { label: 'Сумма продаж',  value: fmt(totalSellSum) },
                            { label: 'Себестоимость', value: fmt(totalCostSum) },
                            { label: 'Прибыль',       value: fmt(totalProfit) },
                            { label: 'Рентабельность',value: `${totalProfitPct}%` },
                        ].map(({ label, value }) => (
                            <Paper key={label} variant="outlined" sx={{ px: 2.5, py: 1.5, borderRadius: 2, minWidth: 140 }}>
                                <Typography variant="caption" color="text.secondary">{label}</Typography>
                                <Typography variant="subtitle1" fontWeight={700}>{value}</Typography>
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* Таблица */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : items.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {/* Основное */}
                                    <TableCell sx={{ fontWeight: 700, minWidth: 300 }}>Наименование</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Код</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="center">Кол-во</TableCell>

                                    {/* История продаж */}
                                    <TableCell colSpan={4} align="center" sx={{ fontWeight: 700, borderLeft: '2px solid', borderColor: 'divider', background: '#f5f5f5' }}>
                                        История продаж
                                    </TableCell>

                                    {/* Текущий остаток */}
                                    <TableCell colSpan={6} align="center" sx={{ fontWeight: 700, borderLeft: '2px solid', borderColor: 'divider', background: '#f0f4ff' }}>
                                        Текущий остаток
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell sx={{ background: '#fafafa' }}>
                                        <TableSortLabel active={sortKey === 'sellQty'} direction={sortKey === 'sellQty' ? sortDir : 'desc'} onClick={() => handleSort('sellQty')} sx={{ fontSize: 12, fontWeight: 600 }}>
                                            Кол-во
                                        </TableSortLabel>
                                    </TableCell>

                                    {/* История продаж подзаголовки */}
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12, borderLeft: '2px solid', borderColor: 'divider', background: '#f5f5f5' }}>Сумма</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12, background: '#f5f5f5' }}>Себестоимость</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12, background: '#f5f5f5' }}>
                                        <TableSortLabel active={sortKey === 'profit'} direction={sortKey === 'profit' ? sortDir : 'desc'} onClick={() => handleSort('profit')} sx={{ fontSize: 12, fontWeight: 600 }}>
                                            Прибыль
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, background: '#f5f5f5' }}>
                                        <TableSortLabel active={sortKey === 'profitPct'} direction={sortKey === 'profitPct' ? sortDir : 'desc'} onClick={() => handleSort('profitPct')} sx={{ fontSize: 12, fontWeight: 600 }}>
                                            Рент-ть
                                        </TableSortLabel>
                                    </TableCell>

                                    {/* Текущий остаток подзаголовки */}
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, borderLeft: '2px solid', borderColor: 'divider', background: '#f0f4ff' }}>
                                        <TableSortLabel active={sortKey === 'salesPerDay'} direction={sortKey === 'salesPerDay' ? sortDir : 'desc'} onClick={() => handleSort('salesPerDay')} sx={{ fontSize: 12, fontWeight: 600 }}>
                                            Прод/день
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, background: '#f0f4ff' }}>Остаток</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, background: '#f0f4ff' }}>Резерв</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, background: '#f0f4ff' }}>Ожидание</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, background: '#f0f4ff' }}>
                                        <TableSortLabel active={sortKey === 'available'} direction={sortKey === 'available' ? sortDir : 'asc'} onClick={() => handleSort('available')} sx={{ fontSize: 12, fontWeight: 600 }}>
                                            Доступно
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, background: '#e8f5e9' }}>
                                        <Tooltip title="Дней при текущей скорости продаж">
                                            <TableSortLabel active={sortKey === 'daysLeft'} direction={sortKey === 'daysLeft' ? sortDir : 'asc'} onClick={() => handleSort('daysLeft')} sx={{ fontSize: 12, fontWeight: 600 }}>
                                                Дней
                                            </TableSortLabel>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {sortedItems.map((item, idx) => {
                                    const daysLeft    = item.salesPerDay > 0 ? +(item.available / item.salesPerDay).toFixed(1) : null;
                                    const profitColor = item.profit >= 0 ? 'success.main' : 'error.main';
                                    const availColor  = item.available <= 0 ? 'error.main' : item.available <= 3 ? 'warning.main' : 'inherit';
                                    const daysColor   = daysLeft === null ? 'text.secondary'
                                        : daysLeft <= 7  ? 'error.main'
                                        : daysLeft <= 14 ? 'warning.main'
                                        : daysLeft <= 30 ? 'text.primary'
                                        : 'success.main';

                                    return (
                                        <TableRow key={item.productId ?? idx} hover sx={{ '&:last-child td': { border: 0 } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {item.imageUrl && (
                                                        <Box
                                                            component="img"
                                                            src={item.imageUrl}
                                                            alt=""
                                                            sx={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                                                        />
                                                    )}
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>{item.name ?? '—'}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{item.code ?? '—'}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>{fmtNum(item.sellQty)}</TableCell>

                                            {/* История продаж */}
                                            <TableCell align="right" sx={{ borderLeft: '2px solid', borderColor: 'divider', fontSize: 12 }}>{fmt(item.sellSum)}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 12, color: 'text.secondary' }}>{fmt(item.costSum)}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 12, color: profitColor, fontWeight: 600 }}>{fmt(item.profit)}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={`${item.profitPct}%`}
                                                    size="small"
                                                    color={item.profitPct >= 30 ? 'success' : item.profitPct >= 0 ? 'warning' : 'error'}
                                                    variant="outlined"
                                                    sx={{ fontSize: 11 }}
                                                />
                                            </TableCell>

                                            {/* Текущий остаток */}
                                            <TableCell align="center" sx={{ borderLeft: '2px solid', borderColor: 'divider', fontSize: 12 }}>{item.salesPerDay}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: 12 }}>{fmtNum(item.stockQty)}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: 12 }}>{fmtNum(item.reserve)}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: 12 }}>{fmtNum(item.inTransit)}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: 12, color: availColor, fontWeight: 600 }}>{fmtNum(item.available)}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: 12, fontWeight: 700, color: daysColor, background: '#f1f8f1' }}>
                                                {daysLeft !== null ? daysLeft : '∞'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : null}
            </div>
        </div>
    );
}

export default PurchaseOrderPage;
