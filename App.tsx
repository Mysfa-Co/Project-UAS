import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Wand2, Download, Image as ImageIcon } from 'lucide-react';
import RetroButton from './components/RetroButton';
import PixelCard from './components/PixelCard';
import { generatePixelStory, generatePixelArt } from './services/gemini';
import { GenerationStatus, GeneratedImage } from './types';

// Placeholder image that mimics the user's requested style until they generate one
const INITIAL_IMAGE = "https://picsum.photos/seed/pixeljungle/800/800"; 

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>(INITIAL_IMAGE);
  const [prompt, setPrompt] = useState("jungle sunset with mountains");
  
  const [imageStatus, setImageStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [storyStatus, setStoryStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  
  const [story, setStory] = useState({
    title: "The Emerald Horizon",
    content: "The sun dips below the jagged peaks, casting a warm glow over the ancient canopy. Here in the digital wilderness, adventure awaits those who dare to explore the 8-bit jungle."
  });

  const [gallery, setGallery] = useState<GeneratedImage[]>([]);

  // Initial Story Load
  useEffect(() => {
    handleGenerateStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateStory = async () => {
    setStoryStatus(GenerationStatus.LOADING);
    const result = await generatePixelStory(prompt);
    setStory({
      title: result.title,
      content: result.content
    });
    setStoryStatus(GenerationStatus.SUCCESS);
  };

  const handleGenerateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt) return;

    setImageStatus(GenerationStatus.LOADING);
    try {
      const base64Image = await generatePixelArt(prompt);
      if (base64Image) {
        setCurrentImage(base64Image);
        
        // Add to gallery
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: base64Image,
          prompt: prompt,
          createdAt: Date.now()
        };
        setGallery(prev => [newImage, ...prev]);
        
        // Also refresh story to match new image
        handleGenerateStory();
      }
      setImageStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setImageStatus(GenerationStatus.ERROR);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `pixel-vista-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-retro-pink selection:text-white">
      {/* Navbar */}
      <nav className="border-b-4 border-black bg-retro-purple/90 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-retro-orange border-2 border-black flex items-center justify-center shadow-hard-sm">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-retro-dark" />
            </div>
            <h1 className="font-pixel text-sm sm:text-xl text-white tracking-widest uppercase">
              Pixel<span className="text-retro-yellow">Vista</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-retro text-xl">
            <a href="#create" className="hover:text-retro-yellow transition-colors">Create</a>
            <a href="#gallery" className="hover:text-retro-yellow transition-colors">Gallery</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Display */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-retro-teal bg-retro-teal/20 hidden sm:block"></div>
            <div className="relative z-10">
              <PixelCard imageSrc={currentImage} title={imageStatus === GenerationStatus.LOADING ? "Rendering..." : "Current View"}>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-pixel text-[10px] text-gray-500 uppercase">16-BIT COLOR DEPTH</span>
                  <button 
                    onClick={handleDownload}
                    className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                    title="Download Wallpaper"
                  >
                    <Download className="w-5 h-5 text-retro-dark" />
                  </button>
                </div>
              </PixelCard>
            </div>
          </div>

          {/* Right Column: Controls & Story */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <div className="space-y-4">
              <h2 className="font-pixel text-2xl sm:text-4xl text-retro-orange leading-relaxed shadow-black drop-shadow-md">
                {story.title}
              </h2>
              <div className="bg-black/40 p-6 border-l-4 border-retro-pink backdrop-blur-sm">
                <p className="font-retro text-xl sm:text-2xl text-white leading-relaxed">
                  {storyStatus === GenerationStatus.LOADING ? (
                    <span className="animate-pulse">Loading story data from cartridge...</span>
                  ) : (
                    story.content
                  )}
                </p>
              </div>
            </div>

            {/* Generator Form */}
            <div id="create" className="bg-retro-dark border-4 border-white/20 p-6 shadow-hard relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <ImageIcon className="w-24 h-24 text-white" />
              </div>
              
              <h3 className="font-pixel text-white text-lg mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                World Builder
              </h3>
              
              <form onSubmit={handleGenerateImage} className="space-y-4 relative z-10">
                <div>
                  <label htmlFor="prompt" className="block font-retro text-retro-green text-xl mb-1">Theme Prompt</label>
                  <input
                    type="text"
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-black/50 border-2 border-retro-purple text-white font-retro text-xl p-3 focus:outline-none focus:border-retro-yellow transition-colors placeholder-white/30"
                    placeholder="e.g., cyberpunk city raining"
                  />
                </div>
                
                <div className="flex gap-4">
                  <RetroButton 
                    type="submit" 
                    isLoading={imageStatus === GenerationStatus.LOADING}
                    className="flex-1"
                  >
                    Generate View
                  </RetroButton>
                  <RetroButton 
                    type="button" 
                    variant="secondary"
                    onClick={() => handleGenerateStory()}
                    disabled={storyStatus === GenerationStatus.LOADING}
                    title="Regenerate Story Only"
                  >
                    <RefreshCw className={`w-5 h-5 ${storyStatus === GenerationStatus.LOADING ? 'animate-spin' : ''}`} />
                  </RetroButton>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <section id="gallery" className="mt-20 sm:mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 flex-1 bg-retro-blue"></div>
              <h2 className="font-pixel text-xl sm:text-2xl text-retro-blue uppercase">Recent Discoveries</h2>
              <div className="h-1 flex-1 bg-retro-blue"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((img) => (
                <div key={img.id} onClick={() => {
                  setCurrentImage(img.url);
                  setPrompt(img.prompt);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} className="cursor-pointer transform hover:-translate-y-2 transition-transform">
                  <PixelCard imageSrc={img.url} title={new Date(img.createdAt).toLocaleTimeString()} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-20 py-8 border-t-4 border-black bg-black/80 text-center font-retro text-gray-400 text-lg">
        <p>POWERED BY GOOGLE GEMINI • 2025</p>
      </footer>
    </div>
  );
};

export default App;