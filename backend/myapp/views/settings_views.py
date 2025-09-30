from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from myapp.models import Settings

@csrf_exempt
def update_numbers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        o_number = request.GET.get("o_number")
        language = request.GET.get("language")
        numbers_data = Settings.objects.get()
        if o_number != 0:
            numbers_data.o_number = o_number
        numbers_data.language = language
        numbers_data.save()
        return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def update_special(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        special = request.GET.get("special")
        numbers_data = Settings.objects.get()
        numbers_data.special = special
        numbers_data.save()
        return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_numbers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        numbers_data = Settings.objects.filter()
        if not numbers_data:
            new_data = Settings(o_number = 20, language = "ru", special = 0)
            new_data.save()
            numbers_data = Settings.objects.filter()
        result = []
        for entry in numbers_data:
            settings_instance = {}
            settings_instance["o_number"] = entry.o_number
            settings_instance["language"] = entry.language
            settings_instance["special"] = entry.special
            result.append(settings_instance)
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})