"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

import myapp.views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('add_user', myapp.views.add_user),
    path('get_all_users', myapp.views.get_all_users),
    path('update_user', myapp.views.update_user),
    path('delete_user', myapp.views.delete_user),
    path('get_all_game_users', myapp.views.get_all_game_users),
    path('change_user_status', myapp.views.change_user_status),
    path('login', myapp.views.login),

    path('upload', myapp.views.upload_file),

    path('get_all_question_types', myapp.views.get_all_question_types),
    path('add_question', myapp.views.add_question),
    path('get_all_questions', myapp.views.get_all_questions),
    path('get_all_game_questions', myapp.views.get_all_game_questions),
    path('get_all_draw_questions', myapp.views.get_all_draw_questions),
    path('update_question', myapp.views.update_question),
    path('delete_question', myapp.views.delete_question),
    path('get_question_answers', myapp.views.get_question_answers),
    path('get_question', myapp.views.get_question),
    path('change_question_status', myapp.views.change_question_status),
    path('set_question_start_time', myapp.views.set_question_start_time),

    path('get_all_games', myapp.views.get_all_games),
    path('add_game', myapp.views.add_game),
    path('start_game', myapp.views.start_game),
    path('clone_game', myapp.views.clone_game),
    path('end_game', myapp.views.end_game),
    path('update_game', myapp.views.update_game),
    path('delete_game', myapp.views.delete_game),

    path('save_fleet_layout', myapp.views.save_fleet_layout),
    path('load_fleet_layout', myapp.views.load_fleet_layout),
    path('update_fleet_layout', myapp.views.update_fleet_layout),
    path('save_queue', myapp.views.save_queue),
    path('save_current', myapp.views.save_current),
    path('get_queue', myapp.views.get_queue),    

    path('set_command', myapp.views.set_command),
    path('get_command', myapp.views.get_command),

    path('get_current_results', myapp.views.get_current_results),
    path('save_result', myapp.views.save_result),
    path('update_result', myapp.views.update_result),

    path('get_user_answers', myapp.views.get_user_answers),
    path('assign_answer_points', myapp.views.assign_answer_points),
    path('set_user_answer', myapp.views.set_user_answer),
    path('set_provisional_answer', myapp.views.set_provisional_answer),
    path('get_provisional_answer', myapp.views.get_provisional_answer),
    path('get_all_game_answers', myapp.views.get_all_game_answers),
    path('delete_user_answer', myapp.views.delete_user_answer),
    path('delete_user_answer_by_id', myapp.views.delete_user_answer_by_id),
    path('zero_user_answer', myapp.views.zero_user_answer),

    path('update_numbers', myapp.views.update_numbers),
    path('update_special', myapp.views.update_special),
    path('get_numbers', myapp.views.get_numbers),
]
