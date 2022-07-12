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


class CommitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commit
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class BranchSerializer(serializers.ModelSerializer):
    repo = RepoSerializer(read_only=True)
    repo_id = serializers.PrimaryKeyRelatedField(
        source="repo",
        queryset=Repo.objects.all(),
        write_only=True,
        required=False,
    )
    commits = serializers.SerializerMethodField()

    def get_commits(self, obj):
        commits = Commit.objects.filter(branch_id=obj.id)
        serializer = CommitSerializer(commits, many=True)
        return serializer.data


    class Meta:
        model = Branch
        fields = ['name', 'repo', 'id', 'repo_id', 'commits']
        reead_only_fields = ['id']







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
            'id',
        ]

    def validate(self,attrs):
        if attrs['status'] == 'MERGED':
            try:
                repo_name = attrs['base_branch'].repo.name
                repo_link = attrs['base_branch'].repo.link

                repo_i = get_repo_instance(repo_name, repo_link)

                o = repo_i.remotes.origin
                repo_i.git.checkout(attrs['base_branch'].name)
                o.pull()
                repo_i.git.merge(attrs['compare_branch'].name)
            except:
                raise ValidationError('The branches cannot be merged')

        return super().validate(attrs)



