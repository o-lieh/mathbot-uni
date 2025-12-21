import uuid
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
    registration_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # قیمت ثبت‌نام

    def __str__(self):
        return self.title


class ContestRegistration(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='registrations')
    wallet_address = models.CharField(max_length=255)  # آدرس ولت کاربر
    transaction_hash = models.CharField(max_length=255, blank=True, null=True)  # هش تراکنش
    unique_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)  # کد یکتا
    is_code_used = models.BooleanField(default=False)  # آیا کد استفاده شده؟
    registration_date = models.DateTimeField(auto_now_add=True)  # تاریخ ثبت‌نام


    class Meta:
        unique_together = ['contest', 'wallet_address']  # هر کاربر فقط یک بار در هر مسابقه ثبت‌نام کند

    def __str__(self):
        return f"{self.wallet_address} - {self.contest.title}"
