Django APPs:

# Shortcode
python3 manage.py startapp shortcode

# Analytics
python3 manage.py startapp analytics

# Geo-Targeting
python3 manage.py startapp geotargeting

# Tracking AI
python3 manage.py startapp trackingai
# Link in Bio
python3 manage.py startapp linkinbio

# WebClickTracker
python3 manage.py startapp webclicktracker

# products
python manage.py startapp products

# contentpages
python manage.py startapp contentpages

# Acounts
python manage.py startapp accounts

# Link in Bio Seite
    Neues Module

# Campaign
https://support.bitly.com/hc/en-us/articles/115001195167

# Django CMD
python3 manage.py makemigrations && python3 manage.py migrate

python3 manage.py runserver

python3 manage.py runserver 0.0.0.0:8000

python manage.py collectstatic
python manage.py createsuperuser

python3 manage.py startapp APP_NAME

python manage.py compress

# Pip
pip freeze > requirements.txt
pip install -r requirements.txt

pip3 uninstall 

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
    git push origin linkinbio

# Überstzung
- python manage.py makemessages -l de
- python manage.py makemessages -l en
- python manage.py compilemessages

    - from django.utils.translation import gettext_lazy as _
    - {% trans "Welcome" %}
    
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

# Coding Guidelines


# BUG LISTE
- Tags nur für User Anzeigen !erledigt
- Tags nach dem Erstellen laden. !erleding
- Archive keine ansicht für user. !erleding
- Archive rückganig machen. !erleding
- Shorcode Löschen. !erleding
- Abrufen von mÖglichkeiten in der URL View !erldeigt
    limitation, Android Targeting, Ios Targeting BETA Version GEO Targeting !erldeigt
- Überstzung einbauen !erldeigt
- Überszungssetings Ansicht aktuelle sprache anzeigen. !erldeigt
- Startseite ist nicht erreichbar !erldeigt
- Formular Shorcoe auf ES6 Umschreiben
- LinkInBio List für Fehler in Javascript
- Menü Shorcode
- Automasticher Tags bei link in bio Seite und in Shorcode Extra Makieren

# ToDos Liste
- 
    - Push
    git add .
    git commit -m '_text'
    git push origin linkinbio

    - Crate Script adjustment
    - Add Image !erledingt
    - Remove Image !erledingt
    - Image View !erledingt
    - Crate and titel, description !erledingt
    - Add Social media and Remove Social media * adjustmentSocial.js --> !erledingt
    - Fonts * adjustmentFonts.js 
    - Color Button * adjustmentColor.js !erldeigt



- Stripe Verkaufsseiten 1 Preis und keine Monadliche Zahlung maximal 90 Euro im Jahr.
    - @https://stripe.com/docs/checkout/quickstart
    - Payment Intigrieren 
        Stipe einbinden und alle Formular bereistellen. !erldeigt
        Frontend-Anpassungen !erldeigt
        Stripe-Zahlungsverarbeitung !erldeigt
        Erstellen Sie Abonnements !erldeigt
        Benutzerprofil aktualisieren !erldeigt
        E-Mail-Benachrichtigungen 
        Verwaltung von Abonnements


- Neues Module Pages
    - Update Anpassungen Header !erledigt
    - Update Header Menü erstellen !erledigt --> https://codingyaar.com/bootstrap-navbar-button-right/
    - Models überstzebar machen !erledigt
    - Bug Überstzung seiten !erledigt --> https://pypi.org/project/django-translations/
    - Hero Pages !erledigt
    - Marketing Section Pages !erledigt
    - Django's Flatpages App !erldeigt
    
    - Home Page und Pages HTML, css zusammen fühgen !erleding
    - Menus auf Home seite einbinden !erleding
    - Bilder Verkleinern auf Home !erleding
    - Texte anpssen auf der Startseite !erleding
    - Login Prüfen Designe !erleding
    - Überszung Prüfen !erleding
    - Mobile Prüfen !erleding
    - Cookie für Überszung Prüfen final !erleding
    - Cookie Banner
        - Cookie Banner für normale Seiten Desing erstellt. erleding
        - Definition der Cookie-Einstellungen erleding
            Notwendige Cookies erleding
            Analyse-Cookies erleding
            Marketing-Cookies erleding

        - Cookie Model 
            Speichern nach User das Jeder User sein Cookie einstellung erstellen kann.

        -  Cookie-Präferenzen speichern
            Banner Cookie-Typen sie akzeptieren oder ablehnen möchten

        - Abrufen von JavaScript-Dateien serverseitig oder normal
            Facebook Script
            Google Tag Manger
            Analytics

        - Design und Funktion
            Normales Banner zum auswälen welche daten man speichern kann.

    - @ToDo Link in Bio
        * Link in Bio Module erleding
            - user
            - Links erstellen und verbinden erledigt
            - Link liste anzeigen und sortieren erledigt
            - sozialen Crate und View erledigt
                Facebook
                Instagram
                YouTube
                Vimeo
                Xing
                LinkedIn
                Pinterest
                Twitter
                Twitch
                TikTok
                Reddit
                Tumblr
                Snapchat
                Discord
            - sozialen löschen
            - Image Profile
            - Image Hinteregund
            - Titel
            - Beschreibung

        + links
            - Name link
            - selection links
            - Datum wie lange Verfühgbar

        + Crate neuen link
            - Datum wie lange Verfügbar

        + Style
            color
            font
        - LinkInBio mit Shorcode Vergnüpfen
        - Performens Treching analyse
        - Clicks nach Buttton Label
        - Clicks Country 
        - Clicks City
        - Clicks Referrer
        - clicks Device

# Google Sheets
- https://pypi.org/project/django-gsheets/

# QR-Code
    Neues Module

# Bug liste
- Einzelansicht Profile Eisntellungs seite Formular die ID noch einfühgen das immer der Richtige name kommt.
- Logo & Favicon austauschen !erledigt
- User Type zum Model hinzufühgen
- Analytics Dahboard Anpssen
- IP Gefärliche IP Sicherung einbauen --> https://chat.openai.com/c/f6d2978c-6cb7-44ba-9c1b-918ee67a37b0
- E-Mail Bestätigung und Passwort zurück stezen.
- Externe Doamin Testen wen die Server einstellungen stimmen.
- Notweiterleitung unter Profile Einstellungen
- first cklick in der Analyse und im Targeting

- Anwendungen text seiten neues Module für SEO ready
- Link speeren

# Stripe Webhook

stripe listen --forward-to http://localhost:8000/products/stripe-webhook/

stripe login
https://stripe.com/docs/payments/quickstart

#  Webhook Softwar 
- https://dashboard.ngrok.com/settings

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

# Sontiges
https://www.chartjs.org/docs/latest/charts/bar.html
https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery
https://www.bl.ink/blog/how-blink-uses-short-links

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




rm accounts/migrations/*
rm analytics/migrations/*
rm contentpages/migrations/*
rm geotargeting/migrations/*
rm linkinbio/migrations/*
rm products/migrations/*
rm shortcode/migrations/*
rm webclicktracker/migrations/*