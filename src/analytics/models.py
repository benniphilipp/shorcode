from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from shortcode.models import ShortcodeClass
# Create your models here.

class ClickEventManager(models.Manager):
    def create_event(self, shortInstance):
        if isinstance(shortInstance, ShortcodeClass):
            obj, created = self.get_or_create(short_url=shortInstance)
            obj.count += 1
            obj.save()
            return obj.count
        return None

class ClickEvent(models.Model):
    short_url   = models.OneToOneField(ShortcodeClass, on_delete=models.CASCADE)
    count       = models.IntegerField(default=0)
    updated     = models.DateTimeField(auto_now=True) 
    timestamp   = models.DateTimeField(auto_now_add=True)

    objects = ClickEventManager()

    def __str__(self):
        return "{i}".format(i=self.count)
    


# class TimestampToDate(models.Model):
#     event = models.ForeignKey(ClickEvent, on_delete=models.CASCADE)
#     create = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.event
    
# @receiver(post_save, sender=ClickEvent)
# def time_save(sender, instance, **kwargs):
#     instance.event.save()