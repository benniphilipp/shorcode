# Generated by Django 3.2 on 2023-08-15 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0007_auto_20230815_1918'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ipgeolocation',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='ipgeolocation',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
