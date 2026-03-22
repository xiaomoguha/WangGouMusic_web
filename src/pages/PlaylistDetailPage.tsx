import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Loader2, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SongCard } from '@/components/SongCard'
import { usePlayer } from '@/context/PlayerContext'
import {
    getPlaylistTracks,
    normalizePlaylistTrack,
    kugouImg,
    NormalizedSong,
} from '@/services/api'

export function PlaylistDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { playQueue } = usePlayer()

    const name = searchParams.get('name') || '歌单'
    const cover = searchParams.get('cover') || ''
    const intro = searchParams.get('intro') || ''

    const [songs, setSongs] = useState<NormalizedSong[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        let cancelled = false

        async function fetchTracks() {
            setLoading(true)
            try {
                const res = await getPlaylistTracks(id!, 1, 50)
                if (cancelled) return
                if (res.status === 1 && res.data?.songs) {
                    const normalized = res.data.songs.map(normalizePlaylistTrack)
                    setSongs(normalized)
                    setTotalCount(res.data.count || normalized.length)
                }
            } catch (err) {
                console.warn('Failed to load playlist tracks:', err)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchTracks()
        return () => { cancelled = true }
    }, [id])

    const handlePlayAll = () => {
        if (songs.length > 0) playQueue(songs)
    }

    return (
        <div className="pb-8">
            {/* Header with back button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                返回
            </button>

            {/* Playlist info */}
            <div
                className="mb-8 flex gap-6"
                style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out forwards' }}
            >
                <img
                    src={kugouImg(cover, '400')}
                    alt={name}
                    className="h-44 w-44 shrink-0 rounded-2xl object-cover shadow-lg"
                    onError={e => { (e.target as HTMLImageElement).src = '/images/album-cover-2.png' }}
                />
                <div className="flex min-w-0 flex-col justify-center">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">歌单</p>
                    <h1 className="mb-2 text-2xl font-bold text-foreground">{name}</h1>
                    {intro && (
                        <p className="mb-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{intro}</p>
                    )}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="player"
                            size="default"
                            className="gap-2"
                            onClick={handlePlayAll}
                            disabled={loading || songs.length === 0}
                        >
                            <Play className="h-4 w-4" />
                            播放全部
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {loading ? '加载中...' : `${totalCount} 首歌曲`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Song list */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">正在加载歌曲...</span>
                </div>
            )}

            {!loading && songs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Music2 className="mb-4 h-12 w-12 text-muted" />
                    <p className="text-base font-medium text-foreground">歌单暂无歌曲</p>
                </div>
            )}

            {!loading && songs.length > 0 && (
                <div
                    className="rounded-2xl bg-card p-2 shadow-sm"
                    style={{ opacity: 0, animation: 'fade-in-up 0.4s ease-out 0.1s forwards' }}
                >
                    {songs.map((song, i) => (
                        <SongCard key={`${song.hash}-${i}`} song={song} index={i} variant="list" />
                    ))}
                </div>
            )}
        </div>
    )
}
