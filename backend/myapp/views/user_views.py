from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

# Create your views here.

@csrf_exempt
def add_user(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        username = request.GET.get("username")
        password = request.GET.get("password")
        role = request.GET.get("role")
        try:
            user_data = User.objects.get(username = username)
            return JsonResponse({"message": "User already exists"})
        except User.DoesNotExist:
            if role == 'admin':
                is_superuser = 1
                is_staff = 1
                is_active = 1
            elif role == 'host':
                is_superuser = 1
                is_staff = 0
                is_active = 1
            elif role == 'tv':
                is_superuser = 0
                is_staff = 1
                is_active = 1
            else:
                is_superuser = 0
                is_staff = 0
                is_active = 0
            new_user_data = User(username = username, is_superuser = is_superuser, is_staff = is_staff, is_active = is_active)
            new_user_data.set_password(password)
            new_user_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_all_users(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        user_data = User.objects.all()
        if not user_data:
            return JsonResponse({"message": "No users"})
        else:
            result = []
            for entry in user_data:
                user_instance = {}
                user_instance["id"] = entry.pk
                user_instance["username"] = entry.username
                if(entry.is_superuser == 1 and entry.is_staff == 1):
                    user_instance["role"] = "admin"
                elif(entry.is_superuser == 0 and entry.is_staff == 1):
                    user_instance["role"] = "tv"
                elif(entry.is_superuser == 1 and entry.is_staff == 0):
                    user_instance["role"] = "host"
                else:
                    user_instance["role"] = "player"
                user_instance["is_active"] = entry.is_active
                result.append(user_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def update_user(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        new_username = request.GET.get("new_username")
        old_username = request.GET.get("old_username")
        password = request.GET.get("password")
        if new_username == old_username:
            user_data = User.objects.get(username=old_username)
            user_data.set_password(password)
            user_data.save()
            return JsonResponse({"message": "Data updated"})
        else:
            try:
                user_data = User.objects.get(username=new_username)
                return JsonResponse(
                    {"message": "The chosen name already exists. Please choose a new name."}
                )
            except User.DoesNotExist:
                user_data = User.objects.get(username=old_username)
                user_data.username = new_username
                user_data.set_password(password)
                user_data.save()
                return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def delete_user(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        username = request.GET.get("username")
        try: 
            user_data = User.objects.get(username=username)       
            user_data.delete()
            return JsonResponse({"message": "Data updated"})
        except User.DoesNotExist:
            return JsonResponse({"message": "User doesn't exist"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_all_game_users(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        user_data = User.objects.filter(is_active = 1)
        if not user_data:
            return JsonResponse({"message": "No users"})
        else:
            result = []
            for entry in user_data:
                user_instance = {}
                user_instance["id"] = entry.pk
                user_instance["username"] = entry.username
                if(entry.is_superuser == 1 and entry.is_staff == 1):
                    user_instance["role"] = "admin"
                elif(entry.is_superuser == 0 and entry.is_staff == 1):
                    user_instance["role"] = "tv"
                elif(entry.is_superuser == 1 and entry.is_staff == 0):
                    user_instance["role"] = "host"
                else:
                    user_instance["role"] = "player"
                user_instance["is_active"] = entry.is_active
                if user_instance["role"] == "player" and user_instance["is_active"] == 1:
                    result.append(user_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def change_user_status(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        user_id = request.GET.get("user_id")
        is_active = request.GET.get("is_active")
        try:
            user_data = User.objects.get(pk=user_id)
            user_data.is_active = is_active
            user_data.save()
            return JsonResponse({"message": "Data updated"})
        except User.DoesNotExist:
            return JsonResponse({"message": "No user exists"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def login(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        username = request.GET.get("username")
        password = request.GET.get("password")

        user = authenticate(username = username, password = password)

        if user is not None:
            user_data = User.objects.get(username = username)
            result = []
            result.append(user_data.is_superuser)
            result.append(user_data.is_staff)
            result.append(user_data.pk)
            result.append(user_data.username)
            return JsonResponse(result, safe=False)
        else:
            return JsonResponse({"message": "Invalid username or password"})
    except Exception as e:
            return JsonResponse({"message": e})