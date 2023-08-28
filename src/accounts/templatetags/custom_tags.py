from django import template
from accounts.models import CustomUser 

register = template.Library()

@register.simple_tag
def first_character(email):
    if email:
        return email[0]
    return ""


@register.filter(name='is_free_user')
def is_free_user(user):
    try:
        custom_user = CustomUser.objects.get(id=user.id)
        return custom_user.free_user
    except CustomUser.DoesNotExist:
        return False






