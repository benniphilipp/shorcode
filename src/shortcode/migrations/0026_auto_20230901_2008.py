# Generated by Django 3.2 on 2023-09-01 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geotargeting', '0001_initial'),
        ('shortcode', '0025_auto_20230829_0907'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shortcodeclass',
            name='template_geo',
        ),
        migrations.AddField(
            model_name='shortcodeclass',
            name='template_geo',
            field=models.ManyToManyField(blank=True, null=True, related_name='geothemplate', to='geotargeting.GeoThemplate'),
        ),
    ]
