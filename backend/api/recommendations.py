import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def load_data():
    return pd.read_csv('backend/data/imdb_top_1000.csv') 

def get_recommendations(user_movies):
    imdb_data = load_data()

    # Everything else comes out null from api, so we'll just use these features
    features = imdb_data[['Series_Title', 'Genre', 'Director', 'Star1', 'Star2', 'Star3', 'Star4']]
    
    # Fill missing values and combine into string
    features = features.fillna('')
    features['combined_features'] = features.apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

    # Create the CountVectorizer matrix
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(features['combined_features'])

    # Compute the Cosine Similarity matrix
    cosine_sim = cosine_similarity(count_matrix)

    # Get movie index from title
    def get_index_from_title(title):
        try:
            return features[features['Series_Title'] == title].index.values[0]
        except IndexError:
            return None

    # Function to get title from movie index
    def get_title_from_index(index):
        return features.iloc[index]['Series_Title']

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

    # Remove movies already rated by the user (can't recommend a movie already rated)
    rated_indices = [get_index_from_title(movie['title']) for movie in user_movies]
    user_sim_scores = user_sim_scores[~user_sim_scores['movie_index'].isin(rated_indices)]

    # Get the top N recommendations
    user_sim_scores = user_sim_scores.sort_values(by='score', ascending=False)
    top_recommendations = user_sim_scores.head(5)

    # Get the poster URLs for the recommended movies
    recommended_titles = top_recommendations['movie_index'].apply(get_title_from_index)
    recommendations = pd.merge(recommended_titles, imdb_data[['Series_Title', 'Poster_Link']], on='Series_Title', how='inner')

    # Rename 'Poster_Link' to 'poster' to fit our dataset in postgres
    recommendations = recommendations.rename(columns={'Poster_Link': 'poster'}) 
    return recommendations[['Series_Title', 'poster']].to_dict(orient='records') # Our recommendations are given as the title and poster, so they can be displayed and added to postgres

