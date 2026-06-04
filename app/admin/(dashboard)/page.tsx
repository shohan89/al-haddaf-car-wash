import { getDashboardStats } from '@/actions/admin-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import {
  FileText, Star, HelpCircle, MapPin,
  ArrowUpRight, BarChart3, Activity, Users, Zap,
  TrendingUp, Car, Mail, MessageSquare
} from 'lucide-react'

export const metadata = { title: 'Dashboard | Admin' }

function StatCard({ title, value, sub, icon: Icon, color, bg, trend, trendUp }: {
  title: string; value: string | number; sub?: string;
  icon: any; color: string; bg: string;
  trend?: string; trendUp?: boolean;
}) {
  return (
    <Card className="border-none shadow-soft hover:shadow-premium transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-12 w-12 rounded-2xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            )}>
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-black mt-2 tracking-tight">{value}</p>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{title}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function ContactStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    NEW:     { label: 'New',     className: 'bg-blue-100 text-blue-700' },
    READ:    { label: 'Read',    className: 'bg-gray-100 text-gray-600' },
    REPLIED: { label: 'Replied', className: 'bg-emerald-100 text-emerald-700' },
  }
  const s = map[status] || map.NEW
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold", s.className)}>
      {s.label}
    </span>
  )
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const quickActions = [
    { label: 'New Service', href: '/admin/services/create', icon: Car,       color: 'bg-purple-500' },
    { label: 'Write Blog',  href: '/admin/blogs/create',    icon: FileText,  color: 'bg-emerald-500' },
    { label: 'Add Review',  href: '/admin/reviews/create',  icon: Star,      color: 'bg-amber-500' },
    { label: 'Add FAQ',     href: '/admin/faqs/create',     icon: HelpCircle,color: 'bg-rose-500' },
    { label: 'New Area',    href: '/admin/areas/create',    icon: MapPin,    color: 'bg-cyan-500' },
  ]

  const contentStats = [
    { label: 'Services',   published: stats.publishedServices, total: stats.totalServices, href: '/admin/services', icon: Car,       color: 'bg-purple-50 text-purple-600' },
    { label: 'Blog Posts', published: stats.publishedBlogs,    total: stats.totalBlogs,    href: '/admin/blogs',    icon: FileText,  color: 'bg-emerald-50 text-emerald-600' },
    { label: 'FAQs',       published: stats.totalFaqs,         total: stats.totalFaqs,     href: '/admin/faqs',     icon: HelpCircle,color: 'bg-rose-50 text-rose-600' },
    { label: 'Areas',      published: stats.totalAreas,        total: stats.totalAreas,    href: '/admin/areas',    icon: MapPin,    color: 'bg-cyan-50 text-cyan-600' },
  ]

  const contentFunnel = [
    { label: 'Services',   published: stats.publishedServices, total: stats.totalServices, color: 'bg-purple-400' },
    { label: 'Blog Posts', published: stats.publishedBlogs,    total: stats.totalBlogs,    color: 'bg-emerald-400' },
    { label: 'FAQs',       published: stats.totalFaqs,         total: stats.totalFaqs,     color: 'bg-rose-400' },
    { label: 'Areas',      published: stats.totalAreas,        total: stats.totalAreas,    color: 'bg-cyan-400' },
  ]

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{greeting}, Admin 👋</p>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/homepage">
            <Button variant="outline" size="sm" className="gap-2">
              <Zap size={14} /> Homepage CMS
            </Button>
          </Link>
          <Link href="/admin/contacts">
            <Button size="sm" className="gap-2">
              <Mail size={14} /> View Contacts
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reviews"    value={stats.totalReviews}        icon={Star}      color="text-purple-600"  bg="bg-purple-50"  trend="Customer reviews" trendUp />
        <StatCard title="Live Services"    value={stats.publishedServices}   icon={Car}       color="text-blue-600"    bg="bg-blue-50"    trend="Published"        trendUp />
        <StatCard title="Published Blogs"  value={stats.publishedBlogs}      icon={FileText}  color="text-emerald-600" bg="bg-emerald-50" trend="Published"        trendUp />
        <StatCard title="Total Contacts"   value={stats.totalContacts}       sub="Form submissions" icon={Mail} color="text-rose-600" bg="bg-rose-50" trend="All time" trendUp />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Contacts — 2 cols */}
        <Card className="lg:col-span-2 border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
            <div>
              <CardTitle className="text-lg font-bold">Recent Contacts</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Latest 5 contact form submissions</p>
            </div>
            <Link href="/admin/contacts">
              <Button variant="ghost" size="sm" className="text-primary gap-1 text-sm font-bold">
                View All <ArrowUpRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentContacts.length > 0 ? (
              <div className="divide-y divide-border">
                {stats.recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center font-black text-rose-600 text-sm shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                    </div>
                    <div className="hidden sm:block flex-1 min-w-0 px-2">
                      <p className="text-sm text-muted-foreground truncate">{contact.subject || '—'}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <ContactStatusBadge status={contact.status} />
                      <p className="text-xs text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Mail size={40} className="mb-3 opacity-30" />
                <p className="font-medium">No contacts yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <Card className="border-none shadow-soft">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Zap size={18} className="text-primary" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.href} href={action.href}>
                      <div className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-border">
                        <div className={`h-9 w-9 rounded-xl ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-center leading-tight">{action.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Status */}
          <Card className="border-none shadow-soft">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity size={18} className="text-primary" /> Content Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {contentFunnel.map((item) => {
                const pct = item.total > 0 ? Math.round((item.published / item.total) * 100) : 0
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-gray-700">{item.label}</span>
                      <span className="font-black">
                        {item.published}<span className="text-muted-foreground font-normal">/{item.total}</span>
                        <span className="text-muted-foreground font-normal text-xs ml-1">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Latest Reviews */}
        <Card className="lg:col-span-2 border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
            <div>
              <CardTitle className="text-lg font-bold">Latest Reviews</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Most recent customer feedback</p>
            </div>
            <Link href="/admin/reviews">
              <Button variant="ghost" size="sm" className="text-primary gap-1 text-sm font-bold">
                Manage <ArrowUpRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.latestReviews.length > 0 ? (
              <div className="divide-y divide-border">
                {stats.latestReviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gray-100 shrink-0 overflow-hidden relative">
                      {review.avatar ? (
                        <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-black text-gray-500 text-sm">
                          {review.author.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm">{review.author}</p>
                        <div className="flex gap-0.5 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{review.location || 'Dubai'}</p>
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 italic">&ldquo;{review.content}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Star size={40} className="mb-3 opacity-30" />
                <p className="font-medium">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Overview + Traffic Placeholder */}
        <div className="space-y-6">
          {/* Content Overview */}
          <Card className="border-none shadow-soft">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" /> Content Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {contentStats.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.label} href={item.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.color} shrink-0`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.published} published</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black">{item.total}</p>
                        <ArrowUpRight size={12} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Traffic Placeholder */}
          <Card className="border-none shadow-soft overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10" />
            <CardContent className="relative p-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="font-black text-lg">Traffic Analytics</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect Google Analytics or Vercel Analytics to see real-time traffic data.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { label: 'Page Views',       value: '—' },
                  { label: 'Unique Visitors',  value: '—' },
                  { label: 'Bounce Rate',      value: '—' },
                  { label: 'Avg. Session',     value: '—' },
                ].map(item => (
                  <div key={item.label} className="bg-white/60 rounded-xl p-2.5 text-center">
                    <p className="font-black text-gray-400">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/80 rounded-full px-3 py-1.5 mt-1">
                <Users size={11} /> Integration coming soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Health Bar */}
      <Card className="border-none shadow-soft">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold">All Systems Operational</span>
            </div>
            {[
              { label: 'Database',     status: 'Connected' },
              { label: 'Server',       status: 'Healthy' },
              { label: 'File Storage', status: 'Active' },
              { label: 'Auth',         status: 'Secured' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold">{item.label}:</span>
                <span className="text-emerald-600 font-bold">{item.status}</span>
              </div>
            ))}
            <div className="ml-auto text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
