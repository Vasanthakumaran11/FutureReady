import os
import logging
import httpx
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

async def fetch_adzuna_jobs(
    keywords: str = "",
    location: str = "",
    page: int = 1,
    per_page: int = 15,
    country: str = "in",
    timeout_sec: float = 10.0
) -> List[Dict[str, Any]]:
    """
    Fetches job listings from the Adzuna API.
    Reads ADZUNA_APP_ID and ADZUNA_APP_KEY from environment.
    Country defaults to 'in' (India), but falls back or can be parameterized.
    Gracefully returns an empty list if unconfigured or on failure.
    """
    app_id = os.getenv("ADZUNA_APP_ID", "").strip()
    app_key = os.getenv("ADZUNA_APP_KEY", "").strip()

    if not app_id or not app_key:
        logger.info("ADZUNA_APP_ID or ADZUNA_APP_KEY not configured. Skipping Adzuna job source.")
        return []

    # Adzuna API URL format: /v1/api/jobs/{country}/search/{page}
    target_country = (country or "in").lower()
    url = f"{ADZUNA_BASE_URL}/{target_country}/search/{page}"
    
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": per_page,
        "content-type": "application/json"
    }
    if keywords:
        params["what"] = keywords
    if location:
        params["where"] = location

    try:
        async with httpx.AsyncClient(timeout=timeout_sec) as client:
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                logger.info(f"Adzuna returned {len(results)} jobs for query '{keywords}' in '{location}'.")
                return results
            elif response.status_code in (401, 403):
                logger.warning(f"Adzuna API authentication failed (HTTP {response.status_code}). Verify ADZUNA_APP_ID and ADZUNA_APP_KEY.")
                return []
            elif response.status_code == 429:
                logger.warning("Adzuna API rate limit reached.")
                return []
            else:
                logger.warning(f"Adzuna API returned status {response.status_code}: {response.text[:200]}")
                return []
    except httpx.TimeoutException:
        logger.warning(f"Adzuna API request timed out after {timeout_sec}s.")
        return []
    except httpx.RequestError as e:
        logger.warning(f"Adzuna API network error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error in Adzuna service: {e}")
        return []
