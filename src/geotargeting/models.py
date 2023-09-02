from django.db import models
from accounts.models import CustomUser


""" GEO Themplate """
class GeoThemplate(models.Model):
    themplate_user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,)
    themplate_name = models.CharField(max_length=255, blank=True, null=True)
    land = models.CharField(max_length=255, blank=True, null=True)
    themplate_region = models.CharField(max_length=255, blank=True, null=True) 
    def __str__(self):
        return self.themplate_name