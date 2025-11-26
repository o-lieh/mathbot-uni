from django.db import models


class Contest(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    prize = models.CharField(max_length=255)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    pdf_rules = models.FileField(upload_to='rules/', blank=True, null=True)
    capacity = models.IntegerField(default=0)
    signed_up = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    def available_spots(self):
        return self.capacity - self.signed_up