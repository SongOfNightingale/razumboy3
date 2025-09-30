from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from myapp.models import ProvisionalAnswer, Question, UserAnswer

@csrf_exempt
def get_user_answers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_id = request.GET.get("questions_id")
        game_id = request.GET.get("game_id")
        answer_data = UserAnswer.objects.filter(question_id=question_id, game_id=game_id)
        if not answer_data:
            return JsonResponse({"message": "No answers"})
        else:
            result = []
            for entry in answer_data:
                answer_instance = {}
                answer_instance["id"] = entry.pk
                answer_instance["text"] = entry.text
                answer_instance["time"] = entry.time
                answer_instance["team"] = entry.user.username
                answer_instance["team_id"] = entry.user.pk
                answer_instance["is_correct"] = entry.is_correct
                answer_instance["question"] = entry.question.pk
                answer_instance["checked"] = entry.checked
                answer_instance["questionNumber"] = entry.questionNumber
                result.append(answer_instance)
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def assign_answer_points(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        question_id = request.GET.get("question_id")
        team = request.GET.get("team")
        is_correct = request.GET.get("is_correct")
        points = request.GET.get("points")
        checked = request.GET.get("checked")
        user_data = User.objects.get(username = team)
        answer_data = UserAnswer.objects.get(question_id = question_id, game_id = game_id, user_id = user_data.pk)
        if not answer_data:
            return JsonResponse({"message": "No answer exist"})
        else:
            answer_data.is_correct = is_correct
            answer_data.points = points
            answer_data.checked = checked
            answer_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def set_user_answer(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        text = request.GET.get("text")
        game_id = request.GET.get("game_id")
        question_id = request.GET.get("question_id")
        user_id = request.GET.get("user_id")
        sync = request.GET.get("sync")
        try:
            answer_data = UserAnswer.objects.get(game_id = game_id, question_id = question_id, user_id = user_id)
            return JsonResponse({"message": "Answer already exists"})
        except UserAnswer.DoesNotExist:
            question_data = Question.objects.get(pk = question_id)
            current_date = datetime.now()
            if sync == "1":                
                time_difference = current_date.replace(tzinfo=None) - question_data.start_time.replace(tzinfo=None)
            else:
                print(current_date.replace(tzinfo=None) - question_data.start_time.replace(tzinfo=None))
                print(timedelta(seconds=int(sync)))
                time_difference = current_date.replace(tzinfo=None) - question_data.start_time.replace(tzinfo=None)
            new_answer_data = UserAnswer(text = text, time = str(time_difference), game_id = game_id, question_id = question_id, user_id = user_id)
            new_answer_data.save()
            new_data = UserAnswer.objects.filter(game_id = game_id, question_id = question_id).values_list('pk', flat=True).order_by('pk')
            rank = list(new_data).index(new_answer_data.pk)
            result = []
            result.append(str(time_difference))
            result.append(rank + 1)
            return JsonResponse(result, safe=False) 
    except Exception as e:
        print(e)
        return JsonResponse({"message": e})
    
@csrf_exempt
def set_provisional_answer(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        text = request.GET.get("text")
        game_id = request.GET.get("game_id")
        question_id = request.GET.get("question_id")
        user_id = request.GET.get("user_id")
        try:
            answer_data = ProvisionalAnswer.objects.get(game_id = game_id, question_id = question_id, user_id = user_id)
            answer_data.text = text
            answer_data.save()
        except ProvisionalAnswer.DoesNotExist:
            new_answer_data = ProvisionalAnswer(text = text, game_id = game_id, question_id = question_id, user_id = user_id)
            new_answer_data.save()
        return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_provisional_answer(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        question_id = request.GET.get("question_id")
        user_id = request.GET.get("user_id")
        try:
            answer_data = ProvisionalAnswer.objects.get(game_id = game_id, question_id = question_id, user_id = user_id)
            result = []
            result.append(answer_data.text)
            return JsonResponse(result, safe=False)
        except ProvisionalAnswer.DoesNotExist:
            return JsonResponse({"message": "Answer doesn't exist"})
    except Exception as e:
        return JsonResponse({"message": e})

@csrf_exempt
def get_all_game_answers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        answer_data = UserAnswer.objects.filter(game_id=game_id)
        if not answer_data:
            return JsonResponse({"message": "No answers"})
        else:
            result = []
            for entry in answer_data:
                answer_instance = {}
                answer_instance["id"] = entry.pk
                answer_instance["text"] = entry.text
                answer_instance["time"] = entry.time
                answer_instance["team"] = entry.user.username
                answer_instance["is_correct"] = entry.is_correct
                answer_instance["points"] = entry.points
                answer_instance["questionNumber"] = entry.questionNumber
                answer_instance["question"] = entry.question.pk
                answer_instance["checked"] = entry.checked
                result.append(answer_instance)
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def delete_user_answer(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        question_id = request.GET.get("question_id")
        user_id = request.GET.get("user_id")
        try:
            answer_data = UserAnswer.objects.filter(game_id = game_id, question_id = question_id, user_id = user_id)
            answer_data.delete()
            return JsonResponse({"message": "Data updated"})
        except UserAnswer.DoesNotExist:
            return JsonResponse({"message": "Answer doesn't exist"})
    except Exception as e:
        print(e)
        return JsonResponse({"message": e})
    
@csrf_exempt
def delete_user_answer_by_id(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        answer_id = request.GET.get("answer_id")
        try:
            answer_data = UserAnswer.objects.filter(pk = answer_id)
            answer_data.delete()
            return JsonResponse({"message": "Data updated"})
        except UserAnswer.DoesNotExist:
            return JsonResponse({"message": "Answer doesn't exist"})
    except Exception as e:
        print(e)
        return JsonResponse({"message": e})
    
@csrf_exempt
def zero_user_answer(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        game_id = request.GET.get("game_id")
        question_id = request.GET.get("question_id")
        user_id = request.GET.get("user_id")
        try:
            answer_data = UserAnswer.objects.get(game_id = game_id, question_id = question_id, user_id = user_id)
            answer_data.points = 0
            answer_data.save()
            return JsonResponse({"message": "Data updated"})
        except UserAnswer.DoesNotExist:
            return JsonResponse({"message": "Answer doesn't exist"})
    except Exception as e:
        print(e)
        return JsonResponse({"message": e})