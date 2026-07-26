'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateContactStatus, deleteContactSubmission } from '@/actions/contact'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Mail, Phone, Clock, Trash2, ChevronDown, ChevronUp,
  CheckCheck, Eye, Archive, InboxIcon,
} from 'lucide-react'

type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'

interface Submission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: ContactStatus
  adminNote: string | null
  createdAt: Date
}

const STATUS_TABS: { label: string; value: ContactStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'New', value: 'NEW' },
  { label: 'Read', value: 'READ' },
  { label: 'Replied', value: 'REPLIED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const statusBadge: Record<ContactStatus, { label: string; className: string }> = {
  NEW: { label: 'New', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  READ: { label: 'Read', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  REPLIED: { label: 'Replied', className: 'bg-green-100 text-green-700 border-green-200' },
  ARCHIVED: { label: 'Archived', className: 'bg-amber-100 text-amber-700 border-amber-200' },
}

export function ContactManager({ submissions }: { submissions: Submission[] }) {
  const [activeTab, setActiveTab] = useState<ContactStatus | 'ALL'>('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(submissions.map((s) => [s.id, s.adminNote ?? '']))
  )

  const filtered =
    activeTab === 'ALL' ? submissions : submissions.filter((s) => s.status === activeTab)

  const newCount = submissions.filter((s) => s.status === 'NEW').length

  const handleStatus = async (id: string, status: ContactStatus) => {
    const result = await updateContactStatus(id, status as any)
    if (result.success) {
      toast.success('Status updated')
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  const handleNoteBlur = async (id: string, status: ContactStatus) => {
    const result = await updateContactStatus(id, status as any, notes[id])
    if (result.success) {
      toast.success('Note saved')
    } else {
      toast.error(result.error || 'Failed to save note')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission permanently?')) return
    setDeletingId(id)
    const result = await deleteContactSubmission(id)
    setDeletingId(null)
    if (result.success) {
      toast.success('Submission deleted')
    } else {
      toast.error(result.error || 'Failed to delete submission')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
              activeTab === tab.value
                ? 'bg-primary text-white shadow'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            {tab.label}
            {tab.value === 'NEW' && newCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">
                {newCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <InboxIcon size={40} className="opacity-30" />
          <p className="font-medium">No submissions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const isOpen = expanded === sub.id
            const badge = statusBadge[sub.status]
            return (
              <div key={sub.id} className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900">{sub.name}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {sub.subject}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail size={13} /> {sub.email}</span>
                      <span className="flex items-center gap-1.5"><Phone size={13} /> {sub.phone}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {new Date(sub.createdAt).toLocaleDateString('en-AE', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpanded(isOpen ? null : sub.id)}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isOpen ? 'Collapse' : 'View'}
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Message</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Admin Note</p>
                      <textarea
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        rows={2}
                        placeholder="Add an internal note..."
                        value={notes[sub.id]}
                        onChange={(e) => setNotes((n) => ({ ...n, [sub.id]: e.target.value }))}
                        onBlur={() => handleNoteBlur(sub.id, sub.status)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sub.status !== 'READ' && sub.status !== 'REPLIED' && sub.status !== 'ARCHIVED' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatus(sub.id, 'READ')} className="gap-1.5">
                          <Eye size={14} /> Mark as Read
                        </Button>
                      )}
                      {sub.status !== 'REPLIED' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatus(sub.id, 'REPLIED')} className="gap-1.5 border-green-300 text-green-700 hover:bg-green-50">
                          <CheckCheck size={14} /> Mark as Replied
                        </Button>
                      )}
                      {sub.status !== 'ARCHIVED' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatus(sub.id, 'ARCHIVED')} className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50">
                          <Archive size={14} /> Archive
                        </Button>
                      )}
                      <a
                        href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject)}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Mail size={13} /> Reply by Email
                      </a>
                      <a
                        href={`https://wa.me/${sub.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
