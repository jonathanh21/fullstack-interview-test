"""
Database models
"""
import uuid
import os

from django.conf import settings
from django.db import models
from django.contrib.auth.models import(
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class Repo(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    link = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return self.name



class Branch(models.Model):

    repo = models.ForeignKey(
        'Repo',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return self.name



class Commit(models.Model):

    author = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    files_changed = models.IntegerField()
    message = models.TextField()
    created_at = models.DateTimeField()
    branch = models.ForeignKey(
        'Branch',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.message




class PullRequest(models.Model):
    base_branch = models.ForeignKey(
        'Branch',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='base_branch',
    )
    compare_branch = models.ForeignKey(
        'Branch',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='compare_branch'
    )
    author = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=10,
        choices = [
            ('OPEN', 'open'),
            ('CLOSED', 'closed'),
            ('MERGED', 'merged'),
        ],
        default='OPEN',
        )

    def __str__(self):
        return self.author