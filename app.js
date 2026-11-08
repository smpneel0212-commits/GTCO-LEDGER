/**
 * GTCO-LEDGER - Commodity Trader Advance & Bill Settlement Platform
 * Official APMC Mandi pulse merchant ledger for Gururaj Trading Company (GTCO).
 * Initialized with 100% authentic records extracted from the ledger workbook:
 * - 189 Farmer Accounts
 * - 1,432 Advances (Cash, Seeds, Fertilizer, DAP, Cutting Machine, Old Lekka)
 * - 151 Commodity Produce Bills & Harvest Settlement Pattis (Tur, Moong, Chana, Urad)
 * - 874 Mandi Daybook & Operational Expenses (Hamali, Transport, Maintenance, Rent)
 */

// ==========================================
// CONSTANTS & STORE CONFIGURATION
// ==========================================

const STORAGE_KEY = 'GTCO_LEDGER_DATA_V4';
const PAISABHAI_STORAGE_KEY = 'paisabhai_ledger_store_v3';
const STOCK_TRACKER_STORAGE_KEY = 'gtco_stock_tracker_v3';

const COMMODITIES = [
  { id: 'tur', name: 'Tur (Pigeon Pea)', badgeClass: 'commodity-tur', icon: 'wheat' },
  { id: 'moong', name: 'Moong (Green Gram)', badgeClass: 'commodity-moong', icon: 'sprout' },
  { id: 'chana', name: 'Chana (Chickpea)', badgeClass: 'commodity-chana', icon: 'circle-dot' },
  { id: 'urad', name: 'Urad (Black Gram)', badgeClass: 'commodity-urad', icon: 'box' },
  { id: 'general', name: 'General Harvest Patti', badgeClass: 'commodity-custom', icon: 'package' }
];

const ADVANCE_PURPOSES = [
  'Cultivation',
  'Seeds',
  'Fertilizer & Pesticide',
  'Harvesting',
  'Old Balance / Lekka',
  'Loan',
  'Personal Use',
  'Other'
];

// ==========================================
// APPLICATION STATE
// ==========================================

let state = {
  farmers: [],
  advances: [],
  bills: [],
  expenses: [],
  customCommodities: [],
  activeTab: 'dashboard',
  selectedYear: 'all', // 'all', '2026', '2025', '2024', '2023'
  pagination: {
    advancePage: 1,
    advancePerPage: 50,
    billPage: 1,
    billPerPage: 50,
    farmerPage: 1,
    farmerPerPage: 24,
    expensePage: 1,
    expensePerPage: 50
  },
  filters: {
    advanceFarmer: 'all',
    advancePurpose: 'all',
    advanceStatus: 'all',
    advanceSearch: '',
    billFarmer: 'all',
    billCommodity: 'all',
    billSearch: '',
    farmerSearch: '',
    expenseCategory: 'all',
    expenseSearch: ''
  }
};

let activeBillDeductions = {};

// ==========================================
// FORMATTING UTILITIES
// ==========================================

function formatINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// ==========================================
// STORE LOADING & INITIALIZATION
// ==========================================

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.farmers = parsed.farmers || [];
      state.advances = parsed.advances || [];
      state.bills = parsed.bills || [];
      state.expenses = parsed.expenses || [];
      state.customCommodities = parsed.customCommodities || [];
    } else {
      // First run or migrated to V4: Load directly from Master Data (ledger-data.js)
      if (typeof GTCO_MASTER_DATA !== 'undefined') {
        state.farmers = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.farmers || []));
        state.advances = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.advances || []));
        state.bills = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.bills || []));
        state.expenses = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.expenses || []));
      }
      state.customCommodities = [];
      saveState();
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    if (typeof GTCO_MASTER_DATA !== 'undefined') {
      state.farmers = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.farmers || []));
      state.advances = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.advances || []));
      state.bills = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.bills || []));
      state.expenses = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.expenses || []));
    }
  }

  updateSyncStatusBadge();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      farmers: state.farmers,
      advances: state.advances,
      bills: state.bills,
      expenses: state.expenses,
      customCommodities: state.customCommodities
    }));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

function resetToMasterData() {
  if (confirm('Are you sure you want to reload all original records from the uploaded Excel file? Any manual changes made in this session will be restored to the clean dataset.')) {
    if (typeof GTCO_MASTER_DATA !== 'undefined') {
      state.farmers = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.farmers || []));
      state.advances = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.advances || []));
      state.bills = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.bills || []));
      state.expenses = JSON.parse(JSON.stringify(GTCO_MASTER_DATA.expenses || []));
      saveState();
      renderActiveView();
      showToast(`Master file restored: ${state.farmers.length} farmers, ${state.advances.length} advances, ${state.bills.length} bills loaded!`);
    } else {
      alert('Master data not available.');
    }
  }
}

function updateSyncStatusBadge() {
  const badge = document.getElementById('sync-status-badge');
  if (!badge) return;

  const hasPaisabhai = !!localStorage.getItem(PAISABHAI_STORAGE_KEY);
  const hasStock = !!localStorage.getItem(STOCK_TRACKER_STORAGE_KEY);

  if (hasPaisabhai && hasStock) {
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200';
    badge.innerHTML = '● Live Synced: Paisabhai + Stock Tracker';
  } else if (hasPaisabhai) {
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200';
    badge.innerHTML = '● Live Synced: Paisabhai Active';
  } else {
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200';
    badge.innerHTML = '● Master Excel Data Loaded';
  }
}

// ==========================================
// BUSINESS LOGIC & HELPERS
// ==========================================

function getAllCommodities() {
  const list = [...COMMODITIES];
  state.customCommodities.forEach(c => {
    if (!list.some(x => x.name.toLowerCase() === c.toLowerCase())) {
      list.push({
        id: 'custom-' + c.toLowerCase().replace(/\s+/g, '-'),
        name: c,
        badgeClass: 'commodity-custom',
        icon: 'package'
      });
    }
  });
  return list;
}

function getFarmerById(id) {
  if (!id) return null;
  return state.farmers.find(f => f.id === id || f.name.toLowerCase() === id.toLowerCase());
}

function getFarmerMetrics(farmerId) {
  const advances = state.advances.filter(a => a.farmerId === farmerId);
  const bills = state.bills.filter(b => b.farmerId === farmerId);

  const totalAdvances = advances.reduce((acc, a) => acc + (Number(a.originalAmount) || 0), 0);
  const totalDeducted = advances.reduce((acc, a) => acc + (Number(a.deductedAmount) || 0), 0);
  const remainingAdvanceBalance = advances.reduce((acc, a) => acc + (Number(a.unpaidBalance) || 0), 0);
  const totalBillsValue = bills.reduce((acc, b) => acc + (Number(b.grossAmount) || 0), 0);
  const totalNetCashPaid = bills.reduce((acc, b) => acc + (Number(b.netPayableCash) || 0), 0);

  const seedsAdvances = advances.filter(a => a.purpose === 'Seeds');
  const totalSeedsValue = seedsAdvances.reduce((acc, a) => acc + (Number(a.originalAmount) || 0), 0);

  return {
    totalAdvances,
    totalDeducted,
    remainingAdvanceBalance,
    totalBillsValue,
    totalNetCashPaid,
    totalSeedsValue,
    advancesCount: advances.length,
    billsCount: bills.length,
    unpaidAdvancesCount: advances.filter(a => a.status !== 'PAID').length
  };
}

function getGlobalMetrics() {
  let advList = state.advances;
  let billList = state.bills;
  let expList = state.expenses;

  if (state.selectedYear !== 'all') {
    advList = advList.filter(a => String(a.year) === String(state.selectedYear));
    billList = billList.filter(b => String(b.year) === String(state.selectedYear));
    expList = expList.filter(e => String(e.year) === String(state.selectedYear));
  }

  const totalAdvancesGiven = advList.reduce((acc, a) => acc + (Number(a.originalAmount) || 0), 0);
  const totalAdvancesDeducted = advList.reduce((acc, a) => acc + (Number(a.deductedAmount) || 0), 0);
  const totalOutstandingBalance = advList.reduce((acc, a) => acc + (Number(a.unpaidBalance) || 0), 0);
  const totalGrossBills = billList.reduce((acc, b) => acc + (Number(b.grossAmount) || 0), 0);
  const totalNetCashPaid = billList.reduce((acc, b) => acc + (Number(b.netPayableCash) || 0), 0);
  const totalExpenses = expList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  return {
    totalAdvancesGiven,
    totalAdvancesDeducted,
    totalOutstandingBalance,
    totalGrossBills,
    totalNetCashPaid,
    totalExpenses,
    farmersCount: state.farmers.length,
    advancesCount: advList.length,
    billsCount: billList.length,
    expensesCount: expList.length
  };
}

function getNextBillNumber() {
  const currentYearSuffix = new Date().getFullYear().toString().slice(-2);
  const count = state.bills.length + 1;
  return `BILL-${currentYearSuffix}-${String(count).padStart(4, '0')}`;
}

function getNextAdvanceNumber() {
  const currentYearSuffix = new Date().getFullYear().toString().slice(-2);
  const count = state.advances.length + 1;
  return `ADV-${currentYearSuffix}-${String(count).padStart(4, '0')}`;
}

function updateAdvanceStatus(advance) {
  const orig = Number(advance.originalAmount) || 0;
  const ded = Number(advance.deductedAmount) || 0;
  const bal = Math.max(0, orig - ded);

  advance.unpaidBalance = bal;
  if (bal === 0 && orig > 0) {
    advance.status = 'PAID';
  } else if (ded > 0 && bal > 0) {
    advance.status = 'PARTIALLY PAID';
  } else {
    advance.status = 'UNPAID';
  }
}

// Modal controllers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Tab navigation
function setTab(tabName) {
  state.activeTab = tabName;

  ['dashboard', 'advances', 'bills', 'farmers', 'expenses'].forEach(t => {
    const btn = document.getElementById(`nav-${t}`);
    const view = document.getElementById(`view-${t}`);
    if (btn && view) {
      if (t === tabName) {
        btn.classList.add('bg-emerald-700', 'text-white', 'shadow-sm');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
        view.classList.remove('hidden');
      } else {
        btn.classList.remove('bg-emerald-700', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
        view.classList.add('hidden');
      }
    }
  });

  renderActiveView();
}

function onGlobalYearChanged(yearVal) {
  state.selectedYear = yearVal;
  state.pagination.advancePage = 1;
  state.pagination.billPage = 1;
  state.pagination.expensePage = 1;
  renderActiveView();
  showToast(`Filtered for: ${yearVal === 'all' ? 'All Financial Years' : 'Year ' + yearVal}`);
}

function renderActiveView() {
  if (state.activeTab === 'dashboard') renderDashboard();
  else if (state.activeTab === 'advances') renderAdvancesLedger();
  else if (state.activeTab === 'bills') renderBillsLedger();
  else if (state.activeTab === 'farmers') renderFarmersDirectory();
  else if (state.activeTab === 'expenses') renderExpensesLedger();

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// 1. DASHBOARD VIEW
// ==========================================

function renderDashboard() {
  const m = getGlobalMetrics();

  const elAdv = document.getElementById('dash-total-advances'); if (elAdv) elAdv.innerText = formatINR(m.totalAdvancesGiven);
  const elDed = document.getElementById('dash-total-deducted'); if (elDed) elDed.innerText = formatINR(m.totalAdvancesDeducted);
  const elBal = document.getElementById('dash-remaining-balance'); if (elBal) elBal.innerText = formatINR(m.totalOutstandingBalance);
  const elBills = document.getElementById('dash-total-bills'); if (elBills) elBills.innerText = formatINR(m.totalGrossBills);
  const elNet = document.getElementById('dash-net-cash-paid'); if (elNet) elNet.innerText = formatINR(m.totalNetCashPaid);

  const elFarmCount = document.getElementById('dash-farmers-count'); if (elFarmCount) elFarmCount.innerText = m.farmersCount;
  const elAdvCount = document.getElementById('dash-advances-count'); if (elAdvCount) elAdvCount.innerText = m.advancesCount;
  const elBillCount = document.getElementById('dash-bills-count'); if (elBillCount) elBillCount.innerText = m.billsCount;

  // Filtered advances for breakdown
  let advList = state.advances;
  let billList = state.bills;
  if (state.selectedYear !== 'all') {
    advList = advList.filter(a => String(a.year) === String(state.selectedYear));
    billList = billList.filter(b => String(b.year) === String(state.selectedYear));
  }

  // Advances by Purpose Breakdown
  const purposeContainer = document.getElementById('dash-purpose-breakdown');
  if (purposeContainer) {
    const purposeTotals = {};
    advList.forEach(a => {
      const p = a.purpose || 'Cultivation';
      purposeTotals[p] = (purposeTotals[p] || 0) + (Number(a.originalAmount) || 0);
    });

    purposeContainer.innerHTML = Object.entries(purposeTotals).map(([p, amt]) => {
      const pIcon = p === 'Seeds' ? '🌱' : (p === 'Fertilizer & Pesticide' ? '🧪' : (p === 'Old Balance / Lekka' ? '📜' : '🌾'));
      const pct = m.totalAdvancesGiven > 0 ? ((amt / m.totalAdvancesGiven) * 100).toFixed(0) : 0;
      return `
        <div class="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
          <div class="flex items-center space-x-2">
            <span>${pIcon}</span>
            <span class="font-semibold text-slate-800">${p}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold text-slate-900">${formatINR(amt)}</span>
            <span class="text-[10px] text-slate-400 font-mono">(${pct}%)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Commodity Breakdown
  const commContainer = document.getElementById('dash-commodity-breakdown');
  if (commContainer) {
    const commoditySales = {};
    billList.forEach(b => {
      const comm = b.commodity || 'General Harvest Patti';
      commoditySales[comm] = (commoditySales[comm] || 0) + (Number(b.grossAmount) || 0);
    });

    const entries = Object.entries(commoditySales);
    if (entries.length === 0) {
      commContainer.innerHTML = `
        <div class="col-span-full py-4 text-center text-slate-400 text-xs italic">
          No commodity bills recorded for selected period.
        </div>`;
    } else {
      commContainer.innerHTML = entries.map(([name, amount]) => {
        const commObj = getAllCommodities().find(c => c.name.toLowerCase() === name.toLowerCase()) || { badgeClass: 'commodity-custom' };
        return `
          <div class="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full ${commObj.badgeClass}">${name}</span>
            <div class="text-sm font-bold text-slate-800 font-mono mt-1">${formatINR(amount)}</div>
          </div>
        `;
      }).join('');
    }
  }

  // Recent Advances list
  const recentAdvContainer = document.getElementById('dash-recent-advances');
  if (recentAdvContainer) {
    const recentAdv = [...advList].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    if (recentAdv.length === 0) {
      recentAdvContainer.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs italic">No advances recorded.</div>`;
    } else {
      recentAdvContainer.innerHTML = recentAdv.map(a => `
        <div class="flex items-center justify-between p-3 hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono font-semibold text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">${a.advanceNumber}</span>
              <span class="font-medium text-sm text-slate-800">${a.farmerName}</span>
              <span class="text-xs font-semibold ${a.purpose === 'Seeds' ? 'text-emerald-700' : 'text-slate-500'}">(${a.purpose === 'Seeds' ? '🌱 Seeds' : a.purpose})</span>
            </div>
            <div class="text-xs text-slate-400 mt-0.5">${formatDate(a.date)} • <span class="font-mono text-slate-500">${a.sourceSheet || 'Ledger'}</span></div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-sm text-slate-800">${formatINR(a.originalAmount)}</div>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(a.status)}">${a.status}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Recent Bills list
  const recentBillsContainer = document.getElementById('dash-recent-bills');
  if (recentBillsContainer) {
    const recentBills = [...billList].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    if (recentBills.length === 0) {
      recentBillsContainer.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs italic">No bills recorded.</div>`;
    } else {
      recentBillsContainer.innerHTML = recentBills.map(b => `
        <div class="flex items-center justify-between p-3 hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono font-semibold text-xs text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">${b.billNumber}</span>
              <span class="font-medium text-sm text-slate-800">${b.farmerName}</span>
            </div>
            <div class="text-xs text-slate-500 mt-0.5">${b.commodity} • ${formatDate(b.date)}</div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-sm text-slate-800">${formatINR(b.grossAmount)}</div>
            <div class="text-[11px] text-amber-700 font-mono">Deducted: ${formatINR(b.totalAdvancesDeducted)}</div>
          </div>
        </div>
      `).join('');
    }
  }
}

function getStatusBadgeClass(status) {
  if (status === 'PAID') return 'badge-paid';
  if (status === 'PARTIALLY PAID') return 'badge-partially-paid';
  return 'badge-unpaid';
}

function getPurposeBadgeClass(purpose) {
  if (purpose === 'Seeds') return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (purpose === 'Fertilizer & Pesticide') return 'bg-blue-50 text-blue-800 border-blue-300';
  if (purpose === 'Harvesting') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (purpose === 'Old Balance / Lekka') return 'bg-purple-50 text-purple-800 border-purple-300';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

function renderPaginationControls(totalItems, currentPage, perPage, changeFnName) {
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return `
    <div class="flex items-center space-x-2 text-xs text-slate-500">
      <span>Showing <strong class="text-slate-800">${start}-${end}</strong> of <strong class="text-slate-800">${totalItems}</strong> records</span>
    </div>
    <div class="flex items-center space-x-1">
      <button onclick="${changeFnName}(1)" ${currentPage <= 1 ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="hover:bg-slate-200"'} class="px-2 py-1 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700" title="First Page">
        «
      </button>
      <button onclick="${changeFnName}(${currentPage - 1})" ${currentPage <= 1 ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="hover:bg-slate-200"'} class="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700">
        Prev
      </button>
      <span class="px-2.5 py-1 text-xs font-mono font-bold text-slate-800 bg-slate-100 rounded border border-slate-200">
        ${currentPage} / ${totalPages}
      </span>
      <button onclick="${changeFnName}(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="hover:bg-slate-200"'} class="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700">
        Next
      </button>
      <button onclick="${changeFnName}(${totalPages})" ${currentPage >= totalPages ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="hover:bg-slate-200"'} class="px-2 py-1 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700" title="Last Page">
        »
      </button>
    </div>
  `;
}

// ==========================================
// 2. ADVANCES LEDGER VIEW
// ==========================================

function onAdvancePageChanged(newPage) {
  state.pagination.advancePage = Math.max(1, newPage);
  renderAdvancesLedger();
}

function renderAdvancesLedger() {
  populateFarmerDropdown('filter-advance-farmer', state.filters.advanceFarmer, true);

  const container = document.getElementById('advances-table-body');
  if (!container) return;

  let list = [...state.advances];

  // Year Filter
  if (state.selectedYear !== 'all') {
    list = list.filter(a => String(a.year) === String(state.selectedYear));
  }

  // Filters
  if (state.filters.advanceFarmer !== 'all') {
    list = list.filter(a => a.farmerId === state.filters.advanceFarmer || a.farmerName.toLowerCase() === state.filters.advanceFarmer.toLowerCase());
  }
  if (state.filters.advancePurpose !== 'all') {
    list = list.filter(a => a.purpose === state.filters.advancePurpose);
  }
  if (state.filters.advanceStatus !== 'all') {
    list = list.filter(a => a.status === state.filters.advanceStatus);
  }
  if (state.filters.advanceSearch) {
    const s = state.filters.advanceSearch.toLowerCase();
    list = list.filter(a =>
      a.advanceNumber.toLowerCase().includes(s) ||
      a.farmerName.toLowerCase().includes(s) ||
      (a.purpose && a.purpose.toLowerCase().includes(s)) ||
      (a.notes && a.notes.toLowerCase().includes(s))
    );
  }

  // Sort: newest date first
  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalItems = list.length;
  const page = state.pagination.advancePage;
  const perPage = state.pagination.advancePerPage;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  if (page > totalPages) state.pagination.advancePage = totalPages;

  const paginatedList = list.slice((state.pagination.advancePage - 1) * perPage, state.pagination.advancePage * perPage);

  const paginationContainer = document.getElementById('advances-pagination');
  if (paginationContainer) {
    paginationContainer.innerHTML = renderPaginationControls(totalItems, state.pagination.advancePage, perPage, 'onAdvancePageChanged');
  }

  if (paginatedList.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400 italic">
          No advances found matching your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = paginatedList.map(adv => {
    const farmer = getFarmerById(adv.farmerId);
    const deductions = adv.deductionHistory || [];
    const hasDeductions = deductions.length > 0;

    const deductionsHtml = hasDeductions ? `
      <div class="mt-2 pt-1.5 border-t border-dashed border-slate-200">
        <div class="text-[11px] font-semibold text-slate-600 flex items-center space-x-1 mb-1">
          <i data-lucide="history" class="w-3.5 h-3.5 text-emerald-600"></i>
          <span>Deduction History (${deductions.length}):</span>
        </div>
        <div class="space-y-1">
          ${deductions.map(d => `
            <div class="flex items-center justify-between text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              <div class="flex items-center space-x-1">
                <span class="font-mono font-bold text-emerald-700">${d.billNumber || d.billId}</span>
                <span class="text-slate-600">• ${d.commodity || ''}</span>
                <span class="text-slate-400 text-[10px]">(${formatDate(d.deductionDate)})</span>
              </div>
              <span class="font-mono font-semibold text-emerald-800">Deducted: ${formatINR(d.amountDeducted)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const purposeIcon = adv.purpose === 'Seeds' ? '🌱' : (adv.purpose === 'Fertilizer & Pesticide' ? '🧪' : (adv.purpose === 'Old Balance / Lekka' ? '📜' : '🌾'));

    return `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
        <td class="py-3 px-4 font-mono font-semibold text-xs text-slate-700 whitespace-nowrap align-top">
          ${adv.advanceNumber}
          <div class="text-[10px] text-slate-400 font-mono">${adv.sourceSheet || 'Ledger'}</div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-500 whitespace-nowrap align-top">
          ${formatDate(adv.date)}
        </td>
        <td class="py-3 px-4 align-top">
          <div class="font-semibold text-sm text-slate-900">${adv.farmerName}</div>
          <div class="text-xs text-slate-500">${farmer ? farmer.village : 'Neelahalli Mandi'}</div>
          <div class="mt-1 flex flex-wrap items-center gap-1">
            <span class="inline-flex items-center text-[11px] font-bold border px-2 py-0.5 rounded ${getPurposeBadgeClass(adv.purpose)}">
              <span class="mr-1">${purposeIcon}</span> ${adv.purpose}
            </span>
            ${adv.notes ? `<span class="text-xs text-slate-600 ml-1 italic font-normal">"${adv.notes}"</span>` : ''}
          </div>
          ${deductionsHtml}
        </td>
        <td class="py-3 px-4 font-mono font-bold text-sm text-slate-800 text-right whitespace-nowrap align-top">
          ${formatINR(adv.originalAmount)}
        </td>
        <td class="py-3 px-4 font-mono font-semibold text-sm text-emerald-700 text-right whitespace-nowrap align-top">
          ${formatINR(adv.deductedAmount)}
        </td>
        <td class="py-3 px-4 font-mono font-bold text-sm text-amber-700 text-right whitespace-nowrap align-top">
          ${formatINR(adv.unpaidBalance)}
        </td>
        <td class="py-3 px-4 text-center whitespace-nowrap align-top">
          <span class="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(adv.status)}">
            ${adv.status}
          </span>
          <div class="mt-1.5 flex items-center justify-center space-x-1">
            <button onclick="viewFarmerStatement('${adv.farmerId}')" class="text-xs text-emerald-700 hover:text-emerald-900 font-semibold p-1" title="View Full Ledger Statement">
              Statement
            </button>
            <button onclick="deleteAdvance('${adv.id}')" class="text-slate-400 hover:text-red-600 p-1 rounded transition" title="Delete Advance">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// 3. BILLS LEDGER VIEW
// ==========================================

function onBillPageChanged(newPage) {
  state.pagination.billPage = Math.max(1, newPage);
  renderBillsLedger();
}

function renderBillsLedger() {
  populateFarmerDropdown('filter-bill-farmer', state.filters.billFarmer, true);

  const container = document.getElementById('bills-table-body');
  if (!container) return;

  let list = [...state.bills];

  if (state.selectedYear !== 'all') {
    list = list.filter(b => String(b.year) === String(state.selectedYear));
  }

  if (state.filters.billFarmer !== 'all') {
    list = list.filter(b => b.farmerId === state.filters.billFarmer || b.farmerName.toLowerCase() === state.filters.billFarmer.toLowerCase());
  }
  if (state.filters.billCommodity !== 'all') {
    list = list.filter(b => b.commodity.toLowerCase().includes(state.filters.billCommodity.toLowerCase()));
  }
  if (state.filters.billSearch) {
    const s = state.filters.billSearch.toLowerCase();
    list = list.filter(b =>
      b.billNumber.toLowerCase().includes(s) ||
      b.farmerName.toLowerCase().includes(s) ||
      b.commodity.toLowerCase().includes(s) ||
      (b.notes && b.notes.toLowerCase().includes(s))
    );
  }

  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalItems = list.length;
  const page = state.pagination.billPage;
  const perPage = state.pagination.billPerPage;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  if (page > totalPages) state.pagination.billPage = totalPages;

  const paginatedList = list.slice((state.pagination.billPage - 1) * perPage, state.pagination.billPage * perPage);

  const paginationContainer = document.getElementById('bills-pagination');
  if (paginationContainer) {
    paginationContainer.innerHTML = renderPaginationControls(totalItems, state.pagination.billPage, perPage, 'onBillPageChanged');
  }

  if (paginatedList.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400 italic">
          No bills found matching your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = paginatedList.map(bill => {
    const deductions = bill.deductions || [];
    const commObj = getAllCommodities().find(c => c.name.toLowerCase() === bill.commodity.toLowerCase()) || { badgeClass: 'commodity-custom' };

    const deductionsSummary = deductions.length > 0 ? `
      <div class="mt-1.5 pt-1.5 border-t border-dashed border-slate-200">
        <div class="text-[11px] font-semibold text-slate-600 mb-1">
          Settled Advances (${deductions.length}):
        </div>
        <div class="flex flex-wrap gap-1">
          ${deductions.map(d => `
            <span class="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
              <span class="font-bold text-slate-900 mr-1">${d.advanceNumber}</span>
              <span class="text-emerald-700">(${formatINR(d.amountDeducted)})</span>
            </span>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
        <td class="py-3 px-4 font-mono font-bold text-xs text-emerald-800 whitespace-nowrap align-top">
          ${bill.billNumber}
          <div class="text-[10px] text-slate-400 font-mono">${bill.sourceSheet || 'Ledger'}</div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-500 whitespace-nowrap align-top">
          ${formatDate(bill.date)}
        </td>
        <td class="py-3 px-4 align-top">
          <div class="font-semibold text-sm text-slate-900">${bill.farmerName}</div>
          <div class="text-xs text-slate-500">${bill.farmerVillage || 'Neelahalli Mandi'}</div>
          <div class="mt-1 flex items-center space-x-1.5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${commObj.badgeClass}">${bill.commodity}</span>
            ${bill.quantity ? `<span class="text-xs text-slate-500 font-mono">${bill.quantity} ${bill.unit || 'Qtl'} @ ${formatINR(bill.rate)}</span>` : ''}
          </div>
          ${bill.notes ? `<div class="text-xs text-slate-500 italic mt-0.5">${bill.notes}</div>` : ''}
          ${deductionsSummary}
        </td>
        <td class="py-3 px-4 font-mono font-bold text-sm text-slate-800 text-right whitespace-nowrap align-top">
          ${formatINR(bill.grossAmount)}
        </td>
        <td class="py-3 px-4 font-mono font-bold text-sm text-amber-700 text-right whitespace-nowrap align-top">
          ${formatINR(bill.totalAdvancesDeducted)}
        </td>
        <td class="py-3 px-4 font-mono font-extrabold text-sm text-emerald-700 text-right whitespace-nowrap align-top">
          ${formatINR(bill.netPayableCash)}
        </td>
        <td class="py-3 px-4 text-center whitespace-nowrap align-top">
          <div class="flex items-center justify-center space-x-1.5">
            <button onclick="viewBillReceipt('${bill.id}')" class="inline-flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded transition border border-emerald-200">
              <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
              <span>Receipt</span>
            </button>
            <button onclick="deleteBill('${bill.id}')" class="text-slate-400 hover:text-red-600 p-1 rounded transition" title="Delete Bill">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// 4. FARMERS DIRECTORY VIEW
// ==========================================

function onFarmerPageChanged(newPage) {
  state.pagination.farmerPage = Math.max(1, newPage);
  renderFarmersDirectory();
}

function renderFarmersDirectory() {
  const container = document.getElementById('farmers-grid');
  if (!container) return;

  let list = [...state.farmers];

  if (state.filters.farmerSearch) {
    const s = state.filters.farmerSearch.toLowerCase();
    list = list.filter(f =>
      f.name.toLowerCase().includes(s) ||
      (f.phone && f.phone.toLowerCase().includes(s)) ||
      (f.village && f.village.toLowerCase().includes(s))
    );
  }

  // Sort alphabetically
  list.sort((a, b) => a.name.localeCompare(b.name));

  const totalItems = list.length;
  const page = state.pagination.farmerPage;
  const perPage = state.pagination.farmerPerPage;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  if (page > totalPages) state.pagination.farmerPage = totalPages;

  const paginatedList = list.slice((state.pagination.farmerPage - 1) * perPage, state.pagination.farmerPage * perPage);

  const paginationContainer = document.getElementById('farmers-pagination');
  if (paginationContainer) {
    paginationContainer.innerHTML = renderPaginationControls(totalItems, state.pagination.farmerPage, perPage, 'onFarmerPageChanged');
  }

  if (paginatedList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 italic">
        No farmers found matching your search.
      </div>
    `;
    return;
  }

  container.innerHTML = paginatedList.map(f => {
    const m = getFarmerMetrics(f.id);

    return `
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-bold text-sm text-slate-900">${f.name}</h3>
              <div class="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                <span><i data-lucide="map-pin" class="w-3 h-3 inline text-slate-400"></i> ${f.village || 'Neelahalli Mandi'}</span>
              </div>
            </div>
            <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              ${m.advancesCount} Adv • ${m.billsCount} Bills
            </span>
          </div>

          <!-- Metric Cards -->
          <div class="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-xs">
            <div class="bg-slate-50 p-2 rounded border border-slate-100">
              <span class="text-slate-500 text-[10px] block">Advances Given</span>
              <span class="font-mono font-bold text-slate-800">${formatINR(m.totalAdvances)}</span>
            </div>
            <div class="bg-emerald-50/60 p-2 rounded border border-emerald-100">
              <span class="text-emerald-700 text-[10px] block">Deducted in Bills</span>
              <span class="font-mono font-bold text-emerald-800">${formatINR(m.totalDeducted)}</span>
            </div>
            <div class="bg-amber-50/60 p-2 rounded border border-amber-100">
              <span class="text-amber-800 text-[10px] block font-semibold">Unpaid Balance</span>
              <span class="font-mono font-bold text-amber-800">${formatINR(m.remainingAdvanceBalance)}</span>
            </div>
            <div class="bg-blue-50/60 p-2 rounded border border-blue-100">
              <span class="text-blue-700 text-[10px] block">Produce Bills</span>
              <span class="font-mono font-bold text-blue-800">${formatINR(m.totalBillsValue)}</span>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <button onclick="viewFarmerStatement('${f.id}')" class="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Statement & Ledger</span>
          </button>
          <div class="flex items-center space-x-1">
            <button onclick="editFarmer('${f.id}')" class="text-slate-400 hover:text-slate-700 p-1 rounded" title="Edit Farmer">
              <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteFarmer('${f.id}')" class="text-slate-400 hover:text-red-600 p-1 rounded" title="Delete Farmer">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 5. DAYBOOK & MANDI EXPENSES VIEW
// ==========================================

function onExpensePageChanged(newPage) {
  state.pagination.expensePage = Math.max(1, newPage);
  renderExpensesLedger();
}

function onExpenseCategoryChanged(cat) {
  state.filters.expenseCategory = cat;
  state.pagination.expensePage = 1;
  renderExpensesLedger();
}

function onExpenseSearchChanged(txt) {
  state.filters.expenseSearch = txt;
  state.pagination.expensePage = 1;
  renderExpensesLedger();
}

function renderExpensesLedger() {
  const container = document.getElementById('expenses-table-body');
  if (!container) return;

  let list = [...state.expenses];

  if (state.selectedYear !== 'all') {
    list = list.filter(e => String(e.year) === String(state.selectedYear));
  }

  if (state.filters.expenseCategory !== 'all') {
    list = list.filter(e => (e.category || '').toUpperCase().includes(state.filters.expenseCategory.toUpperCase()));
  }

  if (state.filters.expenseSearch) {
    const s = state.filters.expenseSearch.toLowerCase();
    list = list.filter(e =>
      (e.category && e.category.toLowerCase().includes(s)) ||
      (e.partyName && e.partyName.toLowerCase().includes(s)) ||
      (e.notes && e.notes.toLowerCase().includes(s))
    );
  }

  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Compute Expense KPI Cards
  const totalAmt = list.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const hamaliAmt = list.filter(e => (e.category || '').toUpperCase().includes('HAMALI')).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const transAmt = list.filter(e => (e.category || '').toUpperCase().includes('TRANSPORT') || (e.category || '').toUpperCase().includes('DIESEL') || (e.category || '').toUpperCase().includes('FUEL')).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const maintAmt = list.filter(e => (e.category || '').toUpperCase().includes('MAINTAINANCE') || (e.category || '').toUpperCase().includes('RENT') || (e.category || '').toUpperCase().includes('LIGHT')).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const elTotal = document.getElementById('exp-total-amount');
  const elCount = document.getElementById('exp-total-count');
  const elHamali = document.getElementById('exp-hamali-amount');
  const elTrans = document.getElementById('exp-transport-amount');
  const elMaint = document.getElementById('exp-maintenance-amount');

  if (elTotal) elTotal.innerText = formatINR(totalAmt);
  if (elCount) elCount.innerText = `${list.length} expense entries`;
  if (elHamali) elHamali.innerText = formatINR(hamaliAmt);
  if (elTrans) elTrans.innerText = formatINR(transAmt);
  if (elMaint) elMaint.innerText = formatINR(maintAmt);

  const totalItems = list.length;
  const page = state.pagination.expensePage;
  const perPage = state.pagination.expensePerPage;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  if (page > totalPages) state.pagination.expensePage = totalPages;

  const paginatedList = list.slice((state.pagination.expensePage - 1) * perPage, state.pagination.expensePage * perPage);

  const paginationContainer = document.getElementById('expenses-pagination');
  if (paginationContainer) {
    paginationContainer.innerHTML = renderPaginationControls(totalItems, state.pagination.expensePage, perPage, 'onExpensePageChanged');
  }

  if (paginatedList.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" class="py-12 text-center text-slate-400 italic">
          No operational expenses found matching your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = paginatedList.map(exp => `
    <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
      <td class="py-2.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
        ${formatDate(exp.date)}
      </td>
      <td class="py-2.5 px-4">
        <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
          ${exp.category}
        </span>
      </td>
      <td class="py-2.5 px-4 text-xs font-medium text-slate-800">
        ${exp.partyName || 'Mandi Cash Expense'}
        ${exp.notes ? `<div class="text-[11px] text-slate-400 italic">${exp.notes}</div>` : ''}
      </td>
      <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-900 text-right whitespace-nowrap">
        ${formatINR(exp.amount)}
      </td>
      <td class="py-2.5 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
        ${exp.sourceSheet || 'Ledger'}
      </td>
    </tr>
  `).join('');
}

function populateFarmerDropdown(elementId, selectedId = '', includeAllOption = false) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let options = '';
  if (includeAllOption) {
    options += `<option value="all" ${selectedId === 'all' ? 'selected' : ''}>All Farmers (${state.farmers.length})</option>`;
  } else {
    options += `<option value="">-- Select Farmer --</option>`;
  }

  const sorted = [...state.farmers].sort((a, b) => a.name.localeCompare(b.name));

  sorted.forEach(f => {
    const isSelected = f.id === selectedId || f.name.toLowerCase() === selectedId.toLowerCase() ? 'selected' : '';
    options += `<option value="${f.id}" ${isSelected}>${f.name} (${f.village || 'Neelahalli Mandi'})</option>`;
  });

  el.innerHTML = options;
}

// ==========================================
// RECORD ADVANCE MODAL
// ==========================================

function openRecordAdvanceModal(preselectedFarmerId = '') {
  populateFarmerDropdown('advance-farmer-select', preselectedFarmerId);

  document.getElementById('advance-number').value = getNextAdvanceNumber();
  document.getElementById('advance-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('advance-amount').value = '';
  document.getElementById('advance-purpose').value = 'Seeds';
  document.getElementById('advance-notes').value = '';

  onAdvancePurposeChanged();
  openModal('modal-record-advance');
}

function onAdvancePurposeChanged() {
  const purpose = document.getElementById('advance-purpose').value;
  const seedsGroup = document.getElementById('advance-seeds-group');
  const fertGroup = document.getElementById('advance-fert-group');

  if (purpose === 'Seeds') {
    seedsGroup.classList.remove('hidden');
    fertGroup.classList.add('hidden');
  } else if (purpose === 'Fertilizer & Pesticide') {
    seedsGroup.classList.add('hidden');
    fertGroup.classList.remove('hidden');
  } else {
    seedsGroup.classList.add('hidden');
    fertGroup.classList.add('hidden');
  }
}

function calculateSeedOrFertTotal() {
  const purpose = document.getElementById('advance-purpose').value;
  if (purpose === 'Seeds') {
    const qty = parseFloat(document.getElementById('seed-qty').value);
    const rate = parseFloat(document.getElementById('seed-rate').value);
    if (!isNaN(qty) && !isNaN(rate) && qty > 0 && rate > 0) {
      document.getElementById('advance-amount').value = Math.round(qty * rate);
    }
  }
}

function handleSaveAdvance(e) {
  e.preventDefault();

  const farmerId = document.getElementById('advance-farmer-select').value;
  if (!farmerId) {
    alert('Please select a farmer.');
    return;
  }

  const farmer = getFarmerById(farmerId);
  const amount = parseFloat(document.getElementById('advance-amount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid advance amount greater than 0.');
    return;
  }

  const purpose = document.getElementById('advance-purpose').value;
  let customNotes = document.getElementById('advance-notes').value.trim();

  if (purpose === 'Seeds') {
    const sVar = document.getElementById('seed-variety').value;
    const sQty = document.getElementById('seed-qty').value;
    const sUnit = document.getElementById('seed-unit').value;
    const sRate = document.getElementById('seed-rate').value;
    if (sQty && sRate) {
      const seedSpec = `Seeds Given: ${sQty} ${sUnit} ${sVar} @ ${formatINR(sRate)}/${sUnit}`;
      customNotes = customNotes ? `${seedSpec} | ${customNotes}` : seedSpec;
    }
  } else if (purpose === 'Fertilizer & Pesticide') {
    const fProd = document.getElementById('fert-product').value.trim();
    const fQty = document.getElementById('fert-qty').value;
    if (fProd) {
      const fertSpec = `Distributed: ${fProd}${fQty ? ` (${fQty})` : ''}`;
      customNotes = customNotes ? `${fertSpec} | ${customNotes}` : fertSpec;
    }
  }

  const dateVal = document.getElementById('advance-date').value || new Date().toISOString().split('T')[0];
  const yearVal = dateVal.split('-')[0];

  const newAdv = {
    id: 'ADV-' + Date.now(),
    advanceNumber: document.getElementById('advance-number').value.trim() || getNextAdvanceNumber(),
    farmerId: farmer.id,
    farmerName: farmer.name,
    date: dateVal,
    originalAmount: amount,
    deductedAmount: 0,
    unpaidBalance: amount,
    purpose: purpose,
    notes: customNotes,
    status: 'UNPAID',
    deductionHistory: [],
    year: yearVal,
    sourceSheet: 'MANUAL ENTRY'
  };

  state.advances.unshift(newAdv);
  saveState();

  closeModal('modal-record-advance');
  renderActiveView();

  showToast(`${purpose === 'Seeds' ? '🌱 Seed' : '💰'} Advance ${newAdv.advanceNumber} (${formatINR(amount)}) recorded for ${farmer.name}!`);
}

function deleteAdvance(advanceId) {
  const adv = state.advances.find(a => a.id === advanceId);
  if (!adv) return;

  if (adv.deductedAmount > 0) {
    alert(`Cannot delete Advance ${adv.advanceNumber} because ${formatINR(adv.deductedAmount)} has already been deducted in bills. Please delete or modify the corresponding bills first.`);
    return;
  }

  if (confirm(`Are you sure you want to delete Advance ${adv.advanceNumber} (${formatINR(adv.originalAmount)})?`)) {
    state.advances = state.advances.filter(a => a.id !== advanceId);
    saveState();
    renderActiveView();
    showToast(`Advance ${adv.advanceNumber} deleted.`);
  }
}

// ==========================================
// BILL & ADVANCE DEDUCTION ENGINE
// ==========================================

function openNewBillModal(preselectedFarmerId = '') {
  populateFarmerDropdown('bill-farmer-select', preselectedFarmerId);

  document.getElementById('bill-number').value = getNextBillNumber();
  document.getElementById('bill-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('bill-gross-amount').value = '';
  document.getElementById('bill-quantity').value = '';
  document.getElementById('bill-rate').value = '';
  document.getElementById('bill-notes').value = '';

  activeBillDeductions = {};

  if (preselectedFarmerId) {
    onBillFarmerSelected(preselectedFarmerId);
  } else {
    document.getElementById('bill-farmer-outstanding-section').classList.add('hidden');
  }

  updateBillSettlementCalculations();
  openModal('modal-new-bill');
}

function onBillFarmerSelected(farmerId) {
  if (!farmerId) {
    document.getElementById('bill-farmer-outstanding-section').classList.add('hidden');
    activeBillDeductions = {};
    updateBillSettlementCalculations();
    return;
  }

  const farmer = getFarmerById(farmerId);
  const metrics = getFarmerMetrics(farmerId);

  const section = document.getElementById('bill-farmer-outstanding-section');
  section.classList.remove('hidden');

  document.getElementById('bill-farmer-total-outstanding').innerText = formatINR(metrics.remainingAdvanceBalance);

  const outstandingAdvances = state.advances
    .filter(a => a.farmerId === farmerId && a.status !== 'PAID' && a.unpaidBalance > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  renderBillOutstandingAdvances(outstandingAdvances);
  updateBillSettlementCalculations();
}

function renderBillOutstandingAdvances(advances) {
  const container = document.getElementById('bill-outstanding-advances-list');
  if (!container) return;

  if (advances.length === 0) {
    container.innerHTML = `
      <div class="py-4 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-slate-200">
        No outstanding advances found for this farmer. Bill will be paid 100% in cash.
      </div>
    `;
    return;
  }

  container.innerHTML = advances.map(adv => {
    const isChecked = !!activeBillDeductions[adv.id];
    const deductVal = activeBillDeductions[adv.id] !== undefined ? activeBillDeductions[adv.id] : '';

    return `
      <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 transition flex items-center justify-between text-xs gap-2">
        <div class="flex items-center space-x-2.5">
          <input type="checkbox" id="check-${adv.id}" onchange="toggleAdvanceCheckbox('${adv.id}', ${adv.unpaidBalance})" ${isChecked ? 'checked' : ''} class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500">
          <div>
            <div class="flex items-center space-x-1.5">
              <span class="font-mono font-bold text-slate-800">${adv.advanceNumber}</span>
              <span class="text-[11px] font-semibold px-1.5 py-0.2 rounded ${getPurposeBadgeClass(adv.purpose)}">${adv.purpose}</span>
              <span class="text-slate-400 text-[10px]">(${formatDate(adv.date)})</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Original: <span class="font-mono">${formatINR(adv.originalAmount)}</span> •
              Unpaid Bal: <strong class="font-mono text-amber-800">${formatINR(adv.unpaidBalance)}</strong>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-1.5">
          <div class="relative">
            <span class="absolute left-2 top-1 text-slate-400 text-xs">₹</span>
            <input type="number" id="input-deduct-${adv.id}" min="0" max="${adv.unpaidBalance}" step="any" value="${deductVal}" oninput="onAdvanceDeductInput('${adv.id}', ${adv.unpaidBalance})" placeholder="0" class="w-24 pl-5 pr-1 py-1 text-xs font-mono font-bold border border-slate-300 rounded text-right focus:ring-1 focus:ring-emerald-500">
          </div>
          <button type="button" onclick="setFullAdvanceDeduction('${adv.id}', ${adv.unpaidBalance})" class="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200" title="Deduct entire balance">
            Full
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function onAdvanceDeductInput(advanceId, maxBalance) {
  const input = document.getElementById(`input-deduct-${advanceId}`);
  const checkbox = document.getElementById(`check-${advanceId}`);
  let val = parseFloat(input.value);

  if (isNaN(val) || val < 0) val = 0;
  if (val > maxBalance) {
    val = maxBalance;
    input.value = maxBalance;
  }

  if (val > 0) {
    activeBillDeductions[advanceId] = val;
    if (checkbox) checkbox.checked = true;
  } else {
    delete activeBillDeductions[advanceId];
    if (checkbox) checkbox.checked = false;
  }

  updateBillSettlementCalculations();
}

function toggleAdvanceCheckbox(advanceId, maxBalance) {
  const checkbox = document.getElementById(`check-${advanceId}`);
  const input = document.getElementById(`input-deduct-${advanceId}`);

  if (checkbox.checked) {
    const gross = parseFloat(document.getElementById('bill-gross-amount').value) || 0;
    const currentTotalDeducted = Object.entries(activeBillDeductions)
      .filter(([id]) => id !== advanceId)
      .reduce((sum, [, amt]) => sum + amt, 0);

    const availableBillCapacity = Math.max(0, gross - currentTotalDeducted);
    const amountToDeduct = Math.min(maxBalance, availableBillCapacity > 0 ? availableBillCapacity : maxBalance);

    activeBillDeductions[advanceId] = amountToDeduct;
    input.value = amountToDeduct;
  } else {
    delete activeBillDeductions[advanceId];
    input.value = '';
  }

  updateBillSettlementCalculations();
}

function setFullAdvanceDeduction(advanceId, maxBalance) {
  const input = document.getElementById(`input-deduct-${advanceId}`);
  const checkbox = document.getElementById(`check-${advanceId}`);

  activeBillDeductions[advanceId] = maxBalance;
  if (input) input.value = maxBalance;
  if (checkbox) checkbox.checked = true;

  updateBillSettlementCalculations();
}

function applyAutoFitFIFODeduction() {
  const farmerId = document.getElementById('bill-farmer-select').value;
  if (!farmerId) {
    alert('Please select a farmer first.');
    return;
  }

  const grossBill = parseFloat(document.getElementById('bill-gross-amount').value);
  if (isNaN(grossBill) || grossBill <= 0) {
    alert('Please enter a valid Gross Bill Amount (₹) first.');
    return;
  }

  let remainingCapacity = grossBill;
  const outstandingAdvances = state.advances
    .filter(a => a.farmerId === farmerId && a.status !== 'PAID' && a.unpaidBalance > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (outstandingAdvances.length === 0) {
    alert('No outstanding advances to deduct for this farmer.');
    return;
  }

  activeBillDeductions = {};

  for (const adv of outstandingAdvances) {
    if (remainingCapacity <= 0) break;
    const deduct = Math.min(adv.unpaidBalance, remainingCapacity);
    if (deduct > 0) {
      activeBillDeductions[adv.id] = deduct;
      remainingCapacity -= deduct;
    }
  }

  renderBillOutstandingAdvances(outstandingAdvances);
  updateBillSettlementCalculations();

  showToast(`Auto-fit FIFO applied: ${formatINR(grossBill - remainingCapacity)} deducted across ${Object.keys(activeBillDeductions).length} advance(s)!`);
}

function clearAllBillDeductions() {
  activeBillDeductions = {};
  const farmerId = document.getElementById('bill-farmer-select').value;
  if (farmerId) {
    const outstandingAdvances = state.advances
      .filter(a => a.farmerId === farmerId && a.status !== 'PAID' && a.unpaidBalance > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    renderBillOutstandingAdvances(outstandingAdvances);
  }
  updateBillSettlementCalculations();
}

function updateBillSettlementCalculations() {
  const gross = parseFloat(document.getElementById('bill-gross-amount').value) || 0;
  const totalDeducted = Object.values(activeBillDeductions).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const netPayableCash = Math.max(0, gross - totalDeducted);

  const farmerId = document.getElementById('bill-farmer-select').value;
  let totalOutstanding = 0;
  if (farmerId) {
    const metrics = getFarmerMetrics(farmerId);
    totalOutstanding = metrics.remainingAdvanceBalance;
  }
  const leftoverCarriedForward = Math.max(0, totalOutstanding - totalDeducted);

  const elGross = document.getElementById('calc-gross-value');
  const elDeducted = document.getElementById('calc-total-deducted');
  const elNet = document.getElementById('calc-net-payable');
  const elLeftover = document.getElementById('calc-leftover-advance');
  const elWarning = document.getElementById('calc-warning-msg');

  if (elGross) elGross.innerText = formatINR(gross);
  if (elDeducted) elDeducted.innerText = formatINR(totalDeducted);
  if (elNet) elNet.innerText = formatINR(netPayableCash);
  if (elLeftover) elLeftover.innerText = formatINR(leftoverCarriedForward);

  if (elWarning) {
    if (totalDeducted > gross && gross > 0) {
      elWarning.classList.remove('hidden');
      elWarning.innerText = `Warning: Advances deducted (${formatINR(totalDeducted)}) exceed Gross Produce Value (${formatINR(gross)})!`;
    } else {
      elWarning.classList.add('hidden');
    }
  }

  const breakdownList = document.getElementById('calc-deductions-breakdown');
  if (breakdownList) {
    const entries = Object.entries(activeBillDeductions);
    if (entries.length === 0) {
      breakdownList.innerHTML = `<span class="text-xs text-slate-400 italic">No advances selected for deduction</span>`;
    } else {
      breakdownList.innerHTML = entries.map(([advId, amt]) => {
        const adv = state.advances.find(a => a.id === advId);
        if (!adv) return '';
        const leftoverThisAdv = Math.max(0, adv.unpaidBalance - amt);
        return `
          <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
            <div>
              <span class="font-mono font-semibold text-slate-800">${adv.advanceNumber}</span>
              <span class="text-slate-500">(${adv.purpose})</span>
            </div>
            <div class="text-right">
              <span class="font-mono font-bold text-emerald-800">${formatINR(amt)}</span>
              <span class="text-[10px] text-slate-400 ml-1">(Rem: ${formatINR(leftoverThisAdv)})</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function handleSaveBill(e) {
  e.preventDefault();

  const farmerId = document.getElementById('bill-farmer-select').value;
  if (!farmerId) {
    alert('Please select a farmer.');
    return;
  }
  const farmer = getFarmerById(farmerId);

  let commodity = document.getElementById('bill-commodity').value;
  if (commodity === 'CUSTOM') {
    const customName = document.getElementById('bill-custom-commodity').value.trim();
    if (!customName) {
      alert('Please enter the custom commodity name.');
      return;
    }
    commodity = customName;
    if (!state.customCommodities.includes(customName)) {
      state.customCommodities.push(customName);
    }
  }

  const grossAmount = parseFloat(document.getElementById('bill-gross-amount').value);
  if (isNaN(grossAmount) || grossAmount <= 0) {
    alert('Please enter a valid Gross Bill Amount (₹) greater than 0.');
    return;
  }

  const billNumber = document.getElementById('bill-number').value.trim() || getNextBillNumber();
  const billDate = document.getElementById('bill-date').value || new Date().toISOString().split('T')[0];
  const quantity = parseFloat(document.getElementById('bill-quantity').value) || null;
  const unit = document.getElementById('bill-unit').value || 'Quintals';
  const rate = parseFloat(document.getElementById('bill-rate').value) || null;
  const notes = document.getElementById('bill-notes').value.trim();

  const deductions = [];
  let totalDeductions = 0;

  for (const [advanceId, deductAmount] of Object.entries(activeBillDeductions)) {
    const numAmt = parseFloat(deductAmount);
    if (numAmt > 0) {
      const adv = state.advances.find(a => a.id === advanceId);
      if (adv) {
        if (numAmt > adv.unpaidBalance) {
          alert(`Deduction amount for ${adv.advanceNumber} (${formatINR(numAmt)}) cannot exceed its unpaid balance (${formatINR(adv.unpaidBalance)}).`);
          return;
        }

        const remBefore = adv.unpaidBalance;
        const remAfter = remBefore - numAmt;

        deductions.push({
          advanceId: adv.id,
          advanceNumber: adv.advanceNumber,
          advancePurpose: adv.purpose,
          advanceOriginalAmount: adv.originalAmount,
          amountDeducted: numAmt,
          advanceRemainingBalanceBefore: remBefore,
          advanceRemainingBalanceAfter: remAfter
        });

        totalDeductions += numAmt;
      }
    }
  }

  const netPayableCash = Math.max(0, grossAmount - totalDeductions);

  // Apply deductions to advances
  deductions.forEach(d => {
    const adv = state.advances.find(a => a.id === d.advanceId);
    if (adv) {
      adv.deductedAmount = (Number(adv.deductedAmount) || 0) + d.amountDeducted;
      updateAdvanceStatus(adv);

      if (!adv.deductionHistory) adv.deductionHistory = [];
      adv.deductionHistory.push({
        billId: billNumber,
        billNumber: billNumber,
        commodity: commodity,
        amountDeducted: d.amountDeducted,
        deductionDate: billDate,
        notes: `Deducted against ${commodity} Bill #${billNumber}`
      });
    }
  });

  const farmerRemainingAdvances = state.advances
    .filter(a => a.farmerId === farmerId)
    .reduce((sum, a) => sum + (Number(a.unpaidBalance) || 0), 0);

  const newBill = {
    id: 'BILL-' + Date.now(),
    billNumber: billNumber,
    farmerId: farmer.id,
    farmerName: farmer.name,
    farmerVillage: farmer.village,
    date: billDate,
    commodity: commodity,
    quantity: quantity,
    unit: unit,
    rate: rate,
    grossAmount: grossAmount,
    totalAdvancesDeducted: totalDeductions,
    netPayableCash: netPayableCash,
    leftoverAdvancesCarriedForward: farmerRemainingAdvances,
    deductions: deductions,
    notes: notes,
    year: billDate.split('-')[0],
    sourceSheet: 'MANUAL ENTRY',
    createdAt: new Date().toISOString()
  };

  state.bills.unshift(newBill);
  saveState();
  closeModal('modal-new-bill');
  renderActiveView();

  showToast(`Bill ${billNumber} created! Net Cash Paid to Farmer: ${formatINR(netPayableCash)}`);
  viewBillReceipt(newBill.id);
}

function deleteBill(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;

  if (confirm(`Are you sure you want to delete Bill ${bill.billNumber}? This will REVERT all ${formatINR(bill.totalAdvancesDeducted)} advance deductions back to the farmer's unpaid advances.`)) {
    if (bill.deductions && bill.deductions.length > 0) {
      bill.deductions.forEach(d => {
        const adv = state.advances.find(a => a.id === d.advanceId);
        if (adv) {
          adv.deductedAmount = Math.max(0, (Number(adv.deductedAmount) || 0) - d.amountDeducted);
          updateAdvanceStatus(adv);

          if (adv.deductionHistory) {
            adv.deductionHistory = adv.deductionHistory.filter(h => h.billNumber !== bill.billNumber && h.billId !== bill.id);
          }
        }
      });
    }

    state.bills = state.bills.filter(b => b.id !== billId);
    saveState();
    renderActiveView();
    showToast(`Bill ${bill.billNumber} deleted and advance deductions reversed.`);
  }
}

// ==========================================
// RECEIPT & STATEMENT MODALS
// ==========================================

function viewBillReceipt(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;

  const farmer = getFarmerById(bill.farmerId);
  const deductions = bill.deductions || [];

  const container = document.getElementById('receipt-content');
  if (!container) return;

  container.innerHTML = `
    <div class="print-area bg-white p-6 max-w-xl mx-auto border border-slate-200 rounded-xl shadow-sm text-slate-800">
      <div class="text-center pb-4 border-b-2 border-emerald-800">
        <h2 class="text-xl font-extrabold text-emerald-900 tracking-wide uppercase">GURURAJ TRADING COMPANY (GTCO)</h2>
        <div class="text-xs text-slate-600 font-medium">Agricultural Pulse & Grain Merchant • APMC Mandi</div>
        <div class="text-[11px] text-slate-500 mt-0.5">Mandi Yard, Neelahalli • Phone: +91 94481 00000</div>
        <div class="mt-2 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
          COMMODITY PURCHASE & ADVANCE SETTLEMENT BILL
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 my-4 text-xs">
        <div>
          <div class="text-slate-500 font-medium">Farmer Details:</div>
          <div class="font-bold text-sm text-slate-900">${bill.farmerName}</div>
          <div>Village: <span class="font-medium">${bill.farmerVillage || (farmer ? farmer.village : 'Neelahalli Mandi')}</span></div>
        </div>
        <div class="text-right">
          <div>Bill Number: <span class="font-mono font-bold text-sm text-emerald-800">${bill.billNumber}</span></div>
          <div>Bill Date: <span class="font-medium">${formatDate(bill.date)}</span></div>
          <div>Mode: <span class="font-medium">Produce Adjustment & Cash</span></div>
        </div>
      </div>

      <table class="w-full text-xs border border-slate-200 mb-4">
        <thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th class="py-2 px-3 text-left">Commodity Produce</th>
            <th class="py-2 px-3 text-right">Quantity</th>
            <th class="py-2 px-3 text-right">Rate / Unit</th>
            <th class="py-2 px-3 text-right">Gross Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2.5 px-3 font-semibold text-slate-800">${bill.commodity}</td>
            <td class="py-2.5 px-3 font-mono text-right">${bill.quantity ? `${bill.quantity} ${bill.unit || 'Qtl'}` : '-'}</td>
            <td class="py-2.5 px-3 font-mono text-right">${bill.rate ? formatINR(bill.rate) : '-'}</td>
            <td class="py-2.5 px-3 font-mono font-bold text-right text-slate-900">${formatINR(bill.grossAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div class="mb-4">
        <div class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Advance Deductions Settled in this Bill:</span>
          <span class="text-emerald-800 font-mono">${formatINR(bill.totalAdvancesDeducted)}</span>
        </div>
        ${deductions.length > 0 ? `
          <table class="w-full text-[11px] border border-slate-200">
            <thead class="bg-amber-50/70 text-slate-700 border-b border-slate-200">
              <tr>
                <th class="py-1 px-2 text-left">Adv #</th>
                <th class="py-1 px-2 text-left">Purpose / Item</th>
                <th class="py-1 px-2 text-right">Original</th>
                <th class="py-1 px-2 text-right">Deducted Now</th>
                <th class="py-1 px-2 text-right">Leftover Carryover</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${deductions.map(d => `
                <tr>
                  <td class="py-1.5 px-2 font-mono font-semibold">${d.advanceNumber}</td>
                  <td class="py-1.5 px-2 text-slate-700 font-medium">${d.advancePurpose}</td>
                  <td class="py-1.5 px-2 font-mono text-right">${formatINR(d.advanceOriginalAmount)}</td>
                  <td class="py-1.5 px-2 font-mono text-right font-bold text-emerald-800">${formatINR(d.amountDeducted)}</td>
                  <td class="py-1.5 px-2 font-mono text-right text-amber-700">${formatINR(d.advanceRemainingBalanceAfter)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="text-xs text-slate-400 italic p-2 bg-slate-50 border border-slate-200 rounded">
            No advance deductions were adjusted in this bill.
          </div>
        `}
      </div>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs mb-4">
        <div class="flex justify-between">
          <span class="text-slate-600">Gross Commodity Sale Value:</span>
          <span class="font-mono font-bold text-slate-800">${formatINR(bill.grossAmount)}</span>
        </div>
        <div class="flex justify-between text-amber-800 font-semibold">
          <span>Less: Total Advances Deducted:</span>
          <span class="font-mono">- ${formatINR(bill.totalAdvancesDeducted)}</span>
        </div>
        <div class="pt-2 border-t border-slate-300 flex justify-between items-center text-sm">
          <span class="font-extrabold text-emerald-900">NET CASH PAYABLE TO FARMER:</span>
          <span class="font-mono font-extrabold text-base text-emerald-700">${formatINR(bill.netPayableCash)}</span>
        </div>
        <div class="pt-1.5 border-t border-dashed border-slate-200 flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Farmer Unpaid Advance Balance Carried Forward:</span>
          <span class="font-bold text-slate-700">${formatINR(bill.leftoverAdvancesCarriedForward || 0)}</span>
        </div>
      </div>

      ${bill.notes ? `<div class="text-[11px] text-slate-500 italic mb-4">Note: "${bill.notes}"</div>` : ''}

      <div class="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 text-xs text-center">
        <div>
          <div class="h-10 border-b border-dashed border-slate-400"></div>
          <div class="mt-1 font-medium text-slate-700">Farmer Signature / Thumb</div>
          <div class="text-[10px] text-slate-400">${bill.farmerName}</div>
        </div>
        <div>
          <div class="h-10 border-b border-dashed border-slate-400"></div>
          <div class="mt-1 font-medium text-slate-700">For Gururaj Trading Co. (GTCO)</div>
          <div class="text-[10px] text-slate-400">Authorized Mandi Trader Sign</div>
        </div>
      </div>
    </div>
  `;

  openModal('modal-bill-receipt');
}

function viewFarmerStatement(farmerId) {
  const farmer = getFarmerById(farmerId);
  if (!farmer) return;

  const metrics = getFarmerMetrics(farmer.id);
  const advances = state.advances.filter(a => a.farmerId === farmer.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const bills = state.bills.filter(b => b.farmerId === farmer.id).sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById('farmer-statement-content');
  if (!container) return;

  container.innerHTML = `
    <div class="print-area bg-white p-6 max-w-3xl mx-auto border border-slate-200 rounded-xl shadow-sm text-slate-800">
      <div class="text-center pb-4 border-b-2 border-emerald-800">
        <h2 class="text-xl font-extrabold text-emerald-900 tracking-wide uppercase">GURURAJ TRADING COMPANY (GTCO)</h2>
        <div class="text-xs text-slate-600 font-medium">APMC Mandi Yard • Trader Advance, Seeds & Commodity Ledger Statement</div>
        <div class="mt-1 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
          FARMER ACCOUNT LEDGER
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 my-4 p-3 bg-slate-50 rounded-lg text-xs">
        <div>
          <div class="text-slate-500 font-medium">Farmer Name:</div>
          <div class="font-bold text-sm text-slate-900">${farmer.name}</div>
          <div>Village: <span class="font-medium">${farmer.village || 'Neelahalli Mandi'}</span></div>
        </div>
        <div class="text-right">
          <div>Statement Date: <span class="font-medium">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
          <div>Active Advances: <span class="font-mono font-bold text-amber-700">${metrics.unpaidAdvancesCount} pending</span></div>
          <div>Bills Settled: <span class="font-mono font-bold">${metrics.billsCount}</span></div>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2 mb-5 text-center text-xs">
        <div class="p-2.5 bg-slate-100 rounded border border-slate-200">
          <div class="text-slate-500 text-[10px] uppercase">Total Advances Given</div>
          <div class="font-mono font-bold text-sm text-slate-800">${formatINR(metrics.totalAdvances)}</div>
        </div>
        <div class="p-2.5 bg-emerald-50 rounded border border-emerald-200">
          <div class="text-emerald-700 text-[10px] uppercase">Total Deducted in Bills</div>
          <div class="font-mono font-bold text-sm text-emerald-800">${formatINR(metrics.totalDeducted)}</div>
        </div>
        <div class="p-2.5 bg-amber-50 rounded border border-amber-200">
          <div class="text-amber-800 text-[10px] uppercase font-bold">Unpaid Advance Balance</div>
          <div class="font-mono font-extrabold text-sm text-amber-800">${formatINR(metrics.remainingAdvanceBalance)}</div>
        </div>
        <div class="p-2.5 bg-blue-50 rounded border border-blue-200">
          <div class="text-blue-700 text-[10px] uppercase">Total Produce Sales</div>
          <div class="font-mono font-bold text-sm text-blue-800">${formatINR(metrics.totalBillsValue)}</div>
        </div>
      </div>

      <!-- Advances Table -->
      <div class="mb-5">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Advances Taken by Farmer (Cash, Seeds & Fertilizer):</span>
          <span class="text-slate-500 font-normal">Count: ${advances.length}</span>
        </h4>
        <div class="overflow-x-auto max-h-64 border border-slate-200 rounded">
          <table class="w-full text-xs">
            <thead class="bg-slate-100 text-slate-700 sticky top-0">
              <tr>
                <th class="py-1.5 px-2 text-left">Adv #</th>
                <th class="py-1.5 px-2 text-left">Date</th>
                <th class="py-1.5 px-2 text-left">Purpose / Item</th>
                <th class="py-1.5 px-2 text-right">Original</th>
                <th class="py-1.5 px-2 text-right">Deducted</th>
                <th class="py-1.5 px-2 text-right">Balance</th>
                <th class="py-1.5 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${advances.map(a => `
                <tr>
                  <td class="py-1.5 px-2 font-mono font-semibold">${a.advanceNumber}</td>
                  <td class="py-1.5 px-2 text-slate-500">${formatDate(a.date)}</td>
                  <td class="py-1.5 px-2 text-slate-700">${a.purpose}</td>
                  <td class="py-1.5 px-2 font-mono text-right font-medium">${formatINR(a.originalAmount)}</td>
                  <td class="py-1.5 px-2 font-mono text-right text-emerald-700">${formatINR(a.deductedAmount)}</td>
                  <td class="py-1.5 px-2 font-mono text-right font-bold text-amber-800">${formatINR(a.unpaidBalance)}</td>
                  <td class="py-1.5 px-2 text-center">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(a.status)}">${a.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bills Table -->
      <div class="mb-5">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Produce Sales & Settlement Bills:</span>
          <span class="text-slate-500 font-normal">Count: ${bills.length}</span>
        </h4>
        ${bills.length > 0 ? `
          <div class="overflow-x-auto max-h-48 border border-slate-200 rounded">
            <table class="w-full text-xs">
              <thead class="bg-slate-100 text-slate-700 sticky top-0">
                <tr>
                  <th class="py-1.5 px-2 text-left">Bill #</th>
                  <th class="py-1.5 px-2 text-left">Date</th>
                  <th class="py-1.5 px-2 text-left">Commodity</th>
                  <th class="py-1.5 px-2 text-right">Gross Value</th>
                  <th class="py-1.5 px-2 text-right">Advances Deducted</th>
                  <th class="py-1.5 px-2 text-right">Net Cash Paid</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${bills.map(b => `
                  <tr>
                    <td class="py-1.5 px-2 font-mono font-bold text-emerald-800">${b.billNumber}</td>
                    <td class="py-1.5 px-2 text-slate-500">${formatDate(b.date)}</td>
                    <td class="py-1.5 px-2 font-medium">${b.commodity}</td>
                    <td class="py-1.5 px-2 font-mono text-right">${formatINR(b.grossAmount)}</td>
                    <td class="py-1.5 px-2 font-mono text-right text-amber-700 font-medium">${formatINR(b.totalAdvancesDeducted)}</td>
                    <td class="py-1.5 px-2 font-mono text-right text-emerald-800 font-bold">${formatINR(b.netPayableCash)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="text-xs text-slate-400 italic p-3 bg-slate-50 border border-slate-200 rounded text-center">
            No commodity sales recorded for this farmer yet.
          </div>
        `}
      </div>

      <!-- Carryover statement -->
      <div class="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs">
        <div class="font-bold text-amber-900 flex items-center space-x-1.5">
          <i data-lucide="info" class="w-4 h-4 text-amber-700"></i>
          <span>Outstanding Advance Carryover Note:</span>
        </div>
        <p class="text-amber-800 mt-1">
          As of today, farmer <span class="font-bold">${farmer.name}</span> has an outstanding advance balance of <span class="font-mono font-bold text-amber-900">${formatINR(metrics.remainingAdvanceBalance)}</span>. This balance carries forward and will be deducted when future crops (Tur, Moong, Chana, Urad, etc.) are brought for sale.
        </p>
      </div>

      <!-- Signatures -->
      <div class="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 text-xs text-center">
        <div>
          <div class="h-10 border-b border-dashed border-slate-400"></div>
          <div class="mt-1 font-medium text-slate-700">Farmer Signature</div>
        </div>
        <div>
          <div class="h-10 border-b border-dashed border-slate-400"></div>
          <div class="mt-1 font-medium text-slate-700">Trader Signature & Seal</div>
        </div>
      </div>
    </div>
  `;

  openModal('modal-farmer-statement');
}

// ==========================================
// FARMER MANAGEMENT (CRUD)
// ==========================================

let editingFarmerId = null;

function openAddFarmerModal() {
  editingFarmerId = null;
  document.getElementById('modal-farmer-title').innerText = 'Add New Farmer';
  document.getElementById('farmer-name').value = '';
  document.getElementById('farmer-phone').value = '';
  document.getElementById('farmer-village').value = 'NEELAHALLI';
  document.getElementById('farmer-notes').value = '';

  openModal('modal-farmer-form');
}

function editFarmer(farmerId) {
  const farmer = getFarmerById(farmerId);
  if (!farmer) return;

  editingFarmerId = farmerId;
  document.getElementById('modal-farmer-title').innerText = 'Edit Farmer Details';
  document.getElementById('farmer-name').value = farmer.name;
  document.getElementById('farmer-phone').value = farmer.phone || '';
  document.getElementById('farmer-village').value = farmer.village || 'NEELAHALLI';
  document.getElementById('farmer-notes').value = farmer.notes || '';

  openModal('modal-farmer-form');
}

function handleSaveFarmer(e) {
  e.preventDefault();

  const name = document.getElementById('farmer-name').value.trim();
  if (!name) {
    alert('Please enter the farmer name.');
    return;
  }

  const phone = document.getElementById('farmer-phone').value.trim();
  const village = document.getElementById('farmer-village').value.trim() || 'NEELAHALLI';
  const notes = document.getElementById('farmer-notes').value.trim();

  if (editingFarmerId) {
    const f = getFarmerById(editingFarmerId);
    if (f) {
      f.name = name;
      f.phone = phone;
      f.village = village;
      f.notes = notes;

      state.advances.filter(a => a.farmerId === f.id).forEach(a => a.farmerName = name);
      state.bills.filter(b => b.farmerId === f.id).forEach(b => {
        b.farmerName = name;
        b.farmerVillage = village;
      });

      showToast(`Farmer ${name} updated!`);
    }
  } else {
    const code = name.replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const newFarmer = {
      id: `FARMER-${code}-${Date.now()}`,
      name: name,
      phone: phone,
      village: village,
      notes: notes,
      createdAt: new Date().toISOString()
    };
    state.farmers.push(newFarmer);
    showToast(`Farmer ${name} added!`);
  }

  saveState();
  closeModal('modal-farmer-form');
  renderActiveView();
}

function deleteFarmer(farmerId) {
  const farmer = getFarmerById(farmerId);
  if (!farmer) return;

  const advCount = state.advances.filter(a => a.farmerId === farmerId).length;
  const billCount = state.bills.filter(b => b.farmerId === farmerId).length;

  if (advCount > 0 || billCount > 0) {
    alert(`Cannot delete ${farmer.name} because they have ${advCount} advance(s) and ${billCount} bill(s) recorded in the ledger. Please settle or delete transactions first.`);
    return;
  }

  if (confirm(`Are you sure you want to delete farmer ${farmer.name}?`)) {
    state.farmers = state.farmers.filter(f => f.id !== farmerId);
    saveState();
    renderActiveView();
    showToast(`Farmer ${farmer.name} deleted.`);
  }
}

// ==========================================
// EXCEL EXPORT & BACKUP
// ==========================================

function exportDataJSON() {
  const jsonStr = JSON.stringify({
    version: '4.0',
    exportDate: new Date().toISOString(),
    farmers: state.farmers,
    advances: state.advances,
    bills: state.bills,
    expenses: state.expenses,
    customCommodities: state.customCommodities
  }, null, 2);

  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GTCO_LEDGER_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('JSON Backup downloaded.');
}

function importDataJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed.farmers || !parsed.advances) throw new Error('Invalid backup schema');

      state.farmers = parsed.farmers || [];
      state.advances = parsed.advances || [];
      state.bills = parsed.bills || [];
      state.expenses = parsed.expenses || [];
      state.customCommodities = parsed.customCommodities || [];

      saveState();
      renderActiveView();
      showToast('Data restored from backup!');
    } catch (err) {
      alert('Error parsing backup: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function exportExcelLedger() {
  if (typeof XLSX === 'undefined') {
    alert('SheetJS Excel library loading. Please try again.');
    return;
  }

  const wb = XLSX.utils.book_new();

  // 1. Advances Sheet
  const advData = state.advances.map(a => ({
    'Advance ID': a.advanceNumber,
    'Date': a.date,
    'Year': a.year || '',
    'Farmer Name': a.farmerName,
    'Purpose / Input': a.purpose,
    'Original Amount (INR)': a.originalAmount,
    'Deducted Amount (INR)': a.deductedAmount,
    'Unpaid Balance (INR)': a.unpaidBalance,
    'Status': a.status,
    'Source Sheet': a.sourceSheet || '',
    'Notes / Details': a.notes || ''
  }));
  const wsAdv = XLSX.utils.json_to_sheet(advData);
  XLSX.utils.book_append_sheet(wb, wsAdv, 'Advances & Inputs');

  // 2. Bills Sheet
  const billData = state.bills.map(b => ({
    'Bill ID': b.billNumber,
    'Date': b.date,
    'Year': b.year || '',
    'Farmer Name': b.farmerName,
    'Commodity': b.commodity,
    'Gross Amount (INR)': b.grossAmount,
    'Advances Deducted (INR)': b.totalAdvancesDeducted,
    'Net Cash Paid (INR)': b.netPayableCash,
    'Source Sheet': b.sourceSheet || '',
    'Notes': b.notes || ''
  }));
  const wsBills = XLSX.utils.json_to_sheet(billData);
  XLSX.utils.book_append_sheet(wb, wsBills, 'Produce Bills & Pattis');

  // 3. Farmers Summary Sheet
  const farmerData = state.farmers.map(f => {
    const m = getFarmerMetrics(f.id);
    return {
      'Farmer Name': f.name,
      'Village': f.village,
      'Total Advances Given (INR)': m.totalAdvances,
      'Total Deducted in Bills (INR)': m.totalDeducted,
      'Unpaid Balance (INR)': m.remainingAdvanceBalance,
      'Total Produce Bills (INR)': m.totalBillsValue
    };
  });
  const wsFarmers = XLSX.utils.json_to_sheet(farmerData);
  XLSX.utils.book_append_sheet(wb, wsFarmers, 'Farmer Ledgers');

  // 4. Expenses Sheet
  const expData = state.expenses.map(e => ({
    'Date': e.date,
    'Year': e.year || '',
    'Category': e.category,
    'Party / Description': e.partyName,
    'Amount (INR)': e.amount,
    'Source Sheet': e.sourceSheet || '',
    'Notes': e.notes || ''
  }));
  const wsExp = XLSX.utils.json_to_sheet(expData);
  XLSX.utils.book_append_sheet(wb, wsExp, 'Mandi Expenses & Hamali');

  XLSX.writeFile(wb, `GTCO_MASTER_LEDGER_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast('Excel report generated and downloaded!');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
      <span>${message}</span>
    </div>
  `;
  toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');

  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
  }, 4000);
}

// ==========================================
// INITIALIZATION & EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setTab('dashboard');

  const today = new Date().toISOString().split('T')[0];
  const advDate = document.getElementById('advance-date');
  if (advDate) advDate.value = today;
  const billDate = document.getElementById('bill-date');
  if (billDate) billDate.value = today;

  // Filter change listeners
  const filterAdvFarmer = document.getElementById('filter-advance-farmer');
  if (filterAdvFarmer) filterAdvFarmer.addEventListener('change', (e) => {
    state.filters.advanceFarmer = e.target.value;
    state.pagination.advancePage = 1;
    renderAdvancesLedger();
  });

  const filterAdvPurpose = document.getElementById('filter-advance-purpose');
  if (filterAdvPurpose) filterAdvPurpose.addEventListener('change', (e) => {
    state.filters.advancePurpose = e.target.value;
    state.pagination.advancePage = 1;
    renderAdvancesLedger();
  });

  const filterAdvStatus = document.getElementById('filter-advance-status');
  if (filterAdvStatus) filterAdvStatus.addEventListener('change', (e) => {
    state.filters.advanceStatus = e.target.value;
    state.pagination.advancePage = 1;
    renderAdvancesLedger();
  });

  const filterAdvSearch = document.getElementById('filter-advance-search');
  if (filterAdvSearch) filterAdvSearch.addEventListener('input', (e) => {
    state.filters.advanceSearch = e.target.value;
    state.pagination.advancePage = 1;
    renderAdvancesLedger();
  });

  const filterBillFarmer = document.getElementById('filter-bill-farmer');
  if (filterBillFarmer) filterBillFarmer.addEventListener('change', (e) => {
    state.filters.billFarmer = e.target.value;
    state.pagination.billPage = 1;
    renderBillsLedger();
  });

  const filterBillComm = document.getElementById('filter-bill-commodity');
  if (filterBillComm) filterBillComm.addEventListener('change', (e) => {
    state.filters.billCommodity = e.target.value;
    state.pagination.billPage = 1;
    renderBillsLedger();
  });

  const filterBillSearch = document.getElementById('filter-bill-search');
  if (filterBillSearch) filterBillSearch.addEventListener('input', (e) => {
    state.filters.billSearch = e.target.value;
    state.pagination.billPage = 1;
    renderBillsLedger();
  });

  const filterFarmerSearch = document.getElementById('filter-farmer-search');
  if (filterFarmerSearch) filterFarmerSearch.addEventListener('input', (e) => {
    state.filters.farmerSearch = e.target.value;
    state.pagination.farmerPage = 1;
    renderFarmersDirectory();
  });

  // URL query parameter deep linking: ?farmer=...
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const farmerParam = urlParams.get('farmer');
    if (farmerParam) {
      const match = state.farmers.find(f => f.name.toLowerCase() === farmerParam.toLowerCase() || f.id.toLowerCase() === farmerParam.toLowerCase());
      if (match) {
        state.filters.advanceFarmer = match.id;
        state.filters.billFarmer = match.id;
        setTab('advances');
        showToast(`Filtered for farmer: ${match.name}`);
      }
    }
  } catch (e) {
    console.warn('URL param error:', e);
  }
});
