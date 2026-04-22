from rest_framework.decorators import api_view
from rest_framework.response import Response
import joblib
import pandas as pd

model = joblib.load("ml/model.pkl")
features = joblib.load("ml/features.pkl")
metrics = joblib.load("ml/metrics.pkl")

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})

@api_view(["GET"])
def model_info(request):
    return Response({
        "coefficients": model.coef_.tolist(),
        "intercept": model.intercept_,
        "performance_metrics": metrics
    })

@api_view(["POST"])
def predict(request):
    data = request.data

    try:
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = pd.DataFrame([data])

        df = df[features]

        preds = model.predict(df)

        return Response({
            "predictions": preds.tolist()
        })

    except KeyError as e:
        return Response({
            "error": f"Missing field: {str(e)}"
        }, status=400)

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)