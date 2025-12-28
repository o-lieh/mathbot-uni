from django.test import TestCase
from .models import Contest, ContestRegistration
from datetime import date, time
import uuid


class ContestRegistrationTest(TestCase):

    def setUp(self):
        self.contest = Contest.objects.create(
            title="Test Contest",
            description="This is a test contest.",
            location="Tehran",
            date=date(2025, 1, 1),
            time=time(12, 30),
            prize="Gold Medal",
            registration_price=0.1  # 0.1 ETH
        )

    def test_registration_creation(self):
        registration = ContestRegistration.objects.create(
            contest=self.contest,
            wallet_address="0x742d35Cc6634C0532925a3b844Bc9e3a4C2a3F5C",
            email="test@example.com"
        )

        self.assertEqual(registration.wallet_address, "0x742d35Cc6634C0532925a3b844Bc9e3a4C2a3F5C")
        self.assertFalse(registration.is_code_used)
        self.assertIsNotNone(registration.unique_code)

    def test_unique_code_generation(self):
        registration1 = ContestRegistration.objects.create(
            contest=self.contest,
            wallet_address="0x123...",
        )

        registration2 = ContestRegistration.objects.create(
            contest=self.contest,
            wallet_address="0x456...",
        )

        self.assertNotEqual(registration1.unique_code, registration2.unique_code)