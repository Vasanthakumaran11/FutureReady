import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from ..database.mongodb import get_interviews_collection, get_profiles_collection
from .deps import get_current_user

router = APIRouter(prefix="/interview", tags=["Interview Preparation"])

class InterviewSetupPayload(BaseModel):
    role: str = "Backend Developer"
    company: str = "Google"
    experience: str = "0-2"
    focusAreas: List[str] = Field(default_factory=lambda: ["dsa", "technical", "project", "hr"])

class ToggleCompletePayload(BaseModel):
    item_id: str
    category: str
    completed: bool = True
    title: Optional[str] = None
    score: Optional[int] = None

class InterviewAnswerRequest(BaseModel):
    questionId: str
    category: str = "technical"
    answer: str = ""

# Comprehensive curated DSA categories with 7-8 benchmark problems each
DSA_CATEGORIES_DATA = [
    {
        "id": "searching",
        "title": "Searching & Binary Search",
        "icon": "Search",
        "description": "Binary search algorithms, rotated arrays, and divide-and-conquer search spaces.",
        "problems": [
            {"id": "search-1", "title": "Standard Binary Search", "difficulty": "Easy", "description": "Search target in an array of sorted integers in O(log n) time."},
            {"id": "search-2", "title": "Search in Rotated Sorted Array", "difficulty": "Medium", "description": "Find target in sorted array rotated at an unknown pivot index."},
            {"id": "search-3", "title": "Find Minimum in Rotated Sorted Array", "difficulty": "Medium", "description": "Determine the minimum element in a rotated sorted array in O(log n)."},
            {"id": "search-4", "title": "First and Last Position of Element", "difficulty": "Medium", "description": "Find starting and ending position of a given target value in sorted array."},
            {"id": "search-5", "title": "Search a 2D Matrix", "difficulty": "Medium", "description": "Search target in m x n integer matrix with sorted rows and columns."},
            {"id": "search-6", "title": "Find Peak Element", "difficulty": "Medium", "description": "Find a peak element strictly greater than its neighbors in O(log n)."},
            {"id": "search-7", "title": "Koko Eating Bananas", "difficulty": "Medium", "description": "Binary search on answer space to find minimum eating speed per hour."},
            {"id": "search-8", "title": "Median of Two Sorted Arrays", "difficulty": "Hard", "description": "Find the median of two sorted arrays with combined O(log(min(m,n))) time."}
        ]
    },
    {
        "id": "sorting",
        "title": "Sorting & Intervals",
        "icon": "ArrowUpDown",
        "description": "Quick sort partitioning, merge intervals, frequency heaps and custom comparators.",
        "problems": [
            {"id": "sort-1", "title": "Merge Overlapping Intervals", "difficulty": "Medium", "description": "Merge all overlapping intervals and return non-overlapping range array."},
            {"id": "sort-2", "title": "Insert Interval", "difficulty": "Medium", "description": "Insert new interval into non-overlapping sorted intervals and merge."},
            {"id": "sort-3", "title": "Kth Largest Element in an Array", "difficulty": "Medium", "description": "Find kth largest element using QuickSelect partitioning or Min-Heap in O(n)."},
            {"id": "sort-4", "title": "Sort Colors (Dutch National Flag)", "difficulty": "Medium", "description": "Sort array of 0s, 1s, and 2s in-place in a single pass O(n) time."},
            {"id": "sort-5", "title": "Top K Frequent Elements", "difficulty": "Medium", "description": "Find top k frequent elements using Bucket Sort or Max-Heap in O(n log k)."},
            {"id": "sort-6", "title": "Meeting Rooms II", "difficulty": "Medium", "description": "Find minimum number of conference rooms required for meeting schedules."},
            {"id": "sort-7", "title": "Largest Number Formed from Array", "difficulty": "Medium", "description": "Arrange numbers in custom order such that they form the largest possible number."},
            {"id": "sort-8", "title": "Sort Characters By Frequency", "difficulty": "Medium", "description": "Sort string in decreasing order based on character frequencies."}
        ]
    },
    {
        "id": "linkedlist",
        "title": "Linked Lists",
        "icon": "Link2",
        "description": "Fast & slow pointers, pointer manipulation, reversal, and LRU linked structures.",
        "problems": [
            {"id": "ll-1", "title": "Reverse a Linked List", "difficulty": "Easy", "description": "Reverse singly linked list iteratively in O(n) time and O(1) space."},
            {"id": "ll-2", "title": "Detect Cycle in Linked List", "difficulty": "Easy", "description": "Determine if linked list has a cycle using Floyd's Tortoise and Hare algorithm."},
            {"id": "ll-3", "title": "Merge Two Sorted Lists", "difficulty": "Easy", "description": "Merge two sorted linked lists into a single sorted list."},
            {"id": "ll-4", "title": "Remove Nth Node From End of List", "difficulty": "Medium", "description": "Remove the nth node from the end of the list in a single pass."},
            {"id": "ll-5", "title": "Reorder List", "difficulty": "Medium", "description": "Reorder L0 -> Ln -> L1 -> Ln-1 by finding midpoint, reversing second half and interleaving."},
            {"id": "ll-6", "title": "Copy List with Random Pointer", "difficulty": "Medium", "description": "Deep copy linked list where nodes contain an additional random pointer."},
            {"id": "ll-7", "title": "LRU Cache (Doubly Linked List + Map)", "difficulty": "Medium", "description": "Implement Least Recently Used cache with constant time get/put operations."},
            {"id": "ll-8", "title": "Merge K Sorted Lists", "difficulty": "Hard", "description": "Merge k sorted linked lists using Min-Heap priority queue or divide-and-conquer."}
        ]
    },
    {
        "id": "recursion",
        "title": "Recursion & Backtracking",
        "icon": "Repeat",
        "description": "Decision trees, subset generation, permutations, and constrained state backtracking.",
        "problems": [
            {"id": "rec-1", "title": "Subsets & Power Set Generation", "difficulty": "Medium", "description": "Generate all possible unique subsets (the power set) of an integer array."},
            {"id": "rec-2", "title": "Permutations of Array", "difficulty": "Medium", "description": "Return all possible unique permutations of distinct integers."},
            {"id": "rec-3", "title": "Combination Sum", "difficulty": "Medium", "description": "Find all unique combinations of candidates that sum up to target with reuse."},
            {"id": "rec-4", "title": "Generate Valid Parentheses", "difficulty": "Medium", "description": "Generate all combinations of well-formed parentheses given n pairs."},
            {"id": "rec-5", "title": "Word Search on 2D Board", "difficulty": "Medium", "description": "Check if word exists in grid of characters using DFS backtracking with visited tracking."},
            {"id": "rec-6", "title": "Palindrome Partitioning", "difficulty": "Medium", "description": "Partition string such that every substring in the partition is a palindrome."},
            {"id": "rec-7", "title": "Letter Combinations of a Phone Number", "difficulty": "Medium", "description": "Map digits 2-9 to corresponding telephone letter combinations."},
            {"id": "rec-8", "title": "N-Queens Constraint Satisfaction", "difficulty": "Hard", "description": "Place n non-attacking queens on an n x n chessboard using column and diagonal bitmasks."}
        ]
    },
    {
        "id": "tree",
        "title": "Trees & Binary Search Trees",
        "icon": "GitFork",
        "description": "Tree traversals (BFS/DFS), BST properties, LCA, serialization and path sums.",
        "problems": [
            {"id": "tree-1", "title": "Maximum Depth of Binary Tree", "difficulty": "Easy", "description": "Find the maximum depth (height) of binary tree recursively and iteratively."},
            {"id": "tree-2", "title": "Invert Binary Tree", "difficulty": "Easy", "description": "Invert (mirror) a binary tree by swapping left and right subtrees."},
            {"id": "tree-3", "title": "Validate Binary Search Tree", "difficulty": "Medium", "description": "Determine if binary tree satisfies strict BST node value ordering constraints."},
            {"id": "tree-4", "title": "Lowest Common Ancestor in BST", "difficulty": "Medium", "description": "Find lowest common ancestor node between two target nodes in a BST."},
            {"id": "tree-5", "title": "Binary Tree Level Order Traversal", "difficulty": "Medium", "description": "Return level order (BFS) traversal of node values using a queue."},
            {"id": "tree-6", "title": "Diameter of Binary Tree", "difficulty": "Medium", "description": "Compute length of longest path between any two nodes in tree."},
            {"id": "tree-7", "title": "Construct Tree from Preorder and Inorder", "difficulty": "Medium", "description": "Reconstruct binary tree given preorder and inorder traversal arrays."},
            {"id": "tree-8", "title": "Serialize and Deserialize Binary Tree", "difficulty": "Hard", "description": "Design algorithm to serialize tree into string and reconstruct tree back."}
        ]
    },
    {
        "id": "graph",
        "title": "Graphs & Disjoint Set",
        "icon": "Network",
        "description": "Connected components, topological sort, Dijkstra shortest paths, and cycle detection.",
        "problems": [
            {"id": "graph-1", "title": "Number of Connected Islands", "difficulty": "Medium", "description": "Count number of 1s islands in 2D grid using DFS/BFS flood-fill."},
            {"id": "graph-2", "title": "Clone Undirected Graph", "difficulty": "Medium", "description": "Deep clone connected undirected graph using hash map node lookup during BFS."},
            {"id": "graph-3", "title": "Course Schedule (Topological Sort)", "difficulty": "Medium", "description": "Detect directed cycles in prerequisite graph using Kahn's algorithm or DFS color states."},
            {"id": "graph-4", "title": "Pacific Atlantic Water Flow", "difficulty": "Medium", "description": "Find grid coordinates where water can flow to both Pacific and Atlantic oceans."},
            {"id": "graph-5", "title": "Rotting Oranges (Multi-source BFS)", "difficulty": "Medium", "description": "Find minimum time required until all fresh oranges rot using multi-source BFS."},
            {"id": "graph-6", "title": "Network Delay Time (Dijkstra)", "difficulty": "Medium", "description": "Calculate shortest time for signal to reach all nodes in weighted directed graph."},
            {"id": "graph-7", "title": "Redundant Connection (Union-Find)", "difficulty": "Medium", "description": "Find an edge in graph that can be removed to form a tree using Disjoint Set Union."},
            {"id": "graph-8", "title": "Word Ladder Shortest Transformation", "difficulty": "Hard", "description": "Find shortest transformation sequence from beginWord to endWord in dictionary."}
        ]
    },
    {
        "id": "dp",
        "title": "Dynamic Programming",
        "icon": "Cpu",
        "description": "Subproblem memoization, bottom-up tabulations, knapsack and sequence alignments.",
        "problems": [
            {"id": "dp-1", "title": "Climbing Stairs (Fibonacci DP)", "difficulty": "Easy", "description": "Count distinct ways to climb n stairs taking 1 or 2 steps at each stride."},
            {"id": "dp-2", "title": "Coin Change (Fewest Coins)", "difficulty": "Medium", "description": "Compute fewest number of coins needed to make up target amount."},
            {"id": "dp-3", "title": "Longest Increasing Subsequence (LIS)", "difficulty": "Medium", "description": "Find length of strictly increasing subsequence in O(n log n) with patience sorting."},
            {"id": "dp-4", "title": "Maximum Subarray (Kadane's Algorithm)", "difficulty": "Medium", "description": "Find contiguous subarray with largest sum in a single linear pass."},
            {"id": "dp-5", "title": "Word Break", "difficulty": "Medium", "description": "Determine if string can be segmented into space-separated sequence of dictionary words."},
            {"id": "dp-6", "title": "House Robber Non-Adjacent DP", "difficulty": "Medium", "description": "Determine maximum amount of money you can rob without alerting adjacent alarms."},
            {"id": "dp-7", "title": "0/1 Knapsack & Subset Sum", "difficulty": "Medium", "description": "Find maximum value subset of items with weights fitting target knapsack capacity."},
            {"id": "dp-8", "title": "Longest Common Subsequence (LCS)", "difficulty": "Medium", "description": "Find length of longest common subsequence between two strings using 2D DP matrix."}
        ]
    }
]

# Section questions for Technical, Project, and HR
DEFAULT_OTHER_QUESTIONS = {
    "technical": [
        {
            "id": "tech-1",
            "question": "How does database indexing with B-Trees work under the hood, and under what conditions can indexing hurt query performance?",
            "topic": "Databases & Indexing",
            "difficulty": "Medium",
            "solutionTip": "Explain balanced search trees, I/O page lookups, clustered vs non-clustered indexes, and write amplification during INSERT/UPDATE operations."
        },
        {
            "id": "tech-2",
            "question": "Explain the difference between process-based and thread-based concurrency in modern OS, and how the Global Interpreter Lock (GIL) impacts CPU-bound vs IO-bound tasks.",
            "topic": "Concurrency & OS",
            "difficulty": "Medium",
            "solutionTip": "Differentiate memory isolation, context-switching overhead, multi-processing vs multi-threading, and non-blocking event loops."
        },
        {
            "id": "tech-3",
            "question": "What is the CAP Theorem, and how do modern distributed databases (e.g. Cassandra vs PostgreSQL/CockroachDB) make trade-offs between consistency and availability during network partitions?",
            "topic": "Distributed Systems",
            "difficulty": "Hard",
            "solutionTip": "Discuss Consistency, Availability, Partition Tolerance, quorum reads/writes, PACELC theorem, and eventual consistency models."
        },
        {
            "id": "tech-4",
            "question": "How do JWT authentication tokens compare with Stateful Server Sessions? What are the security trade-offs, revocation strategies, and CSRF/XSS vectors?",
            "topic": "API Security & Auth",
            "difficulty": "Medium",
            "solutionTip": "Discuss cryptographic signing, token payload decoding, refresh token rotation, HttpOnly SameSite cookies, and token blacklisting in Redis."
        }
    ],
    "project": [
        {
            "id": "proj-1",
            "question": "Walk through the architectural trade-offs you made in your primary resume project. What would you redesign differently if your user traffic increased by 100x?",
            "topic": "System Architecture",
            "difficulty": "Hard",
            "solutionTip": "Discuss database sharding, CDN caching, message queues for asynchronous processing, and horizontal service scaling."
        },
        {
            "id": "proj-2",
            "question": "Describe a production issue, data race, or unexpected bug you encountered in your project. How did you diagnose the root cause and ensure it won't regress?",
            "topic": "Debugging & Observability",
            "difficulty": "Medium",
            "solutionTip": "Structure response using STAR: Situation, Task, Action (logs, tracing, isolation), and Result (fix, test coverage, monitoring alert)."
        }
    ],
    "hr": [
        {
            "id": "hr-1",
            "question": "Tell me about a time you faced a difficult technical disagreement with a teammate or lead. How did you resolve the conflict to achieve project success?",
            "topic": "Conflict & Collaboration",
            "difficulty": "Medium",
            "solutionTip": "Focus on data-driven benchmarking, empathy, objective pros/cons trade-offs, and committing to team alignment."
        },
        {
            "id": "hr-2",
            "question": "Describe a scenario where you had to quickly learn an unfamiliar technology, library, or codebase to meet a strict deadline. What was your approach?",
            "topic": "Agility & Continuous Learning",
            "difficulty": "Easy",
            "solutionTip": "Highlight structured learning, reviewing official documentation, building a minimal POC, and seeking code reviews early."
        }
    ]
}

@router.get("/setup")
async def get_interview_setup(current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    profile = await profiles_col.find_one({"user_id": current_user["id"]}) if profiles_col is not None else None
    
    target_roles = profile.get("targetRoles", {}) if profile else {}
    major_role = target_roles.get("major") if isinstance(target_roles, dict) else (profile.get("targetRole") or "Backend Developer")
    target_company = profile.get("targetCompany") or profile.get("company") or "Google"
    
    return {
        "role": major_role or "Backend Developer",
        "company": target_company or "Google",
        "experience": profile.get("yearsExperience", "0-2") if profile else "0-2",
        "focusAreas": ["dsa", "technical", "project", "hr"]
    }

@router.post("/setup")
async def save_interview_setup(payload: InterviewSetupPayload, current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    if profiles_col is not None:
        await profiles_col.update_one(
            {"user_id": current_user["id"]},
            {"$set": {
                "targetRoles.major": payload.role,
                "targetCompany": payload.company,
                "company": payload.company,
                "yearsExperience": payload.experience,
                "interviewFocus": payload.focusAreas
            }},
            upsert=True
        )
    return {"message": "Setup saved successfully", "data": payload.dict()}

@router.get("/plan")
async def get_interview_plan(current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    interviews_col = get_interviews_collection()
    
    profile = await profiles_col.find_one({"user_id": current_user["id"]}) if profiles_col is not None else None
    target_roles = profile.get("targetRoles", {}) if profile else {}
    major_role = target_roles.get("major") if isinstance(target_roles, dict) else (profile.get("targetRole") or "Backend Developer")
    target_company = profile.get("targetCompany") or profile.get("company") or "Google"
    
    # Fetch real completed user records
    completed_items = []
    if interviews_col is not None:
        completed_items = await interviews_col.find({"user_id": current_user["id"], "completed": True}).to_list(length=300)
        
    practiced_count = len(completed_items)
    
    # Calculate progress per category (4 categories: dsa, technical, project, hr)
    category_counts = {"dsa": 0, "technical": 0, "project": 0, "hr": 0}
    for item in completed_items:
        cat = item.get("category", "")
        if cat in category_counts:
            category_counts[cat] += 1
        elif "dsa" in cat.lower() or item.get("item_id", "").startswith(("search", "sort", "ll", "rec", "tree", "graph", "dp", "dsa")):
            category_counts["dsa"] += 1

    # Compute totals
    dsa_total = sum(len(c["problems"]) for c in DSA_CATEGORIES_DATA)
    tech_total = len(DEFAULT_OTHER_QUESTIONS["technical"])
    proj_total = len(DEFAULT_OTHER_QUESTIONS["project"])
    hr_total = len(DEFAULT_OTHER_QUESTIONS["hr"])
    total_tasks = dsa_total + tech_total + proj_total + hr_total

    readiness = int(min(100, (practiced_count / max(1, total_tasks)) * 100))
    if practiced_count == 0 and major_role:
        readiness = 20

    return {
        "setup": {
            "role": major_role or "Backend Developer",
            "company": target_company or "Google",
            "experience": profile.get("yearsExperience", "0-2") if profile else "0-2"
        },
        "completedTasks": practiced_count,
        "pendingTasks": max(0, total_tasks - practiced_count),
        "dailyGoal": "2 problems / day",
        "readiness": readiness,
        "categoryProgress": [
            {"category": "dsa", "label": "DSA Practice", "progress": int(min(100, (category_counts["dsa"] / dsa_total) * 100)), "solved": category_counts["dsa"], "total": dsa_total},
            {"category": "technical", "label": "Technical Concepts", "progress": int(min(100, (category_counts["technical"] / tech_total) * 100)), "solved": category_counts["technical"], "total": tech_total},
            {"category": "project", "label": "Project Deep Dive", "progress": int(min(100, (category_counts["project"] / proj_total) * 100)), "solved": category_counts["project"], "total": proj_total},
            {"category": "hr", "label": "HR & Behavioral", "progress": int(min(100, (category_counts["hr"] / hr_total) * 100)), "solved": category_counts["hr"], "total": hr_total},
        ],
        "strongAreas": ["REST APIs", "System Architecture"] if practiced_count >= 2 else (["Problem Solving"] if practiced_count > 0 else []),
        "weakAreas": ["Dynamic Programming", "Concurrency"] if practiced_count < total_tasks else []
    }

@router.get("/dsa/categories")
async def get_dsa_categories(current_user: dict = Depends(get_current_user)):
    """
    Returns all DSA categories with total problem counts and user solved counts.
    """
    interviews_col = get_interviews_collection()
    user_completed_ids = set()
    if interviews_col is not None:
        docs = await interviews_col.find({"user_id": current_user["id"], "completed": True}).to_list(length=300)
        user_completed_ids = {d.get("item_id") for d in docs}

    results = []
    for cat in DSA_CATEGORIES_DATA:
        probs = cat["problems"]
        solved_in_cat = sum(1 for p in probs if p["id"] in user_completed_ids)
        total_in_cat = len(probs)
        progress_pct = int((solved_in_cat / total_in_cat) * 100) if total_in_cat > 0 else 0
        
        results.append({
            "id": cat["id"],
            "title": cat["title"],
            "icon": cat.get("icon", "Code"),
            "description": cat["description"],
            "total": total_in_cat,
            "solved": solved_in_cat,
            "progress": progress_pct,
            "problems": [
                {
                    **p,
                    "completed": p["id"] in user_completed_ids
                }
                for p in probs
            ]
        })
    return results

@router.get("/dsa/category/{cat_id}")
async def get_dsa_category_problems(cat_id: str, current_user: dict = Depends(get_current_user)):
    """
    Returns all 7-8 problems for a specific DSA category with user completion flags.
    """
    interviews_col = get_interviews_collection()
    user_completed_ids = set()
    if interviews_col is not None:
        docs = await interviews_col.find({"user_id": current_user["id"], "completed": True}).to_list(length=300)
        user_completed_ids = {d.get("item_id") for d in docs}

    target_cat = next((c for c in DSA_CATEGORIES_DATA if c["id"].lower() == cat_id.lower()), None)
    if not target_cat:
        target_cat = DSA_CATEGORIES_DATA[0]

    return [
        {
            **p,
            "category": f"dsa_{target_cat['id']}",
            "completed": p["id"] in user_completed_ids
        }
        for p in target_cat["problems"]
    ]

@router.get("/questions/{category}")
async def get_category_questions(category: str, current_user: dict = Depends(get_current_user)):
    """
    Returns questions for Technical, Project, or HR.
    """
    interviews_col = get_interviews_collection()
    user_records = {}
    if interviews_col is not None:
        user_docs = await interviews_col.find({"user_id": current_user["id"], "category": category}).to_list(length=100)
        for doc in user_docs:
            user_records[doc.get("item_id")] = doc

    base_list = DEFAULT_OTHER_QUESTIONS.get(category, DEFAULT_OTHER_QUESTIONS["technical"])
    results = []
    for item in base_list:
        rec = user_records.get(item["id"], {})
        is_completed = rec.get("completed", False)
        user_ans = rec.get("answer", "")
        feedback = rec.get("feedback", "")
        
        results.append({
            **item,
            "category": category,
            "completed": is_completed,
            "status": "completed" if is_completed else ("reviewed" if feedback else "not_started"),
            "answer": user_ans,
            "feedback": feedback
        })
    return results

@router.post("/toggle-complete")
async def toggle_item_complete(payload: ToggleCompletePayload, current_user: dict = Depends(get_current_user)):
    """
    Toggles completion of any problem or question in MongoDB.
    """
    interviews_col = get_interviews_collection()
    if interviews_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    query = {"user_id": current_user["id"], "item_id": payload.item_id}
    update_doc = {
        "user_id": current_user["id"],
        "item_id": payload.item_id,
        "category": payload.category,
        "completed": payload.completed,
        "title": payload.title or payload.item_id,
        "updated_at": datetime.datetime.utcnow().isoformat()
    }
    
    await interviews_col.update_one(query, {"$set": update_doc}, upsert=True)
    return {"success": True, "item_id": payload.item_id, "completed": payload.completed}

@router.post("/feedback")
async def submit_answer(payload: InterviewAnswerRequest, current_user: dict = Depends(get_current_user)):
    interviews_col = get_interviews_collection()
    
    answer_len = len(payload.answer.strip())
    if answer_len > 100:
        score = 90
        feedback = "Outstanding explanation with robust technical reasoning, architecture trade-offs, and clear production focus."
    elif answer_len > 40:
        score = 75
        feedback = "Solid answer covering core principles. Adding concrete performance metrics and edge-case handling would make it top-tier."
    else:
        score = 60
        feedback = "Answer provides basic context. Structure your response using STAR and elaborate on key system design trade-offs."

    if interviews_col is not None:
        await interviews_col.update_one(
            {"user_id": current_user["id"], "item_id": payload.questionId},
            {"$set": {
                "user_id": current_user["id"],
                "item_id": payload.questionId,
                "category": payload.category,
                "answer": payload.answer,
                "score": score,
                "feedback": feedback,
                "completed": True,
                "updated_at": datetime.datetime.utcnow().isoformat()
            }},
            upsert=True
        )

    return {
        "questionId": payload.questionId,
        "feedback": feedback,
        "score": score,
        "completed": True
    }
