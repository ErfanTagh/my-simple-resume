"""
Admin configuration for Resume models
"""
from django.contrib import admin
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'get_email', 'created_at', 'updated_at')
    search_fields = ('personal_info__first_name', 'personal_info__last_name', 'personal_info__email')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_full_name(self, obj):
        return f"{obj.personal_info.first_name} {obj.personal_info.last_name}"
    get_full_name.short_description = 'Name'
    
    def get_email(self, obj):
        return obj.personal_info.email
    get_email.short_description = 'Email'

