/**
 * GTCO-LEDGER - Commodity Trader Advance & Bill Settlement Ledger
 * Complete, production-ready ledger application for APMC agricultural pulse merchants.
 * Linked with Paisabhai Daily Cashbook & GTCO Stock Tracker.
 */

// ==========================================
// CONSTANTS & INITIAL DATA
// ==========================================

const STORAGE_KEY = 'GTCO_LEDGER_DATA_V2';
const PAISABHAI_STORAGE_KEY = 'paisabhai_ledger_store_v3';
const STOCK_TRACKER_STORAGE_KEY = 'gtco_stock_tracker_v3';

const COMMODITIES = [
  { id: 'moong', name: 'Moong (Green Gram)', badgeClass: 'commodity-moong', icon: 'sprout' },
  { id: 'tur', name: 'Tur (Pigeon Pea)', badgeClass: 'commodity-tur', icon: 'wheat' },
  { id: 'chana', name: 'Chana (Chickpea)', badgeClass: 'commodity-chana', icon: 'circle-dot' },
  { id: 'urad', name: 'Urad (Black Gram)', badgeClass: 'commodity-urad', icon: 'box' },
];

const ADVANCE_PURPOSES = [
  'Seeds',
  'Fertilizer & Pesticide',
  'Cultivation',
  'Harvesting',
  'Personal Use',
  'Other'
];

// Pre-seeded Neelahalli / APMC Mandi Farmers
const INITIAL_MANDI_FARMERS = [
  { id: 'FARMER-001', name: 'Rameshwar Patil', phone: '+91 98765 43210', village: 'Neelahalli', notes: 'Moong, Tur, and Chana grower (Reference Test Farmer)', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-SMP', name: 'SMPATIL', phone: '', village: 'NEELAHALLI', notes: 'Lead Urad pulse grower', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-RM', name: 'RAJU MANKAR', phone: '', village: 'NEELAHALLI', notes: 'Regular Mandi farmer', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-BS', name: 'BASWARAJ SHARNAIYYA', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-AP', name: 'ANIL PUJARI', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-DK', name: 'DEVAPPA K', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-BH', name: 'BEERBAN HOLA', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-SP', name: 'SHARANU POST', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-SB', name: 'SIDDU BAMNALLI', phone: '', village: 'BAMNALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-JS', name: 'JHANGIR SAAB', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-CB', name: 'CHANDAMMA BYADER', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-SM', name: 'SHANKAPPA MALAGI', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-KM', name: 'KALAPPA MADIVAL', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-JP', name: 'JAGADEVI POLICE PATIL', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-MP', name: 'MARTHAND PUJARI', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-NA', name: 'NAGAPPA AMBANNA', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-BD', name: 'BASWARAJ DEVAR', phone: '', village: 'KOKNALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-KB', name: 'KASHAPPA BYADER', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-RMAD', name: 'RAJU MADIVAL', phone: '', village: 'NEELAHALLI', notes: 'Regular pulse farmer', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-MMAD', name: 'MANJUNATH MADIVAL', phone: '', village: 'NEELAHALLI', notes: 'Moong pulse producer', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-JSHET', name: 'JAGU SHETTY', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-MKUR', name: 'MAHESH KURKUNTA', phone: '', village: 'KURKUNTA', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-UKUM', name: 'UDAY KUMAR', phone: '', village: 'NEELAHALLI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-DAND', name: 'DANDAPPA', phone: '', village: 'NEELAHALLI', notes: 'Fertilizer & seed recipient', createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'FARMER-SIDBEL', name: 'SIDDAPPA BELKOTI', phone: '', village: 'BELKOTI', notes: '', createdAt: '2026-08-01T10:00:00.000Z' }
];

// Pre-seeded GTCO Advances from Paisabhai & Test Scenario
function getInitialSeedAdvances() {
  return [
    // Concrete Reference Scenario Advances
    { id: 'ADV-001', advanceNumber: 'ADV-001', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-08-10', originalAmount: 1000, deductedAmount: 1000, unpaidBalance: 0, purpose: 'Cultivation', notes: 'Initial Cultivation Advance for land prep', status: 'PAID', deductionHistory: [{ billId: 'BILL-101', billNumber: 'BILL-101', commodity: 'Moong (Green Gram)', amountDeducted: 1000, deductionDate: '2026-11-01', notes: 'Full deduction settled against Bill #101' }] },
    { id: 'ADV-002', advanceNumber: 'ADV-002', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-09-05', originalAmount: 5000, deductedAmount: 5000, unpaidBalance: 0, purpose: 'Harvesting', notes: 'Harvesting Expenses for labor', status: 'PAID', deductionHistory: [{ billId: 'BILL-101', billNumber: 'BILL-101', commodity: 'Moong (Green Gram)', amountDeducted: 5000, deductionDate: '2026-11-01', notes: 'Full deduction settled against Bill #101' }] },
    { id: 'ADV-003', advanceNumber: 'ADV-003', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-09-25', originalAmount: 10000, deductedAmount: 10000, unpaidBalance: 0, purpose: 'Fertilizer & Pesticide', notes: 'Nutrient spray & pesticide supplies', status: 'PAID', deductionHistory: [{ billId: 'BILL-101', billNumber: 'BILL-101', commodity: 'Moong (Green Gram)', amountDeducted: 10000, deductionDate: '2026-11-01', notes: 'Full deduction settled against Bill #101' }] },
    { id: 'ADV-004', advanceNumber: 'ADV-004', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-10-15', originalAmount: 50000, deductedAmount: 34000, unpaidBalance: 16000, purpose: 'Personal Use', notes: 'Emergency personal cash advance', status: 'PARTIALLY PAID', deductionHistory: [{ billId: 'BILL-101', billNumber: 'BILL-101', commodity: 'Moong (Green Gram)', amountDeducted: 34000, deductionDate: '2026-11-01', notes: 'Partial deduction of ₹34,000 against Bill #101. ₹16,000 carries forward.' }] },

    // Seeds Advances Given to Farmers
    { id: 'ADV-SEED-01', advanceNumber: 'ADV-SEED-01', farmerId: 'FARMER-SMP', farmerName: 'SMPATIL', date: '2026-08-05', originalAmount: 9000, deductedAmount: 0, unpaidBalance: 9000, purpose: 'Seeds', notes: 'Given 2 Bags (100kg) Certified Urad Seeds @ ₹4,500/bag for kharif sowing [Return expected: Urad harvest bags]', status: 'UNPAID', deductionHistory: [] },
    { id: 'ADV-SEED-02', advanceNumber: 'ADV-SEED-02', farmerId: 'FARMER-RM', farmerName: 'RAJU MANKAR', date: '2026-08-12', originalAmount: 4500, deductedAmount: 0, unpaidBalance: 4500, purpose: 'Seeds', notes: 'Given 1 Bag (50kg) Urad Seeds @ ₹4,500 [Produce return in Mandi]', status: 'UNPAID', deductionHistory: [] },
    { id: 'ADV-SEED-03', advanceNumber: 'ADV-SEED-03', farmerId: 'FARMER-BS', farmerName: 'BASWARAJ SHARNAIYYA', date: '2026-08-14', originalAmount: 13500, deductedAmount: 0, unpaidBalance: 13500, purpose: 'Seeds', notes: 'Given 3 Bags Urad Seeds @ ₹4,500/bag', status: 'UNPAID', deductionHistory: [] },

    // GTCO Advances & Fertilizers/Pesticides from Paisabhai Ledger
    { id: 'ADV-PB-213', advanceNumber: 'ADV-PB-213', farmerId: 'FARMER-RMAD', farmerName: 'RAJU MADIVAL', date: '2026-08-19', originalAmount: 3000, deductedAmount: 0, unpaidBalance: 3000, purpose: 'Cultivation', notes: 'Cash advance given [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_213' },
    { id: 'ADV-PB-214', advanceNumber: 'ADV-PB-214', farmerId: 'FARMER-JSHET', farmerName: 'JAGU SHETTY', date: '2026-08-19', originalAmount: 1000, deductedAmount: 0, unpaidBalance: 1000, purpose: 'Cultivation', notes: 'Advance [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_214' },
    { id: 'ADV-PB-215', advanceNumber: 'ADV-PB-215', farmerId: 'FARMER-MKUR', farmerName: 'MAHESH KURKUNTA', date: '2026-08-19', originalAmount: 4000, deductedAmount: 0, unpaidBalance: 4000, purpose: 'Cultivation', notes: 'Advance [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_215' },
    { id: 'ADV-PB-216', advanceNumber: 'ADV-PB-216', farmerId: 'FARMER-UKUM', farmerName: 'UDAY KUMAR', date: '2026-08-19', originalAmount: 3000, deductedAmount: 0, unpaidBalance: 3000, purpose: 'Cultivation', notes: 'Advance [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_216' },
    { id: 'ADV-PB-218', advanceNumber: 'ADV-PB-218', farmerId: 'FARMER-SP', farmerName: 'SHARNU POST', date: '2026-08-19', originalAmount: 3000, deductedAmount: 0, unpaidBalance: 3000, purpose: 'Cultivation', notes: 'Advance [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_218' },
    { id: 'ADV-PB-171', advanceNumber: 'ADV-PB-171', farmerId: 'FARMER-DAND', farmerName: 'DANDAPPA', date: '2026-08-15', originalAmount: 500, deductedAmount: 0, unpaidBalance: 500, purpose: 'Fertilizer & Pesticide', notes: 'Crop Medicine / Spray distribution [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_171' },
    { id: 'ADV-PB-321', advanceNumber: 'ADV-PB-321', farmerId: 'FARMER-SIDBEL', farmerName: 'SIDDAPPA BELKOTI', date: '2026-06-04', originalAmount: 20000, deductedAmount: 0, unpaidBalance: 20000, purpose: 'Cultivation', notes: 'Early season advance [Synced from Paisabhai GTCO]', status: 'UNPAID', deductionHistory: [], paisabhaiTxId: 'tx_hist_321' }
  ];
}

// Initial Bill #101 Settled
function getInitialSeedBills() {
  return [
    {
      id: 'BILL-101',
      billNumber: 'BILL-101',
      farmerId: 'FARMER-001',
      farmerName: 'Rameshwar Patil',
      farmerVillage: 'Neelahalli',
      date: '2026-11-01',
      commodity: 'Moong (Green Gram)',
      quantity: 6.25,
      unit: 'Quintals',
      rate: 8000,
      grossAmount: 50000,
      totalAdvancesDeducted: 50000,
      netPayableCash: 0,
      leftoverAdvancesCarriedForward: 16000,
      notes: 'Produce brought to GTCO Mandi shop. Full bill amount adjusted against advances #1, #2, #3 and partial #4.',
      deductions: [
        { advanceId: 'ADV-001', advanceNumber: 'ADV-001', advancePurpose: 'Cultivation', advanceOriginalAmount: 1000, amountDeducted: 1000, advanceRemainingBalanceBefore: 1000, advanceRemainingBalanceAfter: 0 },
        { advanceId: 'ADV-002', advanceNumber: 'ADV-002', advancePurpose: 'Harvesting', advanceOriginalAmount: 5000, amountDeducted: 5000, advanceRemainingBalanceBefore: 5000, advanceRemainingBalanceAfter: 0 },
        { advanceId: 'ADV-003', advanceNumber: 'ADV-003', advancePurpose: 'Fertilizer & Pesticide', advanceOriginalAmount: 10000, amountDeducted: 10000, advanceRemainingBalanceBefore: 10000, advanceRemainingBalanceAfter: 0 },
        { advanceId: 'ADV-004', advanceNumber: 'ADV-004', advancePurpose: 'Personal Use', advanceOriginalAmount: 50000, amountDeducted: 34000, advanceRemainingBalanceBefore: 50000, advanceRemainingBalanceAfter: 16000 }
      ],
      createdAt: '2026-11-01T11:30:00.000Z'
    }
  ];
}

// ==========================================
// STATE MANAGEMENT
// ==========================================

let state = {
  farmers: [],
  advances: [],
  bills: [],
  customCommodities: [],
  activeTab: 'dashboard',
  filters: {
    advanceFarmer: 'all',
    advancePurpose: 'all',
    advanceStatus: 'all',
    advanceSearch: '',
    billFarmer: 'all',
    billCommodity: 'all',
    billSearch: '',
    farmerSearch: ''
  }
};

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
// REAL-TIME SYNC ENGINE (PAISABHAI + STOCK TRACKER)
// ==========================================

function syncWithPaisabhai(notify = false) {
  try {
    const rawPaisabhai = localStorage.getItem(PAISABHAI_STORAGE_KEY);
    if (!rawPaisabhai) {
      if (notify) showToast('Paisabhai store not found in this browser yet. When you enter GTCO transactions in Paisabhai, they appear here automatically!');
      return 0;
    }

    const pbData = JSON.parse(rawPaisabhai);
    if (!pbData || !pbData.transactions) return 0;

    // Find GTCO particular
    const gtcoPart = (pbData.master?.particulars || []).find(p => (p.name || '').trim().toUpperCase() === 'GTCO' || p.id === 'part_3');
    const gtcoPartId = gtcoPart ? gtcoPart.id : 'part_3';

    const gtcoTxList = pbData.transactions.filter(t => t.particularId === gtcoPartId);
    if (gtcoTxList.length === 0) return 0;

    const catMap = {};
    (pbData.master?.categories || []).forEach(c => { catMap[c.id] = (c.name || '').toUpperCase(); });

    let syncedCount = 0;

    gtcoTxList.forEach(tx => {
      const catName = catMap[tx.categoryId] || '';
      const person = (tx.personName || '').trim();
      if (!person || person === '-' || person === 'N/A') return;

      const isAdvance = catName.includes('ADVANCE');
      const isFertilizer = catName.includes('FERTILIZER') || catName.includes('DAP');
      const isPesticide = catName.includes('MEDICINE') || catName.includes('PESTICIDE');
      const isSeeds = catName.includes('SEED');

      // Ensure farmer exists
      let farmer = state.farmers.find(f => (f.name || '').trim().toLowerCase() === person.toLowerCase());
      if (!farmer) {
        farmer = {
          id: 'FARMER-PB-' + Math.abs(person.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)),
          name: person,
          phone: '',
          village: 'NEELAHALLI',
          notes: 'Synced from Paisabhai GTCO ledger',
          createdAt: new Date().toISOString()
        };
        state.farmers.push(farmer);
      }

      if (isAdvance || isFertilizer || isPesticide || isSeeds) {
        const purpose = (isFertilizer || isPesticide) ? 'Fertilizer & Pesticide'
                      : isSeeds ? 'Seeds'
                      : 'Cultivation';

        const amt = Number(tx.amount) || 0;
        const existingAdv = state.advances.find(a => a.paisabhaiTxId === tx.id || a.id === `ADV-PB-${tx.id}`);

        if (!existingAdv) {
          state.advances.push({
            id: `ADV-PB-${tx.id}`,
            advanceNumber: `ADV-PB-${(tx.id || '').replace('tx_hist_', '').replace('tx_', '')}`,
            farmerId: farmer.id,
            farmerName: farmer.name,
            date: tx.date || new Date().toISOString().split('T')[0],
            originalAmount: amt,
            deductedAmount: 0,
            unpaidBalance: amt,
            purpose: purpose,
            notes: `${catName} via ${tx.paymentMode || 'Cash'} [Synced from Paisabhai GTCO]`,
            status: 'UNPAID',
            deductionHistory: [],
            paisabhaiTxId: tx.id
          });
          syncedCount++;
        } else {
          // If transaction amount or date changed in Paisabhai, update while preserving settlement status
          if (existingAdv.originalAmount !== amt || existingAdv.date !== tx.date) {
            existingAdv.originalAmount = amt;
            existingAdv.date = tx.date;
            existingAdv.unpaidBalance = Math.max(0, amt - (existingAdv.deductedAmount || 0));
            existingAdv.status = existingAdv.unpaidBalance === 0 ? 'PAID' : (existingAdv.deductedAmount > 0 ? 'PARTIALLY PAID' : 'UNPAID');
            syncedCount++;
          }
        }
      }
    });

    if (syncedCount > 0) {
      saveState();
      renderActiveView();
    }

    if (notify) {
      showToast(`⚡ Synced with Paisabhai: Checked ${gtcoTxList.length} GTCO entries across ${state.farmers.length} farmers!`);
    }

    return syncedCount;
  } catch (e) {
    console.error('Error in syncWithPaisabhai:', e);
    return 0;
  }
}

function syncWithStockTracker(notify = false) {
  try {
    const rawStock = localStorage.getItem(STOCK_TRACKER_STORAGE_KEY);
    if (!rawStock) return 0;

    const stockData = JSON.parse(rawStock);
    if (!stockData || !stockData.masters || !stockData.masters.farmers) return 0;

    let addedFarmers = 0;
    stockData.masters.farmers.forEach(sf => {
      const exists = state.farmers.find(f => (f.name || '').trim().toLowerCase() === (sf.name || '').trim().toLowerCase() || f.id === sf.id);
      if (!exists) {
        state.farmers.push({
          id: sf.id || ('FARMER-ST-' + Date.now()),
          name: sf.name,
          phone: sf.mobile || '',
          village: sf.village || 'NEELAHALLI',
          notes: sf.notes || 'From GTCO Stock Tracker',
          createdAt: new Date().toISOString()
        });
        addedFarmers++;
      }
    });

    if (addedFarmers > 0) {
      saveState();
      renderActiveView();
    }
    return addedFarmers;
  } catch (e) {
    console.error('Error syncing Stock Tracker:', e);
    return 0;
  }
}

function syncAllEcosystemData(notify = true) {
  const pCount = syncWithPaisabhai(false);
  const sCount = syncWithStockTracker(false);
  updateSyncStatusBadge();
  renderActiveView();
  if (notify) {
    showToast(`⚡ Real-Time Sync Complete: Paisabhai GTCO ledger & Stock Tracker synchronized!`);
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
    badge.innerHTML = '● Standalone / Shared Domain Active';
  }
}

// Push advance back into Paisabhai storage if user records an advance in GTCO-LEDGER
function pushAdvanceToPaisabhai(newAdv) {
  try {
    const raw = localStorage.getItem(PAISABHAI_STORAGE_KEY);
    if (!raw) return;

    const pb = JSON.parse(raw);
    if (!pb || !pb.transactions) return;

    const gtcoPart = (pb.master?.particulars || []).find(p => (p.name || '').trim().toUpperCase() === 'GTCO' || p.id === 'part_3');
    const gtcoPartId = gtcoPart ? gtcoPart.id : 'part_3';

    // Map category
    let catId = 'cat_1'; // ADVANCE
    if (newAdv.purpose === 'Fertilizer & Pesticide') catId = 'cat_31'; // FERTILIZER

    const newPbTx = {
      id: 'tx_gtco_' + Date.now(),
      date: newAdv.date,
      particularId: gtcoPartId,
      categoryId: catId,
      personName: newAdv.farmerName,
      amount: newAdv.originalAmount,
      paymentMode: 'Cash',
      notes: `${newAdv.purpose}: ${newAdv.notes || ''} [From GTCO-LEDGER]`,
      media: null
    };

    pb.transactions.push(newPbTx);
    localStorage.setItem(PAISABHAI_STORAGE_KEY, JSON.stringify(pb));
  } catch (e) {
    console.warn('Could not push to Paisabhai:', e);
  }
}

// Storage helpers
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.farmers = parsed.farmers || [];
      state.advances = parsed.advances || [];
      state.bills = parsed.bills || [];
      state.customCommodities = parsed.customCommodities || [];
    } else {
      state.farmers = INITIAL_MANDI_FARMERS;
      state.advances = getInitialSeedAdvances();
      state.bills = getInitialSeedBills();
      state.customCommodities = [];
      saveState();
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    state.farmers = INITIAL_MANDI_FARMERS;
    state.advances = getInitialSeedAdvances();
    state.bills = getInitialSeedBills();
    state.customCommodities = [];
  }

  // Auto-sync on startup
  syncWithPaisabhai(false);
  syncWithStockTracker(false);
  updateSyncStatusBadge();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      farmers: state.farmers,
      advances: state.advances,
      bills: state.bills,
      customCommodities: state.customCommodities
    }));
  } catch (e) {
    console.error('Error saving state:', e);
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
  return state.farmers.find(f => f.id === id);
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
  const totalAdvancesGiven = state.advances.reduce((acc, a) => acc + (Number(a.originalAmount) || 0), 0);
  const totalAdvancesDeducted = state.advances.reduce((acc, a) => acc + (Number(a.deductedAmount) || 0), 0);
  const totalOutstandingBalance = state.advances.reduce((acc, a) => acc + (Number(a.unpaidBalance) || 0), 0);
  const totalGrossBills = state.bills.reduce((acc, b) => acc + (Number(b.grossAmount) || 0), 0);
  const totalNetCashPaid = state.bills.reduce((acc, b) => acc + (Number(b.netPayableCash) || 0), 0);

  return {
    totalAdvancesGiven,
    totalAdvancesDeducted,
    totalOutstandingBalance,
    totalGrossBills,
    totalNetCashPaid,
    farmersCount: state.farmers.length,
    advancesCount: state.advances.length,
    billsCount: state.bills.length
  };
}

function getNextBillNumber() {
  if (state.bills.length === 0) return 'BILL-101';
  const nums = state.bills.map(b => {
    const match = b.billNumber.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 100;
  });
  const max = Math.max(...nums, 100);
  return `BILL-${max + 1}`;
}

function getNextAdvanceNumber() {
  if (state.advances.length === 0) return 'ADV-001';
  const nums = state.advances.map(a => {
    const match = a.advanceNumber.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const max = Math.max(...nums, 0);
  return `ADV-${String(max + 1).padStart(3, '0')}`;
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

  ['dashboard', 'advances', 'bills', 'farmers'].forEach(t => {
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

function renderActiveView() {
  if (state.activeTab === 'dashboard') renderDashboard();
  else if (state.activeTab === 'advances') renderAdvancesLedger();
  else if (state.activeTab === 'bills') renderBillsLedger();
  else if (state.activeTab === 'farmers') renderFarmersDirectory();

  if (window.lucide) window.lucide.createIcons();
}

// 1. Dashboard View
function renderDashboard() {
  const m = getGlobalMetrics();

  document.getElementById('dash-total-advances').innerText = formatINR(m.totalAdvancesGiven);
  document.getElementById('dash-total-deducted').innerText = formatINR(m.totalAdvancesDeducted);
  document.getElementById('dash-remaining-balance').innerText = formatINR(m.totalOutstandingBalance);
  document.getElementById('dash-total-bills').innerText = formatINR(m.totalGrossBills);
  document.getElementById('dash-net-cash-paid').innerText = formatINR(m.totalNetCashPaid);

  document.getElementById('dash-farmers-count').innerText = m.farmersCount;
  document.getElementById('dash-advances-count').innerText = m.advancesCount;
  document.getElementById('dash-bills-count').innerText = m.billsCount;

  // Advances by Purpose Breakdown
  const purposeContainer = document.getElementById('dash-purpose-breakdown');
  if (purposeContainer) {
    const purposeTotals = {};
    state.advances.forEach(a => {
      purposeTotals[a.purpose] = (purposeTotals[a.purpose] || 0) + (Number(a.originalAmount) || 0);
    });

    purposeContainer.innerHTML = Object.entries(purposeTotals).map(([p, amt]) => {
      const pIcon = p === 'Seeds' ? '🌱' : (p === 'Fertilizer & Pesticide' ? '🧪' : '💵');
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
    state.bills.forEach(b => {
      commoditySales[b.commodity] = (commoditySales[b.commodity] || 0) + (Number(b.grossAmount) || 0);
    });

    const entries = Object.entries(commoditySales);
    if (entries.length === 0) {
      commContainer.innerHTML = `
        <div class="col-span-full py-4 text-center text-slate-400 text-xs italic">
          No commodity bills recorded yet. Create a produce bill to see distribution.
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
    const recentAdv = [...state.advances].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    if (recentAdv.length === 0) {
      recentAdvContainer.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs italic">No advances recorded yet.</div>`;
    } else {
      recentAdvContainer.innerHTML = recentAdv.map(a => `
        <div class="flex items-center justify-between p-3 hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono font-semibold text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">${a.advanceNumber}</span>
              <span class="font-medium text-sm text-slate-800">${a.farmerName}</span>
              <span class="text-xs font-semibold ${a.purpose === 'Seeds' ? 'text-emerald-700' : 'text-slate-500'}">(${a.purpose === 'Seeds' ? '🌱 Seeds' : a.purpose})</span>
            </div>
            <div class="text-xs text-slate-400 mt-0.5">${formatDate(a.date)} ${a.paisabhaiTxId ? '• <span class="text-indigo-600 font-medium">Paisabhai Synced</span>' : ''}</div>
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
    const recentBills = [...state.bills].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    if (recentBills.length === 0) {
      recentBillsContainer.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs italic">No bills recorded yet.</div>`;
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
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

// 2. Advances Ledger View
function renderAdvancesLedger() {
  populateFarmerDropdown('filter-advance-farmer', state.filters.advanceFarmer, true);

  const container = document.getElementById('advances-table-body');
  if (!container) return;

  let list = [...state.advances];

  // Filters
  if (state.filters.advanceFarmer !== 'all') {
    list = list.filter(a => a.farmerId === state.filters.advanceFarmer);
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
      a.purpose.toLowerCase().includes(s) ||
      (a.notes && a.notes.toLowerCase().includes(s))
    );
  }

  // Sort: newest date first
  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (list.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400 italic">
          No advances found matching your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = list.map(adv => {
    const farmer = getFarmerById(adv.farmerId);
    const deductions = adv.deductionHistory || [];
    const hasDeductions = deductions.length > 0;

    const deductionsHtml = hasDeductions ? `
      <div class="mt-2.5 pt-2 border-t border-dashed border-slate-200">
        <div class="text-[11px] font-semibold text-slate-600 flex items-center space-x-1 mb-1">
          <i data-lucide="history" class="w-3.5 h-3.5 text-emerald-600"></i>
          <span>Deduction History (${deductions.length} ${deductions.length === 1 ? 'bill' : 'bills'}):</span>
        </div>
        <div class="space-y-1">
          ${deductions.map(d => `
            <div class="flex items-center justify-between text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-emerald-700">${d.billNumber}</span>
                <span class="text-slate-600">• ${d.commodity}</span>
                <span class="text-slate-400 text-[10px]">(${formatDate(d.deductionDate)})</span>
              </div>
              <span class="font-mono font-semibold text-emerald-800">Deducted: ${formatINR(d.amountDeducted)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : `
      <div class="text-[11px] text-slate-400 italic mt-1">No deductions yet — Full balance carries forward</div>
    `;

    const purposeIcon = adv.purpose === 'Seeds' ? '🌱' : (adv.purpose === 'Fertilizer & Pesticide' ? '🧪' : '💵');

    return `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
        <td class="py-3.5 px-4 font-mono font-semibold text-xs text-slate-700 whitespace-nowrap align-top">
          ${adv.advanceNumber}
          ${adv.paisabhaiTxId ? '<div class="text-[10px] text-indigo-700 font-mono font-bold">Paisabhai</div>' : ''}
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap align-top">
          ${formatDate(adv.date)}
        </td>
        <td class="py-3.5 px-4 align-top">
          <div class="font-semibold text-sm text-slate-800">${adv.farmerName}</div>
          <div class="text-xs text-slate-500">${farmer ? farmer.village : 'Neelahalli'}</div>
          <div class="mt-1 flex flex-wrap items-center gap-1">
            <span class="inline-flex items-center text-[11px] font-bold border px-2 py-0.5 rounded ${getPurposeBadgeClass(adv.purpose)}">
              <span class="mr-1">${purposeIcon}</span> ${adv.purpose}
            </span>
            ${adv.notes ? `<span class="text-xs text-slate-600 ml-1 italic font-normal">"${adv.notes}"</span>` : ''}
          </div>
          ${deductionsHtml}
        </td>
        <td class="py-3.5 px-4 font-mono font-bold text-sm text-slate-800 text-right whitespace-nowrap align-top">
          ${formatINR(adv.originalAmount)}
        </td>
        <td class="py-3.5 px-4 font-mono font-semibold text-sm text-emerald-700 text-right whitespace-nowrap align-top">
          ${formatINR(adv.deductedAmount)}
        </td>
        <td class="py-3.5 px-4 font-mono font-bold text-sm text-amber-700 text-right whitespace-nowrap align-top">
          ${formatINR(adv.unpaidBalance)}
        </td>
        <td class="py-3.5 px-4 text-center whitespace-nowrap align-top">
          <span class="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(adv.status)}">
            ${adv.status}
          </span>
          <div class="mt-2 flex items-center justify-center space-x-1">
            <button onclick="deleteAdvance('${adv.id}')" class="text-slate-400 hover:text-red-600 p-1 rounded transition" title="Delete Advance">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Bills Ledger View
function renderBillsLedger() {
  populateFarmerDropdown('filter-bill-farmer', state.filters.billFarmer, true);

  const container = document.getElementById('bills-table-body');
  if (!container) return;

  let list = [...state.bills];

  if (state.filters.billFarmer !== 'all') {
    list = list.filter(b => b.farmerId === state.filters.billFarmer);
  }
  if (state.filters.billCommodity !== 'all') {
    list = list.filter(b => b.commodity.toLowerCase() === state.filters.billCommodity.toLowerCase());
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

  if (list.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400 italic">
          No bills found matching your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = list.map(bill => {
    const deductions = bill.deductions || [];
    const commObj = getAllCommodities().find(c => c.name.toLowerCase() === bill.commodity.toLowerCase()) || { badgeClass: 'commodity-custom' };

    const deductionsSummary = deductions.length > 0 ? `
      <div class="mt-2 pt-2 border-t border-dashed border-slate-200">
        <div class="text-[11px] font-semibold text-slate-600 mb-1">
          Settled Advances (${deductions.length}):
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${deductions.map(d => `
            <span class="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
              <span class="font-bold text-slate-900 mr-1">${d.advanceNumber}</span>
              <span class="text-emerald-700">(${formatINR(d.amountDeducted)})</span>
            </span>
          `).join('')}
        </div>
      </div>
    ` : `<div class="text-[11px] text-slate-400 italic mt-1">No advance deductions adjusted in this bill</div>`;

    return `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
        <td class="py-3.5 px-4 font-mono font-bold text-xs text-emerald-800 whitespace-nowrap align-top">
          ${bill.billNumber}
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap align-top">
          ${formatDate(bill.date)}
        </td>
        <td class="py-3.5 px-4 align-top">
          <div class="font-semibold text-sm text-slate-800">${bill.farmerName}</div>
          <div class="text-xs text-slate-500">${bill.farmerVillage || ''}</div>
          <div class="mt-1 flex items-center space-x-1.5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${commObj.badgeClass}">${bill.commodity}</span>
            ${bill.quantity ? `<span class="text-xs text-slate-500 font-mono">${bill.quantity} ${bill.unit || 'Qtl'} @ ${formatINR(bill.rate)}</span>` : ''}
          </div>
          ${deductionsSummary}
        </td>
        <td class="py-3.5 px-4 font-mono font-bold text-sm text-slate-800 text-right whitespace-nowrap align-top">
          ${formatINR(bill.grossAmount)}
        </td>
        <td class="py-3.5 px-4 font-mono font-bold text-sm text-amber-700 text-right whitespace-nowrap align-top">
          ${formatINR(bill.totalAdvancesDeducted)}
        </td>
        <td class="py-3.5 px-4 font-mono font-extrabold text-sm text-emerald-700 text-right whitespace-nowrap align-top">
          ${formatINR(bill.netPayableCash)}
        </td>
        <td class="py-3.5 px-4 text-center whitespace-nowrap align-top">
          <div class="flex items-center justify-center space-x-1.5">
            <button onclick="viewBillReceipt('${bill.id}')" class="inline-flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded transition border border-emerald-200">
              <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
              <span>Receipt</span>
            </button>
            <button onclick="deleteBill('${bill.id}')" class="text-slate-400 hover:text-red-600 p-1 rounded transition" title="Delete Bill & Revert Deductions">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <div class="text-[10px] text-slate-400 mt-1.5 font-mono">
            Leftover: ${formatINR(bill.leftoverAdvancesCarriedForward || 0)}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. Farmers Directory View
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

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 italic">
        No farmers found matching your search.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(f => {
    const m = getFarmerMetrics(f.id);

    return `
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-bold text-base text-slate-800">${f.name}</h3>
              <div class="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                <span><i data-lucide="map-pin" class="w-3 h-3 inline text-slate-400"></i> ${f.village || 'Neelahalli'}</span>
                ${f.phone ? `<span><i data-lucide="phone" class="w-3 h-3 inline text-slate-400"></i> ${f.phone}</span>` : ''}
              </div>
            </div>
            <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              ${m.billsCount} Bills
            </span>
          </div>

          ${f.notes ? `<p class="text-xs text-slate-500 mt-2 line-clamp-2 italic">"${f.notes}"</p>` : ''}

          <!-- Metric Cards -->
          <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div class="bg-slate-50 p-2 rounded border border-slate-100">
              <span class="text-slate-500 text-[11px] block">Total Advances</span>
              <span class="font-mono font-bold text-slate-800">${formatINR(m.totalAdvances)}</span>
            </div>
            <div class="bg-emerald-50/60 p-2 rounded border border-emerald-100">
              <span class="text-emerald-700 text-[11px] block">Deducted in Bills</span>
              <span class="font-mono font-bold text-emerald-800">${formatINR(m.totalDeducted)}</span>
            </div>
            <div class="bg-amber-50/60 p-2 rounded border border-amber-100">
              <span class="text-amber-800 text-[11px] block font-semibold">Unpaid Balance</span>
              <span class="font-mono font-bold text-amber-800">${formatINR(m.remainingAdvanceBalance)}</span>
            </div>
            <div class="bg-blue-50/60 p-2 rounded border border-blue-100">
              <span class="text-blue-700 text-[11px] block">Total Produce Bills</span>
              <span class="font-mono font-bold text-blue-800">${formatINR(m.totalBillsValue)}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button onclick="viewFarmerStatement('${f.id}')" class="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
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

function populateFarmerDropdown(elementId, selectedId = '', includeAllOption = false) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let options = '';
  if (includeAllOption) {
    options += `<option value="all" ${selectedId === 'all' ? 'selected' : ''}>All Farmers</option>`;
  } else {
    options += `<option value="">-- Select Farmer --</option>`;
  }

  // Sort farmers alphabetically
  const sorted = [...state.farmers].sort((a, b) => a.name.localeCompare(b.name));

  sorted.forEach(f => {
    const isSelected = f.id === selectedId || f.name.toLowerCase() === selectedId.toLowerCase() ? 'selected' : '';
    options += `<option value="${f.id}" ${isSelected}>${f.name} (${f.village || 'NEELAHALLI'})</option>`;
  });

  el.innerHTML = options;
}

// ==========================================
// ADVANCE & SEEDS & FERTILIZER CREATION
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

  const newAdv = {
    id: 'ADV-' + Date.now(),
    advanceNumber: document.getElementById('advance-number').value.trim() || getNextAdvanceNumber(),
    farmerId: farmer.id,
    farmerName: farmer.name,
    date: document.getElementById('advance-date').value || new Date().toISOString().split('T')[0],
    originalAmount: amount,
    deductedAmount: 0,
    unpaidBalance: amount,
    purpose: purpose,
    notes: customNotes,
    status: 'UNPAID',
    deductionHistory: []
  };

  state.advances.push(newAdv);
  saveState();

  // Push back into Paisabhai cashbook
  pushAdvanceToPaisabhai(newAdv);

  closeModal('modal-record-advance');
  renderActiveView();

  showToast(`${purpose === 'Seeds' ? '🌱 Seed' : '💰'} Advance ${newAdv.advanceNumber} (${formatINR(amount)}) recorded for ${farmer.name} & synced with Paisabhai!`);
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

let activeBillDeductions = {};

function openNewBillModal(preselectedFarmerId = '') {
  populateFarmerDropdown('bill-farmer-select', preselectedFarmerId);

  document.getElementById('bill-number').value = getNextBillNumber();
  document.getElementById('bill-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('bill-commodity').value = 'Urad (Black Gram)';
  document.getElementById('bill-custom-commodity').value = '';
  document.getElementById('bill-custom-commodity-group').classList.add('hidden');

  document.getElementById('bill-quantity').value = '';
  document.getElementById('bill-rate').value = '';
  document.getElementById('bill-gross-amount').value = '';
  document.getElementById('bill-notes').value = '';

  activeBillDeductions = {};

  if (preselectedFarmerId) {
    onBillFarmerSelected(preselectedFarmerId);
  } else {
    document.getElementById('bill-advances-section').classList.add('hidden');
    document.getElementById('bill-farmer-summary-banner').classList.add('hidden');
    updateBillSettlementCalculations();
  }

  openModal('modal-new-bill');
}

function onBillCommodityChanged() {
  const sel = document.getElementById('bill-commodity').value;
  const customGroup = document.getElementById('bill-custom-commodity-group');
  if (sel === 'CUSTOM') {
    customGroup.classList.remove('hidden');
  } else {
    customGroup.classList.add('hidden');
  }
}

function onBillFarmerSelected(farmerId) {
  if (!farmerId) {
    document.getElementById('bill-advances-section').classList.add('hidden');
    document.getElementById('bill-farmer-summary-banner').classList.add('hidden');
    activeBillDeductions = {};
    updateBillSettlementCalculations();
    return;
  }

  const farmer = getFarmerById(farmerId);
  const metrics = getFarmerMetrics(farmerId);

  // Check for inward produce lots in Stock Tracker
  let stockLots = [];
  try {
    const rawStock = localStorage.getItem(STOCK_TRACKER_STORAGE_KEY);
    if (rawStock) {
      const parsedStock = JSON.parse(rawStock);
      if (parsedStock && parsedStock.inwardLots) {
        stockLots = parsedStock.inwardLots.filter(l =>
          (l.farmerId || '').toLowerCase() === (farmer.id || '').toLowerCase() ||
          (l.farmerName || '').toLowerCase() === (farmer.name || '').toLowerCase()
        );
      }
    }
  } catch (e) {}

  const banner = document.getElementById('bill-farmer-summary-banner');
  banner.classList.remove('hidden');

  let stockLotsHtml = '';
  if (stockLots.length > 0) {
    stockLotsHtml = `
      <div class="pt-2 border-t border-slate-200 mt-2">
        <div class="text-[11px] font-bold text-amber-900 mb-1 flex items-center justify-between">
          <span>📦 Inward Produce Recorded in Stock Tracker (${stockLots.length} Lots):</span>
          <span class="text-[10px] text-amber-700">Click to Auto-fill</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${stockLots.map(l => `
            <button type="button" onclick="autoFillProduceFromStockTracker('${l.lotId}', ${l.unweighedBags})" class="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono px-2 py-1 rounded border border-amber-300 transition">
              Lot ${l.lotId}: ${l.unweighedBags} Bags • ${l.status || 'Received'}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  banner.innerHTML = `
    <div class="flex flex-wrap items-center justify-between text-xs gap-2">
      <div>
        <span class="font-bold text-slate-800 text-sm">${farmer.name}</span>
        <span class="text-slate-500 ml-1">(${farmer.village || 'Neelahalli'})</span>
      </div>
      <div class="flex items-center space-x-3 font-mono">
        <div>
          <span class="text-slate-500">Unpaid Advances:</span>
          <span class="font-bold text-amber-700 ml-1 text-sm">${formatINR(metrics.remainingAdvanceBalance)}</span>
        </div>
        ${metrics.totalSeedsValue > 0 ? `
          <div>
            <span class="text-slate-500">Seeds Value:</span>
            <span class="font-bold text-emerald-700 ml-1">🌱 ${formatINR(metrics.totalSeedsValue)}</span>
          </div>
        ` : ''}
      </div>
    </div>
    ${stockLotsHtml}
  `;

  // Filter outstanding advances for this farmer (Seeds, Cash, Fertilizer)
  const outstandingAdvances = state.advances
    .filter(a => a.farmerId === farmerId && a.status !== 'PAID' && a.unpaidBalance > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  activeBillDeductions = {};
  renderBillOutstandingAdvances(outstandingAdvances);
  updateBillSettlementCalculations();
}

function autoFillProduceFromStockTracker(lotId, bags) {
  document.getElementById('bill-commodity').value = 'Urad (Black Gram)';
  document.getElementById('bill-quantity').value = bags;
  document.getElementById('bill-unit').value = 'Bags (50kg)';
  document.getElementById('bill-rate').value = 3800; // standard approx rate per bag
  document.getElementById('bill-gross-amount').value = bags * 3800;
  document.getElementById('bill-notes').value = `Harvest produce returned from Stock Tracker Lot ${lotId} (${bags} bags)`;
  updateBillSettlementCalculations();
  showToast(`Auto-filled produce return from Stock Tracker Lot ${lotId}: ${bags} Bags!`);
}

function renderBillOutstandingAdvances(advances) {
  const section = document.getElementById('bill-advances-section');
  const container = document.getElementById('bill-advances-list');

  section.classList.remove('hidden');

  if (advances.length === 0) {
    container.innerHTML = `
      <div class="py-4 text-center text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-slate-200">
        No outstanding unpaid advances found for this farmer. All previous advances are fully settled!
      </div>
    `;
    return;
  }

  container.innerHTML = advances.map(adv => {
    const currentDeduction = activeBillDeductions[adv.id] || 0;
    const isChecked = currentDeduction > 0;
    const pIcon = adv.purpose === 'Seeds' ? '🌱' : (adv.purpose === 'Fertilizer & Pesticide' ? '🧪' : '💵');

    return `
      <div class="p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="adv-row-${adv.id}">
        <div class="flex items-start space-x-3">
          <input type="checkbox" id="check-${adv.id}" onchange="toggleAdvanceCheckbox('${adv.id}', ${adv.unpaidBalance})" ${isChecked ? 'checked' : ''} class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">${adv.advanceNumber}</span>
              <span class="text-xs font-semibold text-slate-700">${pIcon} ${adv.purpose}</span>
              <span class="text-[10px] font-semibold px-2 py-0.2 rounded-full ${getStatusBadgeClass(adv.status)}">${adv.status}</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Issued: ${formatDate(adv.date)} • Original: <span class="font-mono font-medium">${formatINR(adv.originalAmount)}</span>
              ${adv.deductedAmount > 0 ? ` • Already Paid: <span class="font-mono text-emerald-700">${formatINR(adv.deductedAmount)}</span>` : ''}
            </div>
            ${adv.notes ? `<div class="text-[11px] text-slate-500 italic">"${adv.notes}"</div>` : ''}
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:self-center">
          <div class="text-right">
            <span class="text-[10px] text-slate-400 uppercase block font-semibold">Unpaid Balance</span>
            <span class="font-mono font-bold text-sm text-amber-700">${formatINR(adv.unpaidBalance)}</span>
          </div>

          <div class="flex items-center space-x-1 pl-3 border-l border-slate-200">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-2 flex items-center text-xs text-slate-400 font-mono">₹</span>
              <input type="number" id="input-deduct-${adv.id}" value="${currentDeduction > 0 ? currentDeduction : ''}" placeholder="0" min="0" max="${adv.unpaidBalance}" oninput="onAdvanceDeductInput('${adv.id}', ${adv.unpaidBalance})" class="w-28 pl-6 pr-2 py-1 text-right text-xs font-mono font-bold border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            </div>
            <button type="button" onclick="setFullAdvanceDeduction('${adv.id}', ${adv.unpaidBalance})" class="px-2 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200" title="Deduct entire balance of this advance">
              Max
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function calculateBillGrossFromQtyRate() {
  const qty = parseFloat(document.getElementById('bill-quantity').value);
  const rate = parseFloat(document.getElementById('bill-rate').value);

  if (!isNaN(qty) && !isNaN(rate) && qty > 0 && rate > 0) {
    const gross = Math.round(qty * rate);
    document.getElementById('bill-gross-amount').value = gross;
  }
  updateBillSettlementCalculations();
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
    createdAt: new Date().toISOString()
  };

  state.bills.push(newBill);
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
      <!-- Receipt Header -->
      <div class="text-center pb-4 border-b-2 border-emerald-800">
        <h2 class="text-xl font-extrabold text-emerald-900 tracking-wide uppercase">GURURAJ TRADING COMPANY (GTCO)</h2>
        <div class="text-xs text-slate-600 font-medium">Agricultural Pulse & Grain Merchant • APMC Mandi</div>
        <div class="text-[11px] text-slate-500 mt-0.5">Mandi Yard, Shop No. 14, Main Road • Phone: +91 94481 00000</div>
        <div class="mt-2 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
          COMMODITY PURCHASE & ADVANCE SETTLEMENT BILL
        </div>
      </div>

      <!-- Bill & Farmer Meta -->
      <div class="grid grid-cols-2 gap-4 my-4 text-xs">
        <div>
          <div class="text-slate-500 font-medium">Farmer Details:</div>
          <div class="font-bold text-sm text-slate-900">${bill.farmerName}</div>
          <div>Village: <span class="font-medium">${bill.farmerVillage || (farmer ? farmer.village : 'Neelahalli')}</span></div>
          <div>Phone: <span class="font-medium">${farmer ? farmer.phone : 'N/A'}</span></div>
        </div>
        <div class="text-right">
          <div>Bill Number: <span class="font-mono font-bold text-sm text-emerald-800">${bill.billNumber}</span></div>
          <div>Bill Date: <span class="font-medium">${formatDate(bill.date)}</span></div>
          <div>Mode: <span class="font-medium">Produce Adjustment & Cash</span></div>
        </div>
      </div>

      <!-- Commodity Table -->
      <table class="w-full text-xs border border-slate-200 mb-4">
        <thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th class="py-2 px-3 text-left">Commodity Return</th>
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

      <!-- Advances Deducted Breakdown -->
      <div class="mb-4">
        <div class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Advance Deductions (Cash, Seeds & Fert) Settled in this Bill:</span>
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
                  <td class="py-1.5 px-2 text-slate-700 font-medium">${d.advancePurpose === 'Seeds' ? '🌱 Seeds' : d.advancePurpose}</td>
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

      <!-- Financial Summary Box -->
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

      <!-- Signature block -->
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

  const metrics = getFarmerMetrics(farmerId);
  const advances = state.advances.filter(a => a.farmerId === farmerId).sort((a, b) => new Date(a.date) - new Date(b.date));
  const bills = state.bills.filter(b => b.farmerId === farmerId).sort((a, b) => new Date(a.date) - new Date(b.date));

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
          <div>Village: <span class="font-medium">${farmer.village || 'Neelahalli'}</span></div>
          <div>Phone: <span class="font-medium">${farmer.phone || 'N/A'}</span></div>
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
        <table class="w-full text-xs border border-slate-200">
          <thead class="bg-slate-100 text-slate-700">
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
                <td class="py-1.5 px-2 text-slate-700">${a.purpose === 'Seeds' ? '🌱 Seeds' : a.purpose}</td>
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

      <!-- Bills Table -->
      <div class="mb-5">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Produce Sales & Settlement Bills:</span>
          <span class="text-slate-500 font-normal">Count: ${bills.length}</span>
        </h4>
        ${bills.length > 0 ? `
          <table class="w-full text-xs border border-slate-200">
            <thead class="bg-slate-100 text-slate-700">
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
          As of today, farmer <span class="font-bold">${farmer.name}</span> has a remaining unpaid advance balance of <span class="font-mono font-bold text-amber-900">${formatINR(metrics.remainingAdvanceBalance)}</span>. This balance carries forward and will be deducted when future crops (Tur, Moong, Chana, Urad, etc.) are brought for sale.
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
    const newFarmer = {
      id: 'FARMER-' + Date.now(),
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
    alert(`Cannot delete ${farmer.name} because they have ${advCount} advance(s) and ${billCount} bill(s) recorded. Please delete the transactions first.`);
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
// SCENARIO SWITCHER & BACKUP
// ==========================================

function loadReferenceScenario(settled = true) {
  state.farmers = INITIAL_MANDI_FARMERS;

  if (settled) {
    state.advances = getInitialSeedAdvances();
    state.bills = getInitialSeedBills();
    showToast('Loaded Settled Reference Scenario (Bill #101 Moong ₹50k with ₹16k carryover)');
  } else {
    state.advances = [
      { id: 'ADV-001', advanceNumber: 'ADV-001', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-08-10', originalAmount: 1000, deductedAmount: 0, unpaidBalance: 1000, purpose: 'Cultivation', notes: 'Initial Cultivation Advance', status: 'UNPAID', deductionHistory: [] },
      { id: 'ADV-002', advanceNumber: 'ADV-002', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-09-05', originalAmount: 5000, deductedAmount: 0, unpaidBalance: 5000, purpose: 'Harvesting', notes: 'Harvesting Expenses', status: 'UNPAID', deductionHistory: [] },
      { id: 'ADV-003', advanceNumber: 'ADV-003', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-09-25', originalAmount: 10000, deductedAmount: 0, unpaidBalance: 10000, purpose: 'Fertilizer & Pesticide', notes: 'Fertilizer & pesticide spray', status: 'UNPAID', deductionHistory: [] },
      { id: 'ADV-004', advanceNumber: 'ADV-004', farmerId: 'FARMER-001', farmerName: 'Rameshwar Patil', date: '2026-10-15', originalAmount: 50000, deductedAmount: 0, unpaidBalance: 50000, purpose: 'Personal Use', notes: 'Emergency personal cash', status: 'UNPAID', deductionHistory: [] }
    ];
    state.bills = [];
    showToast('Loaded Pre-Bill State (4 advances totaling ₹66,000 ready to settle)');
  }

  saveState();
  syncWithPaisabhai(false);
  renderActiveView();
}

function exportDataJSON() {
  const jsonStr = JSON.stringify({
    version: '2.1',
    exportDate: new Date().toISOString(),
    farmers: state.farmers,
    advances: state.advances,
    bills: state.bills,
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
    'Farmer Name': a.farmerName,
    'Purpose / Input': a.purpose,
    'Original Amount (INR)': a.originalAmount,
    'Deducted Amount (INR)': a.deductedAmount,
    'Unpaid Balance (INR)': a.unpaidBalance,
    'Status': a.status,
    'Notes / Details': a.notes || '',
    'Deduction History': (a.deductionHistory || []).map(h => `${h.billNumber} (${h.commodity}: ₹${h.amountDeducted})`).join('; ')
  }));
  const wsAdv = XLSX.utils.json_to_sheet(advData);
  XLSX.utils.book_append_sheet(wb, wsAdv, 'Advances & Inputs');

  // 2. Bills Sheet
  const billData = state.bills.map(b => ({
    'Bill ID': b.billNumber,
    'Date': b.date,
    'Farmer Name': b.farmerName,
    'Commodity': b.commodity,
    'Quantity': b.quantity || '',
    'Unit': b.unit || '',
    'Rate': b.rate || '',
    'Gross Amount (INR)': b.grossAmount,
    'Advances Deducted (INR)': b.totalAdvancesDeducted,
    'Net Cash Paid (INR)': b.netPayableCash,
    'Leftover Carryover (INR)': b.leftoverAdvancesCarriedForward || 0
  }));
  const wsBills = XLSX.utils.json_to_sheet(billData);
  XLSX.utils.book_append_sheet(wb, wsBills, 'Produce Bills');

  // 3. Farmers Summary Sheet
  const farmerData = state.farmers.map(f => {
    const m = getFarmerMetrics(f.id);
    return {
      'Farmer Name': f.name,
      'Village': f.village,
      'Phone': f.phone,
      'Total Advances (INR)': m.totalAdvances,
      'Total Deducted (INR)': m.totalDeducted,
      'Remaining Balance (INR)': m.remainingAdvanceBalance,
      'Total Produce Bills (INR)': m.totalBillsValue
    };
  });
  const wsFarmers = XLSX.utils.json_to_sheet(farmerData);
  XLSX.utils.book_append_sheet(wb, wsFarmers, 'Farmer Ledgers');

  XLSX.writeFile(wb, `GTCO_LEDGER_EXCEL_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  // Listen to cross-tab storage changes from Paisabhai or Stock Tracker
  window.addEventListener('storage', (e) => {
    if (e.key === PAISABHAI_STORAGE_KEY || e.key === STOCK_TRACKER_STORAGE_KEY) {
      syncAllEcosystemData(false);
    }
  });

  window.addEventListener('gtco_ledger_updated', () => {
    loadState();
    renderActiveView();
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
  } catch (e) {}

  // Filter Listeners
  const filterAdvFarmer = document.getElementById('filter-advance-farmer');
  if (filterAdvFarmer) {
    filterAdvFarmer.addEventListener('change', (e) => {
      state.filters.advanceFarmer = e.target.value;
      renderAdvancesLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterAdvPurpose = document.getElementById('filter-advance-purpose');
  if (filterAdvPurpose) {
    filterAdvPurpose.addEventListener('change', (e) => {
      state.filters.advancePurpose = e.target.value;
      renderAdvancesLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterAdvStatus = document.getElementById('filter-advance-status');
  if (filterAdvStatus) {
    filterAdvStatus.addEventListener('change', (e) => {
      state.filters.advanceStatus = e.target.value;
      renderAdvancesLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterAdvSearch = document.getElementById('filter-advance-search');
  if (filterAdvSearch) {
    filterAdvSearch.addEventListener('input', (e) => {
      state.filters.advanceSearch = e.target.value;
      renderAdvancesLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterBillFarmer = document.getElementById('filter-bill-farmer');
  if (filterBillFarmer) {
    filterBillFarmer.addEventListener('change', (e) => {
      state.filters.billFarmer = e.target.value;
      renderBillsLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterBillCommodity = document.getElementById('filter-bill-commodity');
  if (filterBillCommodity) {
    filterBillCommodity.addEventListener('change', (e) => {
      state.filters.billCommodity = e.target.value;
      renderBillsLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterBillSearch = document.getElementById('filter-bill-search');
  if (filterBillSearch) {
    filterBillSearch.addEventListener('input', (e) => {
      state.filters.billSearch = e.target.value;
      renderBillsLedger();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const filterFarmerSearch = document.getElementById('filter-farmer-search');
  if (filterFarmerSearch) {
    filterFarmerSearch.addEventListener('input', (e) => {
      state.filters.farmerSearch = e.target.value;
      renderFarmersDirectory();
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (window.lucide) window.lucide.createIcons();
});
