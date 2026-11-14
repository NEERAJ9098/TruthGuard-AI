import re
import socket
import ipaddress
from typing import Tuple, Dict, Any, Optional
from urllib.parse import urlparse
import httpx
from bs4 import BeautifulSoup
from app.config import settings

class URLExtractor:
    @staticmethod
    def is_safe_url(url: str) -> Tuple[bool, str]:
        """Validate URL to prevent Server-Side Request Forgery (SSRF)."""
        try:
            parsed = urlparse(url)
            if parsed.scheme not in ("http", "https"):
                return False, "Only HTTP and HTTPS URLs are permitted."

            hostname = parsed.hostname
            if not hostname:
                return False, "Invalid URL: hostname missing."

            # Block common internal/local hostnames
            lower_host = hostname.lower()
            if lower_host in ("localhost", "127.0.0.1", "0.0.0.0", "::1"):
                return False, "Access to localhost or loopback addresses is forbidden."

            if lower_host.endswith((".local", ".internal", ".lan", ".localhost")):
                return False, "Access to internal domain zones is forbidden."

            # Resolve DNS to verify IP address is public and not private/loopback/multicast
            try:
                addr_info = socket.getaddrinfo(hostname, None)
            except socket.gaierror:
                return False, f"Could not resolve hostname '{hostname}'."

            for entry in addr_info:
                ip_str = entry[4][0]
                ip_obj = ipaddress.ip_address(ip_str)
                if (
                    ip_obj.is_private
                    or ip_obj.is_loopback
                    or ip_obj.is_link_local
                    or ip_obj.is_multicast
                    or ip_obj.is_reserved
                ):
                    return False, f"Target IP ({ip_str}) points to a private or restricted network range."

            return True, "Safe"
        except Exception as e:
            return False, f"URL validation failed: {str(e)}"

    @staticmethod
    async def extract_article_content(url: str) -> Dict[str, str]:
        """Safely fetch and parse article text from a URL."""
        is_safe, error_msg = URLExtractor.is_safe_url(url)
        if not is_safe:
            raise ValueError(error_msg)

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36 (TruthGuardAI/1.0; Hackathon Demo)"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }

        async with httpx.AsyncClient(timeout=settings.URL_REQUEST_TIMEOUT, follow_redirects=True) as client:
            try:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
            except httpx.TimeoutException:
                raise TimeoutError("Connection to the target URL timed out. Please check the link or try pasting the text directly.")
            except httpx.HTTPStatusError as e:
                raise ValueError(f"Target server returned HTTP {e.response.status_code}. The page could not be accessed.")
            except Exception as e:
                raise ValueError(f"Failed to fetch news article: {str(e)}")

        # Parse HTML
        soup = BeautifulSoup(response.text, "html.parser")

        # Strip unneeded elements
        for element in soup(["script", "style", "noscript", "nav", "footer", "header", "aside", "svg", "form"]):
            element.decompose()

        # Extract title
        title = ""
        # 1. OpenGraph title
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            title = og_title["content"].strip()
        # 2. <title> tag
        if not title and soup.title and soup.title.string:
            title = soup.title.string.strip()
        # 3. <h1> tag
        if not title:
            h1 = soup.find("h1")
            if h1:
                title = h1.get_text().strip()

        # Clean title suffix (e.g., " | CNN", " - BBC News")
        if title:
            title = re.sub(r"\s+[|\-–—]\s+.*$", "", title).strip()

        # Extract main text
        article_el = soup.find("article") or soup.find("main") or soup.find(id=re.compile(r"article|content|post|story", re.I)) or soup.body
        
        paragraphs = []
        if article_el:
            for p in article_el.find_all(["p", "h2", "h3"]):
                text = p.get_text().strip()
                # filter out very short junk/cookie notices
                if len(text) > 35 and not re.search(r"cookie|subscribe|all rights reserved|sign up|advertisement", text, re.I):
                    paragraphs.append(text)

        full_content = "\n\n".join(paragraphs)
        if not full_content:
            # Fallback to general text
            full_content = soup.get_text(separator=" ", strip=True)
            full_content = re.sub(r"\s{2,}", " ", full_content)

        if len(full_content) < 50:
            raise ValueError("Could not extract readable article text from this web page. Please paste the article text directly.")

        # Truncate if exceedingly long
        if len(full_content) > 12000:
            full_content = full_content[:12000] + "... [Truncated for analysis]"

        return {
            "title": title or "Extracted Web Article",
            "content": full_content,
            "url": str(url)
        }
