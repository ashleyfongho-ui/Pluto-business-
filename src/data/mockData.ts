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
    notes: 'Key pharmacy chain in Bastos. Director goes on holiday in August. Prefers WhatsApp communication. Decision maker is Jean-Pierre. Multi-branch network — 3 outlets in Yaoundé. Moving toward monthly supply agreement.',
    invoiceDetails: { vatNumber: 'M026312875', bankName: 'Afriland First Bank', accountNumber: '08005-00042-12345678901-27', swift: 'CCEICMCX' },
    customFields: { 'DPML License No.': 'DPML-CM-2024-0417', 'Preferred Delivery Day': 'Monday & Thursday', 'Branch Count': '3' },
    tags: ['VIP', 'Pharmacy', 'Repeat Client'],
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
    notes: 'Small private clinic with 20 beds. CEO Marie prefers formal email. Potential for monthly diagnostics supply contract. Planning expansion in 2027 — track closely.',
    invoiceDetails: { vatNumber: 'M087654321', bankName: 'SCB Cameroun', accountNumber: '08001-00078-98765432109-14', swift: 'SCBLCMCX' },
    customFields: { 'Bed Count': '20', 'Speciality': 'General Practice + Maternity', 'Opening Year': '2019' },
    tags: ['Healthcare', 'Clinic'],
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
    notes: 'Large distribution network covering Centre and South regions. Connected to Moda Holding Group. Founder passed away 2022 — son Moda Jr. now in charge but less engaged on medical category. Good opportunity to deepen footprint while he consolidates. Slow payer — flag invoices early.',
    invoiceDetails: { vatNumber: 'M011223344', bankName: 'UBC Cameroun', accountNumber: '08003-00091-55667788990-42', swift: 'UBCACMCX' },
    customFields: { 'Fleet Size': '12 trucks', 'Coverage': 'Centre + South Region', 'Holding Group': 'Moda Holding S.A.' },
    tags: ['Distributor', 'High Value', 'Slow Payer'],
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
    website: 'etoileclinic.cm',
    outstanding: 0,
    lastActivity: '3h ago',
    paymentTerms: 'Net 30',
    paymentTermsCustom: '',
    ownedBy: 'u2',
    teamRelevance: 'u2',
    parentOrgId: null,
    notes: 'Smaller clinic, 10 beds. CFO Henri is the gatekeeper — always route procurement discussions through him first. Director rarely available. They lost a contract with a competitor last year — potentially open to new vendors.',
    invoiceDetails: { vatNumber: 'M099887766', bankName: 'BICEC', accountNumber: '08007-00034-44332211009-19', swift: 'BICOCMCX' },
    customFields: { 'Bed Count': '10', 'Speciality': 'Cardiology + General', 'CFO Contact': 'Henri Atangana' },
    tags: ['Healthcare', 'Clinic'],
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
    notes: 'Family business — father retired, Cécile (daughter) handles all procurement. Fast payer when COD agreed upfront. Consistent restocking volume. Interested in bulk discount programme.',
    invoiceDetails: { vatNumber: 'M055443322', bankName: 'Ecobank Cameroun', accountNumber: '08009-00056-11223344556-33', swift: 'ECOCCMCX' },
    customFields: { 'Key Buyer': 'Cécile Nkoulou', 'Preferred Order Day': 'Wednesday', 'Avg Order Value': '175,000 CFA' },
    tags: ['Distributor', 'COD'],
  },
  {
    id: 6,
    name: 'Réseau Santé Assurances',
    sector: 'Insurance',
    country: 'CM',
    city: 'Yaoundé',
    address: '8 Avenue Ahmadou Ahidjo, Plateau, Yaoundé',
    phone: '+237 222 700 100',
    email: 'corporate@rsainsurance.cm',
    website: 'rsainsurance.cm',
    outstanding: 0,
    lastActivity: '1 day ago',
    paymentTerms: 'Net 30',
    paymentTermsCustom: '',
    ownedBy: 'u1',
    teamRelevance: 'u1',
    parentOrgId: null,
    notes: 'One of the top 5 health insurers in Cameroon. They cover 40,000+ lives through corporate schemes. Looking for a preventative health scanning partner to reduce claims. Key contact: Directeur Général Armand Beyala. Strong relationship — met at MedEx Cameroun 2025.',
    invoiceDetails: { vatNumber: 'M033445566', bankName: 'Afriland First Bank', accountNumber: '08005-00099-33221100987-08', swift: 'CCEICMCX' },
    customFields: { 'Lives Covered': '40,000+', 'Corporate Clients': '120+', 'DG': 'Armand Beyala' },
    tags: ['Insurance', 'Strategic', 'VIP'],
  },
  {
    id: 7,
    name: 'BTP Constructions Réunies',
    sector: 'Construction',
    country: 'CM',
    city: 'Douala',
    address: '112 Boulevard de la Liberté, Bonanjo, Douala',
    phone: '+237 233 801 200',
    email: 'admin@btpcr.cm',
    website: 'btpcr.cm',
    outstanding: 0,
    lastActivity: '2 days ago',
    paymentTerms: 'Net 30',
    paymentTermsCustom: '',
    ownedBy: 'u3',
    teamRelevance: 'u3',
    parentOrgId: null,
    notes: 'Mid-size construction firm with 350 employees. Health & safety manager interested in PreCure scanning for site workers. Seasonal workforce — peaks in dry season (Nov–Apr). Budget approval cycle runs September.',
    invoiceDetails: { vatNumber: 'M022334455', bankName: 'SGC Cameroun', accountNumber: '08002-00067-22334455667-12', swift: 'SGCBCMCX' },
    customFields: { 'Employee Count': '350', 'Peak Season': 'Nov–Apr', 'H&S Manager': 'Patrice Engamba' },
    tags: ['Corporate', 'Construction'],
  },
  {
    id: 8,
    name: 'Total Energies CM',
    sector: 'Energy',
    country: 'CM',
    city: 'Douala',
    address: '31 Avenue du Général de Gaulle, Bonanjo, Douala',
    phone: '+237 233 420 000',
    email: 'procurement.cm@totalenergies.com',
    website: 'totalenergies.com/cm',
    outstanding: 0,
    lastActivity: '3 days ago',
    paymentTerms: 'Net 60',
    paymentTermsCustom: '',
    ownedBy: 'u1',
    teamRelevance: 'u1',
    parentOrgId: null,
    notes: 'Corporate arm of TotalEnergies Cameroon. 800+ staff across fuel stations and HQ. Procurement is centralised — requires formal RFP process. Contact is DR Sandrine Ngo (Corporate Health). Introduced via RSA Insurance referral.',
    invoiceDetails: { vatNumber: 'M044556677', bankName: 'Société Générale CM', accountNumber: '08006-00012-44556677889-56', swift: 'SGCBCMCX' },
    customFields: { 'Staff Count': '800+', 'Procurement Process': 'Formal RFP', 'Health Contact': 'DR Sandrine Ngo' },
    tags: ['Corporate', 'Energy', 'Large Account'],
  },
  {
    id: 9,
    name: 'Alliance Pharmaceutique du Centre',
    sector: 'Pharmacy',
    country: 'CM',
    city: 'Yaoundé',
    address: '3 Avenue de l\'Indépendance, Nlongkak, Yaoundé',
    phone: '+237 222 510 300',
    email: 'direction@apc-pharma.cm',
    website: 'apc-pharma.cm',
    outstanding: 0,
    lastActivity: '4 days ago',
    paymentTerms: 'Net 14',
    paymentTermsCustom: '',
    ownedBy: 'u2',
    teamRelevance: 'u3',
    parentOrgId: null,
    notes: 'Pharmacy cooperative grouping 8 independent pharmacies in Centre region. Decision-making is collective — present to the board quarterly. Lower individual volume but combined order potential is high. Secretary General is Mme. Pauline Tchouta.',
    invoiceDetails: { vatNumber: 'M088776655', bankName: 'BICEC', accountNumber: '08007-00021-88776655443-31', swift: 'BICOCMCX' },
    customFields: { 'Member Pharmacies': '8', 'Board Meeting': 'Quarterly', 'Sec. General': 'Pauline Tchouta' },
    tags: ['Pharmacy', 'Cooperative'],
  },
  {
    id: 10,
    name: 'MTN Cameroon',
    sector: 'Telecommunications',
    country: 'CM',
    city: 'Douala',
    address: '22 Rue du Roi Albert, Akwa, Douala',
    phone: '+237 233 500 500',
    email: 'corporate.health@mtn.cm',
    website: 'mtn.cm',
    outstanding: 0,
    lastActivity: '5 days ago',
    paymentTerms: 'Net 60',
    paymentTermsCustom: '',
    ownedBy: 'u1',
    teamRelevance: 'u2',
    parentOrgId: null,
    notes: 'MTN Cameroon HQ. 2,500 employees. Corporate HR director Josephine Bikele interested in PreCure for annual employee health programme. Long sales cycle — 6–9 months. Budgets set in October. This is a flagship account if closed.',
    invoiceDetails: { vatNumber: 'M011990088', bankName: 'MTN MoMo Business', accountNumber: '08010-00005-11990088772-44', swift: 'N/A' },
    customFields: { 'Staff Count': '2,500', 'Budget Cycle': 'October', 'HR Director': 'Josephine Bikele' },
    tags: ['Corporate', 'Telecom', 'Large Account', 'Strategic'],
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
    notes: 'Prefers WhatsApp. Best time to call: mornings before 11am. Wife is Sylvie — sometimes mentions her in conversation. Very price-conscious but values reliability over cost. Close to retirement (2028) — succession plan unclear.',
    conversations: [
      { id: 'cv1', date: '2026-07-09 10:30', type: 'WhatsApp', direction: 'outbound', summary: 'Followed up on Q3 supply quote. Jean-Pierre confirmed interest, asked for revised pricing by Friday. Mentioned competitor quote was 8% lower — we need to match or justify premium.', user: 'u1' },
      { id: 'cv2', date: '2026-07-07 14:15', type: 'Call', direction: 'inbound', summary: 'Inbound call — asked about Paracetamol 500mg availability for August. Confirmed 500 units available. Also flagged shortage of Amoxicillin from his current supplier — opportunity to cross-sell.', user: 'u1' },
      { id: 'cv3', date: '2026-07-01 09:00', type: 'Email', direction: 'outbound', summary: 'Sent Q3 supply proposal (850K CFA for full package). Includes delivery. Awaiting response.', user: 'u1' },
      { id: 'cv4', date: '2026-06-20 11:00', type: 'Meeting', direction: 'both', summary: 'In-person at Pharma Plus Bastos. Reviewed Q2 performance. Jean-Pierre satisfied with delivery reliability. Asked us to provide Q3 proposal in writing.', user: 'u1' },
    ],
    promises: [
      { id: 'pr1', date: '2026-07-09', what: 'Revised pricing sent by Friday 11 July', dueDate: '2026-07-11', kept: false },
      { id: 'pr2', date: '2026-06-20', what: 'Monthly credit facility explored for Q3', dueDate: '2026-07-30', kept: false },
    ],
  },
  {
    id: 2, orgId: 2, name: 'Marie Essomba', role: 'CEO',
    phone: '+237 699 234 567', email: 'm.essomba@biyem.cm',
    whatsapp: '+237699234567', tags: ['Decision Maker'],
    country: 'CM', city: 'Douala', address: '7 Rue des Cliniques, Akwa',
    lastContact: '3h ago', ownedBy: 'u1',
    notes: 'Very formal — always email first, never cold-call. Birthday is 14 March. Plans to expand clinic to 40 beds in 2027. Interested in PreCure scanning as part of staff wellness. Trust is slow to build — stay consistent.',
    conversations: [
      { id: 'cv5', date: '2026-07-09 08:00', type: 'Email', direction: 'outbound', summary: 'Sent diagnostics equipment brochure as requested. Included case study from similar-size clinic in Abidjan.', user: 'u1' },
      { id: 'cv6', date: '2026-07-02 11:00', type: 'Meeting', direction: 'both', summary: 'Face-to-face at clinic. Discussed monthly supply contract for Q4. Marie positive but cautious — wants 3-month pilot before committing. Asked for references from other clients.', user: 'u2' },
      { id: 'cv7', date: '2026-06-15 14:30', type: 'Email', direction: 'inbound', summary: 'Marie requested service level agreement draft. She wants 48-hour response guarantee for emergency supply.', user: 'u1' },
    ],
    promises: [
      { id: 'pr3', date: '2026-07-02', what: '3-month pilot proposal with SLA included', dueDate: '2026-07-20', kept: false },
    ],
  },
  {
    id: 3, orgId: 3, name: 'Paul Mbarga', role: 'Operations Manager',
    phone: '+237 655 345 678', email: 'p.mbarga@moda.cm',
    whatsapp: '+237655345678', tags: ['Distributor', 'Ops Contact'],
    country: 'CM', city: 'Yaoundé', address: '23 Boulevard de la Réunification',
    lastContact: 'Yesterday', ownedBy: 'u1',
    notes: 'Reports directly to Moda Jr. Operational only — not strategic. Escalate any contractual matter to Moda Jr. directly. Paul is the day-to-day coordinator for deliveries and stock levels.',
    conversations: [
      { id: 'cv8', date: '2026-07-08 16:00', type: 'WhatsApp', direction: 'inbound', summary: 'Paul asked for delivery schedule for next week. Sent logistics plan with estimated arrival times.', user: 'u3' },
      { id: 'cv9', date: '2026-06-30 09:00', type: 'Call', direction: 'outbound', summary: 'Confirmed June delivery completed. Invoice INV-002 raised — Paul acknowledged but says payment needs sign-off from Moda Jr.', user: 'u1' },
    ],
    promises: [],
  },
  {
    id: 4, orgId: 5, name: 'Cécile Nkoulou', role: 'Procurement Manager',
    phone: '+237 677 456 789', email: 'c.nkoulou@kamga.cm',
    whatsapp: '+237677456789', tags: ['Buyer', 'Decision Maker'],
    country: 'CM', city: 'Douala', address: '44 Rue de Bali, Bali',
    lastContact: '2 days ago', ownedBy: 'u3',
    notes: 'Full procurement authority. Father (founder) retired — she now runs the show. Very price-sensitive. Responds well to bulk discount offers. Prefers WhatsApp over email. Reorders roughly every 3 weeks.',
    conversations: [
      { id: 'cv10', date: '2026-07-07 09:30', type: 'Call', direction: 'outbound', summary: 'Called re: restocking order. Cécile confirmed 200 units Paracetamol + 100 Vitamin C. COD agreed for Wednesday delivery.', user: 'u3' },
      { id: 'cv11', date: '2026-06-18 11:00', type: 'WhatsApp', direction: 'inbound', summary: 'Asked about Ibuprofen availability — we were out. She went to competitor for that order. Note: keep Ibuprofen stocked.', user: 'u3' },
    ],
    promises: [
      { id: 'pr4', date: '2026-07-07', what: 'Bulk discount pricing sheet for orders over 500 units', dueDate: '2026-07-15', kept: false },
    ],
  },
  {
    id: 5, orgId: 4, name: 'Henri Atangana', role: 'CFO',
    phone: '+237 699 567 890', email: 'h.atangana@etoile.cm',
    whatsapp: '+237699567890', tags: ['Finance', 'Gatekeeper'],
    country: 'CM', city: 'Yaoundé', address: '5 Rue de l\'Indépendance, Centre Ville',
    lastContact: '3 days ago', ownedBy: 'u2',
    notes: 'Absolute gatekeeper. Nothing moves without his approval. Very detail-oriented on contracts — read every clause. Has previously rejected contracts for ambiguous force majeure clauses. Send clean, precise documents.',
    conversations: [
      { id: 'cv12', date: '2026-07-06 14:00', type: 'Email', direction: 'outbound', summary: 'Sent updated NDA for review. Flagged change in indemnity clause per his feedback from last call.', user: 'u2' },
      { id: 'cv13', date: '2026-06-28 10:00', type: 'Call', direction: 'inbound', summary: 'Henri called to reject initial contract draft — force majeure wording too broad. Requested redline within 5 business days.', user: 'u2' },
    ],
    promises: [],
  },
  {
    id: 6, orgId: 6, name: 'Armand Beyala', role: 'Directeur Général',
    phone: '+237 677 700 001', email: 'a.beyala@rsainsurance.cm',
    whatsapp: '+237677700001', tags: ['Decision Maker', 'VIP', 'C-Suite'],
    country: 'CM', city: 'Yaoundé', address: '8 Avenue Ahmadou Ahidjo, Plateau',
    lastContact: '1 day ago', ownedBy: 'u1',
    notes: 'Met at MedEx Cameroun 2025. Warm relationship. Vision-aligned — he wants to shift RSA from reactive (claims) to preventative (scans). Board approval needed for contracts above 5M CFA. Moves quickly when aligned. Travels to Paris quarterly.',
    conversations: [
      { id: 'cv14', date: '2026-07-08 09:00', type: 'Meeting', direction: 'both', summary: 'Lunch at La Terrasse, Yaoundé. Discussed partnership structure for embedding PreCure scans into RSA corporate packages. Armand is aligned — needs a commercial proposal for board presentation in September.', user: 'u1' },
      { id: 'cv15', date: '2026-06-20 16:00', type: 'Call', direction: 'outbound', summary: 'Follow-up after MedEx. Armand confirmed strong interest. Intro call — set up lunch for July.', user: 'u1' },
    ],
    promises: [
      { id: 'pr5', date: '2026-07-08', what: 'Commercial proposal for RSA board presentation (Sept 2026)', dueDate: '2026-08-20', kept: false },
    ],
  },
  {
    id: 7, orgId: 7, name: 'Patrice Engamba', role: 'HSE Manager',
    phone: '+237 699 801 201', email: 'p.engamba@btpcr.cm',
    whatsapp: '+237699801201', tags: ['H&S', 'Technical'],
    country: 'CM', city: 'Douala', address: '112 Boulevard de la Liberté, Bonanjo',
    lastContact: '2 days ago', ownedBy: 'u3',
    notes: 'Health, Safety & Environment Manager. Very process-driven. Wants ISO-compliant documentation. Budget authority up to 2M CFA — above that goes to Finance Director. Construction site workers are his priority — they do heavy manual work with high injury/illness rates.',
    conversations: [
      { id: 'cv16', date: '2026-07-07 15:00', type: 'Email', direction: 'inbound', summary: 'Patrice requested detailed spec sheet on scanning frequency and data privacy handling. Sent ISO 27001 compliance summary.', user: 'u3' },
      { id: 'cv17', date: '2026-06-25 10:00', type: 'Meeting', direction: 'both', summary: 'Site visit at BTP HQ Bonanjo. Patrice gave tour of operations. Clear health need — 3 site incidents in past 6 months. Very receptive.', user: 'u3' },
    ],
    promises: [
      { id: 'pr6', date: '2026-07-07', what: 'ISO 27001 compliance certificate + privacy impact assessment', dueDate: '2026-07-25', kept: false },
    ],
  },
  {
    id: 8, orgId: 8, name: 'Sandrine Ngo', role: 'DR, Corporate Health',
    phone: '+237 233 420 110', email: 's.ngo@totalenergies.com',
    whatsapp: '+237699420110', tags: ['Healthcare', 'Decision Influencer'],
    country: 'CM', city: 'Douala', address: '31 Avenue du Général de Gaulle, Bonanjo',
    lastContact: '3 days ago', ownedBy: 'u1',
    notes: 'Internal champion at TotalEnergies. Does not have budget authority but is primary recommender for health programmes. Medical background — very thorough. Introduced by Armand Beyala at RSA. Formal RFP process required — prepare a strong tender document.',
    conversations: [
      { id: 'cv18', date: '2026-07-06 09:30', type: 'Email', direction: 'inbound', summary: 'Sandrine sent procurement guidelines and RFP template. Requested submission by 30 September 2026.', user: 'u1' },
      { id: 'cv19', date: '2026-06-28 14:00', type: 'Call', direction: 'outbound', summary: 'Intro call post RSA referral. Sandrine very interested — currently using third-party medical vans for annual health checks. PreCure scanning could replace this at lower cost.', user: 'u1' },
    ],
    promises: [
      { id: 'pr7', date: '2026-07-06', what: 'RFP tender document submitted by 30 September 2026', dueDate: '2026-09-30', kept: false },
    ],
  },
  {
    id: 9, orgId: 9, name: 'Pauline Tchouta', role: 'Secretary General',
    phone: '+237 677 510 301', email: 'p.tchouta@apc-pharma.cm',
    whatsapp: '+237677510301', tags: ['Admin', 'Coordinator'],
    country: 'CM', city: 'Yaoundé', address: '3 Avenue de l\'Indépendance, Nlongkak',
    lastContact: '4 days ago', ownedBy: 'u2',
    notes: 'Coordinates all 8 member pharmacies in the cooperative. Not a buyer directly — facilitates collective purchasing decisions at quarterly board meetings. Be patient — decisions are slow but sticky once made. Next board meeting: September 2026.',
    conversations: [
      { id: 'cv20', date: '2026-07-05 10:00', type: 'Email', direction: 'outbound', summary: 'Sent collective pricing proposal for APC member pharmacies. 12% volume discount for combined orders above 1M CFA/month.', user: 'u2' },
      { id: 'cv21', date: '2026-06-12 09:00', type: 'Meeting', direction: 'both', summary: 'Introductory meeting with APC board — 5 members present. Presented product range. Good reception. Pauline committed to putting proposal on September agenda.', user: 'u2' },
    ],
    promises: [
      { id: 'pr8', date: '2026-07-05', what: 'Proposal on APC September board agenda', dueDate: '2026-09-01', kept: false },
    ],
  },
  {
    id: 10, orgId: 10, name: 'Josephine Bikele', role: 'HR Director',
    phone: '+237 233 500 510', email: 'j.bikele@mtn.cm',
    whatsapp: '+237699500510', tags: ['HR', 'Decision Influencer', 'Champion'],
    country: 'CM', city: 'Douala', address: '22 Rue du Roi Albert, Akwa',
    lastContact: '5 days ago', ownedBy: 'u1',
    notes: 'Strong internal champion at MTN. High EQ — very relationship-oriented. She sees staff health as her KPI. Budget is controlled by Finance Director (Guy Mbah) — needs to build a business case. Long sales cycle expected (6–9 months). Follow up monthly; do not rush.',
    conversations: [
      { id: 'cv22', date: '2026-07-04 11:00', type: 'Meeting', direction: 'both', summary: 'First proper meeting at MTN HQ. Josephine walked us through current health programme challenges — annual check costs 85M CFA/year, low uptake, paper-based records. PreCure solves all three issues.', user: 'u1' },
      { id: 'cv23', date: '2026-06-15 14:00', type: 'Call', direction: 'outbound', summary: 'Cold outreach — intro call. Josephine agreed to a demo meeting. Good initial fit.', user: 'u1' },
    ],
    promises: [
      { id: 'pr9', date: '2026-07-04', what: 'Business case doc (ROI vs current health spend) by end of July', dueDate: '2026-07-31', kept: false },
    ],
  },
]

// ─── DEALS / PIPELINE ─────────────────────────────────────────────────────────
export const deals = [
  {
    id: 1, name: 'Pharma Plus — Q3 Supply Agreement', orgId: 1, contactId: 1,
    stage: 'Negotiation', value: 850000, age: 12, owner: 'u1', probability: 65,
    tags: ['Q3', 'Medical', 'Repeat'],
    closedAt: null,
    lineItems: [
      { id: 'li1', type: 'product', description: 'Paracetamol 500mg × 500 units', sku: 'SKU-001', qty: 500, unitPrice: 850, total: 425000 },
      { id: 'li2', type: 'product', description: 'Amoxicillin 250mg × 100 units', sku: 'SKU-002', qty: 100, unitPrice: 1500, total: 150000 },
      { id: 'li3', type: 'service', description: 'Quarterly delivery service (3 months)', qty: 3, unitPrice: 91667, total: 275000 },
    ],
    activities: [
      { date: '2026-07-09', type: 'Note', note: 'Client flagged competitor price is 8% lower. Exploring matching.' },
      { date: '2026-07-01', type: 'Email', note: 'Sent Q3 proposal document.' },
      { date: '2026-06-20', type: 'Meeting', note: 'In-person review at Pharma Plus Bastos. Positive.' },
    ],
    notes: 'Client wants revised pricing by Friday. Key leverage: they need August supply confirmed — shortage from main supplier. Strong close probability if we sharpen on delivery reliability.',
    reminders: [{ id: 'r1', date: '2026-07-14', assignedTo: 'u1', note: 'Send revised Q3 pricing to Jean-Pierre (match competitor rate)' }],
  },
  {
    id: 2, name: 'Biyem Clinic — Diagnostics Supply Pilot', orgId: 2, contactId: 2,
    stage: 'Proposal', value: 320000, age: 8, owner: 'u1', probability: 40,
    tags: ['Healthcare', 'Pilot'],
    closedAt: null,
    lineItems: [
      { id: 'li4', type: 'product', description: 'PreCure Check-up Kiosk Setup', sku: 'SKU-KIOSK', qty: 1, unitPrice: 220000, total: 220000 },
      { id: 'li5', type: 'service', description: 'Monthly maintenance & calibration', qty: 3, unitPrice: 33333, total: 100000 },
    ],
    activities: [
      { date: '2026-07-09', type: 'Email', note: 'Sent diagnostics brochure + Abidjan case study.' },
      { date: '2026-07-02', type: 'Meeting', note: 'Face-to-face at clinic. Pilot proposed. CEO aligned.' },
    ],
    notes: 'Proposal sent. Marie reviewing internally. She wants a 3-month pilot before committing to full contract. SLA draft needed.',
    reminders: [{ id: 'r2', date: '2026-07-20', assignedTo: 'u1', note: 'Follow up with Marie on pilot proposal — has she shared with board?' }],
  },
  {
    id: 3, name: 'Moda Distribution — Annual Partnership', orgId: 3, contactId: 3,
    stage: 'Qualified', value: 1200000, age: 21, owner: 'u1', probability: 20,
    tags: ['Distribution', 'High Value', 'Long Cycle'],
    closedAt: null,
    lineItems: [
      { id: 'li6', type: 'service', description: 'Annual distribution partnership — 12-month exclusive', qty: 1, unitPrice: 1200000, total: 1200000 },
    ],
    activities: [
      { date: '2026-07-08', type: 'Note', note: 'Paul confirmed Moda Jr. is aware but not engaged yet.' },
      { date: '2026-06-30', type: 'Call', note: 'Spoke with Paul re: invoice delay. Payment pending Moda Jr. sign-off.' },
    ],
    notes: 'Needs contract sign-off from Moda Jr. directly — Paul is not empowered. Escalate in late July once Moda returns from travel.',
    reminders: [{ id: 'r3', date: '2026-07-28', assignedTo: 'u1', note: 'Escalate directly to Moda Jr. — Paul not empowered to sign' }],
  },
  {
    id: 4, name: 'Kamga & Sons — Restocking Order', orgId: 5, contactId: 4,
    stage: 'Won', value: 175000, age: 5, owner: 'u3', probability: 100,
    tags: ['COD', 'Repeat'],
    closedAt: '2026-07-07',
    lineItems: [
      { id: 'li7', type: 'product', description: 'Paracetamol 500mg × 200 units', sku: 'SKU-001', qty: 200, unitPrice: 850, total: 170000 },
      { id: 'li8', type: 'product', description: 'Vitamin C 1000mg × 50 units', sku: 'SKU-003', qty: 50, unitPrice: 100, total: 5000 },
    ],
    activities: [
      { date: '2026-07-07', type: 'Note', note: 'Deal closed. COD received. Delivery confirmed for Wednesday.' },
      { date: '2026-07-07', type: 'Call', note: 'Cécile confirmed order by phone.' },
    ],
    notes: 'Deal closed. COD. Delivery arranged for 9 July.',
    reminders: [],
  },
  {
    id: 5, name: 'Étoile Clinic — Equipment Bundle', orgId: 4, contactId: 5,
    stage: 'Lost', value: 280000, age: 30, owner: 'u2', probability: 0,
    tags: ['Healthcare', 'Equipment'],
    closedAt: '2026-06-15',
    lineItems: [
      { id: 'li9', type: 'product', description: 'Diagnostic Equipment Bundle', sku: 'SKU-DIAG', qty: 1, unitPrice: 280000, total: 280000 },
    ],
    activities: [
      { date: '2026-06-15', type: 'Note', note: 'Lost to MediTech — their price was 15% lower. Henri made the decision.' },
    ],
    notes: 'Lost on price — competitor MediTech undercut by 15%. Henri (CFO) was the deciding factor. Re-approach in Q1 2027 when their contract expires.',
    reminders: [{ id: 'r4', date: '2027-01-15', assignedTo: 'u2', note: 'Re-approach Étoile — MediTech contract likely up for renewal' }],
  },
  {
    id: 6, name: 'RSA Insurance — Corporate Scanning Partnership', orgId: 6, contactId: 6,
    stage: 'Negotiation', value: 4800000, age: 18, owner: 'u1', probability: 55,
    tags: ['Insurance', 'Strategic', 'Partnership'],
    closedAt: null,
    lineItems: [
      { id: 'li10', type: 'service', description: 'PreCure scans embedded in RSA corporate packages — 1,200 scans/year', qty: 1200, unitPrice: 3500, total: 4200000 },
      { id: 'li11', type: 'service', description: 'Data analytics & reporting dashboard (annual)', qty: 1, unitPrice: 600000, total: 600000 },
    ],
    activities: [
      { date: '2026-07-08', type: 'Meeting', note: 'Lunch with Armand Beyala. Partnership structure agreed in principle. Board proposal needed for September.' },
      { date: '2026-06-20', type: 'Call', note: 'Follow-up after MedEx. Armand confirmed strong interest.' },
    ],
    notes: 'Flagship deal. Armand is aligned. Board presentation in September 2026 — we need to deliver a compelling commercial proposal by 20 August.',
    reminders: [{ id: 'r5', date: '2026-08-20', assignedTo: 'u1', note: 'Send commercial proposal to Armand for RSA board presentation (Sept)' }],
  },
  {
    id: 7, name: 'BTP Constructions — Site Worker Health Scans', orgId: 7, contactId: 7,
    stage: 'Proposal', value: 1050000, age: 14, owner: 'u3', probability: 35,
    tags: ['Corporate', 'Construction', 'H&S'],
    closedAt: null,
    lineItems: [
      { id: 'li12', type: 'service', description: 'Annual PreCure scanning programme — 350 workers × 3 scans/year', qty: 1050, unitPrice: 1000, total: 1050000 },
    ],
    activities: [
      { date: '2026-07-07', type: 'Email', note: 'Sent ISO compliance summary + privacy impact assessment.' },
      { date: '2026-06-25', type: 'Meeting', note: 'Site visit at BTP HQ Bonanjo. 3 site incidents in past 6 months — strong need.' },
    ],
    notes: 'Proposal submitted. Patrice needs ISO documentation to proceed internally. Finance Director approval required above 2M CFA — we are just under. Good chance if we keep Patrice warm.',
    reminders: [{ id: 'r6', date: '2026-07-25', assignedTo: 'u3', note: 'Follow up with Patrice on ISO docs — has he moved to Finance Director?' }],
  },
  {
    id: 8, name: 'TotalEnergies CM — Staff Health Programme', orgId: 8, contactId: 8,
    stage: 'Lead', value: 8750000, age: 7, owner: 'u1', probability: 15,
    tags: ['Corporate', 'Energy', 'Large Account', 'RFP'],
    closedAt: null,
    lineItems: [
      { id: 'li13', type: 'service', description: 'Annual health programme — 2,500 staff × 3.5 scans/year', qty: 2500, unitPrice: 3500, total: 8750000 },
    ],
    activities: [
      { date: '2026-07-06', type: 'Email', note: 'Received RFP template from Sandrine. Submission deadline 30 Sept 2026.' },
      { date: '2026-06-28', type: 'Call', note: 'Intro call with Sandrine Ngo. Strong interest — replacing existing medical van programme.' },
    ],
    notes: 'Long cycle — formal RFP process. Submission due 30 Sept 2026. This is the biggest deal in the pipeline. Treat as flagship.',
    reminders: [{ id: 'r7', date: '2026-09-15', assignedTo: 'u1', note: 'Submit RFP tender to TotalEnergies CM — deadline 30 Sept' }],
  },
  {
    id: 9, name: 'APC Pharmacies — Collective Supply Agreement', orgId: 9, contactId: 9,
    stage: 'Qualified', value: 960000, age: 28, owner: 'u2', probability: 30,
    tags: ['Pharmacy', 'Cooperative', 'Collective'],
    closedAt: null,
    lineItems: [
      { id: 'li14', type: 'product', description: 'Collective supply — 8 pharmacies, monthly bundle', qty: 12, unitPrice: 80000, total: 960000 },
    ],
    activities: [
      { date: '2026-07-05', type: 'Email', note: 'Sent collective pricing proposal — 12% volume discount.' },
      { date: '2026-06-12', type: 'Meeting', note: 'Board meeting with 5 members. Good reception. On September agenda.' },
    ],
    notes: 'Proposal on September board agenda. Decision collective — need all 8 members aligned. Christelle managing relationship. Stay in contact with Pauline monthly.',
    reminders: [{ id: 'r8', date: '2026-09-01', assignedTo: 'u2', note: 'APC board meeting — follow up before agenda is set (contact Pauline)' }],
  },
  {
    id: 10, name: 'MTN Cameroon — Employee Health Programme', orgId: 10, contactId: 10,
    stage: 'Lead', value: 16500000, age: 10, owner: 'u1', probability: 10,
    tags: ['Corporate', 'Telecom', 'Flagship', 'Long Cycle'],
    closedAt: null,
    lineItems: [
      { id: 'li15', type: 'service', description: 'Annual health programme — 2,500 staff + 500 dependants × 3 scans', qty: 9000, unitPrice: 1833, total: 16500000 },
    ],
    activities: [
      { date: '2026-07-04', type: 'Meeting', note: 'First meeting at MTN HQ. Strong fit identified. Business case needed.' },
      { date: '2026-06-15', type: 'Call', note: 'Cold outreach — Josephine agreed to a demo meeting.' },
    ],
    notes: 'Flagship 16.5M deal. 6–9 month cycle. Josephine is champion — needs to build business case for Finance Director Guy Mbah. Monthly touchpoints. Budget cycle: October.',
    reminders: [{ id: 'r9', date: '2026-07-31', assignedTo: 'u1', note: 'Send MTN ROI business case doc to Josephine before end of July' }],
  },
  {
    id: 11, name: 'Pharma Plus — Emergency Amoxicillin Restock', orgId: 1, contactId: 1,
    stage: 'Won', value: 225000, age: 3, owner: 'u3', probability: 100,
    tags: ['Emergency', 'Repeat', 'Pharmacy'],
    closedAt: '2026-07-10',
    lineItems: [
      { id: 'li16', type: 'product', description: 'Amoxicillin 250mg × 150 units (emergency)', sku: 'SKU-002', qty: 150, unitPrice: 1500, total: 225000 },
    ],
    activities: [
      { date: '2026-07-10', type: 'Note', note: 'Emergency order placed and fulfilled same day. Jean-Pierre very happy with response time.' },
    ],
    notes: 'Emergency order — Pharma Plus supplier ran out. We stepped in quickly. This is a relationship builder.',
    reminders: [],
  },
  {
    id: 12, name: 'Kamga & Sons — Bulk Discount Programme', orgId: 5, contactId: 4,
    stage: 'Qualified', value: 600000, age: 4, owner: 'u3', probability: 45,
    tags: ['Distributor', 'Volume', 'COD'],
    closedAt: null,
    lineItems: [
      { id: 'li17', type: 'product', description: 'Quarterly bulk order — 700+ units mixed products', qty: 4, unitPrice: 150000, total: 600000 },
    ],
    activities: [
      { date: '2026-07-09', type: 'Note', note: 'Cécile interested in formalising quarterly bulk orders with discount structure.' },
    ],
    notes: 'Cécile wants a structured quarterly programme with 10–15% volume discount. Good for cash flow predictability. Present pricing proposal by 15 July.',
    reminders: [{ id: 'r10', date: '2026-07-15', assignedTo: 'u3', note: 'Send bulk discount programme pricing to Cécile at Kamga & Sons' }],
  },
]

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const invoices = [
  {
    id: 'INV-001', orgId: 1, dealId: 1, amount: 125000, dueDate: '2026-07-15',
    issueDate: '2026-06-30',
    status: 'sent', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [{ date: '2026-07-08', type: 'Due soon' }],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-001',
    lineItems: [
      { description: 'Paracetamol 500mg × 100 units', amount: 85000 },
      { description: 'Q2 Delivery fee', amount: 40000 }
    ],
    templateUsed: 'Standard Invoice',
    notes: 'Due by 15 July. Jean-Pierre confirmed receipt of invoice.',
  },
  {
    id: 'INV-002', orgId: 3, dealId: 3, amount: 450000, dueDate: '2026-07-05',
    issueDate: '2026-06-05',
    status: 'overdue', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [{ date: '2026-07-06', type: '1 day overdue' }, { date: '2026-07-09', type: '4 days overdue' }],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-002',
    lineItems: [{ description: 'Distribution services — June 2026', amount: 450000 }],
    templateUsed: 'Standard Invoice',
    notes: 'OVERDUE — Paul says waiting for Moda Jr. approval. Escalate directly.',
  },
  {
    id: 'INV-003', orgId: 5, dealId: 4, amount: 175000, dueDate: '2026-07-09',
    issueDate: '2026-07-07',
    status: 'paid', paymentRef: 'MOMO-20260709-7712', paidVia: 'MTN MoMo', paidAt: '2026-07-09',
    reminders: [],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-003',
    lineItems: [
      { description: 'Paracetamol 500mg × 200 units', amount: 170000 },
      { description: 'Vitamin C 1000mg × 50 units', amount: 5000 }
    ],
    templateUsed: 'Standard Invoice',
    notes: 'Paid same day — COD as agreed. MoMo confirmation received.',
  },
  {
    id: 'INV-004', orgId: 2, dealId: 2, amount: 78000, dueDate: '2026-07-20',
    issueDate: '2026-07-06',
    status: 'draft', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-004',
    lineItems: [{ description: 'Diagnostics setup deposit (25%)', amount: 78000 }],
    templateUsed: 'Pro-forma Invoice',
    notes: 'Draft — awaiting Marie confirmation before sending.',
  },
  {
    id: 'INV-005', orgId: 1, dealId: 11, amount: 225000, dueDate: '2026-07-24',
    issueDate: '2026-07-10',
    status: 'sent', paymentRef: null, paidVia: null, paidAt: null,
    reminders: [],
    paymentLink: 'https://pay.plutobusiness.cm/inv/INV-005',
    lineItems: [{ description: 'Amoxicillin 250mg × 150 units — Emergency supply', amount: 225000 }],
    templateUsed: 'Standard Invoice',
    notes: 'Emergency restock invoice. Jean-Pierre confirmed payment expected by 24 July.',
  },
]

export const invoiceTemplates = [
  { id: 1, name: 'Standard Invoice', description: 'Clean invoice with line items, VAT, payment terms' },
  { id: 2, name: 'Pro-forma Invoice', description: 'Pre-shipment invoice for customs and advance payment' },
  { id: 3, name: 'Credit Note', description: 'For refunds or adjustments against a previous invoice' },
]

// ─── BANK TRANSACTIONS ────────────────────────────────────────────────────────
export const bankTransactions = [
  { id: 'TXN-001', date: '2026-07-09', amount: 175000, reference: 'KAMGA SONS COD ORDER', source: 'MTN MoMo', matched: true, suggestedInvoice: 'INV-003' },
  { id: 'TXN-002', date: '2026-07-08', amount: 450000, reference: 'MODA DISTR PAIEMENT JUIN', source: 'Orange Money', matched: false, suggestedInvoice: 'INV-002' },
  { id: 'TXN-003', date: '2026-07-07', amount: 55000, reference: 'VIREMENT DIVERS PHARMA', source: 'Bank Transfer', matched: false, suggestedInvoice: null },
  { id: 'TXN-004', date: '2026-07-05', amount: 125000, reference: 'PHARMA PLUS FACTURE JUIN', source: 'MTN MoMo', matched: false, suggestedInvoice: 'INV-001' },
]

export const connectedBankAccounts = [
  { id: 1, name: 'MTN MoMo Business', type: 'Mobile Money', accountNo: '**** 4892', status: 'connected', balance: 2515000 },
  { id: 2, name: 'Orange Money Pro', type: 'Mobile Money', accountNo: '**** 7731', status: 'connected', balance: 890000 },
  { id: 3, name: 'Afriland First Bank', type: 'Bank Account', accountNo: '**** 1042', status: 'pending', balance: null },
]

// ─── INVENTORY ────────────────────────────────────────────────────────────────
export const inventory = [
  {
    id: 1,
    sku: 'SKU-001',
    name: 'Paracetamol 500mg',
    category: 'Medication — Analgesic',
    supplier: 'Médipharma Importation, Douala',
    storageConditions: 'Store below 25°C, dry place, away from light',
    regulatoryNotes: 'DPML approved. Prescription-only above 1,000mg. Batch tracking mandatory.',
    reorderPoint: 100,
    batches: [
      {
        batchId: 'B001-A', purchaseDate: '2026-06-01', totalUnits: 300,
        costPerUnit: 420, sellPerUnit: 850, soldUnits: 187,
        location: 'Warehouse', expiryDate: '2027-06-01',
        assignedTo: 'u1', receiptUrl: null,
        supplierBatchRef: 'MPI-2026-0601-A',
      },
      {
        batchId: 'B001-B', purchaseDate: '2026-07-01', totalUnits: 200,
        costPerUnit: 440, sellPerUnit: 870, soldUnits: 0,
        location: 'Warehouse', expiryDate: '2027-07-01',
        assignedTo: 'u3', receiptUrl: null,
        supplierBatchRef: 'MPI-2026-0701-B',
      },
    ],
    lowStockThreshold: 50,
  },
  {
    id: 2,
    sku: 'SKU-002',
    name: 'Amoxicillin 250mg',
    category: 'Medication — Antibiotic',
    supplier: 'PharmaGros Cameroun, Yaoundé',
    storageConditions: 'Store below 30°C, protect from moisture. Refrigerate once reconstituted.',
    regulatoryNotes: 'DPML approved. Prescription mandatory. Antibiotic — track dispensing records.',
    reorderPoint: 50,
    batches: [
      {
        batchId: 'B002-A', purchaseDate: '2026-06-15', totalUnits: 200,
        costPerUnit: 800, sellPerUnit: 1500, soldUnits: 160,
        location: 'At Market', expiryDate: '2026-09-01',
        assignedTo: 'u1', receiptUrl: null,
        supplierBatchRef: 'PGC-2026-0615-A',
      },
    ],
    lowStockThreshold: 30,
  },
  {
    id: 3,
    sku: 'SKU-003',
    name: 'Vitamin C 1000mg',
    category: 'Supplement — Vitamin',
    supplier: 'Nutri-Import SARL, Douala',
    storageConditions: 'Store in cool, dry place. Avoid humidity and direct sunlight.',
    regulatoryNotes: 'No prescription required. OTC supplement. Country of origin: India (GMP certified).',
    reorderPoint: 60,
    batches: [
      {
        batchId: 'B003-A', purchaseDate: '2026-07-01', totalUnits: 300,
        costPerUnit: 60, sellPerUnit: 100, soldUnits: 45,
        location: 'In Transit', expiryDate: '2027-07-01',
        assignedTo: 'u3', receiptUrl: null,
        supplierBatchRef: 'NI-2026-0701-A',
      },
    ],
    lowStockThreshold: 50,
  },
  {
    id: 4,
    sku: 'SKU-004',
    name: 'Ibuprofen 400mg',
    category: 'Medication — Anti-inflammatory',
    supplier: 'Médipharma Importation, Douala',
    storageConditions: 'Store below 25°C. Keep dry. Do not store in bathroom.',
    regulatoryNotes: 'DPML approved. OTC up to 400mg. Prescription required for packs > 30 tablets.',
    reorderPoint: 40,
    batches: [
      {
        batchId: 'B004-A', purchaseDate: '2026-05-10', totalUnits: 150,
        costPerUnit: 350, sellPerUnit: 700, soldUnits: 142,
        location: 'Warehouse', expiryDate: '2026-08-01',
        assignedTo: 'u1', receiptUrl: null,
        supplierBatchRef: 'MPI-2026-0510-A',
      },
    ],
    lowStockThreshold: 20,
  },
  {
    id: 5,
    sku: 'SKU-005',
    name: 'Palm Oil — Red (5L)',
    category: 'Food — Cooking Oil',
    supplier: 'Huilerie de l\'Ouest, Bafoussam',
    storageConditions: 'Store in cool area, away from heat. Shelf stable when sealed. Oxidises after opening.',
    regulatoryNotes: 'Food-grade. ANOR Cameroon quality certified. No import required — local sourcing.',
    reorderPoint: 15,
    batches: [
      {
        batchId: 'B005-A', purchaseDate: '2026-07-05', totalUnits: 80,
        costPerUnit: 2500, sellPerUnit: 3500, soldUnits: 12,
        location: 'At Market', expiryDate: '2027-01-01',
        assignedTo: 'u3', receiptUrl: null,
        supplierBatchRef: 'HO-2026-0705-A',
      },
    ],
    lowStockThreshold: 10,
  },
  {
    id: 6,
    sku: 'SKU-006',
    name: 'Cassava Flour — Fine (10kg)',
    category: 'Food — Staple Grain',
    supplier: 'Minoterie du Centre, Yaoundé',
    storageConditions: 'Store in dry, cool environment. Keep sealed. Absorbs moisture easily.',
    regulatoryNotes: 'Food-grade. ANOR quality mark. Short shelf life once opened — sell within 2 months.',
    reorderPoint: 20,
    batches: [
      {
        batchId: 'B006-A', purchaseDate: '2026-07-03', totalUnits: 120,
        costPerUnit: 1800, sellPerUnit: 2800, soldUnits: 34,
        location: 'In Transit', expiryDate: '2026-10-01',
        assignedTo: 'u2', receiptUrl: null,
        supplierBatchRef: 'MC-2026-0703-A',
      },
    ],
    lowStockThreshold: 15,
  },
  {
    id: 7,
    sku: 'SKU-007',
    name: 'Zinc Sulfate 20mg',
    category: 'Supplement — Mineral',
    supplier: 'PharmaGros Cameroun, Yaoundé',
    storageConditions: 'Store in airtight container below 25°C. Away from moisture.',
    regulatoryNotes: 'OTC supplement. WHO Essential Medicine for childhood diarrhoea. No prescription needed.',
    reorderPoint: 40,
    batches: [
      {
        batchId: 'B007-A', purchaseDate: '2026-06-20', totalUnits: 250,
        costPerUnit: 80, sellPerUnit: 150, soldUnits: 60,
        location: 'Warehouse', expiryDate: '2027-06-01',
        assignedTo: 'u1', receiptUrl: null,
        supplierBatchRef: 'PGC-2026-0620-A',
      },
    ],
    lowStockThreshold: 30,
  },
  {
    id: 8,
    sku: 'SKU-008',
    name: 'Oral Rehydration Salts (ORS)',
    category: 'Medication — Rehydration',
    supplier: 'Médipharma Importation, Douala',
    storageConditions: 'Store below 30°C, dry. Keep away from children once prepared.',
    regulatoryNotes: 'WHO Essential Medicine. OTC. DPML list item. High community health importance.',
    reorderPoint: 50,
    batches: [
      {
        batchId: 'B008-A', purchaseDate: '2026-07-02', totalUnits: 400,
        costPerUnit: 50, sellPerUnit: 95, soldUnits: 80,
        location: 'Warehouse', expiryDate: '2028-01-01',
        assignedTo: 'u3', receiptUrl: null,
        supplierBatchRef: 'MPI-2026-0702-A',
      },
    ],
    lowStockThreshold: 50,
  },
]

// ─── LOGISTICS ────────────────────────────────────────────────────────────────
export const logisticsMode = 'own_goods'

export const deliveries = [
  {
    id: 'DEL-001', product: 'Palm Oil 5L × 40 units', quantity: 40,
    origin: 'Yaoundé Warehouse', destination: 'Marché Mokolo, Yaoundé',
    driver: 'Emmanuel Nkoa', driverOrg: 'Nkoa Transport', driverPhone: '+237 677 001 002',
    value: 120000, status: 'At Market', dispatchTime: '07:30', expectedArrival: '08:15',
    paymentReceived: true, mode: 'own_goods',
    notes: 'Regular Monday run to Mokolo. Emmanuel reliable — always calls on arrival.',
  },
  {
    id: 'DEL-002', product: 'Cassava Flour 10kg × 60 units', quantity: 60,
    origin: 'Yaoundé Warehouse', destination: 'Marché Sandaga, Douala',
    driver: 'Thierry Bilong', driverOrg: 'In-house', driverPhone: '+237 699 003 004',
    value: 180000, status: 'In Transit', dispatchTime: '09:00', expectedArrival: '11:30',
    paymentReceived: false, mode: 'own_goods',
    notes: 'Douala run. Thierry must have delivery note signed by market agent before unloading.',
  },
  {
    id: 'DEL-003', product: 'Paracetamol 500mg × 200 units', quantity: 200,
    origin: 'Douala Depot', destination: 'Pharma Plus, Yaoundé',
    driver: 'Roger Fouda', driverOrg: 'Fouda Logistics SARL', driverPhone: '+237 655 005 006',
    value: 170000, status: 'Delivered', dispatchTime: '06:00', expectedArrival: '08:00',
    paymentReceived: true, mode: 'logistics_business',
    notes: 'Delivered on time. Jean-Pierre signed delivery note. Invoice INV-003 linked.',
  },
  {
    id: 'DEL-004', product: 'Vitamin C 1000mg × 100 units', quantity: 100,
    origin: 'Yaoundé Warehouse', destination: 'Biyem Clinic, Douala',
    driver: 'Emmanuel Nkoa', driverOrg: 'Nkoa Transport', driverPhone: '+237 677 001 002',
    value: 10000, status: 'Preparing', dispatchTime: '14:00', expectedArrival: '16:30',
    paymentReceived: false, mode: 'own_goods',
    notes: 'Pilot delivery for Biyem Clinic — ensure cold chain is maintained. Christelle coordinating.',
  },
  {
    id: 'DEL-005', product: 'Amoxicillin 250mg × 150 units', quantity: 150,
    origin: 'Yaoundé Warehouse', destination: 'Pharma Plus, Yaoundé (Emergency)',
    driver: 'Thierry Bilong', driverOrg: 'In-house', driverPhone: '+237 699 003 004',
    value: 225000, status: 'Delivered', dispatchTime: '10:00', expectedArrival: '10:45',
    paymentReceived: false, mode: 'logistics_business',
    notes: 'Emergency same-day delivery for Jean-Pierre. Completed 10 July. Invoice INV-005 raised.',
  },
]

// ─── CONTRACTS ────────────────────────────────────────────────────────────────
export const contracts = [
  { id: 'CON-001', name: 'Pharma Plus Q3 Supply Agreement', org: 'Pharma Plus', sentDate: '2026-07-01', status: 'Sent', value: 850000, expiryDate: '2026-12-31' },
  { id: 'CON-002', name: 'Moda Distribution — Annual Partnership', org: 'Moda Distribution', sentDate: '2026-06-20', status: 'Under Review', value: 1200000, expiryDate: '2027-06-20' },
  { id: 'CON-003', name: 'Kamga & Sons NDA', org: 'Kamga & Sons', sentDate: '2026-06-15', status: 'Signed', value: 0, expiryDate: null },
  { id: 'CON-004', name: 'Biyem Clinic Pilot Service Agreement', org: 'Biyem Clinic', sentDate: '2026-07-06', status: 'Draft', value: 320000, expiryDate: null },
  { id: 'CON-005', name: 'RSA Insurance Partnership MOU', org: 'Réseau Santé Assurances', sentDate: '2026-07-08', status: 'Draft', value: 4800000, expiryDate: null },
]

export const contractTemplates = [
  { id: 1, name: 'Service Agreement', description: 'Standard service delivery agreement with payment terms' },
  { id: 2, name: 'Sales Contract', description: 'Product sales contract with delivery and warranty terms' },
  { id: 3, name: 'Non-Disclosure Agreement (NDA)', description: 'Mutual NDA for business discussions and partnerships' },
  { id: 4, name: 'MOU / Partnership Agreement', description: 'Memorandum of Understanding for strategic partnerships' },
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
    promotionTarget: 'CEO by 2028. Requires P&L ownership, 3 enterprise accounts signed, and team of 5+ reporting.',
    promises: [
      { id: 'p1', date: '2026-06-01', promise: 'Salary review in September 2026 if Q3 target hit (target: 3M CFA new pipeline)', status: 'Pending' },
      { id: 'p2', date: '2026-01-15', promise: 'Company vehicle by end of 2026', status: 'Pending' },
    ],
    notes: 'Top performer. Loyal. Brought in RSA and MTN leads independently. Needs autonomy to thrive — micromanagement will lose him.',
    benefits: { healthScan: true, healthScanDate: '2026-06-15' },
    schedule: {
      Monday: ['08:00–17:00'], Tuesday: ['08:00–17:00'], Wednesday: ['08:00–17:00'],
      Thursday: ['08:00–17:00'], Friday: ['08:00–16:00'], Saturday: [], Sunday: [],
    },
    leaveBalance: 18,
    kpi: { target: 3000000, achieved: 1870000 },
  },
  {
    id: 2, name: 'Christelle Abena', role: 'Operations Manager', department: 'Operations',
    startDate: '2024-03-01', status: 'Active',
    phone: '+237 699 100 002', email: 'christelle@plutobusiness.cm',
    address: 'Akwa, Douala',
    salary: 280000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 25000, housing: 40000, meal: 12000 },
    promotionTarget: 'COO when company reaches 10 staff. Must demonstrate vendor management and P&L literacy.',
    promises: [
      { id: 'p3', date: '2026-03-01', promise: 'Training budget CFA 150,000 for 2026 (Supply chain + management course)', status: 'Fulfilled' },
      { id: 'p4', date: '2026-05-01', promise: 'Remote work option: 1 day/week from August 2026', status: 'Pending' },
    ],
    notes: 'Detail-oriented. Runs logistics team tightly. Manages APC pharmacy relationship well. Enrolled in OHADA business law course (self-funded — reimburse per promise p3).',
    benefits: { healthScan: true, healthScanDate: '2026-06-20' },
    schedule: {
      Monday: ['08:00–17:00'], Tuesday: ['08:00–17:00'], Wednesday: ['08:00–17:00'],
      Thursday: ['08:00–17:00'], Friday: ['08:00–17:00'], Saturday: [], Sunday: [],
    },
    leaveBalance: 22,
    kpi: { target: 50, achieved: 46 },
  },
  {
    id: 3, name: 'Rodrigue Tchamba', role: 'Logistics Coordinator', department: 'Logistics',
    startDate: '2024-06-01', status: 'Active',
    phone: '+237 655 100 003', email: 'rodrigue@plutobusiness.cm',
    address: 'Bali, Douala',
    salary: 180000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 0, meal: 10000 },
    promotionTarget: 'Logistics Manager when team grows to 3 full-time drivers. Needs written documentation skills improvement.',
    promises: [],
    notes: 'Had documentation failure in March (DEL-003 unsigned). Retraining completed. Back on track — 0 incidents since April. Good with drivers and vendors.',
    benefits: { healthScan: false, healthScanDate: null },
    schedule: {
      Monday: ['07:00–16:00'], Tuesday: ['07:00–16:00'], Wednesday: ['07:00–16:00'],
      Thursday: ['07:00–16:00'], Friday: ['07:00–15:00'], Saturday: ['07:00–12:00'], Sunday: [],
    },
    leaveBalance: 14,
    kpi: { target: 20, achieved: 19 },
  },
  {
    id: 4, name: 'Nathalie Elong', role: 'Finance Officer', department: 'Finance',
    startDate: '2024-02-15', status: 'On Leave',
    phone: '+237 677 100 004', email: 'nathalie@plutobusiness.cm',
    address: 'Bastos, Yaoundé',
    salary: 220000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 30000, meal: 10000 },
    promotionTarget: 'Finance Manager when accounting module goes live. Must pass OHADA exam by end of 2026.',
    promises: [
      { id: 'p5', date: '2026-02-15', promise: 'Flexible Fridays (leave at 15:00) reviewed annually', status: 'Active' },
      { id: 'p6', date: '2026-05-01', promise: 'OHADA exam fees covered by company (CFA 85,000)', status: 'Fulfilled' },
    ],
    notes: 'On annual leave 7–18 July. Returns 21 July. Extremely reliable — manages all bank reconciliation, CNPS submissions, and payroll runs solo. Handle urgent finance queries via Fabrice while she is out.',
    benefits: { healthScan: true, healthScanDate: '2026-05-10' },
    schedule: {
      Monday: ['08:00–17:00'], Tuesday: ['08:00–17:00'], Wednesday: ['08:00–17:00'],
      Thursday: ['08:00–17:00'], Friday: ['08:00–15:00'], Saturday: [], Sunday: [],
    },
    leaveBalance: 8,
    kpi: { target: 100, achieved: 98 },
  },
  {
    id: 5, name: 'Bruno Manga', role: 'Field Sales Rep', department: 'Sales',
    startDate: '2025-01-10', status: 'Active',
    phone: '+237 699 100 005', email: 'bruno@plutobusiness.cm',
    address: 'Bonamoussadi, Douala',
    salary: 150000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 0, meal: 8000 },
    promotionTarget: 'Senior Sales Rep if 3 deals closed in Q3 2026. Commission structure to be introduced from Q4.',
    promises: [
      { id: 'p7', date: '2026-07-01', promise: 'Commission scheme introduced from Q4 2026 if targets hit', status: 'Pending' },
    ],
    notes: 'Verbal warning for punctuality (May 2026 — 4 late arrivals). Improving significantly since June. Strong client rapport — Cécile at Kamga specifically requests him. Good field instincts once in front of clients.',
    benefits: { healthScan: false, healthScanDate: null },
    schedule: {
      Monday: ['08:30–17:30'], Tuesday: ['08:30–17:30'], Wednesday: ['08:30–17:30'],
      Thursday: ['08:30–17:30'], Friday: ['08:30–17:00'], Saturday: [], Sunday: [],
    },
    leaveBalance: 20,
    kpi: { target: 1000000, achieved: 400000 },
  },
  {
    id: 6, name: 'Sylvie Ondoa', role: 'HR & Admin', department: 'HR',
    startDate: '2024-04-01', status: 'Active',
    phone: '+237 655 100 006', email: 'sylvie@plutobusiness.cm',
    address: 'Nlongkak, Yaoundé',
    salary: 200000, payFrequency: 'Monthly', contractType: 'Permanent',
    allowances: { transport: 20000, housing: 25000, meal: 10000 },
    promotionTarget: 'Head of People when company reaches 15 staff. Currently building HR policy handbook.',
    promises: [
      { id: 'p8', date: '2026-04-01', promise: 'Remote work Mondays approved from July 2026', status: 'Active' },
      { id: 'p9', date: '2026-06-01', promise: 'HR policy handbook bonus: CFA 100,000 on completion', status: 'Pending' },
    ],
    notes: 'Keeps the office running. Handles onboarding, scheduling, leave, and morale. Writing the HR policy handbook (50% complete). Essential — do not lose her.',
    benefits: { healthScan: true, healthScanDate: '2026-06-01' },
    schedule: {
      Monday: ['Remote'], Tuesday: ['08:00–17:00'], Wednesday: ['08:00–17:00'],
      Thursday: ['08:00–17:00'], Friday: ['08:00–17:00'], Saturday: [], Sunday: [],
    },
    leaveBalance: 16,
    kpi: { target: 100, achieved: 87 },
  },
]

// ─── PAYROLL HISTORY ─────────────────────────────────────────────────────────
export const payrollRuns = [
  { id: 'PR-2026-06', month: 'June 2026', runDate: '2026-06-28', status: 'Paid', totalGross: 1390000, totalNet: 1156450, staffCount: 6 },
  { id: 'PR-2026-05', month: 'May 2026', runDate: '2026-05-30', status: 'Paid', totalGross: 1390000, totalNet: 1156450, staffCount: 6 },
  { id: 'PR-2026-04', month: 'April 2026', runDate: '2026-04-29', status: 'Paid', totalGross: 1340000, totalNet: 1114850, staffCount: 5 },
]

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
export const expenses = [
  { id: 'EXP-001', date: '2026-07-05', category: 'Rent', description: 'Office rent — July 2026, Bastos Yaoundé', amount: 150000, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Approved' },
  { id: 'EXP-002', date: '2026-07-03', category: 'Transport', description: 'Fuel + driver costs DEL-002 + DEL-003', amount: 35000, vatRate: 19.25, paidBy: 'u3', receipt: null, status: 'Approved' },
  { id: 'EXP-003', date: '2026-07-02', category: 'Supplies', description: 'Office supplies + printing (invoices, delivery notes)', amount: 18500, vatRate: 19.25, paidBy: 'u2', receipt: null, status: 'Approved' },
  { id: 'EXP-004', date: '2026-07-08', category: 'Marketing', description: 'Airtime for WhatsApp campaign blast (Q3 Pharmacy)', amount: 12000, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Pending' },
  { id: 'EXP-005', date: '2026-07-01', category: 'Utilities', description: 'Electricity bill Q2 — Yaoundé office + warehouse', amount: 45000, vatRate: 19.25, paidBy: 'u2', receipt: null, status: 'Approved' },
  { id: 'EXP-006', date: '2026-06-28', category: 'Payroll', description: 'Staff salaries — June 2026 (6 staff)', amount: 1390000, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Approved' },
  { id: 'EXP-007', date: '2026-06-28', category: 'CNPS', description: 'CNPS employer contributions — June 2026', amount: 218192, vatRate: 0, paidBy: 'u1', receipt: null, status: 'Approved' },
  { id: 'EXP-008', date: '2026-07-06', category: 'Professional Services', description: 'Legal review of Étoile Clinic NDA revision', amount: 75000, vatRate: 19.25, paidBy: 'u1', receipt: null, status: 'Approved' },
]

export const leaveRequests = [
  { id: 1, staff: 'Nathalie Elong', type: 'Annual Leave', from: '2026-07-07', to: '2026-07-18', status: 'Approved', days: 10 },
  { id: 2, staff: 'Bruno Manga', type: 'Sick Leave', from: '2026-07-09', to: '2026-07-09', status: 'Approved', days: 1 },
  { id: 3, staff: 'Rodrigue Tchamba', type: 'Emergency Leave', from: '2026-07-14', to: '2026-07-15', status: 'Pending', days: 2 },
]

export const disciplinaryLog = [
  { id: 1, staff: 'Bruno Manga', date: '2026-05-12', type: 'Verbal Warning', notes: 'Late arrival on 4 occasions in May (08:50–09:15 range). Spoke with Bruno — acknowledged and apologised. Improvement noted June onwards.', outcome: 'Warning issued. No further action.' },
  { id: 2, staff: 'Rodrigue Tchamba', date: '2026-03-20', type: 'Written Warning', notes: 'Missed delivery documentation on DEL-003 — package unloaded without signed delivery note. Client dispute risk. Christelle reported this.', outcome: 'Retraining on delivery procedure completed 25 March. Zero incidents since.' },
]

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
export const campaigns = [
  {
    id: 1, name: 'Q3 Pharmacy Outreach', type: 'Email', status: 'Active',
    sent: 142, opened: 87, clicks: 34, date: '2026-07-01',
    audience: 'Pharmacy sector contacts', subject: 'PreCure Q3 Supply — New pricing + priority delivery',
    notes: 'Targeting all pharmacy contacts with Q3 pricing update and priority delivery offer.',
  },
  {
    id: 2, name: 'Ramadan Promotion 2026', type: 'WhatsApp', status: 'Completed',
    sent: 89, opened: 89, clicks: 52, date: '2026-06-01',
    audience: 'All active clients', subject: 'Ramadan special — 15% off supplements bundle',
    notes: 'WhatsApp broadcast. High open rate. 3 direct orders generated totalling 350K CFA.',
  },
  {
    id: 3, name: 'PreCure Scan Launch — Corporates', type: 'Email', status: 'Draft',
    sent: 0, opened: 0, clicks: 0, date: '2026-07-10',
    audience: 'Corporate & Insurance contacts', subject: 'Introducing PreCure Health Scans for Corporate Wellness',
    notes: 'Targeting RSA, TotalEnergies, MTN, BTP Constructions contacts. Launch email for corporate pipeline.',
  },
  {
    id: 4, name: 'Distributor Bulk Discount Programme', type: 'WhatsApp', status: 'Active',
    sent: 23, opened: 21, clicks: 11, date: '2026-07-08',
    audience: 'Distributors (Kamga, Moda, etc.)', subject: 'Exclusive: Quarterly bulk discount programme',
    notes: 'Targeting all distributor contacts with volume discount programme announcement.',
  },
]

export const campaignTemplates = [
  { id: 1, name: 'Product Launch', subject: 'Introducing [Product] — available now', preview: 'We are excited to announce the launch of...' },
  { id: 2, name: 'Follow-up', subject: 'Following up on our conversation', preview: 'I wanted to follow up on our recent discussion...' },
  { id: 3, name: 'Seasonal Promotion', subject: 'Special offer — [X]% off this week', preview: 'For a limited time only, take advantage of...' },
  { id: 4, name: 'Monthly Newsletter', subject: 'Pluto Business — Monthly Update', preview: 'Here is what happened this month at...' },
  { id: 5, name: 'Corporate Health Pitch', subject: 'Preventative Health for Your Team — PreCure', preview: 'Your employees are your most important asset. PreCure\'s scanning programme...' },
]

// ─── INTERNAL CHAT ────────────────────────────────────────────────────────────
export const chatChannels = [
  { id: 'ch-general', name: 'General', type: 'group', members: ['u1', 'u2', 'u3'] },
  { id: 'ch-sales', name: 'Sales Team', type: 'group', members: ['u1', 'u3'] },
  { id: 'ch-ops', name: 'Operations', type: 'group', members: ['u1', 'u2'] },
]

export const chatMessages: Record<string, { id: string; from: string; text: string; ts: string }[]> = {
  'ch-general': [
    { id: 'm1', from: 'u1', text: 'Morning everyone — Q3 push starts today. Full pipeline review Friday at 10am.', ts: '09:00' },
    { id: 'm2', from: 'u2', text: 'DEL-002 is on the road to Douala. Should be at Sandaga by 11:30.', ts: '09:15' },
    { id: 'm3', from: 'u3', text: 'On my way to Kamga & Sons for the restocking drop. Cécile confirmed COD.', ts: '09:45' },
    { id: 'm4', from: 'u1', text: 'RSA meeting went well — Armand is aligned. Need commercial proposal by 20 Aug.', ts: '14:30' },
  ],
  'ch-sales': [
    { id: 'm5', from: 'u1', text: 'Bruno — follow up on Pharma Plus today. Jean-Pierre wants revised pricing by Friday. Competitor quote is 8% lower.', ts: '08:30' },
    { id: 'm6', from: 'u3', text: 'On it. Will WhatsApp him this morning before 11.', ts: '08:45' },
    { id: 'm7', from: 'u1', text: 'Also chase Kamga bulk discount proposal — Cécile is waiting on our pricing sheet.', ts: '09:05' },
    { id: 'm8', from: 'u3', text: 'Kamga visited — they want the bulk discount in writing. Sending today.', ts: '13:00' },
  ],
  'ch-ops': [
    { id: 'm9', from: 'u2', text: 'Rodrigue — make sure DEL-002 has the delivery note signed at Sandaga before leaving.', ts: '08:00' },
    { id: 'm10', from: 'u1', text: 'Nathalie is on leave until 21 July. Finance queries to me in the interim.', ts: '09:00' },
  ],
}

// ─── DOCUMENTS / COMPLIANCE ───────────────────────────────────────────────────
export const companyDocuments = [
  { id: 1, name: 'Certificate of Incorporation', type: 'Legal', expiry: null, uploadedDate: '2024-01-01', url: null },
  { id: 2, name: 'Business Insurance Policy', type: 'Insurance', expiry: '2026-12-31', uploadedDate: '2026-01-15', url: null },
  { id: 3, name: 'DPML Medical Device License', type: 'Regulatory', expiry: '2027-03-01', uploadedDate: '2026-03-01', url: null },
  { id: 4, name: 'Goods in Transit Insurance', type: 'Insurance', expiry: '2026-09-30', uploadedDate: '2026-09-30', url: null },
  { id: 5, name: 'CNPS Registration Certificate', type: 'HR / Legal', expiry: null, uploadedDate: '2024-01-15', url: null },
  { id: 6, name: 'Import Authorization — Pharmaceutical', type: 'Regulatory', expiry: '2027-06-01', uploadedDate: '2026-06-01', url: null },
]
