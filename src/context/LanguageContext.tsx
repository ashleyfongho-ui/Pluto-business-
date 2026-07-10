import React, { createContext, useContext, useState, useEffect } from 'react'

export type Lang = 'en' | 'fr' | 'ar' | 'es' | 'pt' | 'sw' | 'zh'

export const languageOptions: { code: Lang; label: string; nativeLabel: string; rtl?: boolean }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', rtl: true },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili' },
  { code: 'zh', label: 'Mandarin', nativeLabel: '中文' },
]

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: string) => string
  isRTL: boolean
}

const translations: Record<string, Record<Lang, string>> = {
  dashboard:            { en: 'Dashboard',      fr: 'Tableau de bord',  ar: 'لوحة القيادة',  es: 'Tablero',       pt: 'Painel',          sw: 'Dashibodi',    zh: '仪表盘' },
  organisations:        { en: 'Organisations',  fr: 'Organisations',    ar: 'المنظمات',      es: 'Organizaciones',pt: 'Organizações',    sw: 'Mashirika',    zh: '组织' },
  contacts:             { en: 'Contacts',       fr: 'Contacts',         ar: 'جهات الاتصال',  es: 'Contactos',     pt: 'Contatos',        sw: 'Mawasiliano',  zh: '联系人' },
  pipeline:             { en: 'Pipeline',       fr: 'Pipeline',         ar: 'خط الأعمال',    es: 'Cartera',       pt: 'Pipeline',        sw: 'Mtiririko',    zh: '销售管道' },
  invoices:             { en: 'Invoices',       fr: 'Factures',         ar: 'الفواتير',      es: 'Facturas',      pt: 'Faturas',         sw: 'Ankara',       zh: '发票' },
  inventory:            { en: 'Inventory',      fr: 'Inventaire',       ar: 'المخزون',       es: 'Inventario',    pt: 'Inventário',      sw: 'Hesabu ya Mali',zh: '库存' },
  logistics:            { en: 'Logistics',      fr: 'Logistique',       ar: 'اللوجستيات',   es: 'Logística',     pt: 'Logística',       sw: 'Usafirishaji',  zh: '物流' },
  campaigns:            { en: 'Campaigns',      fr: 'Campagnes',        ar: 'الحملات',       es: 'Campañas',      pt: 'Campanhas',       sw: 'Kampeni',       zh: '活动' },
  reports:              { en: 'Reports',        fr: 'Rapports',         ar: 'التقارير',      es: 'Informes',      pt: 'Relatórios',      sw: 'Ripoti',        zh: '报告' },
  staff:                { en: 'Staff',          fr: 'Personnel',        ar: 'الموظفون',      es: 'Personal',      pt: 'Pessoal',         sw: 'Wafanyakazi',   zh: '员工' },
  chat:                 { en: 'Chat',           fr: 'Messages',         ar: 'الدردشة',       es: 'Chat',          pt: 'Chat',            sw: 'Mazungumzo',    zh: '聊天' },
  settings:             { en: 'Settings',       fr: 'Paramètres',       ar: 'الإعدادات',     es: 'Ajustes',       pt: 'Configurações',   sw: 'Mipangilio',    zh: '设置' },
  accounting:           { en: 'Accounting',     fr: 'Comptabilité',     ar: 'المحاسبة',      es: 'Contabilidad',  pt: 'Contabilidade',   sw: 'Uhasibu',       zh: '会计' },
  'open deals':         { en: 'Open deals',     fr: 'Affaires ouvertes',ar: 'الصفقات المفتوحة',es: 'Tratos abiertos',pt: 'Negócios abertos',sw: 'Mikataba Wazi',zh: '未结交易' },
  'pipeline value':     { en: 'Pipeline value', fr: 'Valeur du pipeline',ar: 'قيمة المسار',  es: 'Valor cartera', pt: 'Valor pipeline',  sw: 'Thamani ya Mtiririko',zh: '管道价值' },
  'won this month':     { en: 'Won this month', fr: 'Gagnés ce mois',   ar: 'ربحنا هذا الشهر',es: 'Ganado este mes',pt: 'Ganhos este mês', sw: 'Ilishindwa Mwezi Huu',zh: '本月赢得' },
  'activities today':   { en: 'Activities today',fr:"Activités aujourd'hui",ar:'الأنشطة اليوم',es:'Actividades hoy',pt:'Atividades hoje',sw:'Shughuli Leo',zh:'今日活动' },
  new:                  { en: 'New',            fr: 'Nouveau',          ar: 'جديد',          es: 'Nuevo',         pt: 'Novo',            sw: 'Mpya',          zh: '新建' },
  search:               { en: 'Search…',        fr: 'Rechercher…',      ar: 'ابحث…',         es: 'Buscar…',       pt: 'Pesquisar…',      sw: 'Tafuta…',       zh: '搜索…' },
  save:                 { en: 'Save',           fr: 'Enregistrer',      ar: 'حفظ',           es: 'Guardar',       pt: 'Salvar',          sw: 'Hifadhi',       zh: '保存' },
  cancel:               { en: 'Cancel',         fr: 'Annuler',          ar: 'إلغاء',         es: 'Cancelar',      pt: 'Cancelar',        sw: 'Ghairi',        zh: '取消' },
  status:               { en: 'Status',         fr: 'Statut',           ar: 'الحالة',        es: 'Estado',        pt: 'Estado',          sw: 'Hali',          zh: '状态' },
  name:                 { en: 'Name',           fr: 'Nom',              ar: 'الاسم',         es: 'Nombre',        pt: 'Nome',            sw: 'Jina',          zh: '名称' },
  date:                 { en: 'Date',           fr: 'Date',             ar: 'التاريخ',       es: 'Fecha',         pt: 'Data',            sw: 'Tarehe',        zh: '日期' },
  amount:               { en: 'Amount',         fr: 'Montant',          ar: 'المبلغ',        es: 'Importe',       pt: 'Valor',           sw: 'Kiasi',         zh: '金额' },
  actions:              { en: 'Actions',        fr: 'Actions',          ar: 'الإجراءات',     es: 'Acciones',      pt: 'Ações',           sw: 'Vitendo',       zh: '操作' },
  'mark as paid':       { en: 'Mark as paid',   fr: 'Marquer comme payé',ar:'وضع علامة مدفوع',es:'Marcar como pagado',pt:'Marcar como pago',sw:'Weka Alama Imelipwa',zh:'标记为已付' },
  paid:                 { en: 'Paid',           fr: 'Payé',             ar: 'مدفوع',         es: 'Pagado',        pt: 'Pago',            sw: 'Imelipwa',      zh: '已付' },
  unpaid:               { en: 'Unpaid',         fr: 'Non payé',         ar: 'غير مدفوع',     es: 'No pagado',     pt: 'Não pago',        sw: 'Haijalipiwa',   zh: '未付' },
  overdue:              { en: 'Overdue',        fr: 'En retard',        ar: 'متأخر',         es: 'Vencido',       pt: 'Vencido',         sw: 'Imechelewa',    zh: '逾期' },
  draft:                { en: 'Draft',          fr: 'Brouillon',        ar: 'مسودة',         es: 'Borrador',      pt: 'Rascunho',        sw: 'Rasimu',        zh: '草稿' },
  sent:                 { en: 'Sent',           fr: 'Envoyé',           ar: 'مرسل',          es: 'Enviado',       pt: 'Enviado',         sw: 'Imetumwa',      zh: '已发送' },
  warehouse:            { en: 'Warehouse',      fr: 'Entrepôt',         ar: 'مستودع',        es: 'Almacén',       pt: 'Armazém',         sw: 'Ghala',         zh: '仓库' },
  'in transit':         { en: 'In Transit',     fr: 'En transit',       ar: 'في العبور',     es: 'En tránsito',   pt: 'Em trânsito',     sw: 'Katika Usafiri', zh: '在途' },
  'at market':          { en: 'At Market',      fr: 'Au marché',        ar: 'في السوق',      es: 'En mercado',    pt: 'No mercado',      sw: 'Sokoni',        zh: '在市场' },
  sold:                 { en: 'Sold',           fr: 'Vendu',            ar: 'مباع',          es: 'Vendido',       pt: 'Vendido',         sw: 'Imeuziwa',      zh: '已售' },
  'low stock':          { en: 'Low Stock',      fr: 'Stock bas',        ar: 'مخزون منخفض',  es: 'Stock bajo',    pt: 'Stock baixo',     sw: 'Hisa Ndogo',    zh: '低库存' },
  'expiring soon':      { en: 'Expiring Soon',  fr: 'Expire bientôt',   ar: 'تنتهي قريباً',  es: 'Por vencer',    pt: 'A vencer',        sw: 'Muda Unakwisha', zh: '即将过期' },
  'stock in transit':   { en: 'Stock in Transit',fr: 'Stock en transit', ar: 'مخزون في العبور',es: 'Stock en tránsito',pt: 'Stock em trânsito',sw: 'Hisa Katika Usafiri',zh: '在途库存' },
  delivery:             { en: 'Delivery',       fr: 'Livraison',        ar: 'التسليم',       es: 'Entrega',       pt: 'Entrega',         sw: 'Utoaji',        zh: '交付' },
  driver:               { en: 'Driver',         fr: 'Chauffeur',        ar: 'السائق',        es: 'Conductor',     pt: 'Motorista',       sw: 'Dereva',        zh: '司机' },
  origin:               { en: 'Origin',         fr: 'Origine',          ar: 'المصدر',        es: 'Origen',        pt: 'Origem',          sw: 'Chanzo',        zh: '起点' },
  destination:          { en: 'Destination',    fr: 'Destination',      ar: 'الوجهة',        es: 'Destino',       pt: 'Destino',         sw: 'Marudio',       zh: '目的地' },
  value:                { en: 'Value',          fr: 'Valeur',           ar: 'القيمة',        es: 'Valor',         pt: 'Valor',           sw: 'Thamani',       zh: '价值' },
  contracts:            { en: 'Contracts',      fr: 'Contrats',         ar: 'العقود',        es: 'Contratos',     pt: 'Contratos',       sw: 'Mikataba',      zh: '合同' },
  templates:            { en: 'Templates',      fr: 'Modèles',          ar: 'القوالب',       es: 'Plantillas',    pt: 'Modelos',         sw: 'Violezo',       zh: '模板' },
  financials:           { en: 'Financials',     fr: 'Finances',         ar: 'الماليات',      es: 'Finanzas',      pt: 'Finanças',        sw: 'Fedha',         zh: '财务' },
  overview:             { en: 'Overview',       fr: "Vue d'ensemble",   ar: 'نظرة عامة',     es: 'Resumen',       pt: 'Visão geral',     sw: 'Muhtasari',     zh: '概览' },
  schedule:             { en: 'Schedule',       fr: 'Planning',         ar: 'الجدول',        es: 'Horario',       pt: 'Horário',         sw: 'Ratiba',        zh: '日程' },
  'leave & absence':    { en: 'Leave & Absence',fr: 'Congés & absences',ar: 'الإجازات',      es: 'Bajas y ausencias',pt:'Licenças e ausências',sw:'Likizo na Kutokuwepo',zh:'假期与缺勤' },
  disciplinary:         { en: 'Disciplinary',   fr: 'Disciplinaire',    ar: 'التأديبي',      es: 'Disciplinario', pt: 'Disciplinar',     sw: 'Adhabu',        zh: '纪律' },
  role:                 { en: 'Role',           fr: 'Rôle',             ar: 'الدور',         es: 'Cargo',         pt: 'Cargo',           sw: 'Jukumu',        zh: '角色' },
  department:           { en: 'Department',     fr: 'Département',      ar: 'القسم',         es: 'Departamento',  pt: 'Departamento',    sw: 'Idara',         zh: '部门' },
  'start date':         { en: 'Start Date',     fr: 'Date de début',    ar: 'تاريخ البدء',   es: 'Fecha inicio',  pt: 'Data início',     sw: 'Tarehe ya Kuanza',zh: '开始日期' },
  active:               { en: 'Active',         fr: 'Actif',            ar: 'نشط',           es: 'Activo',        pt: 'Ativo',           sw: 'Amilifu',       zh: '活跃' },
  'on leave':           { en: 'On Leave',       fr: 'En congé',         ar: 'في إجازة',      es: 'De baja',       pt: 'De licença',      sw: 'Kwa Likizo',    zh: '休假中' },
  suspended:            { en: 'Suspended',      fr: 'Suspendu',         ar: 'معلق',          es: 'Suspendido',    pt: 'Suspenso',        sw: 'Amesimamishwa',  zh: '已暂停' },
  'sales performance':  { en: 'Sales Performance',fr: 'Performance commerciale',ar:'أداء المبيعات',es:'Rendimiento de ventas',pt:'Desempenho de vendas',sw:'Utendaji wa Mauzo',zh:'销售绩效' },
  'inventory health':   { en: 'Inventory Health',fr: 'Santé des stocks',ar: 'صحة المخزون',  es: 'Salud inventario',pt: 'Saúde do inventário',sw:'Afya ya Hisa',zh:'库存健康' },
  'staff performance':  { en: 'Staff Performance',fr: 'Performance du personnel',ar:'أداء الموظفين',es:'Rendimiento del personal',pt:'Desempenho do pessoal',sw:'Utendaji wa Wafanyakazi',zh:'员工绩效' },
  'pipeline health':    { en: 'Pipeline Health',fr: 'Santé du pipeline',ar: 'صحة المسار',   es: 'Salud cartera', pt: 'Saúde pipeline',  sw: 'Afya ya Mtiririko',zh:'管道健康' },
  benefits:             { en: 'Benefits',       fr: 'Avantages',        ar: 'المزايا',       es: 'Beneficios',    pt: 'Benefícios',      sw: 'Faida',         zh: '福利' },
  notes:                { en: 'Notes',          fr: 'Notes',            ar: 'ملاحظات',       es: 'Notas',         pt: 'Notas',           sw: 'Maelezo',       zh: '备注' },
  promises:             { en: 'Promises',       fr: 'Engagements',      ar: 'الوعود',        es: 'Compromisos',   pt: 'Promessas',       sw: 'Ahadi',         zh: '承诺' },
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  toggle: () => {},
  t: (k) => k,
  isRTL: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('pluto_lang') as Lang) || 'en'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('pluto_lang', l)
    const isRTL = languageOptions.find(o => o.code === l)?.rtl ?? false
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }

  useEffect(() => {
    const isRTL = languageOptions.find(o => o.code === lang)?.rtl ?? false
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [lang])

  const toggle = () => setLang(lang === 'en' ? 'fr' : 'en')

  const isRTL = languageOptions.find(o => o.code === lang)?.rtl ?? false

  const t = (key: string) => {
    const entry = translations[key.toLowerCase()]
    return entry?.[lang] ?? entry?.['en'] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
