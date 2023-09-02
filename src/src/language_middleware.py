from django.utils.translation import activate

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Lese die ausgewählte Sprache aus dem Cookie (z.B., "language")
        selected_language = request.COOKIES.get("language")

        # Debug-Ausgabe hinzufügen
        print(f"LanguageMiddleware is activated. Selected language: {selected_language}")

        # Aktiviere die Übersetzung für die ausgewählte Sprache
        if selected_language:
            activate(selected_language)

        response = self.get_response(request)
        return response