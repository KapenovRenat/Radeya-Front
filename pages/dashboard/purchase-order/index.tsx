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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';

interface AiItem {
    name: string;
    code: string;
    qty: number;
    deliveryDays: number;
    itemVolume: number;
    totalItemVolume: number;
    profitPct: number;
    comment: string;
}

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

    const [selected, setSelected]   = useState<ISupplier | null>(null);
    const [dateFrom, setDateFrom]   = useState<Dayjs | null>(dayjs().startOf('month'));
    const [dateTo, setDateTo]       = useState<Dayjs | null>(dayjs());
    const [sortKey, setSortKey]     = useState<SortKey>('sellQty');
    const [sortDir, setSortDir]     = useState<SortDir>('desc');
    const [truckVol, setTruckVol]         = useState<number>(35);
    const [forecastDays, setForecastDays] = useState<number>(10);
    const [deliveryDays, setDeliveryDays] = useState<number>(7);
    const [destination, setDestination]   = useState<string>('Астана');
    const [page, setPage]               = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [aiOpen, setAiOpen]             = useState(false);
    const [aiItems, setAiItems]           = useState<AiItem[]>([]);
    const [aiSummary, setAiSummary]       = useState('');
    const [aiTruck, setAiTruck]           = useState<{ totalVolume: number; truckFillPct: number } | null>(null);
    const [aiLoading, setAiLoading]       = useState(false);
    const [aiError, setAiError]           = useState('');
    const [aiPage, setAiPage]             = useState(0);
    const [aiRowsPerPage, setAiRowsPerPage] = useState(20);
    const [additionalPrompt, setAdditionalPrompt] = useState('');

    useEffect(() => {
        if (user) dispatch(fetchSuppliers());
    }, [dispatch, user]);

    async function handleAiAnalysis(isReanalysis = false) {
        setAiError('');
        setAiLoading(true);
        if (!isReanalysis) {
            setAiItems([]);
            setAiSummary('');
            setAiOpen(true);
            setAiPage(0);
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mysklad/ai-purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    items: sortedItems
                    .map(i => ({
                        name: i.name,
                        code: i.code,
                        volume: i.volume ?? 0,
                        salesPerDay: i.salesPerDay,
                        available: i.available,
                        profitPct: i.profitPct,
                        daysLeft: i.salesPerDay > 0 ? +(i.available / i.salesPerDay).toFixed(1) : 9999,
                    }))
                    .filter(i => i.daysLeft < (deliveryDays + forecastDays))
                    .map(({ daysLeft, ...rest }) => rest),
                    params: { truckVol, forecastDays, deliveryDays, destination },
                    editedItems: isReanalysis ? aiItems : undefined,
                    additionalPrompt: additionalPrompt || undefined,
                }),
            });

            const data = await res.json();
            if (data.error) { setAiError(data.error); return; }

            // Сортируем по кол-ву к заказу убыванию
            const sorted = [...(data.items ?? [])].sort((a: AiItem, b: AiItem) => b.qty - a.qty);
            setAiItems(sorted);
            setAiSummary(data.summary ?? '');
            setAiTruck(data.totalVolume != null ? { totalVolume: data.totalVolume, truckFillPct: data.truckFillPct } : null);
            setAiPage(0);
        } catch (e: any) {
            setAiError(e.message);
        } finally {
            setAiLoading(false);
        }
    }

    function handleSearch() {
        setPage(0);
        dispatch(fetchSalesHistory({
            supplierId: selected?.msId,
            dateFrom: dateFrom ? dateFrom.format('YYYY-MM-DD 00:00:00') : undefined,
            dateTo:   dateTo   ? dateTo.format('YYYY-MM-DD 23:59:59')   : undefined,
        }));
    }

    // Сортировка (хуки — до любого return)
    function handleSort(key: SortKey) {
        setPage(0);
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

    const pagedItems = useMemo(
        () => sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [sortedItems, page, rowsPerPage]
    );

    async function handleDownloadExcel() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mysklad/export-excel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ items: aiItems, params: { truckVol, forecastDays, deliveryDays, destination }, aiTruck, aiSummary }),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
        a.href = url;
        a.download = `zakupka_${destination}_${date}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }

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
                    {sortedItems.length > 0 && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleAiAnalysis(false)}
                            disabled={aiLoading}
                            startIcon={aiLoading ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <AutoAwesomeIcon />}
                            sx={{ height: 56, px: 3 }}
                        >
                            AI Анализ
                        </Button>
                    )}
                </Box>

                {/* Параметры расчёта */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>Параметры:</Typography>
                    <TextField
                        label="Объём машины, м³"
                        type="number"
                        value={truckVol}
                        onChange={(e) => setTruckVol(Number(e.target.value))}
                        inputProps={{ min: 1, step: 0.5 }}
                        sx={{ width: 170 }}
                        size="small"
                    />
                    <TextField
                        label="Кол-во дней"
                        type="number"
                        value={forecastDays}
                        onChange={(e) => setForecastDays(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ width: 140 }}
                        size="small"
                    />
                    <TextField
                        label="Срок доставки, дней"
                        type="number"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ width: 180 }}
                        size="small"
                    />
                    <FormControl size="small" sx={{ width: 160 }}>
                        <InputLabel>Куда доставлять</InputLabel>
                        <Select
                            value={destination}
                            label="Куда доставлять"
                            onChange={(e) => setDestination(e.target.value)}
                        >
                            <MenuItem value="Астана">Астана</MenuItem>
                            <MenuItem value="Павлодар">Павлодар</MenuItem>
                        </Select>
                    </FormControl>
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
                    <>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {/* Основное */}
                                    <TableCell sx={{ fontWeight: 700, minWidth: 300 }}>Наименование</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Код</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="center">Объём, м³</TableCell>
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
                                {pagedItems.map((item, idx) => {
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
                                                <Typography variant="body2" sx={{ fontSize: 12 }}>{item.name ?? '—'}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{item.code ?? '—'}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: 12, color: 'text.secondary' }}>{item.volume != null ? item.volume : '—'}</TableCell>
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
                    <TablePagination
                        count={sortedItems.length}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                        rowsPerPageOptions={[10, 20, 30, 50]}
                        labelRowsPerPage="Строк на странице:"
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
                        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                    />
                    </>
                ) : null}
                {/* AI диалог */}
                <Dialog open={aiOpen} onClose={() => setAiOpen(false)} maxWidth="xl" fullWidth>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesomeIcon color="secondary" />
                        AI Список закупки
                        {aiItems.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {aiItems.length} позиций
                            </Typography>
                        )}
                        <IconButton onClick={() => setAiOpen(false)} sx={{ ml: 'auto' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers sx={{ p: 0 }}>
                        {/* Загрузка */}
                        {aiLoading && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
                                <CircularProgress color="secondary" />
                                <Typography color="text.secondary">AI анализирует данные...</Typography>
                            </Box>
                        )}

                        {/* Ошибка */}
                        {aiError && (
                            <Box sx={{ p: 3 }}>
                                <Typography color="error">{aiError}</Typography>
                            </Box>
                        )}

                        {/* Таблица */}
                        {!aiLoading && aiItems.length > 0 && (
                            <>
                                <TableContainer>
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, minWidth: 280 }}>Наименование</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Код</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>Рент-ть</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700, minWidth: 120 }}>Заказать, шт</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700, minWidth: 130 }}>Срок, дней</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>Объём, м³</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Комментарий</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {aiItems
                                                .slice(aiPage * aiRowsPerPage, aiPage * aiRowsPerPage + aiRowsPerPage)
                                                .map((item, idx) => (
                                                    <TableRow key={`${item.code}-${idx}`} hover>
                                                        <TableCell sx={{ fontSize: 12 }}>{item.name}</TableCell>
                                                        <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{item.code}</TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={`${item.profitPct}%`}
                                                                size="small"
                                                                color={item.profitPct >= 30 ? 'success' : item.profitPct >= 0 ? 'warning' : 'error'}
                                                                variant="outlined"
                                                                sx={{ fontSize: 11 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                type="number"
                                                                value={item.qty}
                                                                onChange={(e) => {
                                                                    const globalIdx = aiPage * aiRowsPerPage + idx;
                                                                    const val = Math.max(0, Number(e.target.value));
                                                                    setAiItems(prev => prev.map((it, i) => i === globalIdx ? { ...it, qty: val } : it));
                                                                }}
                                                                inputProps={{ min: 0, style: { textAlign: 'center', padding: '4px 8px' } }}
                                                                size="small"
                                                                sx={{ width: 90 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                type="number"
                                                                value={item.deliveryDays}
                                                                onChange={(e) => {
                                                                    const globalIdx = aiPage * aiRowsPerPage + idx;
                                                                    const val = Math.max(1, Number(e.target.value));
                                                                    setAiItems(prev => prev.map((it, i) => i === globalIdx ? { ...it, deliveryDays: val } : it));
                                                                }}
                                                                inputProps={{ min: 1, style: { textAlign: 'center', padding: '4px 8px' } }}
                                                                size="small"
                                                                sx={{ width: 90 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontSize: 12 }}>
                                                            {item.totalItemVolume > 0 ? item.totalItemVolume.toFixed(3) : '—'}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: 11, color: 'text.secondary', maxWidth: 200 }}>
                                                            {item.comment}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    count={aiItems.length}
                                    page={aiPage}
                                    onPageChange={(_, p) => setAiPage(p)}
                                    rowsPerPage={aiRowsPerPage}
                                    onRowsPerPageChange={(e) => { setAiRowsPerPage(parseInt(e.target.value)); setAiPage(0); }}
                                    rowsPerPageOptions={[10, 20, 30, 50]}
                                    labelRowsPerPage="Строк:"
                                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
                                />

                                {/* Заполненность машины */}
                                {aiTruck && (
                                    <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 3, background: '#f0f4ff' }}>
                                        <Typography variant="body2">🚛 <b>Объём заказа:</b> {aiTruck.totalVolume} м³ из {truckVol} м³</Typography>
                                        <Typography variant="body2">📦 <b>Заполнение машины:</b> {aiTruck.truckFillPct}%</Typography>
                                    </Box>
                                )}

                                {/* Резюме AI */}
                                {aiSummary && (
                                    <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', background: '#fafafa' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Резюме AI</Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{aiSummary}</Typography>
                                    </Box>
                                )}

                                {/* Дополнительный промт */}
                                <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                                        Дополнительные пожелания для повторного анализа
                                    </Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        placeholder="Например: добавь товары с запасом менее 5 дней, исключи товары с рентабельностью ниже 20%..."
                                        value={additionalPrompt}
                                        onChange={(e) => setAdditionalPrompt(e.target.value)}
                                        size="small"
                                    />
                                </Box>
                            </>
                        )}
                    </DialogContent>

                    {!aiLoading && aiItems.length > 0 && (
                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={() => setAiOpen(false)} color="inherit">Закрыть</Button>
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<TableChartIcon />}
                                onClick={handleDownloadExcel}
                            >
                                Скачать Excel
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AutoAwesomeIcon />}
                                onClick={() => handleAiAnalysis(true)}
                            >
                                Повторный анализ
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>

            </div>
        </div>
    );
}

export default PurchaseOrderPage;
