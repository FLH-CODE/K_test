import matplotlib.pyplot as plt
import numpy as np

# Data for the chart
categories = [
    "Early Attractions",
    "Quality for life",
    "The connecting spine",
    "Zero CO₂ footprint",
    "Blue and Green Dreams",
    "Innovative green",
    "Sustainable everyday life",
    "Well connected & walkable",
    "Nature at your doorstep",
]

segments = len(categories)
colors = ["#F4C7C3", "#F4C7C3", "#F4C7C3", "#F4DB82", "#F4DB82", "#F4DB82", "#93C7E8", "#93C7E8", "#93C7E8"]

# Creating the wheel chart
fig, ax = plt.subplots(figsize=(8, 8), subplot_kw={'projection': 'polar'})
angles = np.linspace(0, 2 * np.pi, segments + 1)

# Draw segments with gaps
for i in range(segments):
    ax.bar(
        angles[i],
        1,
        width=(2 * np.pi / segments) - 0.1,  # Adjust width to create gaps
        color=colors[i],
        edgecolor="white",
        linewidth=2,
    )

# Add labels to segments
for i, category in enumerate(categories):
    angle = angles[i] + (angles[1] - angles[0]) / 2
    rotation = np.degrees(angle)
    alignment = "right" if 90 < rotation < 270 else "left"
    ax.text(
        angle,
        1.2,
        category,
        ha=alignment,
        va="center",
        rotation=rotation if alignment == "left" else rotation + 180,
        rotation_mode="anchor",
        fontsize=10,
        color="white",
    )

# Styling
ax.set_facecolor("#2E3448")
ax.set_yticklabels([])
ax.set_xticklabels([])
ax.spines["polar"].set_visible(False)

plt.show()