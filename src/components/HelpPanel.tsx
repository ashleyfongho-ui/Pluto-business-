import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HelpCircle, X, ChevronRight, ChevronDown, BookOpen, Barcode, QrCode, Printer } from 'lucide-react'

// ─── Help content per route ───────────────────────────────────────────────────
interface HelpSection {
  title: string
  icon?: React.ElementType
  steps?: string[]
  tips?: string[]
  body?: string
}

interface PageHelp {
  title: string
  summary: string
  sections: HelpSection[]
}

const helpContent: Record<string, PageHelp> = {
  '/': {
    title: 'Dashboard',
    summary: 'Your command centre. See everything that matters at a glance.',
    sections: [
      {
        title: 'What you see',
        steps: [
          'KPI cards — pipeline value, overdue invoices, active deals, low stock alerts',
          'Recent activity — latest interactions logged across all contacts and deals',
          'Alerts — items that need your attention today',
        ],
      },
      {
        title: 'Tips',
        tips: [
          'Click any alert to jump straight to the relevant page',
          'The pipeline value card shows your total weighted deal value',
          'Overdue invoice count drives your cash flow risk',
        ],
      },
    ],
  },

  '/organisations': {
    title: 'Organisations',
    summary: 'All your clients, prospects, distributors, and pharmacies in one list.',
    sections: [
      {
        title: 'Key columns',
        steps: [
          'Outstanding — total unpaid invoices for this org',
          'Last Activity — date of most recent interaction logged',
          'Owned By — the team member responsible for this account',
        ],
      },
      {
        title: 'Actions',
        steps: [
          'Click any row to open the full organisation profile',
          'From the detail page you can edit address, payment terms, add notes, and log activities',
          'The Org Tree tab shows parent/subsidiary relationships',
        ],
      },
    ],
  },

  '/contacts': {
    title: 'Contacts',
    summary: 'Individual people inside your client organisations.',
    sections: [
      {
        title: 'How to use',
        steps: [
          'Click a contact to open their detail page',
          'Log interactions (calls, meetings, WhatsApp chats) on their timeline',
          "Set promises — things you've committed to do — and mark them kept/broken",
          'WhatsApp link opens a direct chat in WhatsApp Web',
        ],
      },
    ],
  },

  '/pipeline': {
    title: 'Pipeline',
    summary: 'Track every deal from first contact to won or lost.',
    sections: [
      {
        title: 'Stages',
        steps: [
          'Lead → Qualified → Proposal → Negotiation → Won / Lost',
          'Drag cards between stages (Kanban view) or update stage on the deal detail page',
          'Probability % adjusts your weighted forecast automatically',
        ],
      },
      {
        title: 'Deal detail',
        steps: [
          'Add line items to build a quote inside the deal',
          'Set reminders and assign them to team members',
          'Activity log tracks every touchpoint with the client',
        ],
      },
    ],
  },

  '/invoices': {
    title: 'Invoices',
    summary: 'Create, send, and track invoices and payments.',
    sections: [
      {
        title: 'Invoice lifecycle',
        steps: [
          'Draft → Send to client → Paid (or Overdue if past due date)',
          'Connect your bank account in Accounting to auto-match payments',
          'Cash flow forecast uses due dates to project your income',
        ],
      },
    ],
  },

  '/inventory': {
    title: 'Inventory',
    summary: 'Track stock, batches, expiry, and costs for all your products.',
    sections: [
      {
        title: 'Batches',
        steps: [
          'Each product can have multiple batches — click the ▶ arrow to expand',
          'Batch shows: purchase date, location (warehouse / in transit / at market), cost vs sell price, margin',
          'Low stock alert fires when remaining units drop below the threshold you set',
        ],
      },
      {
        title: 'Adding stock',
        steps: [
          'Manual Entry — fill in product name, quantity, cost, sell price, dates',
          'Upload Receipt — take a photo of your supplier invoice, items are parsed automatically',
          'Daily Reconciliation — log sold/wasted/cash for produce and perishables',
        ],
      },
      {
        title: 'Barcodes',
        icon: Barcode,
        steps: [
          'Every SKU and batch has a barcode generated automatically',
          'Open any item\'s detail page to see its barcode',
          'Click "Print Labels" to print a sheet of sticky labels',
          'Use "Scan to Find" to point your phone camera at a barcode and jump to that item',
        ],
      },
      {
        title: 'Scanning barcodes',
        icon: QrCode,
        steps: [
          'Click the Scan button on the Inventory page',
          'Take a photo of the barcode with your phone — it reads CODE128 and EAN formats',
          'Or type/paste the SKU code manually to search',
          'Scan pulls up the product and pre-fills the Add Stock form',
        ],
      },
      {
        title: 'Printing labels',
        icon: Printer,
        steps: [
          'Select items in inventory and click "Print Labels"',
          'Choose label size: small (50×25mm), medium (80×40mm), large (100×60mm)',
          'Set copies per item — useful for printing a whole batch of shelf labels',
          'Labels open in a print window — use any label printer or sheet labels',
        ],
      },
    ],
  },

  '/logistics': {
    title: 'Logistics',
    summary: 'Manage deliveries, drivers, and shipment tracking.',
    sections: [
      {
        title: 'Creating a delivery',
        steps: [
          'Click "New Delivery" and fill in origin, destination, and assigned driver',
          'Attach inventory items to the delivery — this logs them as "In Transit"',
          'Status updates: Scheduled → In Transit → Delivered',
        ],
      },
      {
        title: 'Driver contact',
        steps: [
          'Click the phone icon to call a driver directly',
          'Click the route button to open Google Maps with origin → destination',
        ],
      },
    ],
  },

  '/campaigns': {
    title: 'Campaigns',
    summary: 'Run SMS and WhatsApp campaigns to your contacts.',
    sections: [
      {
        title: 'Creating a campaign',
        steps: [
          'Step 1: Choose type — SMS, WhatsApp, or Email',
          'Step 2: Write your message. Use {name} and {org} as merge tags',
          'Step 3: Set audience (all contacts, by sector, or by org) and schedule date/time',
        ],
      },
      {
        title: 'Tips',
        tips: [
          'Use templates to save time on repeat message types (promotions, follow-ups)',
          'Import contacts from CSV for one-off campaigns to external lists',
        ],
      },
    ],
  },

  '/reports': {
    title: 'Reports',
    summary: 'Sales, profitability, inventory, logistics, staff, and pipeline reports.',
    sections: [
      {
        title: 'Report tabs',
        steps: [
          'Sales — revenue over time, top clients',
          'Profitability — margin by product, revenue by staff, revenue by location',
          'Inventory — stock levels, expiry risk, waste tracking',
          'Logistics — delivery performance, driver stats',
          'Staff — KPI vs target, leave balance',
          'Pipeline — conversion rates, stage distribution',
        ],
      },
    ],
  },

  '/staff': {
    title: 'Staff',
    summary: 'Manage your team — schedule, leave, KPIs, and disciplinary records.',
    sections: [
      {
        title: 'Tabs on staff list',
        steps: [
          'Overview — full team list with role, department, status',
          'Schedule — weekly shift schedule per staff member',
          'Leave — pending and approved leave requests',
          'Disciplinary — log and track disciplinary actions',
        ],
      },
      {
        title: 'Staff detail page',
        steps: [
          'Click any staff member to open their profile',
          'Set promotion targets and track promises',
          'Benefits tab shows PreCure health scan allocation',
          'Notes tab for private manager observations',
        ],
      },
    ],
  },

  '/accounting': {
    title: 'Accounting',
    summary: 'Bank account linking, transaction feed, and cash flow forecasting.',
    sections: [
      {
        title: 'Getting started',
        steps: [
          'Link your bank account via the "Connect Bank" button',
          'Transactions sync automatically and can be categorised',
          'Cash flow forecast uses invoice due dates and recurring costs',
        ],
      },
    ],
  },

  '/chat': {
    title: 'Chat',
    summary: 'Internal team messaging, recorded for compliance.',
    sections: [
      {
        title: 'How it works',
        steps: [
          'Channels for team discussions — Sales, Logistics, Ops',
          'Direct messages to individual team members',
          'All messages are stored and searchable',
        ],
      },
    ],
  },

  '/settings': {
    title: 'Settings',
    summary: 'Configure your Pluto Business platform.',
    sections: [
      {
        title: 'Tabs',
        steps: [
          'Company — name, logo, address, currency',
          'Users & Roles — add team members, set permissions',
          'Integrations — WhatsApp, SMS gateway, bank connections',
          'Notifications — set alert thresholds and delivery methods',
          'Security — 2FA, session management',
          'Billing — subscription and plan details',
        ],
      },
    ],
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HelpPanel() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const location = useLocation()

  // Match route — strip dynamic :id segments
  const routeKey = '/' + location.pathname.split('/').filter(Boolean).slice(0, 1).join('/')
  const help = helpContent[routeKey] || helpContent['/']

  const toggle = (title: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(title) ? next.delete(title) : next.add(title)
      return next
    })
  }

  return (
    <>
      {/* Floating ? button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-pluto-600 text-white rounded-full shadow-lg hover:bg-pluto-700 transition-all hover:scale-110 flex items-center justify-center"
        title="Help"
        aria-label="Open help"
      >
        <HelpCircle size={20} />
      </button>

      {/* Slide-in panel */}
      {open && (
        <>
          {/* Backdrop (click to close) */}
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setOpen(false)}
          />

          <div className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl border-l border-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-pluto-600 text-white">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <div>
                  <p className="font-semibold text-sm">{help.title}</p>
                  <p className="text-xs text-pluto-100">Help Guide</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-pluto-200 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Summary */}
            <div className="px-5 py-3 bg-pluto-50 border-b border-gray-100">
              <p className="text-sm text-pluto-800">{help.summary}</p>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
              {help.sections.map(section => {
                const isOpen = expanded.has(section.title)
                const Icon = section.icon
                return (
                  <div key={section.title} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggle(section.title)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon size={14} className="text-pluto-600" />}
                        <span className="text-sm font-medium text-gray-800">{section.title}</span>
                      </div>
                      {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </button>

                    {isOpen && (
                      <div className="px-4 py-3 space-y-2 bg-white">
                        {section.body && (
                          <p className="text-sm text-gray-600">{section.body}</p>
                        )}
                        {section.steps && (
                          <ol className="space-y-1.5">
                            {section.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="w-4 h-4 rounded-full bg-pluto-100 text-pluto-700 text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                                  {i + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        )}
                        {section.tips && (
                          <ul className="space-y-1.5">
                            {section.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-pluto-400 shrink-0">💡</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">Pluto Business — PreCure CRM</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
