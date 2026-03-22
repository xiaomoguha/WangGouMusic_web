import { useState } from 'react'
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Loader2,
    ListMusic,
    X,
} from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePlayer } from '@/context/PlayerContext'

export function PlayerBar() {
    const [showPlaylist, setShowPlaylist] = useState(false)
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        audioLoading,
        queue,
        queueIndex,
        playSong,
        togglePlay,
        seekTo,
        setVolume,
        nextSong,
        prevSong,
    } = usePlayer()

    if (!currentSong) return null

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <footer
            className="fixed bottom-16 left-0 right-0 z-40 border-t bg-card/90 backdrop-blur-md md:bottom-0 md:left-[220px]"
            style={{ boxShadow: 'var(--shadow-player)' }}
        >
            <div className="flex h-16 items-center px-4 md:h-20 md:px-6">
                {/* Song info */}
                <div className="flex w-[180px] items-center gap-2 md:w-[260px] md:gap-3">
                    <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="h-10 w-10 rounded-lg object-cover shadow-sm md:h-12 md:w-12 md:rounded-xl"
                        onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-1.png' }}
                    />
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground md:text-sm">
                            {currentSong.title}
                        </p>
                        <p className="hidden truncate text-xs text-muted-foreground md:block">
                            {currentSong.artist}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Button variant="player-ghost" size="icon-sm" onClick={prevSong} aria-label="上一首">
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="player" size="icon" onClick={togglePlay} aria-label={isPlaying ? '暂停' : '播放'}>
                            {audioLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="ml-0.5 h-4 w-4" />
                            )}
                        </Button>
                        <Button variant="player-ghost" size="icon-sm" onClick={nextSong} aria-label="下一首">
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Progress - 手机端隐藏时间 */}
                    <div className="flex w-full max-w-[480px] items-center gap-2">
                        <span className="hidden w-10 text-right text-[11px] tabular-nums text-muted-foreground md:block">
                            {formatTime(currentTime)}
                        </span>
                        <div
                            className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-muted"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const pct = (e.clientX - rect.left) / rect.width
                                seekTo(pct * duration)
                            }}
                        >
                            <div
                                className="progress-fill absolute left-0 top-0 h-full rounded-full bg-primary"
                                style={{ width: `${progress}%` }}
                            />
                            <div
                                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                style={{ left: `${progress}%`, marginLeft: '-6px' }}
                            />
                        </div>
                        <span className="hidden w-10 text-[11px] tabular-nums text-muted-foreground md:block">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume & Playlist */}
                <div className="flex w-[100px] items-center justify-end gap-2 md:w-[200px]">
                    {/* Playlist button */}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        aria-label="播放列表"
                        className={cn(showPlaylist && 'bg-surface text-primary')}
                    >
                        <ListMusic className="h-4 w-4" />
                    </Button>
                    {/* 音量控制 - 手机端隐藏 */}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                        aria-label="静音"
                        className="hidden md:flex"
                    >
                        {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div
                        className="group relative h-1 w-20 cursor-pointer rounded-full bg-muted hidden md:block"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                            setVolume(pct)
                        }}
                    >
                        <div
                            className="absolute left-0 top-0 h-full rounded-full bg-primary/60"
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Playlist Popup */}
            {showPlaylist && (
                <div
                    className="absolute bottom-full right-4 mb-2 w-80 rounded-2xl bg-card p-4 shadow-xl"
                    style={{
                        boxShadow: '0 -4px 24px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)',
                        opacity: 0,
                        animation: 'fade-in 0.2s ease-out forwards',
                    }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">播放列表 ({queue.length})</h3>
                        <button
                            onClick={() => setShowPlaylist(false)}
                            className="rounded-full p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-[320px] space-y-1 overflow-y-auto">
                        {queue.map((song, idx) => (
                            <div
                                key={song.hash}
                                onClick={() => {
                                    playSong(song)
                                }}
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
        </footer>
    )
}
