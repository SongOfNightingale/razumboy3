import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from myapp.models import Battlefield, Game, Queue
from django.contrib.auth.models import User

@csrf_exempt
def save_fleet_layout(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode('utf-8'))
            game = body.get("game")  # required
            ships_data = body.get("ships_data")

            if not game or not ships_data:
                return JsonResponse({"message": "Missing data"}, status=400)

            game = Game.objects.get(id=game)

            layout = Battlefield.objects.create(
                game=game,
                ships_data=ships_data
            )

            return JsonResponse({"message": "Fleet saved", "fleet_id": layout.id})

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    
    return JsonResponse({"message": "Invalid request method"}, status=405)

@csrf_exempt
def load_fleet_layout(request):
    if request.method == "GET":
        try:
            game_id = request.GET.get("game_id")
            layout = Battlefield.objects.filter(game=game_id).first()
            if not layout:
                return JsonResponse([], safe=False)

            return JsonResponse({
                "ships_data": layout.ships_data,
                "revealed_water": layout.revealed_water or ""
            })

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    return JsonResponse({"message": "Invalid method"}, status=405)

@csrf_exempt
def update_fleet_layout(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            game_id = data.get("game")
            ships_data = data.get("ships_data")
            revealed_water = data.get("revealed_water")
            game = Game.objects.get(pk=game_id)

            layout = Battlefield.objects.filter(game=game).first()
            if not layout:
                return JsonResponse({"message": "No layout found"}, status=404)

            layout.ships_data = ships_data
            layout.revealed_water = revealed_water
            layout.save()

            return JsonResponse({"message": "Layout updated"})

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    return JsonResponse({"message": "Invalid method"}, status=405)

@csrf_exempt
def save_queue(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
            game_id = body.get("game_id")
            names = body.get("names", [])
            current = body.get("current")

            game = Game.objects.get(pk=game_id)

            for order, name in enumerate(names):
                username = User.objects.get(username=name)
                layout, created = Queue.objects.get_or_create(game=game, team=username)
                layout.order = order + 1
                layout.current = current
                layout.save()

            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    return JsonResponse({"message": "Invalid method"}, status=405)

@csrf_exempt
def save_current(request):
    if request.method == "GET":
        try:
            game_id = request.GET.get("game_id")
            current = request.GET.get("current")
            game = Game.objects.get(pk=game_id)
            layout = Queue.objects.filter(game=game)
            for entry in layout:
                entry.current = current
                entry.save()
            return JsonResponse([], safe=False)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    return JsonResponse({"message": "Invalid method"}, status=405)

@csrf_exempt
def get_queue(request):
    if request.method == "GET":
        try:
            game_id = request.GET.get("game_id")
            layout = Queue.objects.filter(game=game_id)
            if not layout:
                return JsonResponse({"message": "No order"})
            else:
                result = []
                for entry in layout:
                    name = User.objects.get(username = entry.team)
                    order_instance = {}
                    order_instance["username"] = name.username
                    order_instance["order"] = entry.order
                    order_instance["id"] = name.pk
                    order_instance["current"] = entry.current
                    result.append(order_instance)
                return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    return JsonResponse({"message": "Invalid method"}, status=405)