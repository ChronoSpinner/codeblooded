# 🚀 SugarMommy — AI-Driven Sugarcane Marketplace

> Created by *Team CodeBlooded* during 418 hackathon hosted by Enigma under AEON 2025
> Bridging the gap between 🌾 farmers, 🏭 sugar mills, and 🚚 distributors using AI-powered sugarcane quality prediction and real-time trading.

🌐 **Live Website**: [https://codeblooded-xi.vercel.app/](https://codeblooded-xi.vercel.app/)

---

## 🌟 About the Project

In the sugar industry, farmers are often underpaid due to lack of quality measurement and transparency. **SugarMommy** solves this by

- 🤖 Predicting *sugar content* (TS%) using NIR spectroscopy and machine learning
- 🔗 Connecting farmers, mills, and distributors under one seamless platform
- 💸 Enabling *fair, dynamic pricing* based on quality — no middlemen, no friction
- 📦 Providing *inventory and order management*

---

## ✨ Features

### 🔬 For Farmers
- Upload sugarcane data via CSV or web form  
- Automated prediction of **Total Sugar (TS%)**  
- Receive a **quality grade (A–E)** and **price recommendation**  
- List sugarcane batches on the marketplace in real time  

### 📈 For Buyers
- Browse listings by:
  - Quality Grade (A–E)
  - Predicted TS%
  - Price per ton
- Buy directly from farmers  
- View quantity and location before purchase  

---

## 🤖 Machine Learning

### 🧠 ML Model Highlights
- **Model**: Partial Least Squares Regression (PLS)
- **Features**: 232 NIR wavelength amplitudes (900–1700 nm)
- **Target**: Total Sugar (TS%)  
- **Pre-processing**: Standardization + IQR outlier removal  
- **Accuracy**: ~95% (R² Score)

### 🎯 Sugarcane Quality Grades

| Grade | TS% Range        |
|-------|------------------|
| A     | Above 41.69      |
| B     | 34.24 – 41.69    |
| C     | 17.4 – 34.24     |
| D     | 4.76 – 17.4      |
| E     | Below 4.76       |

🔗 **Live Model**: [Try it on Hugging Face](https://huggingface.co/spaces/ChronoSpinner/SugarCane_Prediction_Model)  
🌐 **Live Website**: [https://codeblooded-xi.vercel.app/](https://codeblooded-xi.vercel.app/)

---

## 🧩 Tech Stack

| Layer       | Tech Used                     |
|-------------|-------------------------------|
| Frontend    | Next.js + TypeScript          |
| Backend     | Firebase                      |
| ML Inference| Scikit-learn (PLS Regression) |
| ML UI       | Gradio                        |
| Database    | Firestore                     |
| Hosting     | Vercel                        |

---

## 🧪 Run Locally


Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/sugarmommy.git
cd sugarmommy
npm install
npm run dev
```
