# Generated by Django 5.0.6 on 2024-05-07 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imgApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='react',
            name='image_path',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='react',
            name='annotate',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='react',
            name='name',
            field=models.CharField(max_length=30, null=True),
        ),
    ]
