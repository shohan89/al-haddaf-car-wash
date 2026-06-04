import {
  LayoutDashboard,
  Car,
  MapPin,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Home,
  Search,
  Mail,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Homepage CMS', href: '/admin/homepage', icon: Home },
  { title: 'Contacts', href: '/admin/contacts', icon: Mail },
  { title: 'Services', href: '/admin/services', icon: Car },
  { title: 'Areas', href: '/admin/areas', icon: MapPin },
  { title: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { title: 'Blogs', href: '/admin/blogs', icon: FileText },
  { title: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { title: 'SEO Manager', href: '/admin/seo', icon: Search },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-white transition-transform">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        {/* Brand */}
        <div className="mb-10 px-2 py-4 border-b border-border">
          <h2 className="text-xl font-black tracking-tighter text-primary uppercase">Al Haddaf Admin</h2>
          <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Management Suite</p>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={cn("transition-colors", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                  {link.title}
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-border">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
