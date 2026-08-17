import logging
from typing import Dict, Any
from .learning_data import ROLE_SKILL_CATALOG
from ...database.mongodb import (
    get_role_skills_collection,
    get_learning_resources_collection
)

logger = logging.getLogger(__name__)

async def seed_skill_database():
    """
    Seeds role_skills and learning_resources collections in MongoDB from the curated catalog.
    Runs idempotently.
    """
    role_skills_col = get_role_skills_collection()
    learning_res_col = get_learning_resources_collection()

    if role_skills_col is None or learning_res_col is None:
        logger.warning("MongoDB not connected yet. Skipping skill database seeding.")
        return

    try:
        # 1. Seed Role-Skills
        for role_entry in ROLE_SKILL_CATALOG:
            role_name = role_entry["role"]
            existing = await role_skills_col.find_one({"role": role_name})
            
            role_doc = {
                "role": role_name,
                "description": role_entry.get("description", ""),
                "skills": [
                    {
                        "name": s["name"],
                        "importance": s.get("importance", "High"),
                        "topics": s.get("topics", []),
                        "default_level": s.get("default_level", "Beginner")
                    }
                    for s in role_entry["skills"]
                ]
            }

            if not existing:
                await role_skills_col.insert_one(role_doc)
            else:
                await role_skills_col.update_one({"role": role_name}, {"$set": role_doc})

            # 2. Seed Learning Resources
            for skill_entry in role_entry["skills"]:
                skill_name = skill_entry["name"]
                for res in skill_entry.get("resources", []):
                    res_query = {
                        "skill": skill_name,
                        "role": role_name,
                        "title": res["title"]
                    }
                    res_doc = {
                        "skill": skill_name,
                        "role": role_name,
                        "title": res["title"],
                        "description": res.get("description", ""),
                        "platform": res.get("platform", "YouTube"),
                        "url": res["url"],
                        "difficulty": res.get("difficulty", "Beginner"),
                        "topic": res.get("topic", ""),
                        "type": res.get("type", "video")
                    }
                    await learning_res_col.update_one(res_query, {"$set": res_doc}, upsert=True)

        logger.info("Successfully seeded Role Skills & Learning Resources collections.")
    except Exception as e:
        logger.error(f"Error seeding skill database: {e}")
