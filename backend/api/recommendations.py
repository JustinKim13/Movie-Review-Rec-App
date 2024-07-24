import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Function to load data (ensure the path is correct)
def load_data():
    return pd.read_csv('backend/data/imdb_top_1000.csv')  # Update the path as needed

def get_recommendations(user_movies):
    # Load IMDB data
    imdb_data = load_data()

    # Select only necessary columns for features
    features = imdb_data[['title', 'Genre', 'Director', 'Star1', 'Star2', 'Star3', 'Star4']]

    # Fill any missing values with empty strings
    features = features.fillna('')

    # Combine features into a single string
    features['combined_features'] = features.apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

    # Create the CountVectorizer matrix
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(features['combined_features'])

    # Compute the Cosine Similarity matrix
    cosine_sim = cosine_similarity(count_matrix)

    # Function to get movie index from title
    def get_index_from_title(title):
        try:
            return features[features['title'] == title].index.values[0]
        except IndexError:
            return None

    # Function to get title from movie index
    def get_title_from_index(index):
        return features.iloc[index]['title']

    # Calculate the weighted average of similarities based on user ratings
    user_sim_scores = []
    for movie in user_movies:
        idx = get_index_from_title(movie['title'])
        if idx is not None:
            sim_scores = list(enumerate(cosine_sim[idx]))
            user_sim_scores.extend([(i, sim * movie['rating']) for i, sim in sim_scores])

    # Aggregate the scores
    user_sim_scores = pd.DataFrame(user_sim_scores, columns=['movie_index', 'score'])
    user_sim_scores = user_sim_scores.groupby('movie_index').sum().reset_index()

    # Remove movies already rated by the user
    rated_indices = [get_index_from_title(movie['title']) for movie in user_movies]
    user_sim_scores = user_sim_scores[~user_sim_scores['movie_index'].isin(rated_indices)]

    # Get the top N recommendations
    user_sim_scores = user_sim_scores.sort_values(by='score', ascending=False)
    top_recommendations = user_sim_scores.head(5)

    # Get the poster URLs for the recommended movies
    recommended_titles = top_recommendations['movie_index'].apply(get_title_from_index)
    recommendations = pd.merge(recommended_titles, imdb_data[['title', 'Poster_Link']], on='title', how='inner')

    return recommendations[['title', 'Poster_Link']].to_dict(orient='records')
