import os
import environ
from pathlib import Path

# from .language_middleware import LanguageMiddleware
from django.utils.translation import gettext_lazy as _


BASE_DIR = Path(__file__).resolve().parent.parent
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'ngrok-free.app', '1442-185-58-55-54.ngrok-free.app']

env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

DEBUG = env('DEBUG')

SECRET_KEY = env('SECRET_KEY')

import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.flatpages',
    'compressor',
    'compressor_toolkit',
    'translations',
    
    #Party
    'rest_framework',
    'rest_framework.authtoken',
    'taggit',
    'fontawesomefree',
    'corsheaders',
    'crispy_forms',
    "crispy_bootstrap4",
    'django_hosts',
    'ckeditor',

    #apps
    'shortcode',
    'accounts',
    'analytics',
    'webclicktracker',
    'linkinbio',
    'geotargeting',
    'products',
    'contentpages',
]

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework.authentication.TokenAuthentication',
#         'rest_framework.authentication.BasicAuthentication',
#         'rest_framework.authentication.SessionAuthentication',
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.IsAuthenticated',
#     ],
# }

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
]

# MIDDLEWARE_CLASSES = (
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.common.CommonMiddleware',
# )

# CORS_ORIGIN_WHITELIST = [
#     'http://localhost:3000',
#     'http://127.0.0.1:8000'
# ]

ROOT_URLCONF = 'src.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['Link'],
            ['NumberedList', 'BulletedList'],
            ['RemoveFormat'],
            ['Source'],
        ],
    },
}

# DATETIME_INPUT_FORMATS = [
#     '%d.%m.%Y %H:%M',  # Füge hier das gewünschte Format hinzu
# ]

WSGI_APPLICATION = 'src.wsgi.application'

DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000

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

gettext = lambda s: s
LANGUAGES = [
    ('de', _('German')),
    ('en', _('English')),
]
# MODELTRANSLATION_DEFAULT_LANGUAGE = 'de'
# MODELTRANSLATION_LANGUAGES = ('de', 'en')

# MODELTRANSLATION_TRANSLATION_FILES = (
#     'contentpages.translation',
# )

MODELTRANSLATION_CUSTOM_FIELDS = ('subline')

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),  # Das Verzeichnis, in dem Übersetzungsdateien gespeichert werden
]

CORS_ORIGIN_ALLOW_ALL = True   

TIME_ZONE = 'Europe/Berlin'

LANGUAGE_CODE = 'de'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

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

STRIPE_PUBLISHABLE_KEY="pk_test_kvxLMnvuKeiFE7Z2i8Lx5DnD007eHlPfx0"
STRIPE_SECRET_KEY = 'sk_test_8jUKcqcX0kSvJXgrRmQUVGdk00BMWYxnWX'

SITE_ID = 4
USE_I18N = True
USE_L10N = True


STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.DefaultStorageFinder',
    'compressor.finders.CompressorFinder'
)
STATIC_FINDERS= STATICFILES_FINDERS

COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter',
    'compressor.filters.template.TemplateFilter',
]
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter',
]
COMPRESS_PRECOMPILERS = (
    ('module', 'compressor_toolkit.precompilers.ES6Compiler'),
    ('text/x-scss', 'compressor_toolkit.precompilers.SCSSCompiler'),
    ('OUTPUT_DIR', 'static/dist/'),
)
COMPRESS_ENABLED = True
