from datetime import datetime, timedelta
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from myapp.models import Answer, Current, Question, QuestionType

@csrf_exempt
def get_all_questions(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_data = Question.objects.filter()
        if not question_data:
            return JsonResponse({"message": "No questions"})
        else:
            result = []
            for entry in question_data:
                question_instance = {}
                question_instance["id"] = entry.pk
                question_instance["text"] = entry.text
                question_instance["comment"] = entry.comment
                question_instance["image_link"] = entry.image_link
                question_instance["audio_link"] = entry.audio_link
                question_instance["video_link"] = entry.video_link
                question_instance["type"] = entry.question_type.name
                question_instance["is_active"] = entry.is_active
                question_instance["used"] = entry.used
                question_instance["created"] = entry.created
                question_instance["updated"] = entry.updated
                question_instance["draw"] = entry.draw
                question_instance["time_to_answer"] = entry.time_to_answer
                result.append(question_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_all_game_questions(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_data = Question.objects.filter(draw = 0, is_active = 1)
        if not question_data:
            return JsonResponse({"message": "No questions"})
        else:
            result = []
            for entry in question_data:
                question_instance = {}
                question_instance["id"] = entry.pk
                question_instance["text"] = entry.text
                question_instance["comment"] = entry.comment
                question_instance["image_link"] = entry.image_link
                question_instance["audio_link"] = entry.audio_link
                question_instance["video_link"] = entry.video_link
                question_instance["type"] = entry.question_type.name
                question_instance["is_active"] = entry.is_active
                question_instance["used"] = entry.used
                question_instance["created"] = entry.created
                question_instance["updated"] = entry.updated
                question_instance["time_to_answer"] = entry.time_to_answer
                result.append(question_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_all_draw_questions(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_data = Question.objects.filter(draw = 1, is_active = 1)
        if not question_data:
            return JsonResponse({"message": "No questions"})
        else:
            result = []
            for entry in question_data:
                question_instance = {}
                question_instance["id"] = entry.pk
                question_instance["text"] = entry.text
                question_instance["comment"] = entry.comment
                question_instance["image_link"] = entry.image_link
                question_instance["audio_link"] = entry.audio_link
                question_instance["video_link"] = entry.video_link
                question_instance["type"] = entry.question_type.name
                question_instance["is_active"] = entry.is_active
                question_instance["used"] = entry.used
                question_instance["created"] = entry.created
                question_instance["updated"] = entry.updated
                question_instance["time_to_answer"] = entry.time_to_answer
                result.append(question_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def add_question(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_text = request.GET.get("question_text")
        image_link = request.GET.get("image_link")
        audio_link = request.GET.get("audio_link")
        video_link = request.GET.get("video_link")
        question_comment = request.GET.get("question_comment")
        question_type_id = request.GET.get("question_type_id")
        answer_image_link = request.GET.get("answer_image_link")
        answer_music_link = request.GET.get("answer_music_link")
        checked = request.GET.get("checked")
        time_to_answer = request.GET.get("time_to_answer")
        current_date = datetime.now()
        if question_type_id == '1':
            answer = request.GET.get("answer")
            is_correct = request.GET.get("is_correct")
            new_question_data = Question(text = question_text, image_link = image_link, audio_link = audio_link, video_link = video_link, comment = question_comment, created = current_date, updated = current_date, question_type_id = question_type_id, is_active = 0, used = 0, draw = checked, time_to_answer = time_to_answer)
            new_question_data.save()
            new_answer_data = Answer(text = answer, is_correct = is_correct, question_id = new_question_data.pk, question_type_id = question_type_id, image_link = answer_image_link, music_link = answer_music_link)
            new_answer_data.save()
            return JsonResponse({"message": "Data updated"})
        elif question_type_id == '2' or question_type_id == '3':
            index = request.GET.get("index")
            answers = []
            is_correct = []
            for i in range(int(index)):
                answers.append(request.GET.get("answer" + str(i)))
                is_correct.append(request.GET.get("is_correct" + str(i)))
            new_question_data = Question(text = question_text, image_link = image_link, audio_link = audio_link, video_link = video_link, comment = question_comment, created = current_date, updated = current_date, question_type_id = question_type_id, is_active = 0, used = 0, draw = checked, time_to_answer = time_to_answer)
            new_question_data.save()
            for i in range(int(index)):
                new_answer_data = Answer(text = answers[i], is_correct = is_correct[i], question_id = new_question_data.pk, question_type_id = question_type_id, image_link = answer_image_link, music_link = answer_music_link)
                new_answer_data.save()
            return JsonResponse({"message": "Data updated"})
        elif question_type_id == '4':
            index = request.GET.get("index")
            answers = []
            is_correct = []
            points = []
            for i in range(int(index)):
                answers.append(request.GET.get("answer" + str(i)))
                is_correct.append(request.GET.get("is_correct" + str(i)))
                points.append(request.GET.get("points" + str(i)))
            new_question_data = Question(text = question_text, image_link = image_link, audio_link = audio_link, video_link = video_link, comment = question_comment, created = current_date, updated = current_date, question_type_id = question_type_id, is_active = 0, used = 0, draw = checked, time_to_answer = time_to_answer)
            new_question_data.save()
            for i in range(int(index)):
                new_answer_data = Answer(text = answers[i], is_correct = is_correct[i], question_id = new_question_data.pk, question_type_id = question_type_id, image_link = answer_image_link, points = points[i], music_link = answer_music_link)
                new_answer_data.save()
            return JsonResponse({"message": "Data updated"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_all_question_types(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_type_data = QuestionType.objects.all()
        if not question_type_data:
            return JsonResponse({"message": "No question types"})
        else:
            result = []
            for entry in question_type_data:
                question_type_instance = {}
                question_type_instance["id"] = entry.pk
                question_type_instance["name"] = entry.name
                result.append(question_type_instance)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def update_question(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_id = request.GET.get("question_id")
        question_text = request.GET.get("question_text")
        image_link = request.GET.get("image_link")
        audio_link = request.GET.get("audio_link")
        video_link = request.GET.get("video_link")
        question_comment = request.GET.get("question_comment")
        question_type_id = request.GET.get("question_type_id")
        answer_image_link = request.GET.get("answer_image_link")
        answer_music_link = request.GET.get("answer_music_link")
        checked = request.GET.get("checked")
        time_to_answer = request.GET.get("time_to_answer")
        current_date = datetime.now()
        try:
            question_data = Question.objects.get(pk=question_id)
            question_data.text = question_text
            question_data.image_link = image_link
            question_data.audio_link = audio_link
            question_data.video_link = video_link
            question_data.comment = question_comment
            question_data.question_type_id = question_type_id
            question_data.updated = current_date
            question_data.draw = checked
            question_data.time_to_answer = time_to_answer
            question_data.save()
            answer_data = Answer.objects.filter(question_id = question_id)
            answer_data.delete()
            if question_type_id == '1':
                answer = request.GET.get("answer")
                is_correct = request.GET.get("is_correct")
                new_answer_data = Answer(text = answer, is_correct = is_correct, question_id = question_id, question_type_id = question_type_id, image_link = answer_image_link, music_link = answer_music_link)
                new_answer_data.save()
                return JsonResponse({"message": "Data updated"})
            elif question_type_id == '2' or question_type_id == '3':
                index = request.GET.get("index")
                answers = []
                is_correct = []
                for i in range(int(index)):
                    answers.append(request.GET.get("answer" + str(i)))
                    is_correct.append(request.GET.get("is_correct" + str(i)))
                    new_answer_data = Answer(text = answers[i], is_correct = is_correct[i], question_id = question_id, question_type_id = question_type_id, image_link = answer_image_link, music_link = answer_music_link)
                    new_answer_data.save()
                return JsonResponse({"message": "Data updated"})
            elif question_type_id == '4':
                index = request.GET.get("index")
                answers = []
                is_correct = []
                points = []
                for i in range(int(index)):
                    answers.append(request.GET.get("answer" + str(i)))
                    is_correct.append(request.GET.get("is_correct" + str(i)))
                    points.append(request.GET.get("points" + str(i)))
                    new_answer_data = Answer(text = answers[i], is_correct = is_correct[i], question_id = question_id, question_type_id = question_type_id, image_link = answer_image_link, points = points[i], music_link = answer_music_link)
                    new_answer_data.save()
                return JsonResponse({"message": "Data updated"})
        except Question.DoesNotExist:            
            return JsonResponse(
                {"message": "Question doesn't exist"}
            )
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def delete_question(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_id = request.GET.get("question_id")
        try: 
            question_data = Question.objects.get(pk=question_id)       
            question_data.delete()
            return JsonResponse({"message": "Data updated"})
        except Question.DoesNotExist:
            return JsonResponse({"message": "Question doesn't exist"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_question_answers(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_id = request.GET.get("question_id")
        try: 
            answer_data = Answer.objects.filter(question_id=question_id)       
            result = []
            for entry in answer_data:
                answer_instance = {}
                answer_instance["text"] = entry.text
                answer_instance["is_correct"] = entry.is_correct
                answer_instance["image_link"] = entry.image_link
                answer_instance["music_link"] = entry.music_link
                answer_instance["question_type_id"] = entry.question_type.pk
                answer_instance["points"] = entry.points
                answer_instance["question"] = entry.question.text
                result.append(answer_instance)
            return JsonResponse(result, safe=False)
        except Question.DoesNotExist:
            return JsonResponse({"message": "Answer doesn't exist"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def get_question(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    question_id = request.GET.get("question_id")
    try:
        question_data = Question.objects.get(pk=question_id)
        if not question_data:
            return JsonResponse({"message": "No questions"})
        else:
            result = []
            result.append(question_data.text)
            result.append(question_data.image_link)
            result.append(question_data.audio_link)
            result.append(question_data.video_link)
            result.append(question_data.question_type.name)
            result.append(question_data.comment)
            result.append(question_data.draw)
            result.append(question_data.time_to_answer)
            return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def change_question_status(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_id = request.GET.get("question_id")
        game_id = request.GET.get("game_id")
        status = request.GET.get("status")
        try:
            question_data = Question.objects.get(pk=question_id)
            current_date = datetime.now()
            question_data.updated = current_date
            if status == '1':
                # question_data.game = game_id
                question_data.is_active = 1
            elif status == '0':
                question_data.is_active = 0
                # question_data.game = ""
            question_data.save()
            return JsonResponse({"message": "Data updated"})
        except Question.DoesNotExist:
            return JsonResponse({"message": "No question exists"})
    except Exception as e:
        return JsonResponse({"message": e})
    
@csrf_exempt
def set_question_start_time(request):
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"})
    try:
        question_id = request.GET.get("question_id")
        game_id = request.GET.get("game_id")
        try:
            question_data = Question.objects.get(pk = question_id)
            current_date = datetime.now()
            question_data.start_time = current_date
            question_data.end_time = current_date  + timedelta(minutes = 1)
            question_data.game = game_id
            question_data.used = 1
            question_data.save()
            current_data = Current.objects.filter(game_id = game_id)
            if current_data:
                current_data[0].current_start_time = current_date
                current_data[0].save()
            return JsonResponse({"message": "Data updated"})
        except Question.DoesNotExist:            
            return JsonResponse({"message": "No question exists"})
    except Exception as e:
        print(e)
        return JsonResponse({"message": e})