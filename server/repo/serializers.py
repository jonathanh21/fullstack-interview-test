"""
Serializers for the repo API
"""
from rest_framework import serializers

from core.models import Repo, Commit, Branch, PullRequest
from repo.utils import get_repo_instance


class RepoSerializer(serializers.ModelSerializer):
    """Serializers for Repos."""

    class Meta:
        model = Repo
        fields = ['id', 'name', 'link']
        read_only_fields = ['id']



class BranchSerializer(serializers.ModelSerializer):
    repo = RepoSerializer(read_only=True)
    repo_id = serializers.PrimaryKeyRelatedField(
        source="repo",
        queryset=Repo.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Branch
        fields = ['name', 'repo', 'id', 'repo_id']
        reead_only_fields = ['id']



class CommitSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(required=False, read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source="branch",
        queryset=Branch.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Commit
        fields = [
            'id',
            'branch_id',
            'branch',
            'author',
            'message',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']





class PullRequestSerializer(serializers.ModelSerializer):
    base_branch = BranchSerializer(required=False, read_only=True)
    base_branch_id = serializers.PrimaryKeyRelatedField(
        source="base_branch",
        queryset=Branch.objects.all(),
        write_only=True,
        required=True,
    )
    compare_branch = BranchSerializer(required=False, read_only=True)
    compare_branch_id = serializers.PrimaryKeyRelatedField(
        source="compare_branch",
        queryset=Branch.objects.all(),
        write_only=True,
        required=True,
    )

    class Meta:
        model = PullRequest
        fields = [
            'base_branch',
            'base_branch_id',
            'compare_branch',
            'compare_branch_id',
            'author',
            'title',
            'description',
            'status',
        ]

    def validate(self,attrs):
        repo_name = attrs['base_branch'].repo.name
        repo_link = attrs['base_branch'].repo.link

        repo_i = get_repo_instance(repo_name, repo_link)

        git_base_branch = repo_i.references[attrs['base_branch'].name]
        git_compare_branch = repo_i.references[attrs['compare_branch'].name]

        base = repo_i.merge_base(git_compare_branch, git_base_branch)
        repo_i.index.merge_tree(git_base_branch, base=base)
        repo_i.index.commit('Merge to branches',
        parent_commits=(git_compare_branch.commit, git_base_branch.commit))

        return super().validate(attrs)



