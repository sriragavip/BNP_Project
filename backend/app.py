from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
import pandas as pd
import numpy as np

app = Flask(__name__)

# Ensure the uploads directory exists
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Function to compare files and generate comparison results
def compare_files(yesterday_file_path, today_file_path):
    yesterday_data = pd.read_csv(yesterday_file_path)
    today_data = pd.read_csv(today_file_path)
    
    # Merge the data on 'ID_GLOBAL'
    merged_data = pd.merge(yesterday_data, today_data, on="ID_GLOBAL", suffixes=("_yesterday", "_today"), how="outer")
    
    # Initialize a DataFrame for comparison results
    comparison_results = pd.DataFrame()
    comparison_results["ID_GLOBAL"] = merged_data["ID_GLOBAL"]
    
    for column in yesterday_data.columns:
        if column != "ID_GLOBAL":
            comparison_results[column] = np.where(
                (merged_data[f"{column}_yesterday"].isna()) & (merged_data[f"{column}_today"].isna()),
                True,
                np.where(
                    (merged_data[f"{column}_yesterday"].notna()) & (merged_data[f"{column}_today"].notna()) &
                    (merged_data[f"{column}_yesterday"] == merged_data[f"{column}_today"]),
                    True,
                    False
                )
            )

    # Save the comparison results to a CSV file
    comparison_results_file = os.path.join(app.config['UPLOAD_FOLDER'], 'comparison_results.csv')
    comparison_results.to_csv(comparison_results_file, index=False)
    
    # Generate delta values where the comparison is False
    mismatched_ids = comparison_results.loc[comparison_results.drop(columns="ID_GLOBAL").eq(False).any(axis=1), "ID_GLOBAL"]
    delta_values = today_data[today_data["ID_GLOBAL"].isin(mismatched_ids)]
    
    # Save the delta values to a CSV file
    delta_values_file = os.path.join(app.config['UPLOAD_FOLDER'], 'delta_values.csv')
    delta_values.to_csv(delta_values_file, index=False)
    
    # Generate separate CSVs for each market sector
    market_sector_groups = delta_values.groupby("MARKET_SECTOR_DES")
    for market_sector, group in market_sector_groups:
        filename = f"delta_values_{market_sector}.csv"
        group.to_csv(os.path.join(app.config['UPLOAD_FOLDER'], filename), index=False)
    
    return comparison_results_file, delta_values_file

# Route for rendering the upload form
@app.route('/')
def index():
    # List the files in the uploads folder to display available files for download
    uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])
    uploaded_files = [file for file in uploaded_files if file.endswith('.csv') and file not in ('yesterday.csv', 'today.csv')]  # Only show .csv files excluding input files
    return render_template('upload.html', uploaded_files=uploaded_files)

# Route for handling file upload and processing
@app.route('/upload', methods=['POST'])
def upload_files():
    if 'yesterday_file' not in request.files or 'today_file' not in request.files:
        return "No file part", 400
    
    yesterday_file = request.files['yesterday_file']
    today_file = request.files['today_file']
    
    if yesterday_file.filename == '' or today_file.filename == '':
        return "No selected file", 400
    
    # Save the uploaded files
    yesterday_file_path = os.path.join('temp', 'yesterday.csv')  # Temporary path
    today_file_path = os.path.join('temp', 'today.csv')  # Temporary path
    os.makedirs('temp', exist_ok=True)

    yesterday_file.save(yesterday_file_path)
    today_file.save(today_file_path)
    
    # Compare the files and generate results
    compare_files(yesterday_file_path, today_file_path)
    
    # After processing, redirect to the index page to show available files
    return redirect(url_for('index'))

# Route to download files from the uploads folder
@app.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the app with Waitress
if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000)
