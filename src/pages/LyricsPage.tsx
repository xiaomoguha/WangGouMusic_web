import { useEffect, useRef, useState } from 'react'
import { Music2, Loader2, ListMusic, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlayer } from '@/context/PlayerContext'

export function LyricsPage() {
    const { currentSong, isPlaying, currentTime, lyrics, lyricsLoading, queue, queueIndex, playSong } = usePlayer()
    const containerRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef<HTMLDivElement>(null)
    const [showPlaylist, setShowPlaylist] = useState(false)

    // Find current lyric index
    let activeIndex = -1
    if (lyrics.length > 0) {
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                activeIndex = i
                break
            }
        }
    }

    // Auto scroll to active lyric
    useEffect(() => {
        if (activeRef.current && containerRef.current) {
            const container = containerRef.current
            const el = activeRef.current
            const containerHeight = container.clientHeight
            const elTop = el.offsetTop
            const elHeight = el.clientHeight
            // 手机端让高亮部分显示在屏幕下方 5% 位置（避开专辑图），桌面端居中
            const isMobile = window.innerWidth < 768
            const offsetRatio = isMobile ? 0.05 : 0.5
            const scrollTarget = elTop - containerHeight * offsetRatio + elHeight / 2

            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth',
            })
        }
    }, [activeIndex])

    // No song playing
    if (!currentSong) {
        return (
            <div className="flex h-[calc(100vh-260px)] flex-col items-center justify-center text-center md:h-[calc(100vh-180px)]">
                <div
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-surface"
                    style={{ opacity: 0, animation: 'scale-in 0.4s ease-out forwards' }}
                >
                    <Music2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <p
                    className="text-lg font-medium text-foreground"
                    style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.1s forwards' }}
                >
                    选择一首歌曲开始播放
                </p>
                <p
                    className="mt-2 text-sm text-muted-foreground"
                    style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.2s forwards' }}
                >
                    歌词将会在此处同步显示
                </p>
            </div>
        )
    }

    // Loading lyrics
    if (lyricsLoading) {
        return (
            <div className="flex h-[calc(100vh-260px)] flex-col items-center justify-center text-center md:h-[calc(100vh-180px)]">
                <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className={cn('mb-8 h-32 w-32 rounded-full object-cover shadow-lg md:h-48 md:w-48', isPlaying && 'vinyl-spin')}
                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                />
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">正在加载歌词...</p>
            </div>
        )
    }

    // No lyrics available
    if (lyrics.length === 0) {
        return (
            <div className="flex h-[calc(100vh-260px)] flex-col items-center justify-center text-center md:h-[calc(100vh-180px)]">
                <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className={cn('mb-6 h-32 w-32 rounded-full object-cover shadow-lg md:mb-8 md:h-48 md:w-48', isPlaying && 'vinyl-spin')}
                    style={{ opacity: 0, animation: 'scale-in 0.4s ease-out forwards' }}
                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                />
                <p className="text-base font-semibold text-foreground md:text-lg">{currentSong.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{currentSong.artist}</p>
                <p className="mt-4 text-sm text-muted-foreground md:mt-6">暂无歌词</p>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-260px)] flex-col gap-6 md:h-[calc(100vh-180px)] md:flex-row md:gap-8">
            {/* Album art side */}
            <div
                className="flex flex-col items-center justify-center pt-4 md:w-[280px] md:shrink-0"
                style={{ opacity: 0, animation: 'fade-in 0.6s ease-out forwards' }}
            >
                <div className="relative">
                    <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className={cn('h-24 w-24 rounded-full object-cover shadow-xl md:h-56 md:w-56', isPlaying && 'vinyl-spin')}
                        onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                    />
                    {isPlaying && (
                        <div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1"
                            style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)' }}
                        >
                            <div className="flex items-end gap-[3px]">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="eq-bar w-[3px] rounded-full bg-primary-foreground" style={{ height: '4px' }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <h2 className="mt-4 text-center text-lg font-bold text-foreground md:mt-6 md:text-xl">
                    {currentSong.title}
                </h2>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                    {currentSong.artist}{currentSong.album ? ` · ${currentSong.album}` : ''}
                </p>
                {/* Playlist toggle button */}
                <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="mt-3 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground md:mt-4"
                >
                    <ListMusic className="h-4 w-4" />
                    播放列表 ({queue.length})
                </button>
            </div>

            {/* Playlist panel */}
            {showPlaylist && (
                <div
                    className="w-full rounded-2xl bg-card p-4 shadow-lg md:w-[280px] md:shrink-0"
                    style={{ opacity: 0, animation: 'fade-in 0.3s ease-out forwards' }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">播放列表</h3>
                        <button
                            onClick={() => setShowPlaylist(false)}
                            className="rounded-full p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-[200px] space-y-1 overflow-y-auto md:max-h-[calc(100vh-300px)]">
                        {queue.map((song, idx) => (
                            <div
                                key={song.hash}
                                onClick={() => playSong(song)}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors',
                                    idx === queueIndex
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-surface'
                                )}
                            >
                                <img
                                    src={song.cover}
                                    alt={song.title}
                                    className="h-10 w-10 rounded object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className={cn('truncate text-sm', idx === queueIndex && 'font-medium')}>
                                        {song.title}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {song.artist}
                                    </p>
                                </div>
                                {idx === queueIndex && isPlaying && (
                                    <div className="flex items-end gap-[2px]">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="eq-bar w-[2px] rounded-full bg-primary" style={{ height: '4px' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lyrics scroll */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto pt-[45vh] pb-[10vh] md:py-[30vh]"
                style={{
                    maskImage: 'linear-gradient(transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(transparent, black 15%, black 85%, transparent)',
                }}
            >
                <div className="space-y-3 px-2 md:space-y-4 md:px-4">
                    {lyrics.map((line, i) => {
                        const isActive = i === activeIndex
                        const isPast = i < activeIndex
                        return (
                            <div
                                key={`${i}-${line.time}`}
                                ref={isActive ? activeRef : undefined}
                                className={cn(
                                    'lyric-line cursor-default rounded-xl px-3 py-2 text-base transition-all duration-500 md:px-4 md:py-3 md:text-xl',
                                    isActive && 'lyric-active text-lg md:text-2xl',
                                    isPast && 'text-muted-foreground/50',
                                    !isActive && !isPast && 'text-muted-foreground/70'
                                )}
                            >
                                {line.text}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
