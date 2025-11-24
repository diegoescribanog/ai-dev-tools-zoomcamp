# Homework Answers

## Question 1: Install Django

**Question:** We want to install Django. Ask AI to help you with that. What's the command you used for that?

**Answer:** `uv add django`

**Explanation:** In this project, we used `uv` for dependency management, so the command was `uv add django`. This installs Django and adds it to `pyproject.toml`. The standard equivalent using pip is `pip install django`.

## Question 2: Project and App

**Question:** Now we need to create a project and an app for that. Follow the instructions from AI to do it. At some point, you will need to include the app you created in the project. What's the file you need to edit for that?

- `settings.py`
- `manage.py`
- `urls.py`
- `wsgi.py`

**Answer:** `settings.py`

**Explanation:** To enable a Django app, it must be added to the `INSTALLED_APPS` list within the project's `settings.py` file. This tells Django to look for models, templates, and other configurations within that app.

## Question 3: Django Models

**Question:** Let's now proceed to creating models - the mapping from python objects to a relational database. For the TODO app, which models do we need? Implement them. What's the next step you need to take?

- Run the application
- Add the models to the admin panel
- Run migrations
- Create a makefile

**Answer:** Run migrations

**Explanation:** After defining or modifying models, you must create migration files (`makemigrations`) and then apply them (`migrate`) to propagate changes to the database schema.

## Question 4. TODO Logic

**Question:** Let's now ask AI to implement the logic for the TODO app. Where do we put it?

- `views.py`
- `urls.py`
- `admin.py`
- `tests.py`

**Answer:** `views.py`

**Explanation:** In Django's MVT (Model-View-Template) architecture, `views.py` is responsible for handling user requests, processing logic (like fetching data from models), and returning responses.

## Question 5. Templates

**Question:** Next step is creating the templates. You will need at least two: the base one and the home one. Let's call them `base.html` and `home.html`. Where do you need to register the directory with the templates?

- `INSTALLED_APPS` in project's `settings.py`
- `TEMPLATES['DIRS']` in project's `settings.py`
- `TEMPLATES['APP_DIRS']` in project's `settings.py`
- In the app's `urls.py`

**Answer:** `TEMPLATES['DIRS']` in project's `settings.py`

**Explanation:** While Django looks in app directories by default if `APP_DIRS` is True, if you want to define a specific custom directory for templates (like a project-level `templates` folder), you explicitly register it in the `DIRS` list within the `TEMPLATES` setting in `settings.py`.

## Question 6. Tests

**Question:** Now let's ask AI to cover our functionality with tests. What's the command you use for running tests in the terminal?

- `pytest`
- `python manage.py test`
- `python -m django run_tests`
- `django-admin test`

**Answer:** `python manage.py test`

**Explanation:** `python manage.py test` is the standard Django command to discover and run tests for the project.
