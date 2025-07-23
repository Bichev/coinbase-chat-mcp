import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  filename: string;
  color: string;
}

const SlideViewer: React.FC = () => {
  const { slideId } = useParams<{ slideId: string }>();
  const navigate = useNavigate();

  const slides: SlideData[] = [
    {
      id: 'slide-1',
      title: 'Web 4.0: The Internet of Agents',
      subtitle: 'The Future of AI-Driven Web',
      filename: 'Slide 1 web4.html',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'slide-2', 
      title: 'The $50B API Integration Problem',
      subtitle: 'Market Opportunity Analysis',
      filename: 'Slide 2 opportunity.html',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'slide-3',
      title: 'MCP: Universal Language for AI',
      subtitle: 'Protocol Innovation',
      filename: 'Slide 3 universal language.html',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'slide-4',
      title: 'EPAM Offering & Solutions',
      subtitle: 'Service Portfolio',
      filename: 'Slide 4 EPAM Offering.html',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'slide-5',
      title: 'Implementation Phases',
      subtitle: 'Strategic Roadmap',
      filename: 'Slide 5 phases.html',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'slide-6',
      title: 'Revenue Map & Business Impact',
      subtitle: 'Financial Analysis',
      filename: 'Slide 6 revenue map.html',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'slide-7',
      title: 'Call to Action',
      subtitle: 'Next Steps',
      filename: 'Slide 7 Call To Action.html',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'slide-8',
      title: 'MCP Architecture Deep Dive',
      subtitle: 'Technical Implementation',
      filename: 'Slide 8 Architecture.html',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  const currentSlide = slides.find(slide => slide.id === slideId);
  const currentIndex = slides.findIndex(slide => slide.id === slideId);

  if (!currentSlide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Slide Not Found</h1>
          <p className="text-red-500 mb-6">The requested slide could not be found.</p>
          <button
            onClick={() => navigate('/presentations')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Back to Presentations
          </button>
        </div>
      </div>
    );
  }

  const navigateSlide = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    } else {
      newIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    }
    navigate(`/slide/${slides[newIndex].id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/presentations')}
              className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200"
            >
              <HomeIcon className="h-4 w-4" />
              <span>Back to Gallery</span>
            </button>
            
            <div className={`bg-gradient-to-r ${currentSlide.color} text-white px-4 py-2 rounded-lg`}>
              <h1 className="font-semibold">{currentSlide.title}</h1>
              <p className="text-sm opacity-90">{currentSlide.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-sm">
              Slide {currentIndex + 1} of {slides.length}
            </span>
            
            <button
              onClick={() => navigateSlide('prev')}
              disabled={currentIndex === 0}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => navigateSlide('next')}
              disabled={currentIndex === slides.length - 1}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            <a
              href={`/slides/${currentSlide.filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              <span>Full Screen</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white rounded-xl shadow-2xl h-full overflow-hidden">
            <iframe
              src={`/slides/${currentSlide.filename}`}
              className="w-full h-full border-0"
              title={currentSlide.title}
              style={{ minHeight: 'calc(100vh - 200px)' }}
            />
          </div>
        </div>
      </div>

      {/* Slide Navigation Footer */}
      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => navigate(`/slide/${slide.id}`)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                title={slide.title}
              />
            ))}
          </div>
          
          <div className="text-white/80 text-sm">
            Use arrow keys or buttons to navigate between slides
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer; 