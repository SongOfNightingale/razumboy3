import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from myapp.models import Penalties, Results

@csrf_exempt
def get_current_results(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        results_data = Results.objects.filter(game_id=game_id)
        if not results_data:
            return JsonResponse({"message": "No answers"})
        else:
            result = []
            for entry in results_data:
                result_instance = {}
                result_instance["id"] = entry.pk
                result_instance["ship_hit_points"] = entry.ship_hit_points
                result_instance["ship_kill_points"] = entry.ship_kill_points
                result_instance["question_points"] = entry.question_points
                result_instance["name"] = entry.user.username
                result_instance["team_id"] = entry.user.pk
                result_instance["bonus_points"] = entry.bonus_points
                result_instance["penalty_points"] = entry.penalty_points
                result.append(result_instance)
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def save_result(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        user_id = request.GET.get("user_id")
        ship_hit_points = request.GET.get("ship_hit_points")
        ship_kill_points = request.GET.get("ship_kill_points")
        question_points = request.GET.get("question_points")        
        bonus_points = request.GET.get("bonus_points")
        penalty_points = request.GET.get("penalty_points")
        try:
            results_data = Results.objects.get(game_id=game_id, user_id=user_id)
            results_data.ship_hit_points = results_data.ship_hit_points + int(ship_hit_points)
            results_data.ship_kill_points = results_data.ship_kill_points + int(ship_kill_points)
            results_data.question_points = results_data.question_points + int(question_points)
            results_data.bonus_points = results_data.bonus_points + int(bonus_points)
            results_data.penalty_points = results_data.penalty_points + int(penalty_points)
            results_data.save()
            return JsonResponse({"message": "Data updated"})
        except Results.DoesNotExist:
            new_results_data = Results(game_id = game_id, user_id = user_id, ship_hit_points = ship_hit_points, ship_kill_points = ship_kill_points, question_points = question_points, bonus_points = bonus_points, penalty_points = penalty_points)
            new_results_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def save_initial_result(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            game_id = data.get("game_id")

            users = User.objects.filter(is_superuser = 0, is_staff = 0, is_active = 1)  # assuming Game has ManyToMany with User

            created = []
            for user in users:
                # only create if not exists already
                result, was_created = Results.objects.get_or_create(
                    game_id=game_id,
                    user_id=user.pk,
                    defaults={
                        "ship_hit_points": 0,
                        "ship_kill_points": 0,
                        "question_points": 0,
                        "bonus_points": 0,
                        "penalty_points": 0,
                    }
                )
                if was_created:
                    created.append(user.username)

            return JsonResponse({"message": f"Initial results created for: {created}"})

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    return JsonResponse({"message": "Invalid method"}, status=405)
    
@csrf_exempt
def update_result(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        user_id = request.GET.get("user_id")
        ship_hit_points = request.GET.get("ship_hit_points")
        ship_kill_points = request.GET.get("ship_kill_points")
        question_points = request.GET.get("question_points")        
        bonus_points = request.GET.get("bonus_points")
        penalty_points = request.GET.get("penalty_points")
        try:
            results_data = Results.objects.get(game_id=game_id, user_id=user_id)
            results_data.ship_hit_points = int(ship_hit_points)
            results_data.ship_kill_points = int(ship_kill_points)
            results_data.question_points = int(question_points)
            results_data.bonus_points = int(bonus_points)
            results_data.penalty_points = int(penalty_points)
            results_data.save()
            return JsonResponse({"message": "Data updated"})
        except Results.DoesNotExist:
            new_results_data = Results(game_id = game_id, user_id = user_id, ship_hit_points = ship_hit_points, ship_kill_points = ship_kill_points, question_points = question_points, bonus_points = bonus_points, penalty_points = penalty_points)
            new_results_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})