import { Heart, Music, Headphones, Sparkles } from 'lucide-react'

export function AboutPage() {
    const features = [
        {
            icon: Music,
            title: '精选音乐',
            desc: '每日更新精心策划的音乐推荐，涵盖各种风格流派',
        },
        {
            icon: Headphones,
            title: '沉浸体验',
            desc: '同步歌词滚动显示，让你沉浸在音乐的每一个音符中',
        },
        {
            icon: Sparkles,
            title: '智能推荐',
            desc: '基于你的听歌习惯，为你推荐最合适的音乐',
        },
        {
            icon: Heart,
            title: '用心设计',
            desc: '简洁优雅的界面设计，让音乐播放成为一种享受',
        },
    ]

    return (
        <div className="mx-auto max-w-3xl space-y-12 pb-8">
            {/* Header */}
            <section className="text-center">
                <div
                    className="mb-6 inline-flex"
                    style={{ opacity: 0, animation: 'scale-in 0.4s ease-out forwards' }}
                >
                    <img
                        src="/images/about-illustration.png"
                        alt="网狗音乐"
                        className="h-48 w-48 rounded-3xl object-cover shadow-lg"
                    />
                </div>
                <h1
                    className="mb-3 text-3xl font-bold text-foreground"
                    style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.1s forwards' }}
                >
                    关于 <span className="gradient-text">网狗音乐</span>
                </h1>
                <p
                    className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground"
                    style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.2s forwards' }}
                >
                    网狗音乐 是一款专注于音乐体验的在线播放器。
                    我们相信音乐是连接心灵的桥梁，每一首歌都承载着独特的情感与故事。
                </p>
            </section>

            {/* Features */}
            <section>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {features.map((feat, i) => (
                        <div
                            key={feat.title}
                            className="group rounded-2xl bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                            style={{
                                opacity: 0,
                                animation: 'fade-in-up 0.5s ease-out forwards',
                                animationDelay: `${0.2 + i * 0.08}s`,
                            }}
                        >
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
                                <feat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                                {feat.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech */}
            <section
                className="rounded-2xl bg-card p-8 shadow-sm"
                style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.6s forwards' }}
            >
                <h2 className="mb-4 text-lg font-bold text-foreground">技术栈</h2>
                <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router', 'Lucide Icons'].map(
                        tech => (
                            <span
                                key={tech}
                                className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
                            >
                                {tech}
                            </span>
                        )
                    )}
                </div>
            </section>

            {/* Footer note */}
            <p
                className="text-center text-sm text-muted-foreground"
                style={{ opacity: 0, animation: 'fade-in 0.5s ease-out 0.8s forwards' }}
            >
                Made with care. Enjoy the music.
            </p>
        </div>
    )
}
