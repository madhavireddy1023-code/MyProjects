import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import joblib
import os

df = pd.read_csv("House_Price_Dataset.csv", sep=None, engine="python")
df.columns = df.columns.str.strip().str.lower()

df["price"] = (
    df["square_footage"] * 150 +
    df["bedrooms"] * 10000 +
    df["bathrooms"] * 8000 -
    df["distance_to_city_center"] * 5000 +
    df["school_rating"] * 7000
)

df.to_csv("output.csv", index=False)

print(df.head())

X = df.drop("price", axis=1)
y = df["price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

metrics = {
    "mean_squared_error": mse,
    "r2_score": r2
}

os.makedirs("ml", exist_ok=True)

joblib.dump(model, "ml/model.pkl")
joblib.dump(list(X.columns), "ml/features.pkl")
joblib.dump(metrics, "ml/metrics.pkl")