from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import BasePermission

from core.models import (
    Repo,
    Commit,
    Branch,
    PullRequest,
)
from repo.serializers import (
    RepoSerializer,
    CommitSerializer,
    BranchSerializer,
    PullRequestSerializer
)
from repo.utils import get_repo_instance


class RepoViewSet(ModelViewSet):
    """View for manage repo api."""
    serializer_class = RepoSerializer
    queryset = Repo.objects.all()

    def create(self, request):

        repo_name = request.data['name']
        repo_link = request.data['link']

        get_repo_instance(repo_name, repo_link)

        return super().create(request)

    def retrieve(self, request, pk=None):
        repo=Repo.objects.filter(pk=pk)

        if repo.exists():
            repo_i = get_repo_instance(repo[0].name, repo[0].link)
            for ref in repo_i.references:
                new_branch, created = Branch.objects.get_or_create(
                    repo = repo[0],
                    name=ref.name,
                )
                for commit in repo_i.iter_commits(rev=ref.name):
                    Commit.objects.get_or_create(
                        message=commit.message,
                        author=commit.author,
                        created_at=commit.authored_datetime,
                        branch = new_branch,
                    )


        return super().retrieve(self,request, pk)



class CommitViewSet(ModelViewSet):
    serializer_class = CommitSerializer
    queryset = Commit.objects.all()



class BranchViewSet(ModelViewSet):
    serializer_class = BranchSerializer
    queryset = Branch.objects.all()



class PullRequestViewSet(ModelViewSet):
    serializer_class = PullRequestSerializer
    queryset = PullRequest.objects.all()




