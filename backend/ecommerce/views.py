from django.views.generic import View
from django.http import HttpResponse
import os

class FrontendAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(BASE_DIR, '../frontend/build/index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("Build not found!", status=501)
