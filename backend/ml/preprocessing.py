import os
import pandas as pd
from sklearn.model_selection import train_test_split

# Global label mapping dictionaries for standard reference
LABEL_MAPPING = {"Building": 0, "Emerging": 1, "Ready": 2}
INVERSE_MAPPING = {0: "Building", 1: "Emerging", 2: "Ready"}

class DummyPreprocessor:
    """
    A custom preprocessor class to handle categorical one-hot encoding
    and align feature column structures. This ensures that live single-user
    inference data gets encoded identically to the training features.
    """
    def __init__(self, categorical_cols):
        self.categorical_cols = categorical_cols
        self.feature_names = None
        
    def fit(self, X):
        """
        Fits the preprocessor by capturing the full one-hot encoded feature column names list.
        """
        # Run dummy encoding on training features to capture complete categories
        X_encoded = pd.get_dummies(X, columns=self.categorical_cols, drop_first=False)
        self.feature_names = X_encoded.columns.tolist()
        return self
        
    def transform(self, X):
        """
        Transforms the input features by encoding categories and reindexing column alignment.
        """
        if self.feature_names is None:
            raise ValueError("Preprocessor has not been fitted yet. Please call fit() first.")
            
        X_encoded = pd.get_dummies(X, columns=self.categorical_cols, drop_first=False)
        
        # Align features to ensure identical columns, filling missing categories with 0
        X_encoded = X_encoded.reindex(columns=self.feature_names, fill_value=0)
        
        # Cast boolean flags to numeric integers 0/1
        bool_cols = X_encoded.select_dtypes(include=['bool']).columns
        X_encoded[bool_cols] = X_encoded[bool_cols].astype(int)
        
        return X_encoded
        
    def fit_transform(self, X):
        return self.fit(X).transform(X)

def load_data(filepath=None):
    """
    Loads the processed features dataset from CSV.
    """
    if filepath is None:
        filepath = os.path.join("processed_data", "growledger_features.csv")
        if not os.path.exists(filepath):
            # Try path relative to script location fallback
            script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            filepath = os.path.join(script_dir, "processed_data", "growledger_features.csv")
            
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Processed dataset not found at: {filepath}")
        
    print(f"Loading features dataset from: {filepath}")
    return pd.read_csv(filepath)

def preprocess_data(df, preprocessor=None):
    """
    Preprocess the dataset for model training or inference.
    Drops analytical columns, encodes categorical columns, and splits features/labels.
    
    Args:
        df (pd.DataFrame): Dataset with engineered features.
        preprocessor (DummyPreprocessor, optional): Pre-fitted preprocessor instance.
        
    Returns:
        tuple: (X_processed, y, preprocessor) where X_processed is the transformed feature DataFrame.
    """
    data = df.copy()
    
    # 1. Columns to exclude from model inputs
    cols_to_drop = [
        "user_id",
        "persona",
        "financial_score",
        "financial_discipline_score",
        "cash_flow_health",
        "stability_score",
        "financial_tier"  # Excluded since it is the target label y
    ]
    
    # Safely filter columns to drop (only drop if they exist in the dataframe)
    cols_to_drop = [col for col in cols_to_drop if col in data.columns]
    
    # 2. Extract and encode target column (financial_tier)
    y = None
    if "financial_tier" in data.columns:
        y = data["financial_tier"].map(LABEL_MAPPING)
    
    # 3. Extract feature inputs
    X = data.drop(columns=cols_to_drop)
    
    # 4. Instantiate or use preprocessor
    categorical_cols = ["occupation", "income_variance", "income_growth"]
    categorical_cols = [col for col in categorical_cols if col in X.columns]
    
    if preprocessor is None:
        preprocessor = DummyPreprocessor(categorical_cols=categorical_cols)
        X_processed = preprocessor.fit_transform(X)
    else:
        X_processed = preprocessor.transform(X)
        
    return X_processed, y, preprocessor

def prepare_train_test_split(filepath=None, test_size=0.2, random_state=42):
    """
    Loads, preprocesses, and splits the data into train and test sets.
    
    Returns:
        dict: A dictionary containing X_train, X_test, y_train, y_test,
              the fitted preprocessor, and the label mappings.
    """
    df = load_data(filepath)
    X_processed, y, preprocessor = preprocess_data(df)
    
    # Perform stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_processed, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    print(f"Preprocessing complete:")
    print(f"  - Features shape (X_train): {X_train.shape}")
    print(f"  - Test shape (X_test): {X_test.shape}")
    print(f"  - Target distribution (y_train):")
    print(y_train.value_counts().to_string())
    
    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "preprocessor": preprocessor,
        "label_mapping": LABEL_MAPPING,
        "inverse_mapping": INVERSE_MAPPING,
    }

if __name__ == "__main__":
    prepare_train_test_split()
