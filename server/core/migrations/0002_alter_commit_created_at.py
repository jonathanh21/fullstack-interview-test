# Generated by Django 4.0.6 on 2022-07-12 05:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commit',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]