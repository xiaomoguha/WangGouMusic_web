import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Loader2, Trophy } from 'lucide-react'
import { SongCard } from '@/components/SongCard'
import { usePlayer } from '@/context/PlayerContext'
import {
    searchSongs,
    searchTwo,
    getHotSearch,
    getTopSongs,
    getSearchSuggest,
    normalizeSong,
    normalizeSearchTwoSong,
    normalizeTopSong,
    NormalizedSong,
    HotKeyword,
} from '@/services/api'

export function SearchPage() {
    const navigate = useNavigate()
    const { playQueue } = usePlayer()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<NormalizedSong[]>([])
    const [total, setTotal] = useState(0)
    const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([])
    const [rankSongs, setRankSongs] = useState<NormalizedSong[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestDropdown, setShowSuggestDropdown] = useState(false)
    const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const doSearch = useCallback(async (kw: string) => {
        setLoading(true)
        setSearched(true)
        setShowSuggestDropdown(false)
        setSuggestions([])
        try {
            let res
            if (!kw.trim()) {
                // 搜索框为空时调用 searchTwo
                console.log('Calling searchTwo...')
                res = await searchTwo(1, 30)
            } else {
                console.log('Calling searchSongs:', kw)
                res = await searchSongs(kw, 1, 30)
            }
            console.log('API response:', res)
            // searchTwo 返回 lists，search 返回 info
            const isSearchTwo = !kw.trim()
            const songList = res.data?.info || res.data?.lists || []
            if (res.status === 1 && songList.length > 0) {
                // searchTwo 和普通搜索使用不同的 normalize 函数
                const songs = isSearchTwo
                    ? songList.map(normalizeSearchTwoSong)
                    : songList.map(normalizeSong)
                console.log('Normalized songs:', songs)
                setResults(songs)
                setTotal(res.data.total || songList.length)
            } else {
                console.log('No results, status:', res.status)
                setResults([])
                setTotal(0)
            }
        } catch (err) {
            console.error('Search error:', err)
            setResults([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch hot search and rank songs on mount
    useEffect(() => {
        getHotSearch()
            .then(res => {
                if (res.data?.list?.[0]?.keywords) {
                    setHotKeywords(res.data.list[0].keywords.slice(0, 12))
                }
            })
            .catch(() => { })

        getTopSongs()
            .then(res => {
                if (res.data) {
                    setRankSongs(res.data.slice(0, 30).map(normalizeTopSong))
                }
            })
            .catch(() => { })
    }, [])

    // Handle input change with debounced suggest
    const handleInputChange = (value: string) => {
        setQuery(value)
        if (suggestTimer.current) clearTimeout(suggestTimer.current)
        if (!value.trim()) {
            setSuggestions([])
            setShowSuggestDropdown(false)
            return
        }
        suggestTimer.current = setTimeout(() => {
            getSearchSuggest(value)
                .then(res => {
                    if (res.status === 1 && res.data) {
                        const hints = res.data
                            .flatMap(g => g.RecordDatas)
                            .map(r => r.HintInfo)
                            .filter(Boolean)
                            .slice(0, 8)
                        setSuggestions(hints)
                        setShowSuggestDropdown(hints.length > 0)
                    }
                })
                .catch(() => { })
        }, 300)
    }

    const handleSuggestClick = (keyword: string) => {
        setQuery(keyword)
        setSuggestions([])
        setShowSuggestDropdown(false)
        doSearch(keyword)
    }

    const handleTagClick = (keyword: string) => {
        setQuery(keyword)
        doSearch(keyword)
    }

    const handlePlayAll = () => {
        if (results.length > 0) {
            playQueue(results)
            navigate('/lyrics')
        }
    }

    const showEmpty = searched && !loading && results.length === 0
    const showSuggestions = !searched && !loading

    return (
        <div className="space-y-8 pb-8">
            {/* Search bar - 使用 fixed 定位让下拉框脱离文档流 */}
            <div
                ref={wrapperRef}
                className="sticky top-0 z-50"
                style={{ opacity: 0, animation: 'fade-in 0.4s ease-out forwards' }}
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => handleInputChange(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') doSearch(query) }}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestDropdown(true) }}
                        placeholder="搜索歌曲、歌手、专辑..."
                        className="w-full rounded-2xl border bg-card py-4 pl-12 pr-12 text-sm text-foreground shadow-sm transition-shadow duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-md"
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setResults([]); setTotal(0); setSearched(false); setSuggestions([]); setShowSuggestDropdown(false) }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Suggest dropdown */}
                {showSuggestDropdown && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-[300px] overflow-y-auto rounded-xl border bg-white shadow-xl">
                        {suggestions.map((hint, i) => (
                            <button
                                key={`${hint}-${i}`}
                                onMouseDown={() => handleSuggestClick(hint)}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-surface"
                            >
                                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="truncate">{hint}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">搜索中...</span>
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <section style={{ opacity: 0, animation: 'fade-in-up 0.4s ease-out forwards' }}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-foreground">
                            找到 {total} 个结果
                        </h2>
                        <button
                            onClick={handlePlayAll}
                            className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90"
                        >
                            播放全部
                        </button>
                    </div>
                    <div className="rounded-2xl bg-card p-2 shadow-sm">
                        {results.map((song, i) => (
                            <SongCard key={`${song.hash}-${i}`} song={song} index={i} variant="list" />
                        ))}
                    </div>
                </section>
            )}

            {/* Empty state */}
            {showEmpty && (
                <div
                    className="flex flex-col items-center justify-center py-20 text-center"
                    style={{ opacity: 0, animation: 'fade-in-up 0.4s ease-out forwards' }}
                >
                    <Search className="mb-4 h-12 w-12 text-muted" />
                    <p className="text-lg font-medium text-foreground">未找到相关结果</p>
                    <p className="mt-1 text-sm text-muted-foreground">尝试换一个关键词搜索</p>
                </div>
            )}

            {/* Hot search suggestions */}
            {showSuggestions && (
                <section style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.1s forwards' }}>
                    <h2 className="mb-4 text-lg font-bold text-foreground">热门搜索</h2>
                    <div className="flex flex-wrap gap-2">
                        {hotKeywords.map((item, i) => (
                            <button
                                key={item.keyword}
                                onClick={() => handleTagClick(item.keyword)}
                                className="rounded-full bg-card px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-200 hover:bg-surface hover:shadow-md"
                                style={{
                                    opacity: 0,
                                    animation: 'scale-in 0.3s ease-out forwards',
                                    animationDelay: `${0.15 + i * 0.04}s`,
                                }}
                            >
                                {item.keyword}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* TOP500 排行榜 */}
            {!loading && !searched && rankSongs.length > 0 && (
                <section style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.3s forwards' }}>
                    <div className="mb-5 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">TOP500 排行榜</h2>
                    </div>
                    <div className="rounded-2xl bg-card p-2 shadow-sm">
                        {rankSongs.map((song, i) => (
                            <SongCard key={`rank-${song.hash}-${i}`} song={song} index={i} variant="list" />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
