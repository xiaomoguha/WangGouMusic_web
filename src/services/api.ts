const BASE = '/api'

async function request<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(path, window.location.origin)
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                url.searchParams.set(k, String(v))
            }
        })
    }
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
}

// ========== Types ==========

export interface KugouSong {
    hash: string
    songname: string
    singername: string
    album_name: string
    album_id: string
    album_audio_id: number
    audio_id: number
    duration: number
    trans_param?: {
        union_cover?: string
        language?: string
    }
    '320hash'?: string
    sqhash?: string
    filename?: string
    pay_type?: number
}

export interface SearchResult {
    status: number
    data: {
        total: number
        info?: KugouSong[]
        lists?: KugouSong[]
    }
}

export interface SongUrlResult {
    status: number
    url: string[]
    backupUrl: string[]
    timeLength: number
    fileSize: number
    bitRate: number
    extName: string
}

export interface LyricSearchResult {
    status: number
    candidates: {
        id: string
        accesskey: string
        song: string
        singer: string
        duration: number
    }[]
}

export interface LyricResult {
    status: number
    content: string
    decodeContent?: string
    fmt: string
}

export interface TopSongItem {
    hash: string
    album_name: string
    album_id: number
    album_audio_id: number
    audio_id: number
    authors: { author_name: string; author_id: number; sizable_avatar?: string }[]
    trans_param?: {
        union_cover?: string
        language?: string
    }
    album_sizable_cover?: string
    timelength_128?: number
    publish_date?: string
    remark?: string
    songname?: string
}

export interface RankListItem {
    id: number
    rankname: string
    intro: string
    img_cover?: string
    banner_9?: string
    album_img_9?: string
    play_times: number
    songinfo?: {
        name: string
        hash: string
        trans_param?: { union_cover?: string }
    }[]
}

export interface PlaylistItem {
    specialid: number
    specialname: string
    imgurl: string
    intro: string
    play_count: number
    collectcount: number
    singername: string
    global_collection_id: string
    tags?: { tag_name: string }[]
}

export interface HotKeyword {
    keyword: string
    reason: string
}

// ========== API Functions ==========

export async function searchSongs(keywords: string, page = 1, pagesize = 30): Promise<SearchResult> {
    return request<SearchResult>(`${BASE}/search`, { keywords, page, pagesize })
}

export async function getSongUrl(hash: string, albumId?: string): Promise<SongUrlResult> {
    const params: Record<string, string | number> = { hash }
    if (albumId) params.album_id = albumId
    return request<SongUrlResult>(`${BASE}/song/url`, params)
}

export async function searchLyric(hash: string, albumAudioId?: number): Promise<LyricSearchResult> {
    const params: Record<string, string | number> = { hash }
    if (albumAudioId) params.album_audio_id = albumAudioId
    return request<LyricSearchResult>(`${BASE}/search/lyric`, params)
}

export async function getLyric(id: string, accesskey: string): Promise<LyricResult> {
    return request<LyricResult>(`${BASE}/lyric`, { id, accesskey, fmt: 'lrc', decode: 'true' })
}

export async function getTopSongs(): Promise<{ data: TopSongItem[]; total: number }> {
    return request(`${BASE}/top/song`)
}

export async function getRankList(): Promise<{ data: { info: RankListItem[] } }> {
    return request(`${BASE}/rank/list`, { withsong: 1 })
}

export async function getRankAudio(rankid: number, page = 1, pagesize = 30) {
    return request<{ data: { total: number; songlist: TopSongItem[] } }>(`${BASE}/rank/audio`, { rankid, page, pagesize })
}

export async function getTopPlaylists(categoryId = 0, page = 1, pagesize = 6) {
    return request<{ data: { special_list: PlaylistItem[] } }>(`${BASE}/top/playlist`, {
        category_id: categoryId,
        withsong: 0,
        page,
        pagesize,
    })
}

export interface PlaylistTrackItem {
    hash: string
    name: string
    cover?: string
    timelen?: number
    audio_id?: number
    mixsongid?: number
    album_id?: number
    singerinfo?: { id: number; name: string; avatar?: string }[]
    albuminfo?: { name: string; id: number }
    trans_param?: { union_cover?: string }
}

export interface PlaylistTrackResult {
    status: number
    data: {
        count: number
        songs: PlaylistTrackItem[]
        list_info?: Record<string, unknown>
    }
}

export async function getPlaylistTracks(id: string, page = 1, pagesize = 30): Promise<PlaylistTrackResult> {
    return request<PlaylistTrackResult>(`${BASE}/playlist/track/all`, { id, page, pagesize })
}

export function normalizePlaylistTrack(item: PlaylistTrackItem): NormalizedSong {
    const singerName = item.singerinfo?.map(s => s.name).join(', ') || ''
    // name is usually "Artist - Title"
    const parts = item.name?.split(' - ') || []
    const title = parts.length > 1 ? parts.slice(1).join(' - ') : (item.name || '未知歌曲')
    const artist = singerName || (parts.length > 1 ? parts[0] : '未知歌手')
    const cover = item.trans_param?.union_cover || item.cover || ''
    return {
        hash: item.hash,
        title,
        artist,
        album: item.albuminfo?.name || '',
        albumId: String(item.album_id || item.albuminfo?.id || ''),
        albumAudioId: item.mixsongid || 0,
        cover: kugouImg(cover),
        duration: item.timelen ? Math.round(item.timelen / 1000) : 0,
    }
}

export async function getHotSearch(): Promise<{ data: { list: { keywords: HotKeyword[] }[] } }> {
    return request(`${BASE}/search/hot`)
}

export interface SuggestRecord {
    HintInfo: string
    Hot?: number
}

export interface SuggestGroup {
    RecordDatas: SuggestRecord[]
    RecordCount: number
    LableName: string
}

export interface SuggestResult {
    status: number
    data: SuggestGroup[]
}

export async function getSearchSuggest(keywords: string): Promise<SuggestResult> {
    return request<SuggestResult>(`${BASE}/search/suggest`, { keywords })
}

export async function searchTwo(page = 1, pagesize = 30): Promise<SearchResult> {
    return request<SearchResult>(`${BASE}/searchtwo`, { page, pagesize })
}

// ========== Helpers ==========

/** Replace {size} placeholder in kugou image urls */
export function kugouImg(url: string | undefined, size = '400'): string {
    if (!url) return '/images/album-cover-1.png'
    return url.replace('{size}', size)
}

/** Parse LRC format lyrics into timed lines */
export interface ParsedLyricLine {
    time: number
    text: string
}

export function parseLrc(lrc: string): ParsedLyricLine[] {
    const lines = lrc.split(/\r?\n/)
    const result: ParsedLyricLine[] = []

    for (const line of lines) {
        // Match [mm:ss.xx] or [mm:ss] patterns
        const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/)
        if (match) {
            const min = parseInt(match[1], 10)
            const sec = parseInt(match[2], 10)
            const ms = match[3].length === 2 ? parseInt(match[3], 10) * 10 : parseInt(match[3], 10)
            const time = min * 60 + sec + ms / 1000
            const text = match[4].trim()
            if (text) {
                result.push({ time, text })
            }
        }
    }

    return result.sort((a, b) => a.time - b.time)
}

/** Normalize a KugouSong / TopSongItem into a unified Song shape for the player */
export interface NormalizedSong {
    hash: string
    title: string
    artist: string
    album: string
    albumId: string
    albumAudioId: number
    cover: string
    duration: number // in seconds
}

export function normalizeSong(item: KugouSong): NormalizedSong {
    return {
        hash: item.hash,
        title: item.songname || item.filename?.split(' - ').pop() || '未知歌曲',
        artist: item.singername || '未知歌手',
        album: item.album_name || '',
        albumId: String(item.album_id || ''),
        albumAudioId: item.album_audio_id || 0,
        cover: kugouImg(item.trans_param?.union_cover),
        duration: item.duration || 0,
    }
}

export function normalizeTopSong(item: TopSongItem): NormalizedSong {
    const authorNames = item.authors?.map(a => a.author_name).join(', ') || '未知歌手'
    const cover = item.trans_param?.union_cover || item.album_sizable_cover || ''
    return {
        hash: item.hash,
        title: item.songname || item.album_name || '未知歌曲',
        artist: authorNames,
        album: item.album_name || '',
        albumId: String(item.album_id || ''),
        albumAudioId: item.album_audio_id || 0,
        cover: kugouImg(cover),
        duration: item.timelength_128 ? Math.round(item.timelength_128 / 1000) : 0,
    }
}

// searchTwo 接口返回的数据格式不同
export function normalizeSearchTwoSong(item: any): NormalizedSong {
    const cover = item.trans_param?.union_cover || item.Image || ''
    return {
        hash: item.FileHash || item.hash || '',
        title: item.OriSongName || item.songname || '未知歌曲',
        artist: item.SingerName || item.singername || '未知歌手',
        album: item.AlbumName || item.album_name || '',
        albumId: String(item.AlbumID || item.album_id || ''),
        // MixSongID 才是歌词搜索需要的 album_audio_id
        albumAudioId: item.MixSongID || item.Audioid || item.album_audio_id || 0,
        cover: kugouImg(cover),
        duration: item.Duration || item.duration || 0,
    }
}
