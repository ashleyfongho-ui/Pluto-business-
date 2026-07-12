// ─── SECTORS ──────────────────────────────────────────────────────────────────
export const sectorOptions = [
  'Agriculture', 'Banking & Finance', 'Construction', 'Distribution',
  'Education', 'Energy', 'FMCG', 'Food & Beverage', 'Government',
  'Healthcare', 'Hospitality', 'Insurance', 'Legal', 'Logistics & Transport',
  'Manufacturing', 'Media & Communications', 'Mining', 'NGO / Non-profit',
  'Pharmacy', 'Real Estate', 'Retail', 'Technology', 'Telecommunications',
  'Waste Management', 'Other',
]

export const paymentTermOptions = ['Net 7', 'Net 14', 'Net 30', 'Net 60', 'Net 90', 'Cash on Delivery', 'Advance Payment', 'Other']

export const countryOptions = [
  { code: 'CM', name: 'Cameroon', cities: ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Kribi', 'Limbe'] },
  { code: 'SN', name: 'Senegal', cities: ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack'] },
  { code: 'CI', name: 'Côte d\'Ivoire', cities: ['Abidjan', 'Bouaké', 'Daloa', 'San-Pédro', 'Yamoussoukro'] },
  { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast'] },
  { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'] },
  { code: 'ZA', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Bloemfontein'] },
  { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol'] },
  { code: 'FR', name: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'] },
]

// ─── SYSTEM USERS ─────────────────────────────────────────────────────────────
export const systemUsers = [
  { id: 'u1', name: 'Fabrice Mvondo', role: 'Owner', avatar: 'FM' },
  { id: 'u2', name: 'Christelle Abena', role: 'Operations Manager', avatar: 'CA' },
  { id: 'u3', name: 'Bruno Manga', role: 'Field Sales Rep', avatar: 'BM' },
]

// ─── ORGANISATIONS ────────────────────────────────────────────────────────────
export const organisations = [
  {
    id: 1,
    name: 'Pharma Plus',
    sector: 'Pharmacy',
    country: 'CM',
    city: 'Yaoundé',
    address: '14 Avenue Kennedy, Bastos, Yaoundé',
    phone: '+237 222 123 456',
    email: 'contact@pharmaplus.cm',
    website: 'pharmaplus.cm',
    outstanding: 125000,
    lastActivity: '12 min ago',
    paymentTerms: 'Net 30',
    paymentTermsCustom: '',
    ownedBy: 'u1',
    teamRelevance: 'u3',
    parentOrgId: null,
    notes: 'Key pharmacy chain in Bastos. Director goes on holiday in August. Prefers WhatsApp communication. Decision maker is Jean-Pierre.',
    invoiceDetails: { vatNumber: 'M026312875', bankName: 'Afriland First Bank', accountNumber: '08005-00042-12345678901-27', swift: 'CCEICMCX' },
    customFields: {}, tags: ["VIP", "Pharmacy"],
  },
  {
    id: 2,
    name: 'Biyem Clinic',
    sector: 'Healthcare',
    country: 'CM',
    city: 'Douala',
    address: '7 Rue des Cliniques, Akwa, Douala',
    phone: '+237 233 234 567',
    email: 'info@biyemclinic.cm',
    website: 'biyemclinic.cm',
    outstanding: 0,
    lastActivity: '38 min ago',
    paymentTerms: 'Net 14',
    paymentTermsCustom: '',
    ownedBy: 'u1',
    teamRelevance: 'u2',
    parentOrgId: null,
    notes: 'Small private clinic. CEO Marie prefers formal email correspondence. Potential for monthly supply contract.',
    invoiceDetails: { vatNumber: 'M087654321', bankName: 'SCB Cameroun', accountNumber: '08001-00078-98765432109-14', swift: 'SCBLCMCX' },
    customFields: {}, tags: ["Healthcare"],
  },
  {
    id: 3,
    name: 'Moda Distribution',
    sector: 'Distribution',
    country: 'CM',
    city: 'Yaoundé',
    address: '23 Boulevard de la Réunification, Yaoundé',
    phone: '+237 222 345 678',
    email: 'ops@modadistrib.cm',
    website: 'modadistrib.cm',
    outstanding: 450000,
    lastActivity: '2h ago',
    paymentTerms: 'Net 60',
    paymentTermsCustom: '',
    ownedBy: 'u1',
    teamRelevance: 'u1',
    parentOrgId: null,
    notes: 'Large distribution network. Connected to Moda Holding. Founder deceased 2022 — son Moda now in charge but less focused on medical side. Good window of opportunity.',
    invoiceDetails: { vatNumber: 'M011223344', bankName: 'UBC Cameroun', accountNumber: '08003-00091-55667788990-42', swift: 'UBCACMCX' },
    customFields: {}, tags: ["Distributor", "High Value"],
  },
  {
    id: 4,
    name: 'Étoile Clinic',
    sector: 'Healthcare',
    country: 'CM',
    city: 'Yaoundé',
    address: '5 Rue de l\'Indépendance, Centre Ville, Yaoundé',
    phone: '+237 222 456 789',
    email: 'contact@etoileclinic.cm',
    website: '',
    outstanding: 0,
    lastActivity: '3h ago',
    paymentTerms: 'Net 30',
    paymentTermsCustom: '',
    ownedBy: 'u2',
    teamRelevance: 'u2',
    parentOrgId: null,
    notes: 'Smaller clinic. CFO Henri is the gatekeeper — always go through him first.',
    invoiceDetails: { vatNumber: 'M099887766', bankName: 'BICEC', accountNumber: '08007-00034-44332211009-19', swift: 'BICOCMCX' },
    customFields: {}, tags: ["Healthcare"],
  },
  {
    id: 5,
    name: 'Kamga & Sons',
    sector: 'Distribution',
    country: 'CM',
    city: 'Douala',
    address: '44 Rue de Bali, Bali, Douala',
    phone: '+237 233 567 890',
    email: 'info@kamgasons.cm',
    website: '',
    outstanding: 32500,
    lastActivity: '5h ago',
    paymentTerms: 'Cash on Delivery',
    paymentTermsCustom: '',
    ownedBy: 'u3',
    teamRelevance: 'u3',
    parentOrgId: null,
    notes: 'Family business. Cécile handles all procurement. Fast payer when COD agreed upfront.',
    invoiceDetails: { vatNumber: 'M055443322', bankName: 'Ecobank Cameroun', accountNumber: '08009-00056-11223344556-33', swift: 'ECOCCMCX' },
    customFields: {}, tags: ["Distributor"],
  },
]

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
export const contacts = [
  {
    id: 1, orgId: 1, name: 'Jean-Pierre Kamga', role: 'Director',
    phone: '+237 677 123 456', email: 'jp.kamga@pharmaplus.cm',
    whatsapp: '+237677123456', tags: ['VIP', 'Decision Maker'],
    country: 'CM', city: 'Yaoundé', address: '14 Avenue Kennedy, Bastos',
    lastContact: '1h ago', ownedBy: 'u1',
    notes: 'Prefers WhatsApp. Best time to call: mornings. Wife is Sylvie. Has a dog named Rex.',
    conversations: [
      { id: 'cv1', date: '2026-07-09 10:30', type: 'WhatsApp', direction: 'outbound', summary: 'Followed up on Q3 supply quote. Jean-Pierre confirmed interest, asked for revised pricing by Friday.', user: 'u1' },
      { id: 'cv2', date: '2026-07-07 14:15', type: 'Call', direction: 'inbound', summary: 'Inbound call — asked about Paracetamol 500mg availability for August. Confirmed 500 units available.', user: 'u1' },
      { id: 'cv3', date: '2026-07-01 09:00', type: 'Email', direction: 'outbound', summary: 'Sent Q3 supply proposal (850K CFA for full package). Awaiting response.', user: 'u1' },
    ],
  },
  {
    id: 2, orgId: 2, name: 'Marie Essomba', role: 'CEO',
    phone: '+237 699 234 567', email: 'm.essomba@biyem.cm',
    whatsapp: '+237699234567', tags: ['Decision Maker'],
    country: 'CM', city: 'Douala', address: '7 Rue des Cliniques, Akwa',
    lastContact: '3h ago', ownedBy: 'u1',
    notes: 'Very formal. Always email first. Birthday in March. Clinic expands in 2027.',
    conversations: [
      { id: 'cv4', date: '2026-07-09 08:00', type: 'Email', direction: 'outbound', summary: 'Sent diagnostics equipment brochure as requested.', user: 'u1' },
      { id: 'cv5', date: '2026-07-02 11:00', type: 'Meeting', direction: 'both', summary: 'Face-to-face at clinic. Discussed monthly supply contract for Q4. Positive meeting.', user: 'u2' },
    ],
  },
  {
    id: 3, orgId: 3, name: 'Paul Mbarga', role: 'Operations Manager',
    phone: '+237 655 345 678', email: 'p.mbarga@moda.cm',
    whatsapp: '+237655345678', tags: ['Distributor'],
    country: 'CM', city: 'Yaoundé', address: '23 Boulevard de la Réunification',
    lastContact: 'Yesterday', ownedBy: 'u1',
    notes: 'Reports directly to Moda (son). Very operational, not strategic. Escalate anything contractual to Moda directly.',
    conversations: [
      { id: 'cv6', date: '2026-07-08 16:00', type: 'WhatsApp', direction: 'inbound', summary: 'Paul asked for delivery schedule for next week. Sent logistics plan.', user: 'u3' },
    ],
  },
  {
    id: 4, orgId: 5, name: 'Cécile Nkoulou', role: 'Procurement',
    phone: '+237 677 456 789', email: 'c.nkoulou@kamga.cm',
    whatsapp: '+237677456789', tags: ['Buyer'],
    country: 'CM', city: 'Douala', address: '44 Rue de Bali, Bali',
    lastContact: '2 days ago', ownedBy: 'u3',
    notes: 'Decision maker for all purchasing. Very price-sensitive. Responds well to bulk discounts.',
    conversations: [
      { id: 'cv7', date: '2026-07-07 09:30', type: 'Call', direction: 'outbound', summary: 'Called re: restocking order. Cécile confirmed 200 units Paracetamol + 100 Vitamin C. COD agreed.', user: 'u3' },
    ],
  },
  {
    id: 5, orgId: 4, name: 'Henri Atangana', role: 'CFO',
    phone: '+237 699 567 890', email: 'h.atangana@etoile.cm',
    whatsapp: '+237699567890', tags: ['Finance', 'Gatekeeper'],
    country: 'CM', city: 'Yaoundé', address: '5 Rue de l\'Indépendance, Centre Ville',
    lastContact: '3 days ago', ownedBy: 'u2',
    notes: 'Gatekeeper at Étoile. Never goes to CEO without his approval first. Very detail-oriented on contracts.',
    conversations: [
      { id: 'cv8', date: '2026-07-06 14:00', type: 'Email', direction: 'outbound', summary: 'Sent updated NDA for review. Awaiting signature.', user: 'u2' },
    ],
  },
]

// ─── DEALS / PIPELINE ─────────────────────────────────────────────────────────
export const deals = [
  {
    id: 1, name: 'Pharma Plus — Q3 Supply', orgId: 1, contactId: 1,
    stage: 'Negotiation', value: 850000, age: 12, owner: 'u1', probability: 65, tags: ['Q3', 'Medical'],
    lineItems: [
      { id: 'li1', type: 'product', description: 'Paracetamol 500mg', sku: 'SKU-001', qty: 500, unitPrice: 850, total: 425000 },
      { id: 'li2', type: 'product', description: 'Amoxicillin 250mg', sku: 'SKU-002', qty: 100, unitPrice: 1500, total: 150000 },
      { id: 'li3', type: 'service', description: 'Quarterly delivery service', qty: 3, unitPrice: 91667, total: 275000 },
    ],
    notes: 'Client wants revised pricing by Friday. Key leverage: they need August supply confirmed.',
    reminders: [{ id: 'r1', date: '2026-07-25', assignedTo: 'u1', note: 'Send revised Q3 pricing to Jean-Pierre' }],
  },
  {
    id: 2, name: 'Biyem Clinic Diagnostics', orgId: 2, contactId: 2,
    stage: 'Proposal', value: 320000, age: 8, owner: 'u1', probability: 40, tags: ['Healthcare'],
    lineItems: [
      { id: 'li4', type: 'product', description: 'Check-up Kiosk Setup', sku: 'SKU-KIOSK', qty: 1, unitPrice: 220000, total: 220000 },
      { id: 'li5', type: 'service', description: 'Monthly maintenance', qty: 12, unitPrice: 8333, total: 100000 },
    ],
    notes: 'Proposal sent. Marie reviewing internally.',
    reminders: [],
  },
  {
    id: 3, name: 'Moda Annual Contract', orgId: 3, contactId: 3,
    stage: 'Qualified', value: 1200000, age: 21, owner: 'u1', probability: 20, tags: ['Distribution', 'High Value'],
    lineItems: [
      { id: 'li6', type: 'service', description: 'Annual distribution partnership', qty: 1, unitPrice: 1200000, total: 1200000 },
    ],
    notes: 'Needs contract sign-off from Moda (son). Paul is just the ops contact.',
    reminders: [{ id: 'r2', date: '2026-07-28', assignedTo: 'u1', note: 'Escalate to Moda directly — Paul not empowered to sign' }],
  },
  {
    id: 4, name: 'Kamga Restocking', orgId: 5, contactId: 4,
    stage: 'Won', value: 175000, age: 5, owner: 'u3', probability: 100, tags: ['COD'],
    lineItems: [
      { id: 'li7', type: 'product', description: 'Paracetamol 500mg', sku: 'SKU-001', qty: 200, unitPrice: 850, total: 170000 },
      { id: 'li8', type: 'product', description: 'Vitamin C 1000mg', sku: 'SKU-003', qty: 50, unitPrice: 100, total: 5000 },
    ],
    notes: 'Deal closed. COD. Delivery arranged for next week.',
    reminders: [],
  },
  {
    id: 5, name: 'Étoile Equipment', orgId: 4, contactId: 5,
    stage: 'Lost', value: 280000, age: 30, owner: 'u2', probability: 0, tags: ['Healthcare'],
    lineItems: [
      { id: 'li9', type: 'product', description: 'Diagnostic Equipment Bundle', sku: 'SKU-DIAG', qty: 1, unitPrice: 280000, total: 280000 },
    ],
    notes: 'Lost to competitor. Price was the issue. Follow up in Q1 2027.',
    reminders: [{ id: 'r3', date: '2027-01-15', assignedTo: 'u2', note: 'Re-approach Étoile — check if competitor contract is up for renewal' }],
  },
]

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const invoices = [
  {
    id: 'INV-001', orgId: 1, dealId: 1, amount: 125000, dueDate: '2026-07-15',
    status: 'sent', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [{ date: '2026-07-08', type: 'Due soon' }],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-001',
    lineItems: [{ description: 'Paracetamol 500mg × 100', amount: 85000 }, { description: 'Delivery Q2', amount: 40000 }],
    templateUsed: 'Standard Invoice',
  },
  {
    id: 'INV-002', orgId: 3, dealId: 3, amount: 450000, dueDate: '2026-07-05',
    status: 'overdue', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [{ date: '2026-07-06', type: '1 day overdue' }, { date: '2026-07-09', type: '4 days overdue' }],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-002',
    lineItems: [{ description: 'Distribution services June', amount: 450000 }],
    templateUsed: 'Standard Invoice',
  },
  {
    id: 'INV-003', orgId: 5, dealId: 4, amount: 32500, dueDate: '2026-06-30',
    status: 'paid', paymentRef: 'MOMO-20260630-4892', paidVia: 'MTN MoMo', paidAt: '2026-06-30',
    reminders: [],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-003',
    lineItems: [{ description: 'Kamga restocking partial', amount: 32500 }],
    templateUsed: 'Standard Invoice',
  },
  {
    id: 'INV-004', orgId: 2, dealId: 2, amount: 78000, dueDate: '2026-07-20',
    status: 'draft', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-004',
    lineItems: [{ description: 'Diagnostics setup deposit', amount: 78000 }],
    templateUsed: 'Standard Invoice',
  },
]

export const invoiceTemplates = [
  { id: 1, name: 'Standard Invoice', description: 'Clean invoice with line items, VAT, payment terms' },
  { id: 2, name: 'Pro-forma Invoice', description: 'Pre-shipment invoice for customs and advance payment' },
  { id: 3, name: 'Credit Note', description: 'For refunds or adjustments against a previous invoice' },
]

// ─── BANK TRANSACTIONS ────────────────────────────────────────────────────────
export const bankTransactions = [
  { id: 'TXN-001', date: '2026-07-09', amount: 125000, reference: 'INV-001 PHARMA PLUS', source: 'MTN MoMo', matched: false, suggestedInvoice: 'INV-001' },
  { id: 'TXN-002', date: '2026-07-08', amount: 450000, reference: 'MODA DISTR PAIEMENT', source: 'Orange Money', matched: false, suggestedInvoice: 'INV-002' },
  { id: 'TXN-003', date: '2026-07-07', amount: 55000, reference: 'VIREMENT KAMGA', source: 'Bank Transfer', matched: false, suggestedInvoice: null },
]

export const connectedBankAccounts = [
  { id: 1, name: 'MTN MoMo Business', type: 'Mobile Money', accountNo: '**** 4892', status: 'connected', balance: 2340000 },
  { id: 2, name: 'Orange Money Pro', type: 'Mobile Money', accountNo: '**** 7731', status: 'connected', balance: 890000 },
  { id: 3, name: 'Afriland First Bank', type: 'Bank Account', accountNo: '**** 1042', status: 'pending', balance: null },
]

// ─── INVENTORY ────────────────────────────────────────────────────────────────
export const inventory = [
  {
    id: 1, sku: 'SKU-001', name: 'Paracetamol 500mg', category: 'Medication',
    batches: [
      { batchId: 'B001-A', purchaseDate: '2026-06-01', totalUnits: 300, costPerUnit: 420, sellPerUnit: 850, soldUnits: 187, location: 'Warehouse', expiryDate: '2027-06-01', assignedTo: 'u1', receiptUrl: null },
      { batchId: 'B001-B', purchaseDate: '2026-07-01', totalUnits: 200, costPerUnit: 440, sellPerUnit: 870, soldUnits: 0, location: 'Warehouse', expiryDate: '2027-07-01', assignedTo: 'u3', receiptUrl: null },
    ],
    lowStockThreshold: 50,
  },
  {
    id: 2, sku: 'SKU-002', name: 'Amoxicillin 250mg', category: 'Medication',
    batches: [
      { batchId: 'B002-A', purchaseDate: '2026-06-15', totalUnits: 200, costPerUnit: 800, sellPerUnit: 1500, soldUnits: 160, location: 'At Market', expiryDate: '2026-09-01', assignedTo: 'u1', receiptUrl: null },
    ],
    lowStockThreshold: 30,
  },
  {
    id: 3, sku: 'SKU-003', name: 'Vitamin C 1000mg', category: 'Supplement',
    batches: [
      { batchId: 'B003-A', purchaseDate: '2026-07-01', totalUnits: 300, costPerUnit: 60, sellPerUnit: 100, soldUnits: 45, location: 'In Transit', expiryDate: '2027-07-01', assignedTo: 'u3', receiptUrl: null },
    ],
    lowStockThreshold: 50,
  },
  {
    id: 4, sku: 'SKU-004', name: 'Ibuprofen 400mg', category: 'Medication',
    batches: [
      { batchId: 'B004-A', purchaseDate: '2026-05-10', totalUnits: 150, costPerUnit: 350, sellPerUnit: 700, soldUnits: 142, location: 'Warehouse', expiryDate: '2026-08-01', assignedTo: 'u1', receiptUrl: null },
    ],
    lowStockThreshold: 20,
  },
  {
    id: 5, sku: 'SKU-005', name: 'Palm Oil 5L', category: 'Food',
    batches: [
      { batchId: 'B005-A', purchaseDate: '2026-07-05', totalUnits: 80, costPerUnit: 2500, sellPerUnit: 3500, soldUnits: 12, location: 'At Market', expiryDate: '2027-01-01', assignedTo: 'u3', receiptUrl: null },
    ],
    lowStockThreshold: 10,
  },
  {
    id: 6, sku: 'SKU-006', name: 'Cassava Flour 10kg', category: 'Food',
    batches: [
      { batchId: 'B006-A', purchaseDate: '2026-07-03', totalUnits: 120, costPerUnit: 1800, sellPerUnit: 2800, soldUnits: 34, location: 'In Transit', expiryDate: '2026-10-01', assignedTo: 'u2', receiptUrl: null },
    ],
    lowStockThreshold: 15,
  },
]

// ─── LOGISTICS ────────────────────────────────────────────────────────────────
// mode: 'logistics_business' = we ARE the logistics company (paid to deliver)
//       'own_goods' = we use logistics to move our own goods to market
export const logisticsMode = 'own_goods'

export const deliveries = [
  { id: 'DEL-001', product: 'Palm Oil 5L × 40 units', quantity: 40, origin: 'Yaoundé Warehouse', destination: 'Marché Mokolo, Yaoundé', driver: 'Emmanuel Nkoa', driverOrg: 'Nkoa Transport', driverPhone: '+237 677 001 002', value: 120000, status: 'At Market', dispatchTime: '07:30', expectedArrival: '08:15', paymentReceived: true, mode: 'own_goods' },
  { id: 'DEL-002', product: 'Cassava Flour 10kg × 60 units', quantity: 60, origin: 'Yaoundé Warehouse', destination: 'Marché Sandaga, Douala', driver: 'Thierry Bilong', driverOrg: 'In-house', driverPhone: '+237 699 003 004', value: 180000, status: 'In Transit', dispatchTime: '09:00', expectedArrival: '11:30', paymentReceived: false, mode: 'own_goods' },
  { id: 'DEL-003', product: 'Paracetamol 500mg × 200 units', quantity: 200, origin: 'Douala Depot', destination: 'Pharma Plus, Yaoundé', driver: 'Roger Fouda', driverOrg: 'Fouda Logistics SARL', driverPhone: '+237 655 005 006', value: 85000, status: 'Delivered', dispatchTime: '06:00', expectedArrival: '08:00', paymentReceived: true, mode: 'logistics_business' },
  { id: 'DEL-004', product: 'Vitamin C 1000mg × 100 units', quantity: 100, origin: 'Yaoundé Warehouse', destination: 'Biyem Clinic, Douala', driver: 'Emmanuel Nkoa', driverOrg: 'Nkoa Transport', driverPhone: '+237 677 001 002', value: 45000, status: 'Preparing', dispatchTime: '14:00', expectedArrival: '16:30', paymentReceived: false, mode: 'own_goods' },
]

// ─── CONTRACTS ────────────────────────────────────────────────────────────────
export const contracts = [
  { id: 'CON-001', name: 'Pharma Plus Supply Agreement', org: 'Pharma Plus', sentDate: '2026-07-01', status: 'Sent', value: 850000 },
  { id: 'CON-002', name: 'Moda Annual Distribution Contract', org: 'Moda Distribution', sentDate: '2026-06-20', status: 'Signed', value: 1200000 },
  { id: 'CON-003', name: 'Kamga & Sons NDA', org: 'Kamga & Sons', sentDate: '2026-06-15', status: 'Signed', value: 0 },
  { id: 'CON-004', name: 'Biyem Clinic Service Agreement', org: 'Biyem Clinic', sentDate: '2026-07-05', status: 'Draft', value: 320000 },
]

export const contractTemplates = [
  { id: 1, name: 'Service Agreement', description: 'Standard service delivery agreement with payment terms' },
  { id: 2, name: 'Sales Contract', description: 'Product sales contract with delivery and warranty terms' },
  { id: 3, name: 'Non-Disclosure Agreement (NDA)', description: 'Mutual NDA for business discussions and partnerships' },
]

// ─── STAFF ────────────────────────────────────────────────────────────────────
export const staff = [
  {
    id: 1, name: 'Fabrice Mvondo', role: 'Sales Director', department: 'Sales',
    startDate: '2024-01-15', status: 'Active',
    phone: '+237 677 100 001', email: 'fabrice@plutobusiness.cm',
    address: 'Bastos, Yaoundé',
    salary: 350000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 30000, housing: 50000, meal: 15000 },
    promotionTarget: 'CEO by 2028. Requires P&L ownership and 3 enterprise accounts signed.',
    promises: [
      { id: 'p1', date: '2026-06-01', promise: 'Salary review in September 2026 if Q3 target hit', status: 'Pending' },
      { id: 'p2', date: '2026-01-15', promise: 'Company vehicle by end of 2026', status: 'Pending' },
    ],
    notes: 'Top performer. Loyal. Needs autonomy to thrive.',
    benefits: { healthScan: true, healthScanDate: '2026-06-15' },
  },
  {
    id: 2, name: 'Christelle Abena', role: 'Operations Manager', department: 'Operations',
    startDate: '2024-03-01', status: 'Active',
    phone: '+237 699 100 002', email: 'christelle@plutobusiness.cm',
    address: 'Akwa, Douala',
    salary: 280000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 25000, housing: 40000, meal: 12000 },
    promotionTarget: 'COO when company reaches 10 staff.',
    promises: [{ id: 'p3', date: '2026-03-01', promise: 'Training budget CFA 150,000 for 2026', status: 'Fulfilled' }],
    notes: 'Detail-oriented. Manages logistics team well.',
    benefits: { healthScan: true, healthScanDate: '2026-06-20' },
  },
  {
    id: 3, name: 'Rodrigue Tchamba', role: 'Logistics Coordinator', department: 'Logistics',
    startDate: '2024-06-01', status: 'Active',
    phone: '+237 655 100 003', email: 'rodrigue@plutobusiness.cm',
    address: 'Bali, Douala',
    salary: 180000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 0, meal: 10000 },
    promotionTarget: 'Logistics Manager when team grows to 3 drivers.',
    promises: [],
    notes: 'Had documentation issues in March. Retrained. Back on track.',
    benefits: { healthScan: false, healthScanDate: null },
  },
  {
    id: 4, name: 'Nathalie Elong', role: 'Finance Officer', department: 'Finance',
    startDate: '2024-02-15', status: 'On Leave',
    phone: '+237 677 100 004', email: 'nathalie@plutobusiness.cm',
    address: 'Bastos, Yaoundé',
    salary: 220000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 30000, meal: 10000 },
    promotionTarget: 'Finance Manager when accounting module goes live.',
    promises: [{ id: 'p4', date: '2026-02-15', promise: 'Part-time Fridays arrangement reviewed annually', status: 'Active' }],
    notes: 'On annual leave 7–18 July. Very reliable. Handles all banking and reconciliation.',
    benefits: { healthScan: true, healthScanDate: '2026-05-10' },
  },
  {
    id: 5, name: 'Bruno Manga', role: 'Field Sales Rep', department: 'Sales',
    startDate: '2025-01-10', status: 'Active',
    phone: '+237 699 100 005', email: 'bruno@plutobusiness.cm',
    address: 'Bonamoussadi, Douala',
    salary: 150000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 0, meal: 8000 },
    promotionTarget: 'Senior Sales Rep if 3 deals closed in Q3.',
    promises: [],
    notes: 'Verbal warning for punctuality in May. Improving. Good with clients once in front of them.',
    benefits: { healthScan: false, healthScanDate: null },
  },
  {
    id: 6, name: 'Sylvie Ondoa', role: 'HR & Admin', department: 'HR',
    startDate: '2024-04-01', status: 'Active',
    phone: '+237 655 100 006', email: 'sylvie@plutobusiness.cm',
    address: 'Nlongkak, Yaoundé',
    salary: 200000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 25000, meal: 10000 },
    promotionTarget: 'Head of People when company reaches 15 staff.',
    promises: [{ id: 'p5', date: '2026-04-01', promise: 'Remote work Mondays approved from July 2026', status: 'Active' }],
    notes: 'Keeps the office running. Essential.',
    benefits: { healthScan: true, healthScanDate: '2026-06-01' },
  },
]

// ─── PAYROLL HISTORY ──────────────────────────────────────────────────────────────
export const payrollRuns = [
  { id: 'PR-2026-06', month: 'June 2026', runDate: '2026-06-28', status: 'Paid', totalGross: 1390000, totalNet: 1156450, staffCount: 6 },
  { id: 'PR-2026-05', month: 'May 2026', runDate: '2026-05-30', status: 'Paid', totalGross: 1390000, totalNet: 1156450, staffCount: 6 },
  { id: 'PR-2026-04', month: 'April 2026', runDate: '2026-04-29', status: 'Paid', totalGross: 1340000, totalNet: 1114850, staffCount: 5 },
]

// ─── EXPENSES ─────────────────────────────────────────────────────────────────────
export const expenses = [
  { id: 'EXP-001', date: '2026-07-05', category: 'Rent', description: 'Office rent July 2026', amount: 150000, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Approved' },
  { id: 'EXP-002', date: '2026-07-03', category: 'Transport', description: 'Fuel for DEL-002 + DEL-003', amount: 35000, vatRate: 19.25, paidBy: 'u3', receipt: null, status: 'Approved' },
  { id: 'EXP-003', date: '2026-07-02', category: 'Supplies', description: 'Office supplies & printing', amount: 18500, vatRate: 19.25, paidBy: 'u2', receipt: null, status: 'Approved' },
  { id: 'EXP-004', date: '2026-07-08', category: 'Marketing', description: 'Airtime for WhatsApp campaign', amount: 12000, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Pending' },
  { id: 'EXP-005', date: '2026-07-01', category: 'Utilities', description: 'Electricity bill Q2', amount: 45000, vatRate: 19.25, paidBy: 'u2', receipt: null, status: 'Approved' },
  { id: 'EXP-006', date: '2026-06-28', category: 'Payroll', description: 'Staff salaries June 2026', amount: 1390000, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Approved' },
  { id: 'EXP-007', date: '2026-06-28', category: 'CNPS', description: 'CNPS employer contributions June', amount: 218192, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Approved' },
]

export const leaveRequests = [
  { id: 1, staff: 'Nathalie Elong', type: 'Annual Leave', from: '2026-07-07', to: '2026-07-18', status: 'Approved', days: 10 },
  { id: 2, staff: 'Bruno Manga', type: 'Sick Leave', from: '2026-07-09', to: '2026-07-09', status: 'Approved', days: 1 },
  { id: 3, staff: 'Rodrigue Tchamba', type: 'Emergency Leave', from: '2026-07-14', to: '2026-07-15', status: 'Pending', days: 2 },
]

export const disciplinaryLog = [
  { id: 1, staff: 'Bruno Manga', date: '2026-05-12', type: 'Verbal Warning', notes: 'Late arrival on multiple occasions', outcome: 'Warning issued' },
  { id: 2, staff: 'Rodrigue Tchamba', date: '2026-03-20', type: 'Written Warning', notes: 'Missed delivery documentation', outcome: 'Retraining completed' },
]

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
export const campaigns = [
  { id: 1, name: 'Q3 Pharmacy Outreach', type: 'Email', status: 'Active', sent: 142, opened: 87, clicks: 34, date: '2026-07-01' },
  { id: 2, name: 'Ramadan Promotion', type: 'WhatsApp', status: 'Completed', sent: 89, opened: 89, clicks: 52, date: '2026-06-01' },
  { id: 3, name: 'New Product Launch', type: 'Email', status: 'Draft', sent: 0, opened: 0, clicks: 0, date: '2026-07-10' },
]

export const campaignTemplates = [
  { id: 1, name: 'Product Launch', subject: 'Introducing [Product] — available now', preview: 'We are excited to announce the launch of...' },
  { id: 2, name: 'Follow-up', subject: 'Following up on our conversation', preview: 'I wanted to follow up on our recent discussion...' },
  { id: 3, name: 'Seasonal Promotion', subject: 'Special offer — [X]% off this week', preview: 'For a limited time only, take advantage of...' },
  { id: 4, name: 'Monthly Newsletter', subject: 'Pluto Business — Monthly Update', preview: 'Here is what happened this month at...' },
]

// ─── INTERNAL CHAT ────────────────────────────────────────────────────────────
export const chatChannels = [
  { id: 'ch-general', name: 'General', type: 'group', members: ['u1','u2','u3'] },
  { id: 'ch-sales', name: 'Sales Team', type: 'group', members: ['u1','u3'] },
  { id: 'ch-ops', name: 'Operations', type: 'group', members: ['u1','u2'] },
]

export const chatMessages: Record<string, {id:string;from:string;text:string;ts:string}[]> = {
  'ch-general': [
    { id: 'm1', from: 'u1', text: 'Morning everyone — Q3 push starts today. Targets in the shared doc.', ts: '09:00' },
    { id: 'm2', from: 'u2', text: 'DEL-002 is on the road. Should be in Douala by 11:30.', ts: '09:15' },
    { id: 'm3', from: 'u3', text: 'On my way to Kamga & Sons now for the restocking drop.', ts: '09:45' },
  ],
  'ch-sales': [
    { id: 'm4', from: 'u1', text: 'Bruno — follow up on Pharma Plus today. Jean-Pierre wants revised pricing by Friday.', ts: '08:30' },
    { id: 'm5', from: 'u3', text: 'On it. Will WhatsApp him this morning.', ts: '08:45' },
  ],
  'ch-ops': [
    { id: 'm6', from: 'u2', text: 'Rodrigue — make sure DEL-002 has the delivery note signed before leaving Sandaga.', ts: '08:00' },
  ],
}

// ─── DOCUMENTS / COMPLIANCE ───────────────────────────────────────────────────
export const companyDocuments = [
  { id: 1, name: 'Certificate of Incorporation', type: 'Legal', expiry: null, uploadedDate: '2024-01-01', url: null },
  { id: 2, name: 'Business Insurance Policy', type: 'Insurance', expiry: '2026-12-31', uploadedDate: '2026-01-15', url: null },
  { id: 3, name: 'DPML Medical Device License', type: 'Regulatory', expiry: '2027-03-01', uploadedDate: '2026-03-01', url: null },
  { id: 4, name: 'Goods in Transit Insurance', type: 'Insurance', expiry: '2026-09-30', uploadedDate: '2026-09-30', url: null },
]
