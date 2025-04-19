import numpy as np

def compute_s_ratio_within_radius_fast(df_s, df_t, matching_on=[], not_matching=["IN"], km=25):
    # Earth's radius in km
    R = 6371.0

    # Convert degrees to radians
    df_s_rad = df_s.copy()
    df_t_rad = df_t.copy()
    df_s_rad["lat_rad"] = np.radians(df_s["LT"])
    df_s_rad["lon_rad"] = np.radians(df_s["LG"])
    df_t_rad["lat_rad"] = np.radians(df_t["LT"])
    df_t_rad["lon_rad"] = np.radians(df_t["LG"])

    s_ratios = []

    for idx, t_row in df_t_rad.iterrows():
        # Apply matching filters
        mask = np.ones(len(df_s_rad), dtype=bool)
        for col in matching_on:
            mask &= (df_s_rad[col] == t_row[col])
        for col in not_matching:
            mask &= (df_s_rad[col] != t_row[col])

        candidates = df_s_rad[mask]

        # Vectorized haversine
        dlat = candidates["lat_rad"].values - t_row["lat_rad"]
        dlon = candidates["lon_rad"].values - t_row["lon_rad"]
        a = np.sin(dlat / 2) ** 2 + np.cos(t_row["lat_rad"]) * np.cos(candidates["lat_rad"].values) * np.sin(dlon / 2) ** 2
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
        distances = R * c

        nearby = candidates[distances <= km]
        S_count = (nearby["S"] == 1).sum()
        F_count = (nearby["S"] == 0).sum()

        ratio = S_count / (S_count + F_count) if (S_count + F_count) > 0 else 0
        s_ratios.append(ratio)

    df_t = df_t.copy()
    df_t["S_RATIO_25km"] = s_ratios

    return df_t

===========================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, roc_auc_score
import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Layer
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam

# Load your data
df = pd.read_csv("da.csv")

# Prepare X and y
df_model = df.drop(columns=["I", "_DT"])
X = pd.get_dummies(df_model.drop(columns=["S"]))
y = df_model["S"].values

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Attention layer
class Attention(Layer):
    def build(self, input_shape):
        self.attention_weights = self.add_weight(
            name='attention_weights',
            shape=(input_shape[-1], 1),
            initializer='random_normal',
            trainable=True
        )
        super().build(input_shape)

    def call(self, inputs):
        scores = tf.matmul(inputs, self.attention_weights)
        weights = tf.nn.softmax(scores, axis=1)
        weighted = inputs * weights
        return tf.reduce_sum(weighted, axis=1)

# Model with attention
def build_model_with_attention(input_shape):
    inputs = Input(shape=(input_shape,))
    x = Dense(64, activation='relu')(inputs)
    x = Dense(64, activation='relu')(x)
    x = tf.expand_dims(x, axis=1)
    x = Attention()(x)
    x = Dense(32, activation='relu')(x)
    outputs = Dense(1, activation='sigmoid')(x)
    model = Model(inputs, outputs)
    model.compile(optimizer=Adam(0.001), loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Plain model
def build_model_plain(input_shape):
    inputs = Input(shape=(input_shape,))
    x = Dense(64, activation='relu')(inputs)
    x = Dense(64, activation='relu')(x)
    x = Dense(32, activation='relu')(x)
    outputs = Dense(1, activation='sigmoid')(x)
    model = Model(inputs, outputs)
    model.compile(optimizer=Adam(0.001), loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Train and evaluate
def evaluate_model(model):
    model.fit(X_train, y_train, epochs=30, batch_size=16, verbose=0)
    y_probs = model.predict(X_test)
    y_pred = (y_probs >= 0.5).astype(int)
    return {
        "accuracy": accuracy_score(y_test, y_pred),
        "roc_auc": roc_auc_score(y_test, y_probs)
    }

# Run both
m1 = build_model_plain(X_train.shape[1])
m2 = build_model_with_attention(X_train.shape[1])

print("Plain model:", evaluate_model(m1))
print("With attention:", evaluate_model(m2))

===========================================


import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, roc_auc_score

# Load and prepare data
df = pd.read_csv("da.csv")
df = df.drop(columns=["I", "_DT"])

X = pd.get_dummies(df.drop(columns=["S"])).astype(np.float32)
y = df["S"].values.astype(np.float32)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

X_train = torch.tensor(X_train)
y_train = torch.tensor(y_train).view(-1, 1)
X_test = torch.tensor(X_test)
y_test = torch.tensor(y_test).view(-1, 1)

# Attention Layer
class AttentionLayer(nn.Module):
    def __init__(self, input_dim):
        super(AttentionLayer, self).__init__()
        self.attn_weights = nn.Parameter(torch.randn(input_dim, 1))

    def forward(self, x):
        scores = torch.matmul(x, self.attn_weights)
        weights = torch.softmax(scores, dim=1)
        attended = x * weights
        return attended.sum(dim=1)

# Plain model
class PlainNN(nn.Module):
    def __init__(self, input_dim):
        super(PlainNN, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

# Model with attention
class AttentionNN(nn.Module):
    def __init__(self, input_dim):
        super(AttentionNN, self).__init__()
        self.dense1 = nn.Linear(input_dim, 64)
        self.dense2 = nn.Linear(64, 64)
        self.attn = AttentionLayer(64)
        self.fc = nn.Sequential(
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = torch.relu(self.dense1(x))
        x = torch.relu(self.dense2(x))
        x = self.attn(x)
        return self.fc(x)

# Training function
def train_model(model, X_train, y_train, X_test, y_test, epochs=30, lr=0.001):
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    
    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        outputs = model(X_train)
        loss = criterion(outputs, y_train)
        loss.backward()
        optimizer.step()

    model.eval()
    with torch.no_grad():
        preds = model(X_test)
        y_pred = (preds >= 0.5).int()
        acc = accuracy_score(y_test, y_pred)
        auc = roc_auc_score(y_test, preds)
    return acc, auc

# Train and evaluate
input_dim = X_train.shape[1]
plain_model = PlainNN(input_dim)
attn_model = AttentionNN(input_dim)

acc_plain, auc_plain = train_model(plain_model, X_train, y_train, X_test, y_test)
acc_attn, auc_attn = train_model(attn_model, X_train, y_train, X_test, y_test)

print(f"Plain NN → Accuracy: {acc_plain:.3f}, AUC: {auc_plain:.3f}")
print(f"Attention NN → Accuracy: {acc_attn:.3f}, AUC: {auc_attn:.3f}")
