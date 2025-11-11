from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from myapp.models import Language, Prediction, Settings

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
def get_numbers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        numbers_data = Settings.objects.filter()
        if not numbers_data:
            new_data = Settings(o_number = 20, language = "ru")
            new_data.save()
            numbers_data = Settings.objects.filter()
        result = []
        for entry in numbers_data:
            settings_instance = {}
            settings_instance["o_number"] = entry.o_number
            settings_instance["language"] = entry.language
            result.append(settings_instance)
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def set_special_cell(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        user_id = request.GET.get("user_id")
        game_id = request.GET.get("game_id")
        special_cell = request.GET.get("special_cell")
        prediction_data = Prediction.objects.filter(user_id = user_id, game_id = game_id)
        if not prediction_data:
            new_prediction_data = Prediction(user_id = user_id, game_id = game_id, cell = special_cell)
            new_prediction_data.save()
        else:
            prediction_data = Prediction.objects.get(user_id = user_id, game_id = game_id)
            prediction_data.cell = special_cell
            prediction_data.save()
        return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_special_cells(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        prediction_data = Prediction.objects.filter(game_id = game_id)
        if not prediction_data:
            return JsonResponse({"message": "No cell"})
        else:
            result = []
            for entry in prediction_data:
                answer_instance = {}
                answer_instance["user_id"] = entry.user.pk
                answer_instance["user_name"] = entry.user.username
                answer_instance["cell"] = entry.cell
                result.append(answer_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_translation(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        word = request.GET.get("word")
        word_data = Language.objects.get(ru=word)
        if not word_data:
            return JsonResponse({"message": "No word"})
        else:
            result = []
            result.append(word_data.en)
            result.append(word_data.uz)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})