import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        timestamp = round(time.time() * 1000)
        # Save the file to a specific location
        with open('../frontend/src/assets/' + uploaded_file.name, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Return the file link
        file_link = '/assets/' + uploaded_file.name
        return JsonResponse({'file_link': file_link})

    return JsonResponse({'error': 'Invalid request'}, status=400)