🌾 Sugarcane Quality Marketplace
An AI-powered web platform that enables farmers to upload sugarcane quality and quantity data, and allows buyers to purchase sugarcane based on its predicted grade and price. Built using React + JavaScript frontend, a database-backed backend, and a machine learning pipeline that analyses NIR spectroscopy data (900–1700 nm) to estimate sugar content.

🛒 Key Features
🔬 For Farmers
Upload sugarcane data via CSV or form

Get automated prediction of Total Sugar (TS%)

Receive a quality grade and price recommendation

List batches on the marketplace in real time

📈 For Buyers
Browse sugarcane lots by:

Quality Grade (A–D)

Predicted TS%
Price per ton
Buy directly from farmers
View quantity and location before purchase

🤖 Machine Learning
Uses NIR (Near-Infrared) spectroscopy features (900–1700 nm)
Trained with Partial Least Squares Regression (PLS)
Categorizes sugarcane into percentile-based grades
Predicts price dynamically based on quality

🧠 ML Model Highlights
Huggingface link: https://huggingface.co/spaces/ChronoSpinner/SugarCane_Prediction_Model
Model: Partial Least Squares Regression (PLS)
Features: 232 NIR wavelength amplitudes
Target: Total Sugar (TS%)
Pre-processing: Standardization + IQR outlier removal

Grades based on TS%:
Grade	TS Range
A       Above 41.69
B	34.24 - 41.69
C	17.4  - 34.24
D	4.76  - 17.4
E	Below 4.76


🧩 Tech Stack
Layer	Tech
Frontend	React + JavaScript
Backend API	FastAPI (Python)
ML Inference	Scikit-learn + PLS Model
Web UI		Gradio (for TS prediction)
Database	Convex


📜 License
This project is licensed under the MIT License.
