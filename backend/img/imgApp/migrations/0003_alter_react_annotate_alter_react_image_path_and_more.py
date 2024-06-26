# Generated by Django 5.0.6 on 2024-05-07 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imgApp', '0002_react_image_path_alter_react_annotate_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='react',
            name='annotate',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='react',
            name='image_path',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='react',
            name='name',
            field=models.CharField(max_length=30),
        ),
    ]
