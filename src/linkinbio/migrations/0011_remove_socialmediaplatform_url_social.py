# Generated by Django 3.2 on 2023-09-10 17:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linkinbio', '0010_auto_20230910_1921'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='socialmediaplatform',
            name='url_social',
        ),
    ]
