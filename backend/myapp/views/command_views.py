from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from myapp.models import Commands

# Create your views here.

@csrf_exempt
def set_command(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        command = request.GET.get("command")
        number = request.GET.get("number")
        commands = Commands.objects.get(pk = 1)
        if not commands:
            return JsonResponse({"message": "No commands"})
        else:
            if number == '1':
                commands.player = command
            elif number == '2':
                commands.host = command
            elif number == '3':
                commands.tv = command
            elif number == '4':
                commands.player = command
                commands.host = command
            elif number == '5':
                commands.player = command
                commands.tv = command
            elif number == '6':
                commands.host = command
                commands.tv = command
            elif number == '7':
                commands.player = command
                commands.host = command
                commands.tv = command
            elif number == '8':
                commands.admin = command
            commands.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_command(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        commands = Commands.objects.get(pk = 1)
        if not commands:
            return JsonResponse({"message": "No commands"})
        else:
            result = []
            result.append(commands.player)
            result.append(commands.tv)
            result.append(commands.host)
            result.append(commands.admin)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})