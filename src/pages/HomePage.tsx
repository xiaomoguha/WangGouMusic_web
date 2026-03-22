import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SongCard } from '@/components/SongCard'
import { usePlayer } from '@/context/PlayerContext'
import {
    getTopSongs,
    getTopPlaylists,
    normalizeTopSong,
    kugouImg,
    NormalizedSong,
    PlaylistItem,
} from '@/services/api'

export function HomePage() {
    const navigate = useNavigate()
    const { playQueue } = usePlayer()
    const [topSongs, setTopSongs] = useState<NormalizedSong[]>([])
    const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function fetchData() {
            setLoading(true)
            try {
                const [topRes, playlistRes] = await Promise.allSettled([
                    getTopSongs(),
                    getTopPlaylists(0, 1, 6),
                ])

                if (cancelled) return

                if (topRes.status === 'fulfilled' && topRes.value.data) {
                    const songs = topRes.value.data.slice(0, 12).map(normalizeTopSong)
                    setTopSongs(songs)
                }

                if (playlistRes.status === 'fulfilled' && playlistRes.value.data?.special_list) {
                    setPlaylists(playlistRes.value.data.special_list.slice(0, 6))
                }
            } catch (err) {
                console.warn('Failed to fetch homepage data:', err)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchData()
        return () => { cancelled = true }
    }, [])

    const recommendedSongs = topSongs.slice(0, 6)

    const handlePlaylistClick = (pl: PlaylistItem) => {
        const params = new URLSearchParams({
            name: pl.specialname,
            cover: pl.imgurl || '',
            intro: pl.intro || '',
        })
        navigate(`/playlist/${encodeURIComponent(pl.global_collection_id)}?${params.toString()}`)
    }

    return (
        <div className="space-y-10 pb-8">
            {/* Hero Banner */}
            <section className="relative overflow-hidden rounded-3xl" style={{ minHeight: '280px' }}>
                <img
                    src="/images/hero-banner.png"
                    alt="网狗音乐"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-foreground/20 to-transparent" />
                <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-center px-10 py-12">
                    <p
                        className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground/80"
                        style={{ opacity: 0, animation: 'fade-in 0.5s ease-out 0.1s forwards' }}
                    >
                        每日推荐
                    </p>
                    <h1
                        className="mb-3 text-4xl font-bold text-primary-foreground"
                        style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.2s forwards' }}
                    >
                        发现你的专属旋律
                    </h1>
                    <p
                        className="mb-6 max-w-md text-sm text-primary-foreground/75"
                        style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.3s forwards' }}
                    >
                        精选音乐，为你的每一个时刻匹配最完美的声音
                    </p>
                    <div style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.4s forwards' }}>
                        <Button
                            variant="player"
                            size="lg"
                            onClick={() => { if (topSongs.length > 0) playQueue(topSongs) }}
                            className="gap-2"
                            disabled={loading}
                        >
                            <Play className="h-4 w-4" />
                            立即播放
                        </Button>
                    </div>
                </div>
            </section>

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {/* Recommended Songs */}
            {!loading && recommendedSongs.length > 0 && (
                <section>
                    <div className="mb-5 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <h2 className="text-xl font-bold text-foreground">热门推荐</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        {recommendedSongs.map((song, i) => (
                            <SongCard key={song.hash} song={song} index={i} />
                        ))}
                    </div>
                </section>
            )}

            {/* Playlists */}
            {!loading && playlists.length > 0 && (
                <section>
                    <div className="mb-5 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">精选歌单</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {playlists.map((pl, i) => (
                            <button
                                key={pl.specialid}
                                onClick={() => handlePlaylistClick(pl)}
                                className="group flex gap-4 rounded-2xl bg-card p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                                style={{
                                    opacity: 0,
                                    animation: 'fade-in-up 0.5s ease-out forwards',
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            >
                                <img
                                    src={kugouImg(pl.imgurl, '400')}
                                    alt={pl.specialname}
                                    className="h-20 w-20 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-2.png' }}
                                />
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <h3 className="truncate text-sm font-semibold text-foreground">
                                        {pl.specialname}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                        {pl.intro || pl.singername}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                                        <span>{(pl.play_count / 10000).toFixed(1)}万 播放</span>
                                        {pl.tags && pl.tags.length > 0 && (
                                            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px]">
                                                {pl.tags[0].tag_name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
