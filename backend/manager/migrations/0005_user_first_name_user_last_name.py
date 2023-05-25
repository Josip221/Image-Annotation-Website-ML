# Generated by Django 4.1.7 on 2023-05-25 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0004_remove_user_first_name_remove_user_last_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='first name'),
        ),
        migrations.AddField(
            model_name='user',
            name='last_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='last name'),
        ),
    ]