import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, Music2, Info, Disc3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlayer } from '@/context/PlayerContext'

const navItems = [
    { path: '/', label: '发现', icon: Home },
    { path: '/search', label: '搜索', icon: Search },
    { path: '/lyrics', label: '歌词', icon: Music2 },
    { path: '/about', label: '关于', icon: Info },
]

export function Sidebar() {
    const location = useLocation()
    const { currentSong, isPlaying } = usePlayer()

    return (
        <aside className="fixed left-0 top-0 bottom-0 z-30 flex w-[220px] flex-col border-r bg-card/80 backdrop-blur-sm">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                    <Disc3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">
                    网狗音乐
                </span>
            </div>

            {/* Navigation */}
            <nav className="mt-2 flex-1 px-3">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    menu
                </p>
                <ul className="space-y-1">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'h-[18px] w-[18px] transition-colors',
                                            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                        )}
                                    />
                                    {item.label}
                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Now Playing mini */}
            {currentSong && (
                <div className="mx-3 mb-4 overflow-hidden rounded-2xl bg-surface p-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={currentSong.cover}
                            alt={currentSong.title}
                            className={cn(
                                'h-10 w-10 rounded-lg object-cover shadow-sm',
                                isPlaying && 'vinyl-spin'
                            )}
                            onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                                {currentSong.title}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                                {currentSong.artist}
                            </p>
                        </div>
                    </div>
                    {isPlaying && (
                        <div className="mt-2 flex items-end justify-center gap-[3px]">
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className="eq-bar w-[3px] rounded-full bg-primary"
                                    style={{ height: '4px' }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </aside>
    )
}
