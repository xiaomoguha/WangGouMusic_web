import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PlayerProvider } from '@/context/PlayerContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { PlayerBar } from '@/components/layout/PlayerBar'
import { HomePage } from '@/pages/HomePage'
import { SearchPage } from '@/pages/SearchPage'
import { LyricsPage } from '@/pages/LyricsPage'
import { AboutPage } from '@/pages/AboutPage'
import { PlaylistDetailPage } from '@/pages/PlaylistDetailPage'

function App() {
    return (
        <BrowserRouter>
            <PlayerProvider>
                <div className="min-h-screen bg-background">
                    <Sidebar />
                    {/* 手机端无左边距，桌面端有侧边栏宽度 */}
                    <main className="min-h-screen pb-36 pt-4 px-4 md:pb-24 md:ml-[220px] md:pt-6 md:px-8">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/lyrics" element={<LyricsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
                        </Routes>
                    </main>
                    <PlayerBar />
                </div>
            </PlayerProvider>
        </BrowserRouter>
    )
}

export default App
