from django.db import models
import os

class React(models.Model):
    name = models.CharField(max_length=30)
    image = models.ImageField(upload_to='images/')
    image_path = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        filename = os.path.basename(self.image.name)
        self.image_path = filename
        super(React, self).save(*args, **kwargs)

class Annotation(models.Model):
    react = models.ForeignKey(React, on_delete=models.CASCADE, related_name='annotations')
    text = models.CharField(max_length=500)

