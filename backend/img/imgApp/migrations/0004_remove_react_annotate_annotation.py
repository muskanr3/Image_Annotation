# Generated by Django 5.0.6 on 2024-05-08 04:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imgApp', '0003_alter_react_annotate_alter_react_image_path_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='react',
            name='annotate',
        ),
        migrations.CreateModel(
            name='Annotation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=500)),
                ('react', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='annotations', to='imgApp.react')),
            ],
        ),
    ]
