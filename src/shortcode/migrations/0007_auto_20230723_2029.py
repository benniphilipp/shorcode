# Generated by Django 3.2 on 2023-07-23 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shortcode', '0006_rename_shortcode_shortcodeclass_short'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shortcodeclass',
            name='short',
        ),
        migrations.AddField(
            model_name='shortcodeclass',
            name='shor',
            field=models.CharField(blank=True, max_length=15),
        ),
    ]
