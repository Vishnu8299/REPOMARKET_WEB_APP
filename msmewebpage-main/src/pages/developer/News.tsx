import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Clock, 
  Search, 
  Filter,
  Share2,
  Bookmark,
  ArrowUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Activity,
  Code,
  Package,
  TrendingUp,
  MessageSquare,
  Newspaper
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface SavedArticle {
  title: string;
  url: string;
}

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('technology');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9; // Show 9 articles per page (3x3 grid)

  const categories = [
    'startup',
    'business',
    'technology',
    'entrepreneurship',
    'innovation',
    'finance',
    'venture-capital',
    'digital-transformation',
    'ai-ml',
    'blockchain',
    'e-commerce',
    'sustainability'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load saved articles from localStorage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveArticle = (article: NewsArticle) => {
    const newArticle = {
      title: article.title,
      url: article.url
    };
    
    const isArticleSaved = savedArticles.some(saved => saved.url === article.url);
    const newSavedArticles = isArticleSaved
      ? savedArticles.filter(saved => saved.url !== article.url)
      : [...savedArticles, newArticle];
    
    setSavedArticles(newSavedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(newSavedArticles));
    
    toast({
      title: isArticleSaved ? "Article removed from bookmarks" : "Article saved to bookmarks",
      duration: 2000,
    });
  };

  const handleShare = async (article: NewsArticle) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } else {
        await navigator.clipboard.writeText(article.url);
        toast({
          title: "Link copied to clipboard!",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRemoveSavedArticle = (urlToRemove: string) => {
    const newSavedArticles = savedArticles.filter(article => article.url !== urlToRemove);
    setSavedArticles(newSavedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(newSavedArticles));
    
    toast({
      title: "Article removed from bookmarks",
      duration: 2000,
    });
  };

  const fetchNews = async (pageNum: number) => {
    try {
      setLoading(true);
      const API_KEY = '3d3400918ac04ea4b408d4cd6c335966';
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?` + 
        `q=${category}` +
        `&language=en` +
        `&sortBy=publishedAt` +
        `&pageSize=${articlesPerPage}` +
        `&page=${pageNum}` +
        `&apiKey=${API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setNews(data.articles);
      setTotalPages(Math.ceil(data.totalResults / articlesPerPage));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchNews(1);
  }, [category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNews(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
            currentPage === i 
              ? 'bg-blue-600 text-white' 
              : 'bg-white/80 hover:bg-blue-100 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg bg-white/80 hover:bg-blue-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 rounded-lg bg-white/80 hover:bg-blue-100 text-gray-700"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-4 py-2 rounded-lg bg-white/80 hover:bg-blue-100 text-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg bg-white/80 hover:bg-blue-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const filteredNews = news.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img 
                src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png" 
                alt="RepoMarket Logo" 
                className="w-16 h-16"
              />
              <div className="hidden lg:flex items-center space-x-6">
                {[
                  { path: "dashboard", href: "/developer/dashboard", label: "Overview", icon: Activity },
                  { path: "repositories", href: "/developer/repositories", label: "Repositories", icon: Code },
                  { path: "projects", href: "/developer/projects", label: "Projects", icon: Package },
                  { path: "analytics", href: "/developer/analytics", label: "Analytics", icon: TrendingUp },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                      window.location.pathname === item.path && "text-blue-600"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Search and Filter Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
              <h2 className="font-semibold mb-4">Search & Filter</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Saved Articles */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Saved Articles</h2>
                {savedArticles.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {savedArticles.length} saved
                  </span>
                )}
              </div>
              {savedArticles.length > 0 ? (
                <div className="space-y-3">
                  {savedArticles.map((article, index) => (
                    <div 
                      key={index}
                      className="group flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <Bookmark className="w-4 h-4 flex-shrink-0 mt-1 group-hover:text-blue-600" />
                          <span className="line-clamp-2 group-hover:text-blue-600">
                            {article.title}
                          </span>
                        </div>
                      </a>
                      <button
                        onClick={() => handleRemoveSavedArticle(article.url)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No saved articles yet</p>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* News Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Latest Tech News</h2>
                {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
              </div>

              {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.map((article, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative">
                        <img 
                          src={article.urlToImage} 
                          alt={article.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png';
                          }}
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-blue-600 font-medium">
                            {article.source.name}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Read More
                          </a>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleSaveArticle(article)}
                              className={`text-gray-400 hover:text-blue-600 ${
                                savedArticles.some(saved => saved.url === article.url) ? 'text-blue-600' : ''
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleShare(article)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-6">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News; 