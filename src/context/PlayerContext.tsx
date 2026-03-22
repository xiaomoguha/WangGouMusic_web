import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import {
    NormalizedSong,
    getSongUrl,
    searchLyric,
    getLyric,
    parseLrc,
    ParsedLyricLine,
} from '@/services/api'

interface PlayerState {
    currentSong: NormalizedSong | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    queue: NormalizedSong[]
    queueIndex: number
    lyrics: ParsedLyricLine[]
    lyricsLoading: boolean
    audioLoading: boolean
}

interface PlayerContextType extends PlayerState {
    playSong: (song: NormalizedSong) => void
    togglePlay: () => void
    seekTo: (time: number) => void
    setVolume: (vol: number) => void
    nextSong: () => void
    prevSong: () => void
    playQueue: (songs: NormalizedSong[], startIndex?: number) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function usePlayer() {
    const ctx = useContext(PlayerContext)
    if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
    return ctx
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<PlayerState>({
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        queue: [],
        queueIndex: -1,
        lyrics: [],
        lyricsLoading: false,
        audioLoading: false,
    })

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const loadingRef = useRef(false)

    // Create audio element once
    useEffect(() => {
        const audio = new Audio()
        audio.volume = 1
        audioRef.current = audio

        const onTimeUpdate = () => {
            setState(prev => ({ ...prev, currentTime: audio.currentTime }))
        }
        const onLoadedMetadata = () => {
            setState(prev => ({
                ...prev,
                duration: audio.duration || prev.duration,
                audioLoading: false,
            }))
        }
        const onEnded = () => {
            setState(prev => {
                const nextIdx = prev.queueIndex + 1
                if (nextIdx < prev.queue.length) {
                    return { ...prev, queueIndex: nextIdx, currentSong: prev.queue[nextIdx] }
                }
                return { ...prev, isPlaying: false }
            })
        }
        const onError = () => {
            console.warn('Audio playback error')
            setState(prev => ({ ...prev, audioLoading: false }))
        }
        const onPlaying = () => {
            setState(prev => ({ ...prev, isPlaying: true, audioLoading: false }))
        }
        const onPause = () => {
            setState(prev => ({ ...prev, isPlaying: false }))
        }

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('loadedmetadata', onLoadedMetadata)
        audio.addEventListener('ended', onEnded)
        audio.addEventListener('error', onError)
        audio.addEventListener('playing', onPlaying)
        audio.addEventListener('pause', onPause)

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('loadedmetadata', onLoadedMetadata)
            audio.removeEventListener('ended', onEnded)
            audio.removeEventListener('error', onError)
            audio.removeEventListener('playing', onPlaying)
            audio.removeEventListener('pause', onPause)
            audio.pause()
            audio.src = ''
        }
    }, [])

    // When currentSong changes, load & play
    const prevSongHashRef = useRef<string | null>(null)
    useEffect(() => {
        if (state.currentSong && state.currentSong.hash !== prevSongHashRef.current) {
            prevSongHashRef.current = state.currentSong.hash
            loadAndPlay(state.currentSong)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentSong?.hash])

    async function loadAndPlay(song: NormalizedSong) {
        if (loadingRef.current) return
        loadingRef.current = true
        const audio = audioRef.current!

        setState(prev => ({
            ...prev,
            audioLoading: true,
            lyricsLoading: true,
            lyrics: [],
            currentTime: 0,
            duration: song.duration || 0,
        }))

        // Fetch song URL
        try {
            const urlData = await getSongUrl(song.hash, song.albumId)
            if (urlData.status === 1 && urlData.url && urlData.url.length > 0) {
                audio.src = urlData.url[0]
                audio.load()
                await audio.play().catch(() => {
                    setState(prev => ({ ...prev, isPlaying: false, audioLoading: false }))
                })
            } else {
                console.warn('No playback URL for:', song.title)
                setState(prev => ({ ...prev, audioLoading: false }))
            }
        } catch (err) {
            console.warn('Failed to get song URL:', err)
            setState(prev => ({ ...prev, audioLoading: false }))
        }

        // Fetch lyrics
        try {
            console.log('Fetching lyrics for:', song.title, 'hash:', song.hash, 'albumAudioId:', song.albumAudioId)
            const lyricSearch = await searchLyric(song.hash, song.albumAudioId)
            console.log('Lyric search result:', lyricSearch)
            if (lyricSearch.status === 200 && lyricSearch.candidates?.length > 0) {
                const candidate = lyricSearch.candidates[0]
                console.log('Found lyric candidate:', candidate)
                const lyricData = await getLyric(candidate.id, candidate.accesskey)
                console.log('Lyric data:', lyricData)
                if (lyricData.decodeContent) {
                    const parsed = parseLrc(lyricData.decodeContent)
                    console.log('Parsed lyrics:', parsed.length, 'lines')
                    const metaPrefixes = [
                        '词 ', '曲 ', '制作', '编曲', '混音', '母带', '出品',
                        '合声', '录音', '吉他', '贝斯', '鼓 ', '和声',
                        'Lyric', 'Compos', 'Arrang', 'Produc', 'Mixing', 'Master',
                        'Vocal', 'Guitar', 'Bass', 'Drum', 'Piano', 'String',
                    ]
                    const filtered = parsed.filter(l =>
                        !metaPrefixes.some(p => l.text.startsWith(p))
                    )
                    setState(prev => ({ ...prev, lyrics: filtered.length > 0 ? filtered : parsed }))
                } else {
                    console.log('No decodeContent in lyric data')
                }
            } else {
                console.log('No lyric candidates found, status:', lyricSearch.status)
            }
        } catch (err) {
            console.warn('Failed to fetch lyrics:', err)
        } finally {
            setState(prev => ({ ...prev, lyricsLoading: false }))
            loadingRef.current = false
        }
    }

    const playSong = useCallback((song: NormalizedSong) => {
        setState(prev => {
            const idx = prev.queue.findIndex(s => s.hash === song.hash)
            return {
                ...prev,
                currentSong: song,
                queueIndex: idx >= 0 ? idx : prev.queueIndex,
            }
        })
    }, [])

    const togglePlay = useCallback(() => {
        const audio = audioRef.current
        if (!audio || !audio.src) return
        if (audio.paused) {
            audio.play().catch(() => { })
        } else {
            audio.pause()
        }
    }, [])

    const seekTo = useCallback((time: number) => {
        const audio = audioRef.current
        if (audio && audio.src) {
            audio.currentTime = time
        }
        setState(prev => ({ ...prev, currentTime: time }))
    }, [])

    const setVolume = useCallback((vol: number) => {
        if (audioRef.current) audioRef.current.volume = vol
        setState(prev => ({ ...prev, volume: vol }))
    }, [])

    const nextSong = useCallback(() => {
        setState(prev => {
            const nextIdx = prev.queueIndex + 1
            if (nextIdx < prev.queue.length) {
                return { ...prev, queueIndex: nextIdx, currentSong: prev.queue[nextIdx] }
            }
            return prev
        })
    }, [])

    const prevSong = useCallback(() => {
        const audio = audioRef.current
        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0
            setState(prev => ({ ...prev, currentTime: 0 }))
            return
        }
        setState(prev => {
            const prevIdx = prev.queueIndex - 1
            if (prevIdx >= 0) {
                return { ...prev, queueIndex: prevIdx, currentSong: prev.queue[prevIdx] }
            }
            if (audio) audio.currentTime = 0
            return { ...prev, currentTime: 0 }
        })
    }, [])

    const playQueue = useCallback((songs: NormalizedSong[], startIndex = 0) => {
        const song = songs[startIndex]
        if (!song) return
        setState(prev => ({
            ...prev,
            queue: songs,
            queueIndex: startIndex,
            currentSong: song,
        }))
    }, [])

    return (
        <PlayerContext.Provider
            value={{
                ...state,
                playSong,
                togglePlay,
                seekTo,
                setVolume,
                nextSong,
                prevSong,
                playQueue,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}
