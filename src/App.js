import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS (Minimalist & Professional) ---
const RupeeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12M6 8h12M6 13h12M6 18h12M8.5 21l8-18"/></svg>
);
const TargetIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const TrendingUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const SunIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const MoonIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);
const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// --- EXPANDED & MORE REALISTIC SALES DATA ---
const salesData = [
  { client: "Innovate Inc.", product: "QuantumLeap CRM", revenue: 550000, target: 525000, date: "2025-01-15" },
  { client: "Synergy Corp.", product: "DataStream ETL", revenue: 640000, target: 610000, date: "2025-01-22" },
  { client: "Apex Solutions", product: "CloudHive PaaS", revenue: 320000, target: 375000, date: "2025-02-10" },
  { client: "Innovate Inc.", product: "QuantumLeap CRM", revenue: 510000, target: 485000, date: "2025-02-18" },
  { client: "Zenith Group", product: "NexusDB", revenue: 380000, target: 375000, date: "2025-03-05" },
  { client: "Synergy Corp.", product: "CloudHive PaaS", revenue: 240000, target: 260000, date: "2025-03-12" },
  { client: "Apex Solutions", product: "QuantumLeap CRM", revenue: 710000, target: 675000, date: "2025-04-08" },
  { client: "Innovate Inc.", product: "DataStream ETL", revenue: 585000, target: 560000, date: "2025-04-21" },
  { client: "Synergy Corp.", product: "NexusDB", revenue: 420000, target: 450000, date: "2025-05-02" },
  { client: "Zenith Group", product: "QuantumLeap CRM", revenue: 765000, target: 750000, date: "2025-05-18" },
  { client: "Apex Solutions", product: "DataStream ETL", revenue: 665000, target: 660000, date: "2025-06-11" },
  { client: "Innovate Inc.", product: "CloudHive PaaS", revenue: 360000, target: 335000, date: "2025-06-25" },
  { client: "Synergy Corp.", product: "QuantumLeap CRM", revenue: 825000, target: 785000, date: "2025-07-10" },
  { client: "Zenith Group", product: "DataStream ETL", revenue: 690000, target: 675000, date: "2025-07-20" },
];

// --- PROFESSIONAL COLOR PALETTE ---
const COLORS = { primary: '#4f46e5', secondary: '#10b981', accent: '#f59e0b' };
const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, '#3b82f6', '#ec4899'];

// --- UTILITY & FORMATTING FUNCTIONS ---
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
const parseMonth = (dateStr) => new Date(dateStr).toLocaleString("default", { month: "short", year: "2-digit" });

const getPreviousMonth = (monthStr) => {
    const date = new Date(`1 ${monthStr}`);
    date.setMonth(date.getMonth() - 1);
    return parseMonth(date.toISOString());
};

const aggregateData = (data, key, valueKey) => {
    const map = {};
    data.forEach(item => {
        const k = item[key];
        map[k] = (map[k] || 0) + item[valueKey];
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
};

// --- REUSABLE UI COMPONENTS ---

const KpiCard = ({ title, value, icon: Icon, trend }) => (
    <motion.div
        className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
        whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
            <Icon className="text-slate-400 dark:text-slate-500" />
        </div>
        <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
            {trend && (
                 <p className={`text-sm font-medium mt-1 flex items-center ${trend.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value).toFixed(1)}% {trend.label}
                 </p>
            )}
        </div>
    </motion.div>
);

const ChartContainer = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>
        <div className="h-72">{children}</div>
    </div>
);

const DataTable = ({ title, data, headers }) => (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-300 dark:border-slate-600">
                        {headers.map((header) => (
                           <th key={header} className="p-3 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ name, value }) => (
                        <tr key={name} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="p-3 font-normal text-slate-700 dark:text-slate-200">{name}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">{formatCurrency(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const FilterDropdown = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-base font-medium text-slate-600 dark:text-slate-400 mb-2 text-center">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full sm:w-56 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-300 dark:border-slate-600 shadow-lg">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="text-sm">
                        {p.name}: <span className="font-bold">{formatCurrency(p.value)}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- MAIN DASHBOARD COMPONENT ---
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showThemePopup, setShowThemePopup] = useState(true);
  const [selectedClient, setSelectedClient] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // --- DERIVED STATES & FILTER OPTIONS ---
  const clientOptions = useMemo(() => ['All', ...new Set(salesData.map(d => d.client))], []);
  const monthOptions = useMemo(() => ['All', ...new Set(salesData.map(d => parseMonth(d.date)))], []);

  // --- FILTERED DATA (The core of the interactivity) ---
  const filteredData = useMemo(() => {
      return salesData.filter(item => {
          const clientMatch = selectedClient === 'All' || item.client === selectedClient;
          const monthMatch = selectedMonth === 'All' || parseMonth(item.date) === selectedMonth;
          return clientMatch && monthMatch;
      });
  }, [selectedClient, selectedMonth]);

  const clientFilteredData = useMemo(() => {
    return salesData.filter(item => selectedClient === 'All' || item.client === selectedClient);
  }, [selectedClient]);

  const lineChartData = useMemo(() => {
      const monthMap = {};
      clientFilteredData.forEach(({ revenue, target, date }) => {
        const month = parseMonth(date);
        if (!monthMap[month]) monthMap[month] = { revenue: 0, target: 0, name: month };
        monthMap[month].revenue += revenue;
        monthMap[month].target += target;
      });
      return Object.values(monthMap).sort((a,b) => new Date('1 ' + a.name) - new Date('1 ' + b.name));
  }, [clientFilteredData]);

  // --- CALCULATIONS BASED ON FILTERED DATA ---
  const totalRevenue = useMemo(() => filteredData.reduce((sum, r) => sum + r.revenue, 0), [filteredData]);
  const totalTarget = useMemo(() => filteredData.reduce((sum, r) => sum + r.target, 0), [filteredData]);
  const targetAchievement = useMemo(() => (totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0), [totalRevenue, totalTarget]);

  const revenueGrowth = useMemo(() => {
      if (selectedMonth === 'All') {
          if (lineChartData.length < 2) return { value: 0, label: "Insufficient data" };
          const latestMonth = lineChartData[lineChartData.length - 1];
          const previousMonth = lineChartData[lineChartData.length - 2];
          const growth = previousMonth.revenue === 0 ? 0 : ((latestMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
          return { value: growth, label: `vs ${previousMonth.name}` };
      } else {
          const previousMonthName = getPreviousMonth(selectedMonth);
          const selectedMonthRevenue = clientFilteredData.filter(d => parseMonth(d.date) === selectedMonth).reduce((sum, i) => sum + i.revenue, 0);
          const previousMonthRevenue = clientFilteredData.filter(d => parseMonth(d.date) === previousMonthName).reduce((sum, i) => sum + i.revenue, 0);
          if (previousMonthRevenue === 0) return { value: selectedMonthRevenue > 0 ? 100 : 0, label: `vs ${previousMonthName}` };
          const growth = ((selectedMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
          return { value: growth, label: `vs ${previousMonthName}` };
      }
  }, [selectedMonth, clientFilteredData, lineChartData]);
  
  const topProducts = useMemo(() => aggregateData(filteredData, "product", "revenue").sort((a, b) => b.value - a.value).slice(0, 5), [filteredData]);
  const topCustomers = useMemo(() => aggregateData(filteredData, "client", "revenue").sort((a, b) => b.value - a.value).slice(0, 5), [filteredData]);
  const productShare = useMemo(() => aggregateData(filteredData, "product", "revenue"), [filteredData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* === Header & Filters === */}
        <header className="mb-8 relative bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-md">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">Sales And Revenue Dashboard</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2">Monthly Sales Performance Overview</p>
            </div>
            <button
                onClick={() => setIsDark(!isDark)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                aria-label="Toggle dark mode"
            >
                {isDark ? <SunIcon/> : <MoonIcon/>}
            </button>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <FilterDropdown label="Filter by Client" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} options={clientOptions} />
                <FilterDropdown label="Filter by Month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} options={monthOptions} />
            </div>
        </header>

        {/* === KPIs Section === */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard title={`Revenue ${selectedMonth !== 'All' ? `(${selectedMonth})` : ''}`} value={formatCurrency(totalRevenue)} icon={RupeeIcon} trend={revenueGrowth}/>
            <KpiCard title={`Target ${selectedMonth !== 'All' ? `(${selectedMonth})` : ''}`} value={`${targetAchievement.toFixed(1)}%`} icon={TargetIcon}/>
            <KpiCard title={`Growth ${selectedMonth !== 'All' ? `(${selectedMonth})` : ''}`} value={`${revenueGrowth.value.toFixed(1)}%`} icon={TrendingUpIcon}/>
        </section>

        {/* === Charts Section === */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3">
                <ChartContainer title="Monthly Performance">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                            <XAxis dataKey="name" tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue"/>
                            <Line type="monotone" dataKey="target" stroke={COLORS.secondary} strokeWidth={2} strokeDasharray="5 5" name="Target"/>
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
            <div className="lg:col-span-2">
                 <ChartContainer title="Revenue by Product">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={productShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                                {productShare.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                             <Legend wrapperStyle={{fontSize: "12px"}} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </section>

        {/* === Tables Section === */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataTable title="Top Products" data={topProducts} headers={['Product', 'Revenue']} />
            <DataTable title="Top Customers" data={topCustomers} headers={['Customer', 'Revenue']} />
        </section>
      </main>
      
      {/* === Theme Info Popup === */}
      <AnimatePresence>
        {showThemePopup && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="fixed bottom-5 right-5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg shadow-xl p-4 flex items-center space-x-3 border border-slate-200 dark:border-slate-700"
            >
                <SunIcon className="w-6 h-6 text-amber-500"/>
                <p className="text-sm font-medium">Light theme is available!</p>
                <button 
                    onClick={() => setShowThemePopup(false)} 
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Dismiss"
                >
                    <XIcon className="w-4 h-4"/>
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

