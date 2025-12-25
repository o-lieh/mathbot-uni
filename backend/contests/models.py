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
    registration_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return self.title


class ContestRegistration(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='registrations')
    wallet_address = models.CharField(max_length=255)
    team_name = models.CharField(max_length=255, blank=True, null=True)
    transaction_hash = models.CharField(max_length=255)
    contract_address = models.CharField(max_length=255, blank=True, null=True)  # ✅ اضافه شده
    amount_paid = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)  # ✅ اضافه شده
    unique_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    is_code_used = models.BooleanField(default=False)
    registration_date = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        unique_together = ['contest', 'wallet_address']
        ordering = ['-registration_date']

    def __str__(self):
        return f"{self.wallet_address[:10]}... - {self.contest.title} ({self.registration_date})"
    
    def is_paid(self):
        """Check if this is a paid registration"""
        return self.amount_paid > 0
    
    def get_payment_method(self):
        """Get payment method description"""
        if self.amount_paid == 0:
            return "Free registration"
        elif self.contract_address:
            return f"Smart contract: {self.contract_address[:10]}..."
        else:
            return "Direct transfer"