from django.contrib import admin
from .models import Contest, ContestRegistration

class ContestRegistrationInline(admin.TabularInline):
    model = ContestRegistration
    extra = 0
    readonly_fields = ['unique_code', 'registration_date']

@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'location', 'registration_price']
    inlines = [ContestRegistrationInline]

@admin.register(ContestRegistration)
class ContestRegistrationAdmin(admin.ModelAdmin):
    list_display = ['wallet_address', 'contest', 'unique_code', 'is_code_used', 'registration_date']
    list_filter = ['contest', 'is_code_used', 'registration_date']
    search_fields = ['wallet_address', 'unique_code', 'email']