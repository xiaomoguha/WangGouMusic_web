export interface Song {
    id: string
    title: string
    artist: string
    album: string
    cover: string
    duration: number // seconds
    lyrics?: LyricLine[]
}

export interface LyricLine {
    time: number // seconds
    text: string
}

export interface Playlist {
    id: string
    name: string
    description: string
    cover: string
    songs: Song[]
}

export const allSongs: Song[] = [
    {
        id: '1',
        title: '海风的呢喃',
        artist: '林清月',
        album: '潮汐之间',
        cover: '/images/album-cover-1.png',
        duration: 245,
        lyrics: [
            { time: 0, text: '♪ 前奏 ♪' },
            { time: 8, text: '海风轻轻吹过脸庞' },
            { time: 14, text: '带来远方的芬芳' },
            { time: 20, text: '白色浪花拍打沙滩' },
            { time: 26, text: '谱写夏天的乐章' },
            { time: 34, text: '闭上眼睛倾听' },
            { time: 40, text: '那片蔚蓝的歌唱' },
            { time: 48, text: '让思绪随潮水飘荡' },
            { time: 54, text: '忘却所有忧伤' },
            { time: 62, text: '海风在呢喃' },
            { time: 68, text: '诉说着永恒的故事' },
            { time: 76, text: '每一朵浪花' },
            { time: 82, text: '都是一段温柔的记忆' },
            { time: 90, text: '♪ 间奏 ♪' },
            { time: 106, text: '赤脚走在沙滩上' },
            { time: 112, text: '脚印被潮水带走' },
            { time: 118, text: '就像那些远去的时光' },
            { time: 124, text: '再也无法挽留' },
            { time: 132, text: '但海风依然温柔' },
            { time: 138, text: '陪伴每个日落' },
            { time: 146, text: '在这无边的蓝色里' },
            { time: 152, text: '找到心的角落' },
            { time: 160, text: '海风在呢喃' },
            { time: 166, text: '诉说着永恒的故事' },
            { time: 174, text: '每一朵浪花' },
            { time: 180, text: '都是一段温柔的记忆' },
            { time: 190, text: '让我在这里停留' },
            { time: 198, text: '聆听大海的呼吸' },
            { time: 206, text: '直到星光洒满海面' },
            { time: 214, text: '与夜色融为一体' },
            { time: 224, text: '♪ 尾奏 ♪' },
        ],
    },
    {
        id: '2',
        title: '山间晨雾',
        artist: '苏雨辰',
        album: '云端漫步',
        cover: '/images/album-cover-2.png',
        duration: 218,
        lyrics: [
            { time: 0, text: '♪ 前奏 ♪' },
            { time: 10, text: '晨雾缭绕在山间' },
            { time: 16, text: '鸟鸣声声如诗篇' },
            { time: 24, text: '露珠挂在叶尖上' },
            { time: 30, text: '折射出彩虹的光' },
            { time: 38, text: '踏着青石的小路' },
            { time: 44, text: '走过溪水的桥梁' },
            { time: 52, text: '让心灵在此安放' },
            { time: 58, text: '远离城市的喧嚷' },
            { time: 66, text: '山间的风 带着花香' },
            { time: 74, text: '云端的梦 自由飞翔' },
            { time: 82, text: '在这宁静的时光里' },
            { time: 90, text: '找到最初的模样' },
        ],
    },
    {
        id: '3',
        title: '樱花树下',
        artist: '陈若雪',
        album: '春日物语',
        cover: '/images/album-cover-3.png',
        duration: 232,
        lyrics: [
            { time: 0, text: '♪ 前奏 ♪' },
            { time: 12, text: '粉色花瓣随风飘落' },
            { time: 18, text: '铺满了回家的路' },
            { time: 26, text: '你站在樱花树下' },
            { time: 32, text: '微笑着向我招手' },
            { time: 40, text: '时间在此刻静止' },
            { time: 46, text: '世界只剩下温柔' },
            { time: 54, text: '让我把这一刻珍藏' },
            { time: 60, text: '直到永久' },
        ],
    },
    {
        id: '4',
        title: '星空下的独白',
        artist: '周子墨',
        album: '夜色温柔',
        cover: '/images/album-cover-4.png',
        duration: 267,
        lyrics: [
            { time: 0, text: '♪ 前奏 ♪' },
            { time: 14, text: '繁星铺满天际' },
            { time: 20, text: '银河静静流淌' },
            { time: 28, text: '独坐在山顶上' },
            { time: 34, text: '对着夜空轻唱' },
            { time: 42, text: '每颗星都是一个梦' },
            { time: 48, text: '每个梦都有一个你' },
            { time: 56, text: '在无尽的宇宙里' },
            { time: 62, text: '我们何其幸运' },
        ],
    },
    {
        id: '5',
        title: '麦田的守望',
        artist: '叶知秋',
        album: '金色年华',
        cover: '/images/album-cover-5.png',
        duration: 195,
        lyrics: [
            { time: 0, text: '♪ 前奏 ♪' },
            { time: 8, text: '金色麦浪翻滚' },
            { time: 14, text: '像大地的心跳' },
            { time: 22, text: '阳光洒在肩上' },
            { time: 28, text: '温暖而美好' },
            { time: 36, text: '守望着这片田野' },
            { time: 42, text: '守望着简单的幸福' },
            { time: 50, text: '在四季的轮回中' },
            { time: 56, text: '感受生命的厚度' },
        ],
    },
    {
        id: '6',
        title: '水晶花园',
        artist: '白羽',
        album: '光之棱镜',
        cover: '/images/album-cover-6.png',
        duration: 208,
        lyrics: [
            { time: 0, text: '♪ 前奏 ♪' },
            { time: 10, text: '透明的花瓣折射光芒' },
            { time: 16, text: '彩虹在指尖绽放' },
            { time: 24, text: '水晶花园的深处' },
            { time: 30, text: '藏着最纯净的梦想' },
            { time: 38, text: '每一步都踏出旋律' },
            { time: 44, text: '每一刻都值得铭记' },
            { time: 52, text: '在光与影的交织中' },
            { time: 58, text: '找到属于我的奇迹' },
        ],
    },
    {
        id: '7',
        title: '城市的温度',
        artist: '林清月',
        album: '潮汐之间',
        cover: '/images/album-cover-1.png',
        duration: 226,
    },
    {
        id: '8',
        title: '云端之上',
        artist: '苏雨辰',
        album: '云端漫步',
        cover: '/images/album-cover-2.png',
        duration: 241,
    },
    {
        id: '9',
        title: '风铃物语',
        artist: '陈若雪',
        album: '春日物语',
        cover: '/images/album-cover-3.png',
        duration: 199,
    },
    {
        id: '10',
        title: '月光奏鸣曲',
        artist: '周子墨',
        album: '夜色温柔',
        cover: '/images/album-cover-4.png',
        duration: 312,
    },
    {
        id: '11',
        title: '秋日私语',
        artist: '叶知秋',
        album: '金色年华',
        cover: '/images/album-cover-5.png',
        duration: 187,
    },
    {
        id: '12',
        title: '琉璃之歌',
        artist: '白羽',
        album: '光之棱镜',
        cover: '/images/album-cover-6.png',
        duration: 253,
    },
]

export const playlists: Playlist[] = [
    {
        id: 'pl-1',
        name: '午后慢时光',
        description: '适合安静午后的轻音乐合集',
        cover: '/images/album-cover-1.png',
        songs: [allSongs[0], allSongs[2], allSongs[4], allSongs[5]],
    },
    {
        id: 'pl-2',
        name: '自然之声',
        description: '聆听自然的呼吸与旋律',
        cover: '/images/album-cover-2.png',
        songs: [allSongs[1], allSongs[3], allSongs[4]],
    },
    {
        id: 'pl-3',
        name: '入眠轻音',
        description: '伴你入梦的温柔旋律',
        cover: '/images/album-cover-4.png',
        songs: [allSongs[3], allSongs[5], allSongs[9], allSongs[11]],
    },
]

export const recommendedSongs = allSongs.slice(0, 6)
export const newReleases = allSongs.slice(6, 12)
