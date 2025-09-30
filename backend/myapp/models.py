from django.db import models
from django.conf import settings

# Create your models here.
class Game(models.Model):
    name = models.CharField(max_length=255)
    is_active = models.IntegerField()
    created = models.DateTimeField()
    updated = models.DateTimeField()
    start_time = models.DateTimeField(null=True)

class QuestionType(models.Model):
    name = models.CharField(max_length=255, unique=True)

class Question(models.Model):
    text = models.TextField()
    question_type = models.ForeignKey(QuestionType, on_delete=models.CASCADE)
    game = models.CharField(max_length=255, null=True)
    image_link = models.CharField(max_length=255, null=True)
    audio_link = models.CharField(max_length=255, null=True)
    video_link = models.CharField(max_length=255, null=True)
    comment = models.CharField(max_length=255, null=True)
    created = models.DateTimeField()
    updated = models.DateTimeField()
    start_time = models.DateTimeField(null=True)
    end_time = models.DateTimeField(null=True)
    is_active = models.IntegerField()
    used = models.IntegerField()
    draw = models.BooleanField()
    time_to_answer = models.IntegerField()

class Advertisement(models.Model):
    name = models.CharField(max_length=255, null=True)
    media_link = models.CharField(max_length=255)

class Answer(models.Model):
    text = models.CharField(max_length=255)
    is_correct = models.IntegerField()
    image_link = models.CharField(max_length=255, null=True)
    music_link = models.CharField(max_length=255, null=True)
    question_type = models.ForeignKey(QuestionType, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    points = models.IntegerField(null=True)

class ProvisionalAnswer(models.Model):
    text = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

class UserAnswer(models.Model):
    text = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    time = models.CharField(max_length=255)
    is_correct = models.IntegerField(null=True)
    points = models.FloatField(null=True)
    checked = models.FloatField(null=True)
    questionNumber = models.IntegerField(null=True)

class Penalties(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    amount = models.IntegerField(null=True)
    comment = models.CharField(max_length=255)

class Results(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ship_hit_points = models.IntegerField()
    ship_kill_points = models.IntegerField()
    question_points = models.IntegerField()
    bonus_points = models.IntegerField()
    penalty_points = models.IntegerField()
    
class Commands(models.Model):
    player = models.CharField(max_length=255, null=True)
    host = models.CharField(max_length=255, null=True)
    tv = models.CharField(max_length=255, null=True)
    admin = models.CharField(max_length=255, null=True)

class Current(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    questionNumber = models.IntegerField(null=True)
    current_start_time = models.DateTimeField(null=True)

class Settings(models.Model):
    language = models.CharField(max_length=255, null=True)
    special = models.IntegerField(null=True)
    o_number = models.IntegerField(null=True)

class Battlefield(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    ships_data = models.JSONField()
    revealed_water = models.TextField(null=True)

class Queue(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    team = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order = models.CharField(max_length=255, null=True)
    current = models.CharField(max_length=255, null=True)