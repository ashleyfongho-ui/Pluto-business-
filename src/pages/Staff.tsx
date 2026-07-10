import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { staff, leaveRequests, disciplinaryLog, payrollRuns } from '../data/mockData'
import { ChevronRight, DollarSign, CheckCircle, Clock, Download, Play, X, FileText } from 'lucide-react'

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
}
const leaveStatusColors: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-700',
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Cameroon tax constants
const CNPS_EMPLOYEE = 0.042   // 4.2% employee
const CNPS_EMPLOYER = 0.1568  // 15.68% employer
// IRPP simplified brackets (Cameroon)
function calcIRPP(grossMonthly: number): number {
  const annual = grossMonthly * 12
  if (annual <= 2000000) return 0
  if (annual <= 3000000) return Math.round((annual - 2000000) * 0.10 / 12)
  if (annual <= 5000000) return Math.round(((3000000 - 2000000) * 0.10 + (annual - 3000000) * 0.155) / 12)
  return Math.round(((3000000 - 2000000) * 0.10 + (5000000 - 3000000) * 0.155 + (annual - 5000000) * 0.20) / 12)
}

function calcPayslip(member: typeof staff[0]) {
  const s = member as typeof member & { salary?: number; allowances?: { transport: number; housing: number; meal: number } }
  const baseSalary = s.salary ?? 0
  const allowances = s.allowances ?? { transport: 0, housing: 0, meal: 0 }
  const totalAllowances = allowances.transport + allowances.housing + allowances.meal
  const grossPay = baseSalary + totalAllowances
  const cnpsEmployee = Math.round(grossPay * CNPS_EMPLOYEE)
  const irpp = calcIRPP(grossPay)
  const totalDeductions = cnpsEmployee + irpp
  const netPay = grossPay - totalDeductions
  const cnpsEmployer = Math.round(grossPay * CNPS_EMPLOYER)
  return { baseSalary, allowances, totalAllowances, grossPay, cnpsEmployee, irpp, totalDeductions, netPay, cnpsEmployer }
}

export default function Staff() {
  const { t } = useLang()
  const [tab, setTab] = useState<'overview' | 'schedule' | 'leave' | 'disciplinary' | 'payroll'>('overview')
  const [payslipModal, setPayslipModal] = useState<typeof staff[0] | null>(null)
  const [runPayrollModal, setRunPayrollModal] = useState(false)

  const totalMonthlyGross = staff.reduce((s, m) => {
    const ps = calcPayslip(m)
    return s + ps.grossPay
  }, 0)
  const totalMonthlyNet = staff.reduce((s, m) => {
    const ps = calcPayslip(m)
    return s + ps.netPay
  }, 0)
  const totalCNPSEmployer = staff.reduce((s, m) => {
    const ps = calcPayslip(m)
    return s + ps.cnpsEmployer
  }, 0)

  return (
    <>
      <TopBar title={t('staff')} />
      <main className="p-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {(['overview','schedule','leave','disciplinary','payroll'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${tab===k ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {k === 'leave' ? t('leave & absence') : k === 'payroll' ? '💰 Payroll' : t(k)}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{staff.length} staff members</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ Add Staff</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Department</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Start Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              </tr></thead>
              <tbody>{staff.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                  <td className="px-4 py-3">
                    <Link to={`/staff/${s.id}`} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">
                        {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{s.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.role}</td>
                  <td className="px-4 py-3 text-gray-500">{s.department}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.startDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3"><Link to={`/staff/${s.id}`}><ChevronRight size={14} className="text-gray-300 group-hover:text-pluto-500"/></Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* SCHEDULE */}
        {tab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Week of 7–12 July 2026</h2>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                {days.map(d => <th key={d} className="text-center px-3 py-3 font-medium text-gray-500">{d}</th>)}
              </tr></thead>
              <tbody>{staff.map(s => (
                <tr key={s.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  {days.map(day => {
                    const onLeave = s.status === 'On Leave' && day !== 'Sat'
                    return (
                      <td key={day} className="text-center px-3 py-3">
                        {day === 'Sat'
                          ? <span className="text-gray-300 text-xs">—</span>
                          : onLeave
                          ? <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-xs rounded">Leave</span>
                          : <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">✓</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* LEAVE */}
        {tab === 'leave' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{leaveRequests.length} requests</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Request</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">From</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">To</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Days</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              </tr></thead>
              <tbody>{leaveRequests.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{l.staff}</td>
                  <td className="px-4 py-3 text-gray-500">{l.type}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.from}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.to}</td>
                  <td className="px-4 py-3 text-gray-500">{l.days}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${leaveStatusColors[l.status]}`}>{l.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* DISCIPLINARY */}
        {tab === 'disciplinary' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{disciplinaryLog.length} records</p>
              <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ Log Incident</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Outcome</th>
              </tr></thead>
              <tbody>{disciplinaryLog.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">{d.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{d.staff}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">{d.type}</span></td>
                  <td className="px-4 py-3 text-gray-500">{d.notes}</td>
                  <td className="px-4 py-3 text-gray-500">{d.outcome}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* PAYROLL */}
        {tab === 'payroll' && (
          <div className="space-y-5">
            {/* KPI strip */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Monthly Gross Payroll</p>
                <p className="text-xl font-bold text-gray-900">{(totalMonthlyGross/1000).toFixed(0)}K CFA</p>
                <p className="text-xs text-gray-400">{staff.length} employees</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Total Net Pay</p>
                <p className="text-xl font-bold text-green-600">{(totalMonthlyNet/1000).toFixed(0)}K CFA</p>
                <p className="text-xs text-gray-400">after deductions</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">CNPS Employer</p>
                <p className="text-xl font-bold text-amber-600">{(totalCNPSEmployer/1000).toFixed(0)}K CFA</p>
                <p className="text-xs text-gray-400">15.68% contrib.</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Total Cost to Co.</p>
                <p className="text-xl font-bold text-pluto-700">{((totalMonthlyGross + totalCNPSEmployer)/1000).toFixed(0)}K CFA</p>
                <p className="text-xs text-gray-400">gross + employer CNPS</p>
              </div>
            </div>

            {/* Payroll table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">July 2026 Payroll</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Export CNPS
                  </button>
                  <button onClick={() => setRunPayrollModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                    <Play size={13} /> Run Payroll
                  </button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Employee</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Base Salary</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Allowances</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Gross</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">CNPS (4.2%)</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">IRPP</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Net Pay</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Employer CNPS</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(member => {
                    const ps = calcPayslip(member)
                    return (
                      <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">
                              {member.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{ps.baseSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">+{ps.totalAllowances.toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{ps.grossPay.toLocaleString()}</td>
                        <td className="px-4 py-3 text-red-500">-{ps.cnpsEmployee.toLocaleString()}</td>
                        <td className="px-4 py-3 text-red-500">-{ps.irpp.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-green-600">{ps.netPay.toLocaleString()}</td>
                        <td className="px-4 py-3 text-amber-600 text-xs">{ps.cnpsEmployer.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setPayslipModal(member)}
                            className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
                            <FileText size={10} /> Payslip
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-pluto-100 bg-pluto-50">
                    <td className="px-4 py-3 font-semibold text-gray-700">TOTALS</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{staff.reduce((s,m) => s + calcPayslip(m).baseSalary, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">+{staff.reduce((s,m) => s + calcPayslip(m).totalAllowances, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{totalMonthlyGross.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-red-500">-{staff.reduce((s,m) => s + calcPayslip(m).cnpsEmployee, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-red-500">-{staff.reduce((s,m) => s + calcPayslip(m).irpp, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{totalMonthlyNet.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-amber-600">{totalCNPSEmployer.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payroll run history */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Payroll History</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Month</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Run Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Staff</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Gross</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Net</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRuns.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.month}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{r.runDate}</td>
                      <td className="px-4 py-3 text-gray-500">{r.staffCount}</td>
                      <td className="px-4 py-3 text-gray-700">{(r.totalGross/1000).toFixed(0)}K CFA</td>
                      <td className="px-4 py-3 font-semibold text-green-600">{(r.totalNet/1000).toFixed(0)}K CFA</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium w-fit px-2 py-0.5 rounded-full ${r.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {r.status === 'Paid' ? <CheckCircle size={10}/> : <Clock size={10}/>} {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-pluto-600 hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 text-center">
              CNPS rates: Employee 4.2% · Employer 15.68% · IRPP calculated per Cameroon Finance Law 2024.
              Phase 2: bulk payment via MTN MoMo Business API.
            </p>
          </div>
        )}
      </main>

      {/* Payslip Modal */}
      {payslipModal && (() => {
        const ps = calcPayslip(payslipModal)
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Payslip — July 2026</h3>
                <button onClick={() => setPayslipModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {/* Employee info */}
                <div className="flex items-center gap-3 p-3 bg-pluto-50 rounded-xl border border-pluto-100">
                  <div className="w-10 h-10 rounded-full bg-pluto-600 text-white flex items-center justify-center font-bold">
                    {payslipModal.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{payslipModal.name}</p>
                    <p className="text-xs text-gray-500">{payslipModal.role} · {payslipModal.department}</p>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Earnings</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Base Salary</span><span className="font-medium">{ps.baseSalary.toLocaleString()} CFA</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Transport Allowance</span><span className="font-medium">{ps.allowances.transport.toLocaleString()} CFA</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Housing Allowance</span><span className="font-medium">{ps.allowances.housing.toLocaleString()} CFA</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Meal Allowance</span><span className="font-medium">{ps.allowances.meal.toLocaleString()} CFA</span></div>
                    <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-1.5"><span>Gross Pay</span><span>{ps.grossPay.toLocaleString()} CFA</span></div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Deductions</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">CNPS (4.2%)</span><span className="text-red-500">-{ps.cnpsEmployee.toLocaleString()} CFA</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">IRPP</span><span className="text-red-500">-{ps.irpp.toLocaleString()} CFA</span></div>
                    <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-1.5 text-red-600"><span>Total Deductions</span><span>-{ps.totalDeductions.toLocaleString()} CFA</span></div>
                  </div>
                </div>

                {/* Net pay */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">NET PAY</p>
                    <p className="text-2xl font-bold text-green-700">{ps.netPay.toLocaleString()} CFA</p>
                  </div>
                  <DollarSign size={28} className="text-green-400" />
                </div>

                {/* Employer info */}
                <div className="text-xs text-gray-400 space-y-0.5">
                  <p>Employer CNPS contribution: {ps.cnpsEmployer.toLocaleString()} CFA (15.68%)</p>
                  <p>Total cost to company: {(ps.grossPay + ps.cnpsEmployer).toLocaleString()} CFA</p>
                </div>
              </div>
              <div className="px-6 pb-5 flex gap-2">
                <button onClick={() => setPayslipModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Close</button>
                <button className="flex-1 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 flex items-center justify-center gap-1.5">
                  <Download size={13}/> Download PDF
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Run Payroll Modal */}
      {runPayrollModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Run Payroll — July 2026</h3>
              <button onClick={() => setRunPayrollModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="bg-pluto-50 rounded-xl p-4 border border-pluto-100">
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Total Net Pay</span><span className="font-bold text-green-600">{totalMonthlyNet.toLocaleString()} CFA</span></div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">CNPS (employer)</span><span className="text-amber-600">{totalCNPSEmployer.toLocaleString()} CFA</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-pluto-200 pt-2"><span>Total outgoing</span><span>{(totalMonthlyNet + totalCNPSEmployer).toLocaleString()} CFA</span></div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Payment Method</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300">
                  <option>MTN Mobile Money (bulk transfer)</option>
                  <option>Orange Money (bulk transfer)</option>
                  <option>Bank Transfer</option>
                  <option>Manual / Cash</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Pay Date</label>
                <input type="date" defaultValue="2026-07-31" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-amber-700">
                ⚠️ Phase 2: Actual bulk payments via MoMo API will be triggered automatically. For now, confirm manually after paying.
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRunPayrollModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setRunPayrollModal(false)} className="flex-1 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Confirm & Mark Paid</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
