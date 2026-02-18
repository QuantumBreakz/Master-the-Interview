import os
import requests
from pathlib import Path

# -----------------------------
# Configuration
# -----------------------------
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # 🔑 Set this in your environment variables
if not GITHUB_TOKEN:
    print("Warning: GITHUB_TOKEN not found in environment variables.")

HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

QUERY = "language:python stars:>500"  # Example: Python repos with >500 stars
SAVE_DIR = Path("data_github/raw/python_human/")
SAVE_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------
# Helper: Search Repositories
# -----------------------------
def search_repositories(query, per_page=5, page=1):
    url = "https://api.github.com/search/repositories"
    params = {"q": query, "sort": "stars", "order": "desc", "per_page": per_page, "page": page}
    r = requests.get(url, headers=HEADERS, params=params)
    r.raise_for_status()
    return r.json()["items"]

# -----------------------------
# Helper: Download Code Files
# -----------------------------
def fetch_repo_files(owner, repo, path=""):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    r = requests.get(url, headers=HEADERS)
    if r.status_code == 200:
        for item in r.json():
            if item["type"] == "file" and item["name"].endswith(".py"):
                download_file(item["download_url"], item["name"], repo)
            elif item["type"] == "dir":
                fetch_repo_files(owner, repo, item["path"])

def download_file(url, filename, repo_name):
    r = requests.get(url)
    if r.status_code == 200:
        filepath = SAVE_DIR / f"{repo_name}_{filename}"
        with open(filepath, "w", encoding="utf-8", errors="ignore") as f:
            f.write(r.text)
        print(f"✅ Saved {filepath}")

# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    print("🔍 Searching for repositories...")
    repos = search_repositories(QUERY, per_page=3, page=1)  # change per_page for more

    for repo in repos:
        owner = repo["owner"]["login"]
        name = repo["name"]
        print(f"\n📂 Fetching repo: {owner}/{name}")
        fetch_repo_files(owner, name)
