from .learning_data import ROLE_SKILL_CATALOG
from .seed_data import seed_skill_database
from .skill_service import (
    normalize_skill_name,
    get_all_roles,
    get_role_details,
    analyze_skill_gaps,
    get_resources_for_skill,
    update_learning_progress,
    get_user_learning_progress
)

__all__ = [
    "ROLE_SKILL_CATALOG",
    "seed_skill_database",
    "normalize_skill_name",
    "get_all_roles",
    "get_role_details",
    "analyze_skill_gaps",
    "get_resources_for_skill",
    "update_learning_progress",
    "get_user_learning_progress"
]
