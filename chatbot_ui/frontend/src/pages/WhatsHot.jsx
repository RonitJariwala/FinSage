// import React, { useState } from "react";
// import axios from "axios";
// import "./WhatsHot.css";

// const WhatsHot = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchNews = async (query) => {
//     const apiKey = process.env.REACT_APP_GNEWS_API_KEY;
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://gnews.io/api/v4/search?q=${query}&lang=en&sortby=publishedAt&max=5&apikey=${apiKey}`
//       );
//       const data = await response.json();
  
//       if (!response.ok) throw new Error(data.message || "Failed to fetch news");
  
//       const filteredNews = data.articles.map((article) => ({
//         title: article.title,
//         description: article.description,
//         url: article.url,
//         published: article.publishedAt,
//       }));
  
//       setNews(filteredNews);
//     } catch (error) {
//       console.error("Error fetching news:", error.message);
//       setNews([
//         {
//           title: "Error",
//           description: "Failed to load news. Please check your API key or network.",
//           url: "#",
//           published: new Date().toISOString(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       fetchNews(searchQuery);
//     }
//   };

//   return (
//     <div className="whats-hot-page">
//       <h1>What's Hot</h1>
//       <div className="search-container">
//         <form onSubmit={handleSearch}>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search news about a company (e.g., Apple, Tesla)..."
//             disabled={loading}
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </form>
//       </div>
//       {loading && <div className="loading">Loading news...</div>}
//       <div className="news-list">
//         {news.length > 0 ? (
//           news.map((item, index) => (
//             <div key={index} className="news-item">
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//               <a href={item.url} target="_blank" rel="noopener noreferrer">
//                 Read more on original page
//               </a>
//               <small>Published: {new Date(item.published).toLocaleString()}</small>
//             </div>
//           ))
//         ) : !loading ? (
//           <p>No news available. Try a different company name!</p>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default WhatsHot;
import React, { useState } from "react";
import axios from "axios";
import "./WhatsHot.css";

const WhatsHot = () => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `https://gnews.io/api/v4/search?q=${query}&lang=en&max=6&token=${process.env.REACT_APP_GNEWS_API_KEY}`
      );
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("News fetch failed", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hot-wrapper">
      <div className="hot-glass">
        <h1 className="hot-title">🔥 What's Hot</h1>

        <form className="hot-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search AI, Tech, Finance news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        <div className="hot-grid">
          {articles.length > 0 ? (
            articles.map((a, i) => (
              <div className="hot-card" key={i}>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <a href={a.url} target="_blank" rel="noreferrer">
                  Read More →
                </a>
                <span className="hot-time">
                  🕒 {new Date(a.publishedAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="hot-empty">
              <p>Start searching to get trending news 💡</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsHot;
