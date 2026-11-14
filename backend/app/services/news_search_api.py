import logging
import re
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

# Sample verified news archives for fallback testing
VERIFIED_NEWS_CATALOG = [
    {
        "keywords": ["chandrayaan", "moon", "isro", "lander", "pragyan"],
        "title": "Chandrayaan-3: India makes historic landing near Moon south pole",
        "source": "BBC News",
        "url": "https://www.bbc.com/news/world-asia-india-66594520",
        "published_date": "2023-08-23",
        "snippet": "India has become the first country to land a spacecraft near the south pole of the Moon, sparking nationwide celebrations."
    },
    {
        "keywords": ["james webb", "space telescope", "nasa", "galaxy", "deep space"],
        "title": "NASA's James Webb Space Telescope Reveals Earliest Galaxies Yet Seen",
        "source": "NASA Release",
        "url": "https://www.nasa.gov/universe/webb-reveals-earliest-galaxies/",
        "published_date": "2024-01-15",
        "snippet": "Astronomers using NASA's James Webb Space Telescope have discovered distant cosmic structures dating back to within 300 million years of the Big Bang."
    },
    {
        "keywords": ["ai", "deepfake", "election", "misinformation", "watermark"],
        "title": "Tech firms sign pact to fight deceptive AI in 2024 elections",
        "source": "Reuters",
        "url": "https://www.reuters.com/technology/tech-firms-sign-pact-fight-deceptive-ai-elections-2024-02-16/",
        "published_date": "2024-02-16",
        "snippet": "Major tech companies pledged to work together to detect and counter harmful artificial intelligence-generated deepfakes aimed at tricking voters."
    }
]

class NewsSearchAPIService:
    def __init__(self):
        self.news_api_key = settings.NEWS_API_KEY
        self.gdelt_endpoint = "https://api.gdeltproject.org/api/v2/doc/doc"
        self.newsapi_endpoint = "https://newsapi.org/v2/everything"

    def _extract_search_keywords(self, text: str) -> str:
        """Extract 3-5 salient keywords for search queries."""
        words = re.findall(r'\b[A-Za-z]{4,}\b', text)
        stopwords = {
            "this", "that", "these", "those", "have", "with", "from", "about",
            "after", "before", "while", "where", "which", "could", "would",
            "should", "their", "there", "report", "news", "today", "breaking",
            "exclusive", "shocking", "urgent", "update"
        }
        filtered = [w for w in words if w.lower() not in stopwords]
        # Return first 4 significant keywords joined
        return " ".join(filtered[:4])

    async def search_gdelt(self, query: str) -> List[Dict[str, Any]]:
        """Search GDELT 2.0 Global News API."""
        results = []
        try:
            params = {
                "query": query,
                "mode": "artlist",
                "maxrecords": "5",
                "format": "json",
                "sort": "rel"
            }
            async with httpx.AsyncClient(timeout=settings.EXTERNAL_API_TIMEOUT) as client:
                resp = await client.get(self.gdelt_endpoint, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    articles = data.get("articles", [])
                    for a in articles:
                        results.append({
                            "title": a.get("title", ""),
                            "source": a.get("domain", "International Media"),
                            "url": a.get("url", ""),
                            "published_date": a.get("seendate", "")[:10] if a.get("seendate") else "",
                            "snippet": f"Document indexed by GDELT Global Knowledge Graph from {a.get('domain', 'news source')}.",
                            "provider": "GDELT Global News Database"
                        })
        except Exception as e:
            logger.info(f"GDELT search notice: {e}")
        return results

    async def search_newsapi(self, query: str) -> List[Dict[str, Any]]:
        """Search NewsAPI if API key is provided."""
        results = []
        if not self.news_api_key:
            return results

        try:
            params = {
                "q": query,
                "apiKey": self.news_api_key,
                "pageSize": 5,
                "sortBy": "relevancy",
                "language": "en"
            }
            async with httpx.AsyncClient(timeout=settings.EXTERNAL_API_TIMEOUT) as client:
                resp = await client.get(self.newsapi_endpoint, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for item in data.get("articles", []):
                        results.append({
                            "title": item.get("title", ""),
                            "source": item.get("source", {}).get("name", "News Outlet"),
                            "url": item.get("url", ""),
                            "published_date": item.get("publishedAt", "")[:10],
                            "snippet": item.get("description", "") or item.get("content", "")[:200],
                            "provider": "NewsAPI (Live)"
                        })
        except Exception as e:
            logger.warning(f"NewsAPI error: {e}")
        return results

    async def search_news_coverage(self, headline_or_text: str) -> Dict[str, Any]:
        """Search for relevant news coverage across GDELT, NewsAPI, and verified archives."""
        search_query = self._extract_search_keywords(headline_or_text)
        if not search_query:
            search_query = headline_or_text[:50]

        matches: List[Dict[str, Any]] = []

        # 1. Try NewsAPI if configured
        if self.news_api_key:
            newsapi_results = await self.search_newsapi(search_query)
            matches.extend(newsapi_results)

        # 2. Try GDELT Project (public free global dataset)
        if len(matches) < 4:
            gdelt_results = await self.search_gdelt(search_query)
            matches.extend(gdelt_results)

        # 3. Check verified catalog fallback if query matches known events
        if len(matches) < 2:
            query_lower = headline_or_text.lower()
            for item in VERIFIED_NEWS_CATALOG:
                hit_count = sum(1 for kw in item["keywords"] if kw in query_lower)
                if hit_count >= 2:
                    matches.append({
                        "title": item["title"],
                        "source": item["source"],
                        "url": item["url"],
                        "published_date": item["published_date"],
                        "snippet": item["snippet"],
                        "provider": "Verified News Knowledge Base"
                    })

        return {
            "query_used": search_query,
            "news_api_configured": bool(self.news_api_key),
            "total_found": len(matches),
            "articles": matches[:6]
        }
