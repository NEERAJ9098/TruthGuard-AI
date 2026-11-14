import logging
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

# Known verified fact checks curated for hackathon demonstration / offline verification
OFFLINE_FACT_CHECK_CATALOG = [
    {
        "keywords": ["lemon", "hot water", "cancer", "cure"],
        "text": "Drinking hot water with lemon slices cures cancer and kills cancer cells 10,000 times stronger than chemotherapy.",
        "claimant": "Viral social media posts",
        "claimDate": "2020-05-12",
        "claimReview": [
            {
                "publisher": {"name": "Snopes", "site": "snopes.com"},
                "url": "https://www.snopes.com/fact-check/lemon-cancer-cure/",
                "title": "Does Drinking Hot Lemon Water Cure Cancer?",
                "textualRating": "False",
                "languageCode": "en"
            },
            {
                "publisher": {"name": "Reuters Fact Check", "site": "reuters.com"},
                "url": "https://www.reuters.com/article/idUSKBN22P2E5/",
                "title": "Fact Check: Hot lemon water does not cure cancer",
                "textualRating": "False",
                "languageCode": "en"
            }
        ]
    },
    {
        "keywords": ["5g", "covid", "coronavirus", "towers", "radiation"],
        "text": "5G wireless network radiation caused the COVID-19 pandemic.",
        "claimant": "Conspiracy websites",
        "claimDate": "2020-04-03",
        "claimReview": [
            {
                "publisher": {"name": "BBC Reality Check", "site": "bbc.com"},
                "url": "https://www.bbc.com/news/52168096",
                "title": "Coronavirus: 5G conspiracy theory debunked",
                "textualRating": "False",
                "languageCode": "en"
            },
            {
                "publisher": {"name": "PolitiFact", "site": "politifact.com"},
                "url": "https://www.politifact.com/factchecks/2020/mar/19/facebook-posts/5g-has-nothing-do-coronavirus-outbreak/",
                "title": "5G has nothing to do with the coronavirus outbreak",
                "textualRating": "Pants on Fire",
                "languageCode": "en"
            }
        ]
    },
    {
        "keywords": ["moon", "landing", "staged", "hollywood", "kubrick"],
        "text": "The Apollo 11 moon landing was faked and directed by Stanley Kubrick in a Nevada desert studio.",
        "claimant": "Conspiracy theorists",
        "claimDate": "2019-07-20",
        "claimReview": [
            {
                "publisher": {"name": "Associated Press", "site": "apnews.com"},
                "url": "https://apnews.com/article/f9c8d35661f7481a95e68fb71333f2b4",
                "title": "Apollo 11 Moon landing was not faked",
                "textualRating": "False",
                "languageCode": "en"
            }
        ]
    },
    {
        "keywords": ["chandrayaan", "isro", "moon", "south pole", "rover"],
        "text": "India's Chandrayaan-3 successfully soft-landed near the lunar south pole.",
        "claimant": "ISRO and International Media",
        "claimDate": "2023-08-23",
        "claimReview": [
            {
                "publisher": {"name": "NASA Science", "site": "nasa.gov"},
                "url": "https://science.nasa.gov/solar-system/moon/chandrayaan-3/",
                "title": "Chandrayaan-3 Mission Landing on the Moon",
                "textualRating": "True / Verified Event",
                "languageCode": "en"
            }
        ]
    },
    {
        "keywords": ["earth", "flat", "antarctica", "ice wall", "nasa lies"],
        "text": "The Earth is flat and surrounded by a giant military-guarded ice wall in Antarctica.",
        "claimant": "Flat Earth Society",
        "claimDate": "2021-02-10",
        "claimReview": [
            {
                "publisher": {"name": "LiveScience Fact Check", "site": "livescience.com"},
                "url": "https://www.livescience.com/60544-ways-to-prove-earth-is-round.html",
                "title": "How We Know the Earth Is Definitely Not Flat",
                "textualRating": "False",
                "languageCode": "en"
            }
        ]
    }
]

class FactCheckAPIService:
    def __init__(self):
        self.api_key = settings.GOOGLE_FACT_CHECK_API_KEY
        self.endpoint = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

    async def search_claims(self, query: str) -> Dict[str, Any]:
        """Search Google Fact Check Tools API, with intelligent fallback."""
        results: List[Dict[str, Any]] = []
        is_live_api = False
        api_error = None

        clean_query = query.strip()
        if len(clean_query) > 100:
            clean_query = clean_query[:100]

        if self.api_key:
            try:
                params = {
                    "query": clean_query,
                    "key": self.api_key,
                    "languageCode": "en"
                }
                async with httpx.AsyncClient(timeout=settings.EXTERNAL_API_TIMEOUT) as client:
                    resp = await client.get(self.endpoint, params=params)
                    if resp.status_code == 200:
                        data = resp.json()
                        claims = data.get("claims", [])
                        for c in claims:
                            for review in c.get("claimReview", []):
                                results.append({
                                    "claim": c.get("text", clean_query),
                                    "claimant": c.get("claimant", "Unknown"),
                                    "claim_date": c.get("claimDate", ""),
                                    "publisher": review.get("publisher", {}).get("name", "Fact Checker"),
                                    "publisher_site": review.get("publisher", {}).get("site", ""),
                                    "url": review.get("url", ""),
                                    "title": review.get("title", ""),
                                    "textual_rating": review.get("textualRating", "Unrated"),
                                    "source_type": "Google Fact Check Tools API (Live)"
                                })
                        is_live_api = True
                    else:
                        api_error = f"Google Fact Check API returned HTTP {resp.status_code}"
            except Exception as e:
                logger.warning(f"Error querying Google Fact Check API: {e}")
                api_error = str(e)

        # If live API has no matches or is not configured, check curated catalog
        if not results:
            query_lower = query.lower()
            for item in OFFLINE_FACT_CHECK_CATALOG:
                matches_count = sum(1 for kw in item["keywords"] if kw in query_lower)
                if matches_count >= 2 or (len(item["keywords"]) == 1 and item["keywords"][0] in query_lower):
                    for review in item["claimReview"]:
                        results.append({
                            "claim": item["text"],
                            "claimant": item["claimant"],
                            "claim_date": item["claimDate"],
                            "publisher": review["publisher"]["name"],
                            "publisher_site": review["publisher"]["site"],
                            "url": review["url"],
                            "title": review["title"],
                            "textual_rating": review["textualRating"],
                            "source_type": "TruthGuard Fact Check Verified Repository"
                        })

        return {
            "api_configured": bool(self.api_key),
            "is_live_api": is_live_api,
            "api_error": api_error,
            "count": len(results),
            "matches": results
        }
