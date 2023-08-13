from django import template

register = template.Library()

@register.simple_tag
def first_character(email):
    if email:
        return email[0]
    return ""