import os
import logging
import httpx
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

JOOBLE_BASE_URL = "https://jooble.org/api"

async def fetch_jooble_jobs(
    keywords: str = "",
    location: str = "",
    page: int = 1,
    per_page: int = 15,
    timeout_sec: float = 10.0
) -> List[Dict[str, Any]]:
    """
    Fetches job listings from the Jooble API.
    Reads JOOBLE_API_KEY from environment.
    Gracefully returns an empty list if unconfigured or on failure.
    """
    api_key = os.getenv("JOOBLE_API_KEY", "").strip()
    if not api_key:
        logger.info("JOOBLE_API_KEY not configured. Skipping Jooble job source.")
        return []

    url = f"{JOOBLE_BASE_URL}/{api_key}"
    payload = {
        "keywords": keywords,
        "location": location,
        "page": page,
        "resultonpage": per_page
    }

    try:
        async with httpx.AsyncClient(timeout=timeout_sec) as client:
            response = await client.post(
                url,
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                # Jooble returns a dictionary with {"jobs": [...], "totalCount": ...}
                jobs = data.get("jobs", [])
                logger.info(f"Jooble returned {len(jobs)} jobs for query '{keywords}' in '{location}'.")
                return jobs
            elif response.status_code in (401, 403):
                logger.warning(f"Jooble API authentication failed (HTTP {response.status_code}). Verify JOOBLE_API_KEY.")
                return []
            elif response.status_code == 429:
                logger.warning("Jooble API rate limit reached.")
                return []
            else:
                logger.warning(f"Jooble API returned unexpected status {response.status_code}: {response.text[:200]}")
                return []
    except httpx.TimeoutException:
        logger.warning(f"Jooble API request timed out after {timeout_sec}s.")
        return []
    except httpx.RequestError as e:
        logger.warning(f"Jooble API network error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error in Jooble service: {e}")
        return []
