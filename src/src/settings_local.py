import os
from pathlib import Path
import environ

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'), #BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


CORS_ORIGIN_ALLOW_ALL = True   

TIME_ZONE = 'Europe/Berlin'

LANGUAGE_CODE = 'de-de'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


DEFAULT_HOST = 'www'
DEFAULT_REDIRECT_URL = "http://www.127.0.0.1:8000"
PARENT_HOST = "127.0.0.1:8000"

ROOT_HOSTCONF = 'src.hosts'

LOGIN_REDIRECT_URL = '/'
LOGIN_URL = 'accounts:login'
SESSION_COOKIE_AGE = 60 * 60 * 24 * 30

AUTH_USER_MODEL = "accounts.CustomUser"

CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap4"
CRISPY_TEMPLATE_PACK = "bootstrap4"

SHORTCODE_MAX = 15
SHORTCODE_MIN = 6

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 1025  # Port für den lokalen SMTP-Server
EMAIL_USE_TLS = False
EMAIL_USE_SSL = False