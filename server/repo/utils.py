from django.conf import settings
from git import Repo as GitRepo, remote

def get_repo_instance(name, link):
    repo_dir = f'{settings.BASE_DIR}/tmp/{name}'
    try:
        repo_instance = GitRepo.clone_from(link, repo_dir)
    except:
        repo_instance = GitRepo(repo_dir)
    return repo_instance
