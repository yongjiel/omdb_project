# Generated by Django 4.2.3 on 2023-08-22 15:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_usermovie'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usermovie',
            old_name='user_id',
            new_name='user',
        ),
    ]
