from django.urls import path
from . import views

urlpatterns = [
    path('scores/', views.get_scores, name='get_scores'),
    path('save/', views.save_score, name='save_score'),
]
