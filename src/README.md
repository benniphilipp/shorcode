Django APPs:

# Shortcode

# Analytics

# Geo-Targeting
python3 manage.py startapp geotargeting

# Tracking AI
python3 manage.py startapp trackingai
# Link in Bio
python3 manage.py startapp linkinbio

# WebClickTracker
webclicktracker

# products
python manage.py startapp products

# Campaign
https://support.bitly.com/hc/en-us/articles/115001195167

# User
    email
    passwort

# Django CMD
python3 manage.py makemigrations && python3 manage.py migrate

python3 manage.py runserver

python3 manage.py runserver 0.0.0.0:8000

python manage.py collectstatic
python manage.py createsuperuser

python3 manage.py startapp APP_NAME

# Pip
pip freeze > requirements.txt
pip install -r requirements.txt

# Server
sudo reboot

source myprojectenv/bin/activate
python manage.py clearcache

# ENV
. env/bin/activate
. myprojectenv/bin/activate

# Github

    - Branrch
    git branch --list
    git branch _name
    git checkout _name

    - Push
    git add .
    git commit -m '_text'
    git push origin create

# Überstzung
- python manage.py makemessages -l de
- python manage.py compilemessages

    - from django.utils.translation import gettext_lazy as _

# SMPTP

python -m smtpd -n -c DebuggingServer localhost:1025

# Test Nutzer
@name
ben@mail.de
&2NNe%qy^vIjtjy6

1ben@web.de
&2NNe%qy^vIjtjy6

pw@web.de
&2NNe%qy^vIjtjy6

benniph86@gmail.com
TqXRm5ikowzmYtZVyCMC

# Framworks
https://apexcharts.com/features/

# API View
website_title
website_url
referrer
ip_address
os
device
browser

# Facebook
https://developers.facebook.com/docs/meta-pixel/reference#standard-events

# Sontiges
https://www.chartjs.org/docs/latest/charts/bar.html
https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery

# Bilder Suche
https://www.freepik.com/author/vectorjuice

# Vertrieb
https://www.capterra.com/
https://www.producthunt.com/
https://appsumo.com/
https://saaspirate.com/
https://saasmantra.com/partners
https://dealmirror.com/
https://pitchground.com/
https://www.rockethub.com/
https://saaszilla.co/
https://www.capterra.com/
https://saasmantra.com/partners

# APIs
https://www.geonames.org/export/web-services.html
https://urlhaus.abuse.ch/api/#submit

#  Google Suche
https://www.google.com/search?q=kurzlinks+erstellen&sca_esv=561558033&sxsrf=AB5stBhFKA56I66QGdIKmpFzQw_tkpVo2w:1693472575130&ei=P1fwZPq2B4eFxc8P3tGB8Aw&start=0&sa=N&ved=2ahUKEwi60pv6xIaBAxWHQvEDHd5oAM44ChDy0wN6BAgKEAQ&biw=2216&bih=1125&dpr=2


# BUG LISTE 2.09.23
- Tags nur für User Anzeigen !erledigt
- Tags nach dem Erstellen laden. !erleding
- Archive keine ansicht für user. !erleding
- Archive rückganig machen. !erleding
- Shorcode Löschen. !erleding


- Abrufen von mÖglichkeiten in der URL View !erldeigt
    limitation, Android Targeting, Ios Targeting BETA Version GEO Targeting !erldeigt


- Überstzung einbauen !erldeigt
- Überszungssetings Ansicht aktuelle sprache anzeigen. !erldeigt

- Startseite ist nicht erreichbar

- Payment Intigrieren 
    Stipe einbinden und alle Formular bereistellen. !erldeigt
    Frontend-Anpassungen !erldeigt
    Stripe-Zahlungsverarbeitung
    Erstellen Sie Abonnements
    Benutzerprofil aktualisieren
    E-Mail-Benachrichtigungen
    Verwaltung von Abonnements


- Einzelansicht User die ID noch einfühgen das immer der Richtige name kommt.
- Logo & Favicon austauschen 
- Analytics Dahboard Anpssen
- IP Gefärliche IP Sicherung einbauen
- E-Mail Verdenden
- QR Code


# Stripe Webhook

stripe listen --forward-to http://localhost:8000/products/stripe-webhook/


https://stripe.com/docs/payments/quickstart
