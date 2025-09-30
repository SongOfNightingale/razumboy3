from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from myapp.models import Answer, Game, Question

@csrf_exempt
def get_all_games(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        games_data = Game.objects.all()
        if not games_data:
            return JsonResponse({"message": "No games"})
        else:
            result = []
            for entry in games_data:
                games_instance = {}
                games_instance["id"] = entry.pk
                games_instance["name"] = entry.name
                games_instance["is_active"] = entry.is_active
                games_instance["start_time"] = entry.start_time
                games_instance["created"] = entry.created
                games_instance["updated"] = entry.updated
                result.append(games_instance)
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def add_game(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_name = request.GET.get("game_name")
        current_date = datetime.now()
        new_game_data = Game(name = game_name, is_active = 0, created = current_date, updated = current_date)
        new_game_data.save()
        return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def start_game(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        game_data = Game.objects.get(pk=game_id)
        if not game_data:
            return JsonResponse({"message": "No game exists"})
        else:
            current_date = datetime.now()
            game_data.is_active = 1
            game_data.start_time = current_date
            game_data.updated = current_date
            game_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def clone_game(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        game_data = Game.objects.get(pk=game_id)
        if not game_data:
            return JsonResponse({"message": "No game exists"})
        else:
            current_date = datetime.now()
            new_game_data = Game(name = game_data.name, is_active = 0, created = current_date, updated = current_date)
            new_game_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def end_game(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        game_data = Game.objects.get(pk=game_id)
        if not game_data:
            return JsonResponse({"message": "No game exists"})
        else:
            current_date = datetime.now()
            game_data.is_active = 0
            game_data.updated = current_date
            game_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def update_game(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        new_game_name = request.GET.get("new_game_name")
        game_data = Game.objects.get(pk=game_id)
        if not game_data:
            return JsonResponse({"message": "No game exists"})
        else:
            current_date = datetime.now()
            game_data.name = new_game_name
            game_data.updated = current_date
            game_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def delete_game(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        try: 
            game_data = Game.objects.get(pk=game_id)   
            game_data.delete()
            return JsonResponse({"message": "Data updated"})
        except Game.DoesNotExist:
            return JsonResponse({"message": "Game doesn't exist"})
    except Exception as e:
        return JsonResponse({"message": e})