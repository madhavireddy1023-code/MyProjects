from django.urls import path
from .views import predict, model_info, health

urlpatterns = [
    path("predict/", predict),
    path("model-info/", model_info),
    path("health/", health),
]