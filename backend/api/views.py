import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Score

def get_scores(request):
    # Get top 10 scores
    scores = Score.objects.order_by('-score')[:10]
    data = [
        {
            "player_name": s.player_name,
            "score": s.score,
            "mode": s.mode,
            "date": s.date.strftime("%Y-%m-%d %H:%M")
        }
        for s in scores
    ]
    return JsonResponse(data, safe=False)

@csrf_exempt
def save_score(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            Score.objects.create(
                player_name=data.get('player_name', 'Player'),
                score=data.get('score', 0),
                mode=data.get('mode', 'NORMAL')
            )
            return JsonResponse({"status": "success", "message": "Score saved"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)
