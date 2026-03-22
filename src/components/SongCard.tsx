import { Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NormalizedSong } from '@/services/api'
import { usePlayer } from '@/context/PlayerContext'
import { formatTime } from '@/lib/utils'

interface SongCardProps {
    song: NormalizedSong
    index?: number
    variant?: 'grid' | 'list'
}

export function SongCard({ song, index, variant = 'grid' }: SongCardProps) {
    const { currentSong, isPlaying, playSong, togglePlay } = usePlayer()
    const isCurrent = currentSong?.hash === song.hash
    const isCurrentPlaying = isCurrent && isPlaying

    const handleClick = () => {
        if (isCurrent) {
            togglePlay()
        } else {
            playSong(song)
        }
    }

    if (variant === 'list') {
        return (
            <button
                onClick={handleClick}
                className={cn(
                    'group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200',
                    isCurrent ? 'bg-primary/5' : 'hover:bg-surface'
                )}
            >
                {index !== undefined && (
                    <span className="w-6 text-center text-sm tabular-nums text-muted-foreground">
                        {isCurrentPlaying ? (
                            <div className="flex items-end justify-center gap-[2px]">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="eq-bar w-[2px] rounded-full bg-primary" style={{ height: '3px' }} />
                                ))}
                            </div>
                        ) : (
                            index + 1
                        )}
                    </span>
                )}
                <img
                    src={song.cover}
                    alt={song.title}
                    className="h-11 w-11 rounded-lg object-cover shadow-sm"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                />
                <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium', isCurrent ? 'text-primary' : 'text-foreground')}>
                        {song.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {song.artist}{song.album ? ` · ${song.album}` : ''}
                    </p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                    {song.duration > 0 ? formatTime(song.duration) : '--:--'}
                </span>
                <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
                    isCurrentPlaying
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface text-muted-foreground opacity-0 group-hover:opacity-100'
                )}>
                    {isCurrentPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                </div>
            </button>
        )
    }

    return (
        <button
            onClick={handleClick}
            className={cn(
                'group flex flex-col gap-3 rounded-2xl p-3 text-left transition-all duration-300',
                'hover:bg-card hover:shadow-md',
                isCurrent && 'bg-card shadow-md'
            )}
            style={{
                opacity: 0,
                animation: 'fade-in-up 0.5s ease-out forwards',
                animationDelay: index !== undefined ? `${index * 0.06}s` : '0s',
            }}
        >
            <div className="relative aspect-square overflow-hidden rounded-xl">
                <img
                    src={song.cover}
                    alt={song.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                />
                <div className={cn(
                    'absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300',
                    'group-hover:bg-foreground/10'
                )}>
                    <div className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300',
                        isCurrentPlaying ? 'scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                    )}>
                        {isCurrentPlaying ? <Pause className="h-5 w-5 text-primary" /> : <Play className="ml-0.5 h-5 w-5 text-primary" />}
                    </div>
                </div>
            </div>
            <div className="min-w-0 px-0.5">
                <p className={cn('truncate text-sm font-semibold', isCurrent ? 'text-primary' : 'text-foreground')}>
                    {song.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
            </div>
        </button>
    )
}
