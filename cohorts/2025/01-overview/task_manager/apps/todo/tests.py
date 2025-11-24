from django.test import TestCase, Client
from django.urls import reverse
from .models import Todo
from datetime import date

class TodoModelTest(TestCase):
    def test_create_todo(self):
        todo = Todo.objects.create(title="Test Todo")
        self.assertEqual(todo.title, "Test Todo")
        self.assertFalse(todo.is_resolved)

class TodoViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.todo = Todo.objects.create(title="Test Todo", description="Desc")
        self.list_url = reverse('todo_list')
        self.create_url = reverse('todo_create')
        self.update_url = reverse('todo_update', args=[self.todo.pk])
        self.delete_url = reverse('todo_delete', args=[self.todo.pk])
        self.toggle_url = reverse('todo_toggle_status', args=[self.todo.pk])

    def test_todo_list_GET(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todo/home.html')
        self.assertContains(response, "Test Todo")

    def test_todo_create_POST(self):
        response = self.client.post(self.create_url, {
            'title': 'New Todo',
            'description': 'New Desc',
            'due_date': '2025-12-31'
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Todo.objects.count(), 2)

    def test_todo_update_POST(self):
        response = self.client.post(self.update_url, {
            'title': 'Updated Todo',
            'description': 'Updated Desc',
            'due_date': '2025-12-31'
        })
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated Todo')

    def test_todo_delete_POST(self):
        response = self.client.post(self.delete_url)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Todo.objects.count(), 0)

    def test_todo_toggle_status(self):
        response = self.client.get(self.toggle_url)
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.is_resolved)
