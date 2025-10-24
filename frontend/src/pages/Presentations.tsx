import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PresentationChartBarIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  DocumentTextIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  filename: string;
  category: 'introduction' | 'opportunity' | 'solution' | 'implementation' | 'action';
  thumbnail: string;
  color: string;
}

const Presentations: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides: Slide[] = [
    {
      id: 'slide-1',
      title: 'Web 4.0: The Internet of Agents',
      subtitle: 'The Future of AI-Driven Web',
      description: 'Introduction to the next evolution of the internet, where AI agents seamlessly interact with web services and data.',
      filename: 'Slide 1 web4.html',
      category: 'introduction',
      thumbnail: '/static/slide-thumbnails/slide-1-thumb.jpg',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'slide-2', 
      title: 'The $50B API Integration Problem',
      subtitle: 'Market Opportunity Analysis',
      description: 'Deep dive into the massive API integration challenge facing enterprises and the business opportunity it represents.',
      filename: 'Slide 2 opportunity.html',
      category: 'opportunity',
      thumbnail: '/static/slide-thumbnails/slide-2-thumb.jpg',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'slide-3',
      title: 'MCP: Universal Language for AI',
      subtitle: 'Protocol Innovation',
      description: 'How Model Context Protocol creates a universal language for AI agents to interact with any system or service.',
      filename: 'Slide 3 universal language.html',
      category: 'solution',
      thumbnail: '/static/slide-thumbnails/slide-3-thumb.jpg',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'slide-4',
      title: 'EPAM Offering & Solutions',
      subtitle: 'Service Portfolio',
      description: 'Comprehensive overview of EPAM\'s MCP implementation services and enterprise solutions.',
      filename: 'Slide 4 EPAM Offering.html',
      category: 'solution',
      thumbnail: '/static/slide-thumbnails/slide-4-thumb.jpg',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'slide-5',
      title: 'Implementation Phases',
      subtitle: 'Strategic Roadmap',
      description: 'Structured approach to MCP adoption with clear phases, milestones, and deliverables for enterprise deployment.',
      filename: 'Slide 5 phases.html',
      category: 'implementation',
      thumbnail: '/static/slide-thumbnails/slide-5-thumb.jpg',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'slide-6',
      title: 'Revenue Map & Business Impact',
      subtitle: 'Financial Analysis',
      description: 'Comprehensive revenue impact analysis and business case for MCP adoption across different industry verticals.',
      filename: 'Slide 6 revenue map.html',
      category: 'opportunity',
      thumbnail: '/static/slide-thumbnails/slide-6-thumb.jpg',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'slide-7',
      title: 'Call to Action',
      subtitle: 'Next Steps',
      description: 'Strategic next steps, partnership opportunities, and concrete actions to begin MCP implementation.',
      filename: 'Slide 7 Call To Action.html',
      category: 'action',
      thumbnail: '/static/slide-thumbnails/slide-7-thumb.jpg',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'slide-8',
      title: 'MCP Architecture Deep Dive',
      subtitle: 'Technical Implementation',
      description: 'Comprehensive technical architecture, evolution timeline, and implementation details for MCP integration.',
      filename: 'Slide 8 Architecture.html',
      category: 'implementation',
      thumbnail: '/static/slide-thumbnails/slide-8-thumb.jpg',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  const categories = {
    introduction: { name: 'Introduction', icon: '🌐', color: 'bg-orange-500' },
    opportunity: { name: 'Market Opportunity', icon: '💰', color: 'bg-blue-500' },
    solution: { name: 'MCP Solutions', icon: '⚡', color: 'bg-purple-500' },
    implementation: { name: 'Implementation', icon: '🔧', color: 'bg-teal-500' },
    action: { name: 'Action Plan', icon: '🚀', color: 'bg-pink-500' }
  };

  const openSlideModal = (slide: Slide, index: number) => {
    console.log('Opening slide modal:', slide.title, 'at index:', index);
    setSelectedSlide(slide);
    setCurrentSlideIndex(index);
  };

  const closeSlideModal = () => {
    setSelectedSlide(null);
  };

  const navigateSlide = (direction: 'prev' | 'next') => {
    let newIndex = currentSlideIndex;
    if (direction === 'prev') {
      newIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : slides.length - 1;
    } else {
      newIndex = currentSlideIndex < slides.length - 1 ? currentSlideIndex + 1 : 0;
    }
    setCurrentSlideIndex(newIndex);
    setSelectedSlide(slides[newIndex]);
  };

  const groupedSlides = slides.reduce((acc, slide) => {
    if (!acc[slide.category]) {
      acc[slide.category] = [];
    }
    acc[slide.category].push(slide);
    return acc;
  }, {} as Record<string, Slide[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <PresentationChartBarIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                MCP Business Presentations
              </h1>
              <p className="text-xl text-slate-600 mt-2">Complete presentation suite for business stakeholders</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Presentation Overview</h2>
            <p className="text-slate-600 leading-relaxed">
              This comprehensive presentation suite covers the complete MCP (Model Context Protocol) business case, 
              from market opportunity analysis to technical implementation. Designed for account managers, sales teams, 
              and technical stakeholders to communicate the value proposition and implementation strategy.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className="text-center">
                  <div className={`${category.color} rounded-lg p-3 text-white font-semibold text-sm mb-2`}>
                    {category.icon} {category.name}
                  </div>
                  <span className="text-xs text-slate-500">
                    {groupedSlides[key]?.length || 0} slides
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Categories */}
        {Object.entries(groupedSlides).map(([categoryKey, categorySlides]) => {
          const category = categories[categoryKey as keyof typeof categories];
          return (
            <div key={categoryKey} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`${category.color} rounded-lg p-2 text-white text-lg font-semibold`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{category.name}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categorySlides.map((slide) => {
                  const globalIndex = slides.findIndex(s => s.id === slide.id);
                  return (
                                         <div key={slide.id} className="group relative">
                       <div 
                         className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                         onClick={() => {
                           console.log('Card clicked for:', slide.title);
                           openSlideModal(slide, globalIndex);
                         }}
                       >
                        {/* Slide Preview */}
                        <div className={`h-48 bg-gradient-to-br ${slide.color} flex items-center justify-center relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative z-10 text-center p-4">
                            <h3 className="text-white font-bold text-lg leading-tight mb-2">{slide.title}</h3>
                            <p className="text-white/80 text-sm">{slide.subtitle}</p>
                          </div>
                          
                                                     {/* Hover Overlay */}
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                                                                                      <button
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 console.log('Preview button clicked for:', slide.title);
                                 openSlideModal(slide, globalIndex);
                               }}
                               className="bg-white text-slate-800 px-3 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors duration-200 flex items-center space-x-1 shadow-lg text-sm"
                             >
                               <EyeIcon className="h-4 w-4" />
                               <span>Preview</span>
                             </button>
                             <button
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 console.log('View Page button clicked for:', slide.title);
                                 navigate(`/slide/${slide.id}`);
                               }}
                               className="bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1 shadow-lg text-sm"
                             >
                               <CursorArrowRaysIcon className="h-4 w-4" />
                               <span>View</span>
                             </button>
                             <a
                               href={`/slides/${slide.filename}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 text-sm"
                             >
                               <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                               <span>Open</span>
                             </a>
                          </div>
                        </div>

                        {/* Slide Info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-500">
                              Slide {globalIndex + 1}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.color} text-white`}>
                              {category.name}
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-800 mb-2 leading-tight">{slide.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{slide.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Present?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Use these slides to communicate the MCP value proposition to clients, stakeholders, 
            and technical teams. Each slide is optimized for business presentations and technical discussions.
          </p>
                     <div className="flex flex-wrap justify-center gap-4">
             <button
               onClick={() => {
                 console.log('Start Presentation clicked');
                 openSlideModal(slides[0], 0);
               }}
               className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
             >
               <PlayIcon className="h-5 w-5" />
               <span>Start Presentation (Modal)</span>
             </button>
             <button
               onClick={() => navigate('/slide/slide-1')}
               className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
             >
               <CursorArrowRaysIcon className="h-5 w-5" />
               <span>Start Presentation (Page)</span>
             </button>
             <a
               href="/slides/Slide 8 Architecture.html"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
             >
               <DocumentTextIcon className="h-5 w-5" />
               <span>Technical Deep Dive</span>
             </a>
           </div>
        </div>
      </div>

             {/* Slide Modal */}
      {selectedSlide && (
        <div 
          className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeSlideModal();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateSlide('prev')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                                 <div>
                   <h3 className="text-xl font-semibold text-slate-800">{selectedSlide.title}</h3>
                   <p className="text-slate-600">Slide {currentSlideIndex + 1} of {slides.length}</p>
                   <p className="text-xs text-green-600">✅ Modal is working! Loading: {selectedSlide.filename}</p>
                 </div>
                <button
                  onClick={() => navigateSlide('next')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={`/slides/${selectedSlide.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  <span>Full Screen</span>
                </a>
                <button
                  onClick={closeSlideModal}
                  className="text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

                        {/* Modal Content */}
            <div className="flex-1 overflow-auto">
              <div className="w-full h-full" style={{ minHeight: '1200px' }}>
                <iframe
                  src={`/slides/${selectedSlide.filename}`}
                  className="w-full border-0"
                  title={selectedSlide.title}
                  style={{ height: '1200px' }}
                  onLoad={() => console.log('Iframe loaded for:', selectedSlide.title)}
                  onError={() => console.error('Iframe failed to load for:', selectedSlide.title)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presentations; 