import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from myapp.models import Language, Prediction, Settings

@csrf_exempt
def update_numbers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        settingsData = json.loads(request.body)
        numbers_data = Settings.objects.get()
        numbers_data.language = settingsData.get("language")
        numbers_data.fieldRows = settingsData.get("fieldRows")
        numbers_data.fieldColumns = settingsData.get("fieldColumns")
        numbers_data.ships6 = settingsData.get("ships6")
        numbers_data.ships5 = settingsData.get("ships5")
        numbers_data.ships4 = settingsData.get("ships4")
        numbers_data.ships3 = settingsData.get("ships3")
        numbers_data.ships2 = settingsData.get("ships2")
        numbers_data.ships1 = settingsData.get("ships1")
        numbers_data.shipSurprise = settingsData.get("shipSurprise")
        numbers_data.shipDoubleBarrel = settingsData.get("shipDoubleBarrel")
        numbers_data.shipReverse = settingsData.get("shipReverse")
        numbers_data.shipMove5 = settingsData.get("shipMove5")
        numbers_data.shipMove3 = settingsData.get("shipMove3")
        numbers_data.shipKaraoke = settingsData.get("shipKaraoke")
        numbers_data.shipCastling = settingsData.get("shipCastling")
        numbers_data.shipBonus5 = settingsData.get("shipBonus5")
        numbers_data.shipBonus3 = settingsData.get("shipBonus3")
        numbers_data.shipBonus1 = settingsData.get("shipBonus1")
        numbers_data.shipPenalty5 = settingsData.get("shipPenalty5")
        numbers_data.shipPenalty3 = settingsData.get("shipPenalty3")
        numbers_data.shipPenalty1 = settingsData.get("shipPenalty1")
        numbers_data.shipSong = settingsData.get("shipSong")
        numbers_data.shipSonar = settingsData.get("shipSonar")
        numbers_data.shipEvenBonus = settingsData.get("shipEvenBonus")
        numbers_data.shipOddBonus = settingsData.get("shipOddBonus")
        numbers_data.shipSpecialTour = settingsData.get("shipSpecialTour")
        numbers_data.shipJackpot = settingsData.get("shipJackpot")
        numbers_data.shipTax = settingsData.get("shipTax")
        numbers_data.pointsSong = settingsData.get("pointsSong")
        numbers_data.pointsSpecialTour = settingsData.get("pointsSpecialTour")
        numbers_data.taxPercent = settingsData.get("taxPercent")
        numbers_data.pointsPrediction = settingsData.get("pointsPrediction")
        numbers_data.penaltyMine = settingsData.get("penaltyMine")
        numbers_data.save()
        return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": str(e)})
    
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
            settings_instance["language"] = entry.language
            settings_instance["fieldRows"] = entry.fieldRows
            settings_instance["fieldColumns"] = entry.fieldColumns
            settings_instance["ships6"] = entry.ships6
            settings_instance["ships5"] = entry.ships5
            settings_instance["ships4"] = entry.ships4
            settings_instance["ships3"] = entry.ships3
            settings_instance["ships2"] = entry.ships2
            settings_instance["ships1"] = entry.ships1
            settings_instance["shipSurprise"] = entry.shipSurprise
            settings_instance["shipDoubleBarrel"] = entry.shipDoubleBarrel
            settings_instance["shipReverse"] = entry.shipReverse
            settings_instance["shipMove5"] = entry.shipMove5
            settings_instance["shipMove3"] = entry.shipMove3
            settings_instance["shipKaraoke"] = entry.shipKaraoke
            settings_instance["shipCastling"] = entry.shipCastling
            settings_instance["shipBonus5"] = entry.shipBonus5
            settings_instance["shipBonus3"] = entry.shipBonus3
            settings_instance["shipBonus1"] = entry.shipBonus1
            settings_instance["shipPenalty5"] = entry.shipPenalty5
            settings_instance["shipPenalty3"] = entry.shipPenalty3
            settings_instance["shipPenalty1"] = entry.shipPenalty1
            settings_instance["shipSong"] = entry.shipSong
            settings_instance["shipSonar"] = entry.shipSonar
            settings_instance["shipEvenBonus"] = entry.shipEvenBonus
            settings_instance["shipOddBonus"] = entry.shipOddBonus
            settings_instance["shipSpecialTour"] = entry.shipSpecialTour
            settings_instance["shipJackpot"] = entry.shipJackpot
            settings_instance["shipTax"] = entry.shipTax
            settings_instance["pointsSong"] = entry.pointsSong
            settings_instance["pointsSpecialTour"] = entry.pointsSpecialTour
            settings_instance["taxPercent"] = entry.taxPercent
            settings_instance["pointsPrediction"] = entry.pointsPrediction
            settings_instance["penaltyMine"] = entry.penaltyMine
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
        variant = request.GET.get("variant")
        prediction_data = Prediction.objects.filter(user_id = user_id, game_id = game_id)
        if not prediction_data:
            if variant == '1':
                new_prediction_data = Prediction(user_id = user_id, game_id = game_id, cell = special_cell, special = 0)
                new_prediction_data.save()
            elif variant == '2':
                new_prediction_data = Prediction(user_id = user_id, game_id = game_id, cell_two = special_cell, special = 0)
                new_prediction_data.save()
        else:
            prediction_data = Prediction.objects.get(user_id = user_id, game_id = game_id)
            if variant == '1':
                prediction_data.cell = special_cell
                prediction_data.special = 0
            elif variant == '2':
                prediction_data.cell_two = special_cell
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
                answer_instance["cell_two"] = entry.cell_two
                answer_instance["special"] = entry.special
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