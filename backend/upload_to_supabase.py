from supabase import create_client
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_data():
    # Load the Canvas data
    with open('canvas_output.json', 'r') as f:
        data = json.load(f)

    # Upload user profile
    user_profile = data['user_profile']
    supabase.table('user_profiles').upsert({
        'id': user_profile['id'],
        'name': user_profile['name'],
        'sortable_name': user_profile['sortable_name']
    }).execute()

    # Upload courses and assignments
    for course in data['courses']:
        # Insert course
        supabase.table('courses').upsert({
            'id': course['id'],
            'user_id': user_profile['id'],
            'name': course['name'],
            'overall_score': course['overall_score']
        }).execute()

        # Process assignments
        for status in ['upcoming', 'past']:
            for assignment in course['assignments'].get(status, []):
                assignment_data = {
                    'id': assignment['id'],
                    'course_id': course['id'],
                    'status': status,
                    'name': assignment['name'],
                    'due_at': assignment['due_at'],
                    'points_possible': assignment['points_possible'],
                    'assignment_type': assignment['assignment_type'],
                    'group_name': assignment['assignment_group']['group_name'],
                    'group_weight': assignment['assignment_group']['group_weight'],
                    'grade_score': None,
                    'grade_points_possible': None,
                    'grade_percentage': None
                }

                # Add grade info if available
                if 'grade_info' in assignment:
                    grade_info = assignment['grade_info']
                    assignment_data.update({
                        'grade_score': grade_info.get('score'),
                        'grade_points_possible': grade_info.get('points_possible'),
                        'grade_percentage': grade_info.get('percentage')
                    })

                supabase.table('assignments').upsert(assignment_data).execute()

if __name__ == "__main__":
    upload_data()