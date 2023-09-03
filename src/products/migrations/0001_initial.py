# Generated by Django 3.2 on 2023-09-03 06:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tax', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('stage', models.CharField(choices=[('Growth', 'Growth'), ('Core', 'Core'), ('Premium', 'Premium')], default='Growth', max_length=10)),
            ],
        ),
    ]
