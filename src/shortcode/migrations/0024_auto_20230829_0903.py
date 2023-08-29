# Generated by Django 3.2 on 2023-08-29 07:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geotargeting', '0001_initial'),
        ('shortcode', '0023_shortcodeclass_limitation_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='shortcodeclass',
            name='link_geo',
            field=models.CharField(blank=True, max_length=320, null=True),
        ),
        migrations.AddField(
            model_name='shortcodeclass',
            name='template_geo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='geotargeting.geothemplate'),
        ),
    ]
